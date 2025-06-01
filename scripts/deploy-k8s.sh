#!/bin/bash

# AWS Next Express Kubernetes Deployment Script
# Usage: ./scripts/deploy-k8s.sh [IMAGE_TAG] [DOCKER_REGISTRY]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="aws-next-express"
DOCKER_REGISTRY="${2:-your-registry}"
IMAGE_TAG="${1:-latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed or not in PATH"
    fi
    
    # Check if envsubst is available
    if ! command -v envsubst &> /dev/null; then
        log_error "envsubst is not installed. Install gettext package."
    fi
    
    # Check kubectl connectivity
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Check your kubeconfig."
    fi
    
    log_success "Prerequisites check passed"
}

build_and_push_image() {
    log_info "Building and pushing Docker image..."
    log_info "Registry: $DOCKER_REGISTRY"
    log_info "Tag: $IMAGE_TAG"
    
    cd "$PROJECT_ROOT"
    
    # Build production image
    docker build -f Dockerfile.production -t "$DOCKER_REGISTRY/aws-next-express:$IMAGE_TAG" .
    
    # Push to registry
    docker push "$DOCKER_REGISTRY/aws-next-express:$IMAGE_TAG"
    
    log_success "Docker image built and pushed successfully"
}

deploy_infrastructure() {
    log_info "Deploying infrastructure components..."
    
    cd "$PROJECT_ROOT"
    
    # Create namespace
    kubectl apply -f k8s/namespace.yaml
    log_success "Namespace created"
    
    # Apply RBAC
    kubectl apply -f k8s/rbac.yaml
    log_success "RBAC configured"
    
    # Apply ConfigMaps
    kubectl apply -f k8s/configmap.yaml
    log_success "ConfigMaps applied"
    
    # Check if secrets exist, if not, create them with warnings
    if ! kubectl get secret app-secrets -n "$NAMESPACE" &> /dev/null; then
        log_warning "app-secrets not found. Creating with default values."
        log_warning "Please update k8s/secrets.yaml with real values before production use!"
        kubectl apply -f k8s/secrets.yaml
    fi
    
    if ! kubectl get secret mysql-secret -n "$NAMESPACE" &> /dev/null; then
        kubectl apply -f k8s/secrets.yaml
    fi
    
    if ! kubectl get secret redis-secret -n "$NAMESPACE" &> /dev/null; then
        kubectl apply -f k8s/secrets.yaml
    fi
    
    log_success "Secrets applied"
}

deploy_databases() {
    log_info "Deploying databases..."
    
    cd "$PROJECT_ROOT"
    
    # Deploy databases
    kubectl apply -f k8s/database.yaml
    log_success "Database deployments created"
    
    # Wait for databases to be ready
    log_info "Waiting for MySQL to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n "$NAMESPACE" || {
        log_error "MySQL deployment failed to become ready"
    }
    
    log_info "Waiting for Redis to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/redis-deployment -n "$NAMESPACE" || {
        log_error "Redis deployment failed to become ready"
    }
    
    log_success "Databases are ready"
}

deploy_application() {
    log_info "Deploying application..."
    
    cd "$PROJECT_ROOT"
    
    # Deploy application with updated image
    export DOCKER_REGISTRY IMAGE_TAG
    envsubst < k8s/app-deployment.yaml | kubectl apply -f -
    
    # Wait for application deployment
    log_info "Waiting for application to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/app-deployment -n "$NAMESPACE" || {
        log_error "Application deployment failed to become ready"
    }
    
    log_success "Application deployed successfully"
}

setup_ingress() {
    log_info "Setting up ingress..."
    
    cd "$PROJECT_ROOT"
    
    # Check if ingress controller is available
    if kubectl get ingressclass nginx &> /dev/null; then
        log_info "NGINX Ingress Controller detected"
        # Apply ingress (you might want to sed out the ALB section)
        kubectl apply -f k8s/ingress.yaml
    elif kubectl get ingressclass alb &> /dev/null; then
        log_info "AWS Load Balancer Controller detected"
        kubectl apply -f k8s/ingress.yaml
    else
        log_warning "No supported ingress controller found. Skipping ingress setup."
        log_warning "You may need to install NGINX Ingress Controller or AWS Load Balancer Controller"
        return
    fi
    
    log_success "Ingress configured"
}

show_status() {
    log_info "Deployment Status:"
    echo ""
    
    # Show pods
    echo "📦 Pods:"
    kubectl get pods -n "$NAMESPACE" -o wide
    echo ""
    
    # Show services
    echo "🌐 Services:"
    kubectl get svc -n "$NAMESPACE"
    echo ""
    
    # Show ingress
    echo "🚪 Ingress:"
    kubectl get ingress -n "$NAMESPACE" 2>/dev/null || echo "No ingress found"
    echo ""
    
    # Show HPA
    echo "📈 Horizontal Pod Autoscaler:"
    kubectl get hpa -n "$NAMESPACE" 2>/dev/null || echo "No HPA found"
    echo ""
    
    # Application URL
    APP_SERVICE_IP=$(kubectl get svc app-service -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$APP_SERVICE_IP" ]; then
        log_success "Application available at: http://$APP_SERVICE_IP"
    else
        log_info "Application service: $(kubectl get svc app-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}'):3000"
        log_info "Use port-forward to access: kubectl port-forward svc/app-service 3000:3000 -n $NAMESPACE"
    fi
}

cleanup() {
    if [ "$1" = "--cleanup" ]; then
        log_warning "Cleaning up deployment..."
        kubectl delete namespace "$NAMESPACE" --ignore-not-found=true
        log_success "Cleanup complete"
        exit 0
    fi
}

show_help() {
    echo "AWS Next Express Kubernetes Deployment Script"
    echo ""
    echo "Usage:"
    echo "  $0 [IMAGE_TAG] [DOCKER_REGISTRY]"
    echo "  $0 --cleanup                      # Remove all resources"
    echo "  $0 --help                         # Show this help"
    echo ""
    echo "Examples:"
    echo "  $0                                # Deploy with default tag 'latest'"
    echo "  $0 v1.0.0                        # Deploy with tag 'v1.0.0'"
    echo "  $0 v1.0.0 my-registry.com        # Deploy with custom registry"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_REGISTRY                   # Docker registry URL"
    echo "  IMAGE_TAG                         # Docker image tag"
    echo ""
}

# Main execution
main() {
    echo "🚀 AWS Next Express Kubernetes Deployment"
    echo "=========================================="
    echo ""
    
    # Handle special arguments
    case "$1" in
        --help|-h)
            show_help
            exit 0
            ;;
        --cleanup)
            cleanup --cleanup
            ;;
    esac
    
    log_info "Starting deployment..."
    log_info "Namespace: $NAMESPACE"
    log_info "Registry: $DOCKER_REGISTRY"
    log_info "Image Tag: $IMAGE_TAG"
    echo ""
    
    check_prerequisites
    build_and_push_image
    deploy_infrastructure
    deploy_databases
    deploy_application
    setup_ingress
    
    echo ""
    log_success "🎉 Deployment completed successfully!"
    echo ""
    
    show_status
    
    echo ""
    log_info "Useful commands:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo "  kubectl logs -f deployment/app-deployment -n $NAMESPACE"
    echo "  kubectl port-forward svc/app-service 3000:3000 -n $NAMESPACE"
    echo ""
    log_info "To clean up: $0 --cleanup"
}

# Run main function
main "$@" 