#!/bin/bash

# Comprehensive logging
exec > >(tee /var/log/user-data.log) 2>&1
set -x

echo "=== Starting AWS Next.js Express Deployment at $(date) ==="

# Update system
echo "=== Updating system ==="
yum update -y

# Install Node.js 18
echo "=== Installing Node.js 18 ==="
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verify Node.js installation
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install Git
echo "=== Installing Git ==="
yum install -y git

# Install PM2 globally
echo "=== Installing PM2 ==="
npm install -g pm2

# Create app directory and set permissions
echo "=== Setting up application directory ==="
mkdir -p /home/ec2-user/app
cd /home/ec2-user

# Clone repository
echo "=== Cloning repository ==="
if [ -d "app" ]; then
    rm -rf app
fi

git clone ${github_repo} app
cd app

# Set proper ownership
chown -R ec2-user:ec2-user /home/ec2-user/app

# Create environment file
echo "=== Creating environment file ==="
sudo -u ec2-user cat > .env.local << EOF
NODE_ENV=production
AWS_REGION=${aws_region}
AWS_S3_BUCKET=${s3_bucket_name}
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF

echo "=== Installing dependencies ==="
# Install dependencies as ec2-user
sudo -u ec2-user npm install --production

echo "=== Building application ==="
# Build application as ec2-user
sudo -u ec2-user npm run build

echo "=== Starting application with PM2 ==="
# Start application with PM2 as ec2-user
sudo -u ec2-user pm2 start npm --name "nextjs-app" -- start
sudo -u ec2-user pm2 startup
sudo -u ec2-user pm2 save

# Wait for application to start
echo "=== Waiting for application to start ==="
sleep 15

# Test if application is running
echo "=== Testing application ==="
if curl -f http://localhost:3000; then
    echo "✅ Application is running successfully!"
else
    echo "❌ Application failed to start, checking logs..."
    sudo -u ec2-user pm2 logs nextjs-app --lines 50
fi

# Install and configure nginx as reverse proxy
echo "=== Installing and configuring Nginx ==="
yum install -y nginx

# Create nginx configuration
cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Remove default nginx config
rm -f /etc/nginx/sites-enabled/default

# Start and enable nginx
systemctl start nginx
systemctl enable nginx

# Test nginx
echo "=== Testing Nginx ==="
if curl -f http://localhost; then
    echo "✅ Nginx is working!"
else
    echo "❌ Nginx failed to start"
    systemctl status nginx
fi

# Final status check
echo "=== Final Status Check ==="
echo "PM2 Status:"
sudo -u ec2-user pm2 status

echo "Nginx Status:"
systemctl status nginx --no-pager

echo "Port 3000 Status:"
netstat -tlnp | grep :3000

echo "Port 80 Status:"
netstat -tlnp | grep :80

echo "=== Deployment completed at $(date) ==="
echo "Application should be accessible at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "And via Nginx at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)" 