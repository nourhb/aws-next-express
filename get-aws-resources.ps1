# PowerShell script to get AWS resource IDs for Terraform
# Run this after configuring AWS CLI with: aws configure

Write-Host "=== AWS Resource ID Finder ===" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is available
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please restart PowerShell and run: aws configure" -ForegroundColor Red
    Write-Host "Or find resources manually in AWS Console" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔍 Finding your AWS resources..." -ForegroundColor Cyan
Write-Host ""

# Get VPCs
Write-Host "📍 Available VPCs:" -ForegroundColor Yellow
try {
    aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0],CidrBlock,State]' --output table
} catch {
    Write-Host "❌ Error getting VPCs. Make sure AWS CLI is configured with: aws configure" -ForegroundColor Red
}

Write-Host ""

# Get Subnets
Write-Host "📍 Available Subnets:" -ForegroundColor Yellow
try {
    aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone,CidrBlock]' --output table
} catch {
    Write-Host "❌ Error getting Subnets" -ForegroundColor Red
}

Write-Host ""

# Get Key Pairs
Write-Host "📍 Available Key Pairs:" -ForegroundColor Yellow
try {
    aws ec2 describe-key-pairs --query 'KeyPairs[*].[KeyName,KeyType]' --output table
} catch {
    Write-Host "❌ Error getting Key Pairs" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the VPC ID you want to use" -ForegroundColor White
Write-Host "2. Copy 2 subnet IDs from DIFFERENT availability zones" -ForegroundColor White
Write-Host "3. Choose a key pair name (or create one in AWS Console)" -ForegroundColor White
Write-Host "4. Update terraform/terraform.tfvars with these values" -ForegroundColor White
Write-Host "" 