# Docker Setup

Quick setup guide for containerized development and production.

## Prerequisites

- Docker Desktop installed
- PowerShell or Terminal

## Setup

### 1. Start Docker Desktop

Launch Docker Desktop and wait for the whale icon to turn blue in your system tray.

### 2. Environment Configuration

```bash
# Copy template
Copy-Item docker.env.template .env.production

# Edit with your values
```

Required variables:
```env
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=nextapp_db
NEXTAUTH_SECRET=your_secret
AWS_S3_BUCKET_NAME=your_bucket
```

### 3. Build & Run

```bash
# Development
npm run docker:compose

# Production stack
npm run docker:compose:prod
```

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| Grafana | http://localhost:3001 | admin/admin |
| Prometheus | http://localhost:9090 | - |

## Commands

```bash
# View containers
docker ps

# View logs
docker logs <container_name>

# Stop all
docker-compose down

# Clean up
docker system prune -a
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Restart terminal |
| Port in use | `docker-compose down` |
| Build fails | Check .env.production exists |

## Production

Full stack includes:
- Next.js application
- MySQL database
- Redis cache
- Nginx proxy
- Prometheus monitoring
- Grafana dashboards 