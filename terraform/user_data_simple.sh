#!/bin/bash

# Update system
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Git
yum install -y git

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
cd /home/ec2-user
git clone ${github_repo} app
cd app

# Install dependencies
npm install

# Build application
npm run build

# Create environment file
cat > .env.production << EOF
NODE_ENV=production
AWS_REGION=${aws_region}
AWS_S3_BUCKET=${s3_bucket_name}
DATABASE_URL=mysql://admin:password@localhost:3306/nextapp_db
REDIS_URL=redis://localhost:6379
EOF

# Start application with PM2
npm install -g pm2
pm2 start npm --name "nextjs-app" -- start
pm2 startup
pm2 save

# Setup nginx reverse proxy
yum install -y nginx
cat > /etc/nginx/conf.d/app.conf << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl start nginx
systemctl enable nginx

# Log deployment
echo "$(date): AWS Next.js Express deployment completed" >> /var/log/app-deployment.log
echo "S3 Bucket: ${s3_bucket_name}" >> /var/log/app-deployment.log
echo "AWS Region: ${aws_region}" >> /var/log/app-deployment.log 