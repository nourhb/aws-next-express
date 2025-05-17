#!/bin/bash

# Update system
yum update -y

# Install Git
yum install -y git

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
amazon-linux-extras install nginx1 -y
systemctl start nginx
systemctl enable nginx

# Clone the repository
mkdir -p /var/www/app
git clone ${github_repo} /var/www/app
cd /var/www/app

# Create .env file
cat > .env << EOF
# Database
DATABASE_URL=mysql://${db_user}:${db_password}@${db_host}:3306/${db_name}

# AWS
AWS_REGION=${aws_region}
AWS_S3_BUCKET_NAME=${s3_bucket_name}

# You would typically set these securely through AWS Secrets Manager or Parameter Store
# For this example, we're using instance profile credentials
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
EOF

# Install dependencies
npm install

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Build the Next.js application
npm run build

# Start the application with PM2
pm2 start npm --name "nextjs-app" -- start
pm2 startup
pm2 save

# Configure Nginx as a reverse proxy
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
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Restart Nginx to apply changes
systemctl restart nginx
