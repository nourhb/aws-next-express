# Terraform Deployment Guide

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
   ```bash
   aws configure
   ```

2. **Terraform installed** (version 1.0 or later)
   ```bash
   # Windows (using Chocolatey)
   choco install terraform
   
   # Or download from https://www.terraform.io/downloads.html
   ```

3. **AWS Resources Ready**:
   - VPC with at least 2 subnets in different AZs
   - EC2 Key Pair created
   - GitHub repository accessible

## Getting Your AWS Resource IDs

### Find your VPC ID:
```bash
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0]]' --output table
```

### Find your Subnet IDs:
```bash
aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone]' --output table
```

### List your Key Pairs:
```bash
aws ec2 describe-key-pairs --query 'KeyPairs[*].KeyName' --output table
```

## Deployment Steps

### 1. Update Configuration
Edit `terraform/terraform.tfvars` with your actual values:
- Replace VPC ID and Subnet IDs with your actual resources
- Set a unique S3 bucket name
- Use your GitHub repository URL
- Set your EC2 Key Pair name

### 2. Initialize Terraform
```bash
cd terraform
terraform init
```

### 3. Plan the Deployment
```bash
terraform plan
```

### 4. Apply the Configuration
```bash
terraform apply
```
Type `yes` when prompted to confirm.

### 5. Get Output Values
```bash
terraform output
```

This will show you:
- S3 bucket name
- RDS endpoint
- EC2 public IP
- EC2 public DNS

## Access Your Application

After deployment completes (5-10 minutes):
1. Your app will be available at: `http://<EC2_PUBLIC_IP>`
2. The application will automatically:
   - Clone your GitHub repository
   - Install dependencies
   - Run database migrations
   - Build and start the Next.js app
   - Configure Nginx as reverse proxy

## Monitoring Deployment

SSH into your EC2 instance to monitor the setup:
```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>

# Check application status
pm2 status
pm2 logs

# Check Nginx status
sudo systemctl status nginx
```

## Clean Up Resources

To destroy all resources:
```bash
terraform destroy
```

## Security Notes

- The current setup uses placeholder passwords - use AWS Secrets Manager for production
- Database is accessible from anywhere (0.0.0.0/0) - restrict this for production
- Consider using Application Load Balancer for production traffic

## Next Steps

1. Set up a custom domain with Route 53
2. Add SSL/TLS certificates with AWS Certificate Manager
3. Implement AWS Secrets Manager for sensitive data
4. Add Auto Scaling Groups for high availability
5. Set up CloudWatch monitoring and alerts 