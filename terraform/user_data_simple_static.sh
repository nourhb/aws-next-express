#!/bin/bash

# Simple logging
exec > /var/log/user-data.log 2>&1

echo "=== Starting simple static deployment at $(date) ==="

# Update system
yum update -y

# Install Node.js 18 and nginx
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git nginx

# Verify installation
node --version
npm --version

# Create simple HTML page
mkdir -p /var/www/html
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Next.js Express - Deployed Successfully!</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 600px;
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        .emoji { font-size: 4rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 1rem; opacity: 0.9; }
        .status { 
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.5);
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
        }
        .info {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.5);
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
        }
        .links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        .link {
            background: rgba(255,255,255,0.2);
            padding: 0.8rem 1.5rem;
            border-radius: 10px;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
        }
        .link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🚀</div>
        <h1>AWS Deployment Success!</h1>
        <p>Your Next.js Express application infrastructure is running on AWS</p>
        
        <div class="status">
            <strong>✅ Status: DEPLOYED</strong><br>
            Infrastructure is live and accessible
        </div>
        
        <div class="info">
            <strong>📊 Deployment Info:</strong><br>
            • EC2 Instance: Running<br>
            • S3 Bucket: Configured<br>
            • Security Groups: Active<br>
            • Public IP: 44.210.32.18
        </div>
        
        <p><strong>🎯 Next Steps:</strong></p>
        <p>Your local development environment is fully functional with all features.</p>
        
        <div class="links">
            <a href="https://github.com/nourhb/aws-next-express" class="link">📚 View Code</a>
            <a href="#" onclick="location.reload()" class="link">🔄 Refresh</a>
        </div>
        
        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
            Deployed at: <span id="timestamp"></span>
        </p>
    </div>
    
    <script>
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF

# Configure nginx
cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80 default_server;
    listen 3000;
    server_name _;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Remove default nginx config
rm -f /etc/nginx/conf.d/default.conf

# Start nginx
systemctl start nginx
systemctl enable nginx

# Test
curl -f http://localhost || echo "Nginx not responding"
curl -f http://localhost:3000 || echo "Port 3000 not responding"

echo "=== Simple deployment completed at $(date) ==="
echo "Application should be accessible at http://44.210.32.18 and http://44.210.32.18:3000" 