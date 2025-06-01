# AWS Deployment

Deploy infrastructure and application to AWS using Terraform.

## Prerequisites

- AWS CLI configured
- Terraform installed
- AWS account with appropriate permissions

## Quick Setup

### 1. Configure AWS

```bash
aws configure
```

### 2. Update Variables

Edit `terraform/terraform.tfvars`:
```hcl
vpc_id         = "vpc-your-vpc-id"
subnet_ids     = ["subnet-id-1", "subnet-id-2"]
s3_bucket_name = "your-unique-bucket-name"
key_name       = "your-ec2-keypair"
github_repo    = "https://github.com/nourhb/aws-next-express.git"
```

### 3. Deploy

```bash
npm run terraform:init
npm run terraform:plan
npm run terraform:apply
```

## Get AWS Resources

```bash
# Find VPC
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0]]' --output table

# Find Subnets
aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone]' --output table

# List Key Pairs
aws ec2 describe-key-pairs --query 'KeyPairs[*].KeyName' --output table
```

## Infrastructure

### Standard Setup
- EC2 instance with Elastic IP
- RDS MySQL database
- S3 bucket for files
- Security groups and IAM roles

### Production Setup
- Application Load Balancer
- Auto Scaling Group
- AWS Secrets Manager
- CloudWatch monitoring

## Access

After deployment:
```bash
# Get outputs
terraform output

# SSH to instance
ssh -i your-key.pem ec2-user@<public-ip>
```

## Monitoring

- Application logs: `/var/log/app-deployment.log`
- CloudWatch metrics and alarms
- S3 access logs

## Cleanup

```bash
npm run terraform:destroy
``` 