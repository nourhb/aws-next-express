# AWS Next Express - Full Stack Application

A complete full-stack application with Next.js frontend, DynamoDB backend, Docker containerization, Kubernetes orchestration, and CI/CD pipeline.

## Features

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: API routes with DynamoDB integration
- **File Storage**: AWS S3 for profile pictures
- **Database**: DynamoDB for user data
- **Containerization**: Docker and Docker Compose
- **Orchestration**: Kubernetes with ArgoCD
- **CI/CD**: GitHub Actions pipeline
- **Testing**: Jest with comprehensive test suite
- **Git Hooks**: Pre-commit hooks with Husky

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- AWS CLI
- kubectl (for Kubernetes)
- ArgoCD CLI (for deployment)

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd aws-next-express
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit with your AWS credentials
vim .env.local
```

Required environment variables:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
DYNAMODB_USERS_TABLE=users
DYNAMODB_ENDPOINT=http://localhost:8000
```

### 3. Local Development with Docker

```bash
# Start all services
pnpm docker:compose

# Initialize DynamoDB tables
node scripts/init-dynamodb.js

# Visit http://localhost:3000
```

### 4. Local Development (Manual)

```bash
# Start DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# Initialize tables
node scripts/init-dynamodb.js

# Start development server
pnpm dev
```

## Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Individual Components

```bash
# Test DynamoDB operations
pnpm test -- users-dynamodb

# Test API endpoints
pnpm test -- api

# Test Docker setup
./scripts/test-docker.sh

# Test Kubernetes setup
./scripts/test-k8s.sh
```

## API Endpoints

### Users API

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user (with file upload)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Example Usage

```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "profilePicture=@profile.jpg"

# Get all users
curl http://localhost:3000/api/users
```

## Docker Commands

```bash
# Build image
pnpm docker:build

# Run container
pnpm docker:run

# Start with Docker Compose
pnpm docker:compose

# View logs
docker-compose logs -f
```

## Kubernetes Deployment

### Prerequisites

1. Kubernetes cluster running
2. ArgoCD installed
3. Docker images pushed to registry

### Deploy

```bash
# Create secrets (base64 encode your credentials)
echo -n "your_access_key" | base64
echo -n "your_secret_key" | base64

# Update k8s/secrets.yaml with encoded values

# Deploy to Kubernetes
pnpm k8s:deploy

# Check deployment status
kubectl get pods
kubectl get services
```

### ArgoCD Setup

```bash
# Install ArgoCD application
kubectl apply -f argocd/application.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## CI/CD Pipeline

The GitHub Actions pipeline automatically:

1. **Build & Test**: Runs tests and builds the application
2. **Docker Build**: Creates and pushes Docker images
3. **Deploy**: Deploys to Kubernetes via ArgoCD

### Setup GitHub Secrets

Add these secrets to your GitHub repository:

```
DOCKERHUB_USERNAME=your_username
DOCKERHUB_TOKEN=your_token
ARGOCD_SERVER=your_argocd_server
ARGOCD_AUTH_TOKEN=your_auth_token
```

### Manual Pipeline Trigger

```bash
# Trigger test pipeline
gh workflow run "Test Pipeline"

# View pipeline status
gh run list
```

## DynamoDB Table Structure

### Users Table

```json
{
  "id": "string (Primary Key)",
  "name": "string",
  "email": "string (GSI)",
  "profilePictureUrl": "string",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── lib/                   # Utility libraries
│   ├── aws/               # AWS integrations
│   └── db/                # Database operations
├── k8s/                   # Kubernetes manifests
├── scripts/               # Utility scripts
├── argocd/               # ArgoCD configurations
├── .github/workflows/    # GitHub Actions
├── docker-compose.yml    # Docker Compose config
├── Dockerfile           # Docker image config
└── README.md           # This file
```

## Troubleshooting

### Common Issues

1. **DynamoDB Connection Error**
   ```bash
   # Check if DynamoDB Local is running
   curl http://localhost:8000

   # Restart DynamoDB Local
   docker restart dynamodb-local
   ```

2. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   pnpm install
   pnpm build
   ```

3. **Test Failures**
   ```bash
   # Run tests with verbose output
   pnpm test --verbose

   # Check environment variables
   echo $AWS_REGION
   ```

### Logs and Debugging

```bash
# Docker Compose logs
docker-compose logs -f

# Kubernetes logs
kubectl logs -f deployment/frontend

# ArgoCD application status
argocd app get aws-next-express
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run the test suite
5. Submit a pull request

Pre-commit hooks will automatically run:
- ESLint
- TypeScript checking
- Jest tests

## License

MIT License - see LICENSE file for details. 