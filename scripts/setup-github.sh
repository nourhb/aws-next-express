#!/bin/bash

# GitHub Repository Setup Script
echo "🚀 Setting up GitHub repository for AWS Next Express..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Full-stack AWS Next Express application

Features:
- ✅ Next.js 15 frontend with TypeScript
- ✅ DynamoDB integration for user management
- ✅ AWS S3 for file storage
- ✅ Docker containerization
- ✅ Kubernetes orchestration
- ✅ CI/CD pipeline with GitHub Actions
- ✅ ArgoCD deployment
- ✅ Pre-commit hooks with Husky
- ✅ Comprehensive test suite
- ✅ Modern UI with Tailwind CSS

Stack:
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: API Routes, DynamoDB, AWS S3
- Infrastructure: Docker, Kubernetes, ArgoCD
- CI/CD: GitHub Actions, Docker Hub
- Testing: Jest, TypeScript
"

echo "🔗 Repository ready for GitHub!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/aws-next-express.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "🔧 Don't forget to set up GitHub Secrets:"
echo "   - DOCKERHUB_USERNAME"
echo "   - DOCKERHUB_TOKEN"
echo "   - ARGOCD_SERVER"
echo "   - ARGOCD_AUTH_TOKEN"
echo ""
echo "✨ Happy coding!" 