# Kubernetes Deployment

Production-ready Kubernetes deployment with auto-scaling and monitoring.

## Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Docker registry access

## Quick Deploy

```bash
# Automated deployment
npm run k8s:deploy:full

# Manual deployment
kubectl apply -f k8s/
```

## Configuration

### 1. Update Secrets

Edit `k8s/secrets.yaml`:
```yaml
stringData:
  database-url: "mysql://user:pass@host:port/db"
  nextauth-secret: "your-secret"
  s3-bucket-name: "your-bucket"
```

### 2. Update Registry

Edit `k8s/app-deployment.yaml`:
```yaml
image: your-registry/aws-next-express:latest
```

## Features

- **Auto-scaling**: 2-10 replicas based on CPU/memory
- **Health checks**: Liveness and readiness probes
- **Persistent storage**: MySQL and Redis data
- **Load balancing**: NGINX or AWS ALB ingress
- **Monitoring**: Prometheus metrics collection
- **Security**: RBAC, Pod Security Standards

## Commands

```bash
# Check status
npm run k8s:status

# View logs
npm run k8s:logs

# Port forward
npm run k8s:port-forward

# Clean up
npm run k8s:cleanup
```

## Access

```bash
# Get ingress IP
kubectl get ingress -n aws-next-express

# Port forward if no ingress
kubectl port-forward svc/app-service 3000:3000 -n aws-next-express
```

## Architecture

```
Internet → Load Balancer → App Pods (2-10) → Services → Databases
```

Components:
- Application deployment with HPA
- MySQL with persistent volume
- Redis cache
- NGINX ingress controller
- Prometheus monitoring 