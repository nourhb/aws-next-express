#!/bin/bash

echo "🚀 AWS Next Express - Quick Start"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🐳 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Initializing DynamoDB tables..."
node scripts/init-dynamodb.js

echo "🧪 Running tests..."
npm test

echo "🏗️ Building application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - DynamoDB Admin: http://localhost:8000"
echo ""
echo "🔧 Available commands:"
echo "   - npm run dev       # Start development server"
echo "   - npm test          # Run tests"
echo "   - npm run build     # Build for production"
echo "   - npm run docker:build # Build Docker image"
echo "   - npm run k8s:deploy   # Deploy to Kubernetes"
echo ""
echo "📚 Check README.md for detailed documentation"
echo "🎉 Happy coding!" 