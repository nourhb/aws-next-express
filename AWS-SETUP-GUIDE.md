# AWS Setup Guide for Terraform Deployment

## 🎯 **What You Need to Update in terraform.tfvars**

Your `terraform/terraform.tfvars` file currently has placeholder values. Here's what you need to replace:

```hcl
aws_region     = "us-east-1"                                    # ✅ Can keep this
s3_bucket_name = "your-unique-app-files-bucket-2024"            # ❌ CHANGE: Must be globally unique
vpc_id         = "vpc-0123456789abcdef0"                        # ❌ CHANGE: Your actual VPC ID
subnet_ids     = ["subnet-0123456789abcdef0", "subnet-0987654321fedcba0"]  # ❌ CHANGE: Your subnet IDs
db_name        = "nextapp_db"                                   # ✅ Can keep this
db_username    = "admin"                                        # ✅ Can keep this
db_password    = "SecurePassword123!"                           # ❌ CHANGE: Use strong password
key_name       = "my-aws-keypair"                               # ❌ CHANGE: Your key pair name
github_repo    = "https://github.com/nourhb/aws-next-express.git"  # ❌ CHANGE: Your GitHub repo
```

---

## 🔍 **Method 1: AWS Console (Recommended)**

### **Step 1: Find VPC ID**
1. Go to: **https://console.aws.amazon.com/vpc/**
2. Click **"Your VPCs"** in the left sidebar
3. Look for **VPC ID** column (example: `vpc-0a1b2c3d4e5f67890`)
4. If you don't have a VPC, create one with **"Create VPC"**

### **Step 2: Find Subnet IDs**
1. In VPC Console, click **"Subnets"**
2. **IMPORTANT**: You need **2 subnets in DIFFERENT availability zones**
3. Filter by your VPC ID if you have multiple VPCs
4. Copy **2 subnet IDs** (example: `subnet-0a1b2c3d`, `subnet-9e8f7g6h`)
5. Verify they're in different **Availability Zone** columns

### **Step 3: Key Pair**
1. Go to: **https://console.aws.amazon.com/ec2/**
2. Click **"Key Pairs"** in left sidebar (under Network & Security)
3. **Option A**: Use existing key pair name
4. **Option B**: Click **"Create key pair"**
   - Name: `my-terraform-keypair`
   - Type: RSA
   - Format: .pem
   - Download and save the .pem file securely

### **Step 4: S3 Bucket Name**
- Choose a **globally unique** name like: `yourname-aws-next-express-2024`
- Rules: lowercase, no spaces, only letters/numbers/hyphens

### **Step 5: GitHub Repository**
- If public: `https://github.com/yourusername/aws-next-express.git`
- Replace `yourusername` with your actual GitHub username

---

## 🖥️ **Method 2: Using AWS CLI**

### **First-time setup:**
1. **Restart PowerShell** (close and reopen)
2. Configure AWS CLI:
   ```powershell
   aws configure
   ```
   Enter:
   - **AWS Access Key ID**: (from AWS Console → IAM → Users → Security credentials)
   - **AWS Secret Access Key**: (from same location)
   - **Default region**: `us-east-1`
   - **Output format**: `json`

3. **Run the helper script:**
   ```powershell
   .\get-aws-resources.ps1
   ```

### **Manual CLI commands:**
```bash
# Get VPCs
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0]]' --output table

# Get Subnets
aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone]' --output table

# Get Key Pairs
aws ec2 describe-key-pairs --query 'KeyPairs[*].KeyName' --output table
```

---

## 🛠️ **Don't Have AWS Resources? Create Them**

### **Create VPC and Subnets:**
1. Go to **VPC Console** → **"Create VPC"**
2. Choose **"VPC and more"**
3. Settings:
   - **Name**: `my-app-vpc`
   - **IPv4 CIDR**: `10.0.0.0/16`
   - **Number of AZs**: 2
   - **Number of public subnets**: 2
   - **Number of private subnets**: 0 (or 2 if you want)
4. Click **"Create VPC"**

This will create:
- 1 VPC
- 2 public subnets in different AZs
- Internet Gateway
- Route tables

---

## ✅ **Example Final Configuration**

```hcl
aws_region     = "us-east-1"
s3_bucket_name = "john-aws-next-express-2024"                    # Your unique name
vpc_id         = "vpc-0a1b2c3d4e5f67890"                        # From AWS Console
subnet_ids     = ["subnet-0a1b2c3d", "subnet-9e8f7g6h"]        # 2 different AZs
db_name        = "nextapp_db"
db_username    = "admin"
db_password    = "MySecurePassword123!"                         # Strong password
key_name       = "my-terraform-keypair"                         # Your key pair
github_repo    = "https://github.com/johndoe/aws-next-express.git"  # Your repo
```

---

## 🚀 **Ready to Deploy?**

Once you've updated `terraform/terraform.tfvars` with real values:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## ❓ **Troubleshooting**

**"VPC not found"**: Make sure the VPC ID is correct and in the right region
**"Subnet not found"**: Verify subnet IDs belong to the specified VPC
**"Key pair not found"**: Create key pair in EC2 console first
**"Bucket already exists"**: Choose a different, globally unique bucket name

---

**Need help?** All resources must be in the **same AWS region** (us-east-1 by default). 