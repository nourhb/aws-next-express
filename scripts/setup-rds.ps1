#!/usr/bin/env pwsh

Write-Host "🚀 AWS Next Express - RDS Setup Script" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Create .env.local if it doesn't exist
if (!(Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    
    $envContent = @"
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
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ .env.local created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your real AWS credentials" -ForegroundColor White
Write-Host "2. Update DATABASE_URL with your MySQL connection string" -ForegroundColor White
Write-Host "3. Run: npm install" -ForegroundColor White
Write-Host "4. Run: npx prisma generate" -ForegroundColor White
Write-Host "5. Run: npx prisma migrate dev" -ForegroundColor White
Write-Host "6. Start development: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For local development with Docker MySQL:" -ForegroundColor Cyan
Write-Host "1. Run: docker-compose -f docker-compose.mysql.yml up -d" -ForegroundColor White
Write-Host "2. Use DATABASE_URL: mysql://root:password@localhost:3306/aws_next_express" -ForegroundColor White
Write-Host ""