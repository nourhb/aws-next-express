output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_eip.app_eip.public_ip}:3000"
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.app_eip.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i aws-next-express-key.pem ec2-user@${aws_eip.app_eip.public_ip}"
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.app_bucket.bucket
}

output "s3_bucket_url" {
  description = "S3 bucket URL"
  value       = "https://${aws_s3_bucket.app_bucket.bucket}.s3.${var.aws_region}.amazonaws.com"
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.app_bucket.arn
}
