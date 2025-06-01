# Docker & Kubernetes Deployment Guide

## 🐳 **Docker Deployment**

### **Development Environment**

1. **Quick Start with Docker Compose:**
   ```bash
   # Start with existing DynamoDB setup
   docker-compose up -d

   # Or start with full MySQL stack
   docker-compose -f docker-compose.production.yml up -d
   ```

2. **Build and Run Individual Container:**
   ```bash
   # Development build
   docker build -t aws-next-express:dev .
   docker run -p 3000:3000 --env-file .env aws-next-express:dev

   # Production build
   docker build -f Dockerfile.production -t aws-next-express:prod .
   docker run -p 3000:3000 --env-file .env aws-next-express:prod
   ```

### **Production Environment**

1. **Full Stack with Monitoring:**
   ```bash
   # Copy environment template
   cp .env.example .env.production

   # Update .env.production with your values
   # Start full production stack
   docker-compose -f docker-compose.production.yml up -d
   ```

2. **Services Available:**
   - **Application:** http://localhost:3000
   - **MySQL:** localhost:3306
   - **Redis:** localhost:6379
   - **Nginx:** http://localhost:80
   - **Prometheus:** http://localhost:9090
   - **Grafana:** http://localhost:3001 (admin/admin)

---

## ☸️ **Kubernetes Deployment**

### **Prerequisites**

1. **Kubernetes Cluster** (EKS, GKE, AKS, or local)
2. **kubectl** configured
3. **Docker registry** access
4. **Ingress Controller** (NGINX or AWS Load Balancer Controller)

### **Quick Deployment**

1. **Build and Push Image:**
   ```bash
   # Build production image
   docker build -f Dockerfile.production -t your-registry/aws-next-express:latest .

   # Push to registry
   docker push your-registry/aws-next-express:latest
   ```

2. **Update Image References:**
   ```bash
   # Update k8s/app-deployment.yaml
   export DOCKER_REGISTRY="your-registry"
   export IMAGE_TAG="latest"
   envsubst < k8s/app-deployment.yaml | kubectl apply -f -
   ```

3. **Deploy to Kubernetes:**
   ```bash
   # Create namespace and RBAC
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/rbac.yaml

   # Create ConfigMaps and Secrets
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/secrets.yaml

   # Deploy databases
   kubectl apply -f k8s/database.yaml

   # Deploy application
   kubectl apply -f k8s/app-deployment.yaml

   # Set up ingress (choose one)
   kubectl apply -f k8s/ingress.yaml  # NGINX Ingress
   # OR
   kubectl apply -f k8s/ingress.yaml  # AWS ALB (comment out NGINX section)
   ```

### **Complete Deployment Script**

```bash
#!/bin/bash
# deploy-k8s.sh

set -e

# Configuration
NAMESPACE="aws-next-express"
DOCKER_REGISTRY="your-registry"
IMAGE_TAG="${1:-latest}"

echo "🚀 Deploying AWS Next Express to Kubernetes..."
echo "Registry: $DOCKER_REGISTRY"
echo "Tag: $IMAGE_TAG"
echo "Namespace: $NAMESPACE"

# Build and push image
echo "📦 Building and pushing Docker image..."
docker build -f Dockerfile.production -t $DOCKER_REGISTRY/aws-next-express:$IMAGE_TAG .
docker push $DOCKER_REGISTRY/aws-next-express:$IMAGE_TAG

# Apply Kubernetes manifests
echo "☸️ Applying Kubernetes manifests..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/configmap.yaml

# Update secrets (you'll need to edit these manually first)
echo "🔐 Applying secrets..."
kubectl apply -f k8s/secrets.yaml

# Deploy databases
echo "🗄️ Deploying databases..."
kubectl apply -f k8s/database.yaml

# Wait for databases to be ready
echo "⏳ Waiting for databases..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/redis-deployment -n $NAMESPACE

# Deploy application with updated image
echo "🚀 Deploying application..."
export DOCKER_REGISTRY IMAGE_TAG
envsubst < k8s/app-deployment.yaml | kubectl apply -f -

# Wait for application deployment
kubectl wait --for=condition=available --timeout=300s deployment/app-deployment -n $NAMESPACE

# Apply ingress
echo "🌐 Setting up ingress..."
kubectl apply -f k8s/ingress.yaml

echo "✅ Deployment complete!"
echo "📊 Check status:"
echo "  kubectl get pods -n $NAMESPACE"
echo "  kubectl get svc -n $NAMESPACE"
echo "  kubectl get ingress -n $NAMESPACE"
```

---

## 🔧 **GitOps with ArgoCD**

### **Setup ArgoCD**

1. **Install ArgoCD:**
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Access ArgoCD UI:**
   ```bash
   # Get admin password
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

   # Port forward
   kubectl port-forward svc/argocd-server -n argocd 8080:443

   # Access: https://localhost:8080
   # Username: admin
   # Password: [from command above]
   ```

3. **Deploy Application:**
   ```bash
   # Update repository URL in argocd/application.yaml
   kubectl apply -f argocd/application.yaml
   ```

---

## 📊 **Monitoring & Observability**

### **Metrics and Dashboards**

1. **Prometheus Metrics:**
   - Available at: http://localhost:9090 (Docker) or via port-forward (K8s)
   - Scrapes metrics from application and infrastructure

2. **Grafana Dashboards:**
   - Available at: http://localhost:3001 (Docker)
   - Default credentials: admin/admin
   - Pre-configured dashboards for Node.js and infrastructure

3. **Application Health Checks:**
   ```bash
   # Check application health
   curl http://localhost:3000/api/health

   # Kubernetes health checks
   kubectl get pods -n aws-next-express
   kubectl describe pod <pod-name> -n aws-next-express
   ```

---

## 🔐 **Security Best Practices**

### **Container Security**
- ✅ Multi-stage builds
- ✅ Non-root user
- ✅ Minimal base image (Alpine)
- ✅ Health checks
- ✅ Resource limits

### **Kubernetes Security**
- ✅ Service accounts with minimal permissions
- ✅ Pod security contexts
- ✅ Network policies
- ✅ Secret management
- ✅ Resource quotas

### **Network Security**
- ✅ TLS/SSL termination
- ✅ Security headers
- ✅ Rate limiting
- ✅ CORS policies

---

## 🚀 **Scaling & Performance**

### **Horizontal Pod Autoscaling**
```bash
# Check HPA status
kubectl get hpa -n aws-next-express

# Manual scaling
kubectl scale deployment app-deployment --replicas=5 -n aws-next-express
```

### **Vertical Pod Autoscaling**
```yaml
# Add to app-deployment.yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## 📝 **Environment Variables**

### **Required Environment Variables:**

```bash
# Database
DATABASE_URL=mysql://user:pass@host:port/db
MYSQL_ROOT_PASSWORD=your-root-password
MYSQL_PASSWORD=your-user-password

# AWS
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# Application
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production

# Redis
REDIS_URL=redis://redis-service:6379
REDIS_PASSWORD=your-redis-password

# Monitoring
GRAFANA_PASSWORD=your-grafana-password
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Pod CrashLoopBackOff:**
   ```bash
   kubectl logs <pod-name> -n aws-next-express
   kubectl describe pod <pod-name> -n aws-next-express
   ```

2. **Service Not Accessible:**
   ```bash
   kubectl get svc -n aws-next-express
   kubectl port-forward svc/app-service 3000:3000 -n aws-next-express
   ```

3. **Database Connection Issues:**
   ```bash
   kubectl exec -it <mysql-pod> -n aws-next-express -- mysql -u root -p
   ```

4. **Image Pull Errors:**
   ```bash
   # Check image exists in registry
   docker pull your-registry/aws-next-express:latest
   
   # Check image pull secrets
   kubectl get secrets -n aws-next-express
   ```

### **Health Check Endpoints:**
- **Application:** `/api/health`
- **Database:** Direct connection test
- **Redis:** PING command

---

## 📈 **Production Readiness Checklist**

- [ ] **Security:** Secrets encrypted, non-root containers
- [ ] **Monitoring:** Prometheus + Grafana configured
- [ ] **Logging:** Centralized logging setup
- [ ] **Backup:** Database backup strategy
- [ ] **SSL/TLS:** HTTPS enforced
- [ ] **Scaling:** HPA configured
- [ ] **CI/CD:** ArgoCD or similar GitOps tool
- [ ] **Resource Limits:** CPU/Memory limits set
- [ ] **Health Checks:** Liveness and readiness probes
- [ ] **Network Policies:** Traffic restrictions configured 