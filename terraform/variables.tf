variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "aws-next-express"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "AWS Key Pair name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository URL"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "nextapp_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}

# Optional VPC variables (will use default VPC if not provided)
variable "vpc_id" {
  description = "VPC ID (optional - will use default VPC if empty)"
  type        = string
  default     = ""
}

variable "subnet_ids" {
  description = "Subnet IDs (optional - will use default subnets if empty)"
  type        = list(string)
  default     = []
} 