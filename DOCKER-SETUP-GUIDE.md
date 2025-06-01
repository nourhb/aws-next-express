# 🐳 Docker Setup Guide for Windows

## ✅ **Docker Desktop Installation Complete!**

Docker Desktop has been successfully installed. Follow these steps to get started:

---

## 🚀 **Step 1: Start Docker Desktop**

1. **Launch Docker Desktop:**
   - Press `Windows + R`, type `Docker Desktop`, and press Enter
   - OR find "Docker Desktop" in your Start Menu and click it
   - Wait for Docker to start (may take a few minutes on first run)

2. **Verify Docker is Running:**
   - Look for the Docker whale icon in your system tray (bottom right)
   - The icon should be blue when Docker is running

3. **Accept License Agreement:**
   - Docker Desktop may ask you to accept terms and conditions
   - Follow the setup wizard if prompted

---

## 🔧 **Step 2: Restart PowerShell**

**Close and reopen PowerShell** to ensure Docker commands are available:

1. Close your current PowerShell window
2. Open a new PowerShell window
3. Navigate back to your project:
   ```powershell
   cd "C:\Users\HP ELITE\OneDrive\Bureau\aws-next-express"
   ```

---

## ✨ **Step 3: Test Docker Installation**

Run these commands to verify Docker is working:

```powershell
# Check Docker version
docker --version

# Check if Docker daemon is running
docker info

# Test with a simple container
docker run hello-world
```

**Expected Output:**
```
Docker version 24.x.x, build xxxxx
```

---

## 📝 **Step 4: Create Environment Files**

Create the necessary environment files for Docker Compose:

### **Create `.env.production` file:**
```powershell
# Copy the template file
Copy-Item docker.env.template .env.production
```

Then edit `.env.production` with your favorite text editor and update these values:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=SecureRootPassword123!
MYSQL_DATABASE=nextapp_db
MYSQL_USER=appuser
MYSQL_PASSWORD=SecureUserPassword123!

# Application Configuration
NODE_ENV=production
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Redis Configuration
REDIS_PASSWORD=SecureRedisPassword123!

# Monitoring
GRAFANA_PASSWORD=admin
```

**💡 Generate a secure NEXTAUTH_SECRET:**
```powershell
# Generate random secret (if you have OpenSSL)
openssl rand -base64 32

# Or use PowerShell to generate random string
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

---

## 🎯 **Step 5: Test Your Docker Setup**

Now you can test the Docker configurations we created:

### **Option A: Simple Development Build**
```powershell
# Build development image
npm run docker:build

# Run the container
npm run docker:run
```

### **Option B: Production Build (Multi-stage)**
```powershell
# Build production image with optimizations
npm run docker:build:prod

# Run production container
npm run docker:run:prod
```

### **Option C: Full Production Stack**
```powershell
# Start the complete stack (App + MySQL + Redis + Nginx + Monitoring)
npm run docker:compose:prod
```

---

## 🌐 **Step 6: Access Your Application**

After running any of the above commands:

- **Application:** http://localhost:3000
- **Nginx Proxy:** http://localhost:80
- **Grafana Dashboard:** http://localhost:3001 (admin/admin)
- **Prometheus Metrics:** http://localhost:9090

---

## 🔧 **Useful Docker Commands**

```powershell
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs <container-name>

# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# View Docker images
docker images

# Remove unused images
docker image prune
```

---

## 🔧 **Troubleshooting**

### **Issue: "docker: command not found"**
- **Solution:** Restart PowerShell and ensure Docker Desktop is running

### **Issue: "Docker daemon not running"**
- **Solution:** Start Docker Desktop application

### **Issue: "Port already in use"**
- **Solution:** Stop existing containers:
  ```powershell
  docker-compose down
  # Or for production stack:
  docker-compose -f docker-compose.production.yml down
  ```

### **Issue: "Permission denied"**
- **Solution:** Run PowerShell as Administrator

### **Issue: Build fails with "no space left"**
- **Solution:** Clean up Docker:
  ```powershell
  docker system prune -a
  ```

### **Issue: "Environment file not found"**
- **Solution:** Make sure you created `.env.production`:
  ```powershell
  Copy-Item docker.env.template .env.production
  ```

---

## 📊 **Next Steps**

### **1. Development Workflow:**
```powershell
# Start development with hot reload
npm run dev

# Or start with Docker for consistency
npm run docker:compose
```

### **2. Production Testing:**
```powershell
# Test full production stack locally
npm run docker:compose:prod
```

### **3. Kubernetes Deployment:**
```powershell
# Once you have a Kubernetes cluster
npm run k8s:deploy:full
```

### **4. AWS Deployment:**
```powershell
# Deploy infrastructure to AWS
npm run terraform:apply
```

---

## ✅ **Success Checklist**

- [ ] Docker Desktop is installed and running
- [ ] `docker --version` shows version information
- [ ] `.env.production` file is created with your values
- [ ] `npm run docker:build:prod` completes successfully
- [ ] Application is accessible at http://localhost:3000
- [ ] Docker containers can be started and stopped

---

## 🎉 **You're Ready!**

Your Docker setup is now complete! You can:

- ✅ **Develop** with consistent environments
- ✅ **Test** production builds locally
- ✅ **Deploy** to any Docker-compatible platform
- ✅ **Scale** with Kubernetes
- ✅ **Monitor** with built-in dashboards

**Need help?** Check the `DOCKER-KUBERNETES-GUIDE.md` for detailed usage instructions! 