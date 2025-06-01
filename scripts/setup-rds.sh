#!/bin/bash

echo "🚀 AWS Next Express - RDS Setup Script"
echo "======================================="

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=your_bucket_name_here

# Database Configuration (RDS MySQL)
DATABASE_URL="mysql://username:password@localhost:3306/aws_next_express"

# For local development with Docker MySQL
# DATABASE_URL="mysql://root:password@localhost:3306/aws_next_express"

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ .env.local created!"
else
    echo "⚠️  .env.local already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Edit .env.local with your real AWS credentials"
echo "2. Update DATABASE_URL with your MySQL connection string"
echo "3. Run: pnpm install"
echo "4. Run: npx prisma generate"
echo "5. Run: npx prisma migrate dev"
echo "6. Start development: pnpm dev"
echo ""
echo "For local development with Docker MySQL:"
echo "1. Run: docker-compose -f docker-compose.mysql.yml up -d"
echo "2. Use DATABASE_URL: mysql://root:password@localhost:3306/aws_next_express"
echo "" 