#!/bin/bash

# Simple logging
exec > /var/log/user-data.log 2>&1
set -e

echo "=== Starting minimal deployment at $(date) ==="

# Update system
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git

# Verify installation
node --version
npm --version

# Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user

# Clone repository
git clone ${github_repo} app || echo "Clone failed, continuing..."
cd app

# Set ownership
chown -R ec2-user:ec2-user /home/ec2-user/app

# Create simple environment
cat > .env.local << EOF
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF

# Install dependencies and build as ec2-user
sudo -u ec2-user npm install
sudo -u ec2-user npm run build

# Install PM2 and start app
npm install -g pm2
sudo -u ec2-user pm2 start npm --name "app" -- start
sudo -u ec2-user pm2 startup
sudo -u ec2-user pm2 save

# Simple test
sleep 10
curl -f http://localhost:3000 || echo "App not responding yet"

echo "=== Deployment completed at $(date) ===" 