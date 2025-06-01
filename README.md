# AWS Next.js Express

Modern full-stack application with enterprise deployment capabilities.

## ⚡ Quick Start

```bash
npm install
npm run dev
```

## 🚀 Deployment Options

| Method | Command | Use Case |
|--------|---------|----------|
| **Development** | `npm run dev` | Local development |
| **Docker** | `npm run docker:compose:prod` | Production testing |
| **Kubernetes** | `npm run k8s:deploy:full` | Cloud production |
| **AWS** | `npm run terraform:apply` | Infrastructure |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: MySQL, Prisma ORM
- **Cache**: Redis
- **Auth**: NextAuth.js
- **Cloud**: AWS (S3, RDS, EC2)
- **Container**: Docker, Kubernetes
- **Infrastructure**: Terraform
- **Monitoring**: Prometheus, Grafana

## 📦 Docker Setup

```bash
# Copy environment template
Copy-Item docker.env.template .env.production

# Edit .env.production with your values
# Start full stack
npm run docker:compose:prod
```

**Access Points:**
- App: http://localhost:3000
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

## ☸️ Kubernetes Deployment

```bash
# Update k8s/secrets.yaml
# Deploy to cluster
npm run k8s:deploy:full
```

## 🏗️ AWS Infrastructure

```bash
# Update terraform/terraform.tfvars
terraform init
terraform apply
```

## 📋 Environment Variables

```env
DATABASE_URL=mysql://user:pass@host:port/db
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket
NEXTAUTH_SECRET=your-secret
```

## 🔧 Available Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run test             # Run tests

npm run docker:build:prod        # Build production image
npm run docker:compose:prod      # Full stack

npm run k8s:deploy:full          # Deploy to Kubernetes
npm run k8s:status               # Check status

npm run terraform:plan           # Plan infrastructure
npm run terraform:apply          # Deploy to AWS
```

## 📚 Documentation

- [Docker Setup](DOCKER-SETUP.md)
- [Kubernetes Guide](K8S-GUIDE.md)
- [AWS Deployment](AWS-GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details. 