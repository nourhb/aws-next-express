#!/bin/bash

# Test Docker Compose
echo "Testing Docker Compose setup..."

# Build and start containers
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Test frontend container
echo "Testing frontend container..."
curl -f http://localhost:3000 || exit 1

# Test DynamoDB container
echo "Testing DynamoDB container..."
aws dynamodb list-tables --endpoint-url http://localhost:8000 || exit 1

# Clean up
echo "Cleaning up..."
docker-compose down

echo "All tests passed!" 