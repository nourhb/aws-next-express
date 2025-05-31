#!/bin/bash

# Test Kubernetes deployment
echo "Testing Kubernetes deployment..."

# Apply the deployment
kubectl apply -f k8s/frontend-deployment.yaml

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend

# Test the service
echo "Testing the service..."
SERVICE_IP=$(kubectl get service frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl -f http://$SERVICE_IP || exit 1

# Check logs
echo "Checking pod logs..."
kubectl logs -l app=frontend

# Clean up
echo "Cleaning up..."
kubectl delete -f k8s/frontend-deployment.yaml

echo "All tests passed!" 