#!/bin/bash

# Enhanced user data script with better error handling and monitoring
set -e

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a /var/log/app-deployment.log
}

log "Starting application deployment..."

# Update system
log "Updating system packages..."
yum update -y

# Install dependencies
log "Installing dependencies..."
yum install -y git awscli

# Install Node.js 18
log "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 globally
log "Installing PM2..."
npm install -g pm2

# Install and configure CloudWatch agent
log "Installing CloudWatch agent..."
yum install -y amazon-cloudwatch-agent

# Install Nginx
log "Installing Nginx..."
amazon-linux-extras install nginx1 -y
systemctl start nginx
systemctl enable nginx

# Create application directory
log "Setting up application directory..."
mkdir -p /var/www/app
cd /var/www/app

# Clone the repository
log "Cloning repository: ${github_repo}"
git clone ${github_repo} .

# Get database password from Secrets Manager
log "Retrieving database credentials from Secrets Manager..."
DB_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id ${db_secret_arn} \
    --region ${aws_region} \
    --query SecretString --output text)

if [ -z "$DB_PASSWORD" ]; then
    log "ERROR: Failed to retrieve database password from Secrets Manager"
    exit 1
fi

# Create .env file
log "Creating environment configuration..."
cat > .env << EOF
# Environment
NODE_ENV=${environment}

# Database
DATABASE_URL=mysql://${db_user}:$DB_PASSWORD@${db_host}:3306/${db_name}

# AWS Configuration
AWS_REGION=${aws_region}
AWS_S3_BUCKET_NAME=${s3_bucket_name}

# Next.js Configuration
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Application Configuration
APP_NAME=aws-next-express
APP_VERSION=1.0.0
EOF

# Set proper permissions
chown ec2-user:ec2-user .env
chmod 600 .env

# Install dependencies
log "Installing Node.js dependencies..."
npm ci --production

# Run database setup
log "Setting up database..."
npx prisma generate
npx prisma migrate deploy

# Build the Next.js application
log "Building Next.js application..."
npm run build

# Create PM2 ecosystem file
log "Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production'
    },
    error_file: '/var/log/pm2/nextjs-error.log',
    out_file: '/var/log/pm2/nextjs-out.log',
    log_file: '/var/log/pm2/nextjs-combined.log',
    time: true
  }]
}
EOF

# Create PM2 log directory
mkdir -p /var/log/pm2
chown ec2-user:ec2-user /var/log/pm2

# Start the application with PM2
log "Starting application with PM2..."
sudo -u ec2-user pm2 start ecosystem.config.js
sudo -u ec2-user pm2 startup
sudo -u ec2-user pm2 save

# Configure Nginx with enhanced configuration
log "Configuring Nginx reverse proxy..."
cat > /etc/nginx/conf.d/app.conf << 'EOF'
upstream nextjs_upstream {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Static files
    location /_next/static {
        alias /var/www/app/.next/static;
        expires 365d;
        access_log off;
    }

    # Main application
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Test Nginx configuration
nginx -t
if [ $? -ne 0 ]; then
    log "ERROR: Nginx configuration test failed"
    exit 1
fi

# Restart Nginx
log "Restarting Nginx..."
systemctl restart nginx

# Configure CloudWatch agent
log "Configuring CloudWatch monitoring..."
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
    "agent": {
        "metrics_collection_interval": 60,
        "run_as_user": "cwagent"
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/app-deployment.log",
                        "log_group_name": "/aws/ec2/app-deployment",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/pm2/nextjs-combined.log",
                        "log_group_name": "/aws/ec2/nextjs-app",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/nginx/access.log",
                        "log_group_name": "/aws/ec2/nginx-access",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/nginx/error.log",
                        "log_group_name": "/aws/ec2/nginx-error",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "AWS/EC2/Custom",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            },
            "netstat": {
                "measurement": [
                    "tcp_established",
                    "tcp_time_wait"
                ],
                "metrics_collection_interval": 60
            },
            "swap": {
                "measurement": [
                    "swap_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start CloudWatch agent
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent

# Create health check script
log "Creating health check script..."
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
# Health check script for monitoring

# Check if Next.js app is running
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "Next.js app health check failed"
    # Restart the application
    sudo -u ec2-user pm2 restart nextjs-app
    exit 1
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "Nginx is not running"
    systemctl start nginx
    exit 1
fi

echo "All services are healthy"
EOF

chmod +x /usr/local/bin/health-check.sh

# Set up cron job for health checks
echo "*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log 2>&1" | crontab -

# Final verification
log "Performing final verification..."
sleep 30

# Check if services are running
if systemctl is-active --quiet nginx && sudo -u ec2-user pm2 list | grep -q "online"; then
    log "SUCCESS: Application deployment completed successfully!"
    log "Application should be accessible at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
else
    log "ERROR: Some services failed to start properly"
    log "Nginx status: $(systemctl is-active nginx)"
    log "PM2 status: $(sudo -u ec2-user pm2 list)"
    exit 1
fi

log "Deployment script completed." 