terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Uncomment and configure for production deployments
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "aws-next-express/terraform.tfstate"
  #   region = "us-east-1"
  # }
} 