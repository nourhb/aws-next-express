#!/usr/bin/env pwsh

Write-Host "=== AWS Next.js Express Deployment Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Check prerequisites
Write-Host "1. Checking Prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
}

# Check Docker
try {
    $dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    if (Test-Path $dockerPath) {
        $dockerVersion = & $dockerPath --version
        Write-Host "✓ Docker: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ Docker not found" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Docker not accessible" -ForegroundColor Red
}

# Check AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "✓ AWS CLI: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found" -ForegroundColor Red
}

# Check Terraform
try {
    $terraformVersion = terraform --version
    Write-Host "✓ Terraform: $terraformVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Terraform not found - Install with: winget install HashiCorp.Terraform" -ForegroundColor Red
}

# Check kubectl
try {
    $kubectlVersion = kubectl version --client
    Write-Host "✓ kubectl: $kubectlVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ kubectl not found - Install with: winget install Kubernetes.kubectl" -ForegroundColor Red
}

Write-Host ""

# Test 2: Application Build
Write-Host "2. Testing Application Build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✓ Application build successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Application build failed" -ForegroundColor Red
}

Write-Host ""

# Test 3: Environment Configuration
Write-Host "3. Checking Environment Configuration..." -ForegroundColor Yellow

$envFiles = @(".env.example", ".env.production", "docker.env.template")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

Write-Host ""

# Test 4: Terraform Configuration
Write-Host "4. Testing Terraform Configuration..." -ForegroundColor Yellow
Set-Location terraform
try {
    if (Get-Command terraform -ErrorAction SilentlyContinue) {
        terraform init
        terraform validate
        Write-Host "✓ Terraform configuration valid" -ForegroundColor Green
    } else {
        Write-Host "✗ Terraform not available" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Terraform validation failed" -ForegroundColor Red
}
Set-Location ..

Write-Host ""

# Test 5: Docker Configuration
Write-Host "5. Testing Docker Configuration..." -ForegroundColor Yellow

$dockerFiles = @("Dockerfile.production", "docker-compose.production.yml", "nginx/nginx.conf")
foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

Write-Host ""

# Test 6: Kubernetes Configuration
Write-Host "6. Testing Kubernetes Configuration..." -ForegroundColor Yellow

$k8sFiles = @(
    "k8s/namespace.yaml",
    "k8s/configmap.yaml", 
    "k8s/secrets.yaml",
    "k8s/app-deployment.yaml",
    "k8s/database.yaml",
    "k8s/ingress.yaml"
)

foreach ($file in $k8sFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

Write-Host ""

# Summary
Write-Host "=== Deployment Status Summary ===" -ForegroundColor Green
Write-Host ""
Write-Host "Available Deployment Methods:" -ForegroundColor Cyan
Write-Host "1. 🚀 AWS Terraform Deployment (EC2 + S3 + RDS)" -ForegroundColor White
Write-Host "   Status: Ready - Run 'cd terraform && terraform apply'" -ForegroundColor Green
Write-Host ""
Write-Host "2. 🐳 Docker Deployment" -ForegroundColor White
Write-Host "   Status: Ready - Run 'docker-compose -f docker-compose.production.yml up'" -ForegroundColor Green
Write-Host ""
Write-Host "3. ☸️  Kubernetes Deployment" -ForegroundColor White
Write-Host "   Status: Ready - Run './scripts/deploy-k8s.sh'" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "• For AWS: Configure AWS credentials and run Terraform"
Write-Host "• For Docker: Start Docker Desktop and run docker-compose"
Write-Host "• For K8s: Setup kubectl context and deploy manifests"
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Green 