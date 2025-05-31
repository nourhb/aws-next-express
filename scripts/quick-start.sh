#!/bin/bash

echo "🚀 AWS Next Express - Quick Start"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🐳 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Initializing DynamoDB tables..."
node scripts/init-dynamodb.js

echo "🧪 Running tests..."
pnpm test

echo "🏗️ Building application..."
pnpm build

echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - DynamoDB Admin: http://localhost:8000"
echo ""
echo "🔧 Available commands:"
echo "   - pnpm dev          # Start development server"
echo "   - pnpm test         # Run tests"
echo "   - pnpm build        # Build for production"
echo "   - pnpm docker:build # Build Docker image"
echo "   - pnpm k8s:deploy   # Deploy to Kubernetes"
echo ""
echo "📚 Check README.md for detailed documentation"
echo "🎉 Happy coding!" 