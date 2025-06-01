# 🚀 AWS Next Express - Application Full-Stack Complète

> **Application Next.js 15 moderne avec support dual RDS + DynamoDB, infrastructure Terraform, containerisation Docker et orchestration Kubernetes**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20RDS%20%2B%20DynamoDB-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-blue?logo=kubernetes)](https://kubernetes.io/)

## 🎯 **Fonctionnalités Principales**

### **🔄 Architecture Dual Database**
- **🗄️ Amazon RDS (MySQL)** avec Prisma ORM
- **☁️ Amazon DynamoDB** avec SDK AWS natif  
- **🔀 Interface de sélection** entre les deux bases
- **📊 Comparaison en temps réel** des performances

### **☁️ AWS Services Intégrés**
- **📁 S3** - Stockage fichiers et images utilisateurs
- **🗂️ RDS** - Base de données relationnelle
- **⚡ DynamoDB** - Base de données NoSQL
- **🔐 IAM** - Gestion des permissions

### **🐳 Containerisation & Orchestration**
- **Docker** avec multi-services (Frontend, MySQL, DynamoDB)
- **Kubernetes** manifests prêts pour production
- **Docker Compose** pour développement local
- **Monitoring** Prometheus + Grafana

### **🔄 CI/CD & DevOps**
- **GitHub Actions** pipeline automatisé
- **ArgoCD** déploiement GitOps
- **Terraform** infrastructure as code
- **Git hooks** pré-commit avec Husky

---

## 🚀 **Démarrage Rapide**

### **1. Installation**

```bash
# Cloner le projet
git clone https://github.com/nourhb/aws-next-express.git
cd aws-next-express

# Installer les dépendances
npm install
```

### **2. Configuration**

```bash
# Créer la configuration
cp .env.example .env.local

# Lancer le setup automatique
./scripts/setup-rds.sh  # Linux/Mac
# ou
powershell -ExecutionPolicy Bypass ./scripts/setup-rds.ps1  # Windows
```

### **3. Démarrage avec Docker (Recommandé)**

```bash
# Démarrer tous les services (MySQL + DynamoDB + App)
docker-compose -f docker-compose.full.yml up -d

# Initialiser les bases de données
npx prisma migrate dev
node scripts/init-dynamodb.js

# Accéder à l'application
# 🌐 App: http://localhost:3000/database
# 🗄️ phpMyAdmin: http://localhost:8080
# ☁️ DynamoDB Admin: http://localhost:8001
```

### **4. Développement local**

```bash
# Option MySQL local uniquement
docker-compose -f docker-compose.mysql.yml up -d

# Option développement manuel
npm run dev
```

---

## 🎯 **URLs d'Accès**

| Service | URL | Credentials |
|---------|-----|-------------|
| **🌐 Application** | http://localhost:3000 | - |
| **🔀 Sélecteur DB** | http://localhost:3000/database | - |
| **🗄️ phpMyAdmin** | http://localhost:8080 | root/password |
| **☁️ DynamoDB Admin** | http://localhost:8001 | - |
| **📊 Prometheus** | http://localhost:9090 | (avec monitoring) |
| **📈 Grafana** | http://localhost:3001 | admin/admin |

---

## 🛠️ **Configuration Environnement**

### **Variables Requises (.env.local)**

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=your_bucket_name

# RDS MySQL Database
DATABASE_URL="mysql://username:password@your-rds-endpoint:3306/aws_next_express"

# DynamoDB (Local Development)
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_USERS_TABLE=users
DYNAMODB_FILES_TABLE=files

# Next.js
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## 🎯 **APIs Disponibles**

### **👥 Utilisateurs RDS (MySQL + Prisma)**
```http
GET    /api/users              # Lister utilisateurs
POST   /api/users              # Créer utilisateur + upload S3
PUT    /api/users/[id]          # Modifier utilisateur
DELETE /api/users/[id]          # Supprimer utilisateur + S3
```

### **👥 Utilisateurs DynamoDB**
```http
GET    /api/dynamo-users        # Lister utilisateurs
POST   /api/dynamo-users        # Créer utilisateur + upload S3
PUT    /api/dynamo-users/[id]   # Modifier utilisateur
DELETE /api/dynamo-users/[id]   # Supprimer utilisateur + S3
```

### **📁 Fichiers S3**
```http
GET    /api/files              # Lister fichiers (en mémoire)
POST   /api/files              # Upload vers S3
DELETE /api/files/[id]          # Supprimer de S3

GET    /api/dynamo-files        # Lister fichiers (métadonnées DynamoDB)
POST   /api/dynamo-files        # Upload S3 + métadonnées DynamoDB
DELETE /api/dynamo-files/[id]   # Supprimer S3 + DynamoDB
```

---

## 🚀 **Déploiement Production**

### **1. AWS avec Terraform**

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### **2. Kubernetes**

```bash
# Créer les secrets
kubectl create secret generic aws-credentials \
  --from-literal=access-key-id=your_key \
  --from-literal=secret-access-key=your_secret

# Déployer
kubectl apply -f k8s/
```

### **3. Docker Production**

```bash
# Build image
docker build -t aws-next-express .
docker run -d -p 3000:3000 aws-next-express
```

---

## 🧪 **Tests & Qualité**

```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Linting
npm run lint

# Build production
npm run build
```

---

## 🎓 **Pour ITEAM University**

### **✅ Conformité Cahier des Charges**
- [x] Dépôt Next.js full stack
- [x] AWS S3 SDK intégré
- [x] Upload fichiers + vérification S3
- [x] Liste et suppression fichiers
- [x] Base RDS avec formulaires CRUD
- [x] Images S3 + données RDS
- [x] Boutons fonctionnels

### **🚀 Fonctionnalités Bonus**
- [x] Support DynamoDB en plus de RDS
- [x] Interface de sélection entre bases
- [x] Containerisation Docker complète
- [x] Orchestration Kubernetes
- [x] Pipeline CI/CD avec ArgoCD
- [x] Infrastructure Terraform

---

## 👥 **Développé par**

**Nour el houda Bouajila** & **Ghofrane Nasri**  
🎓 ITEAM University  
📧 nour.bouajila@iteam.tn | ghofrane.nasri@iteam.tn

---

## 📄 **Documentation Complète**

- 📋 [Guide Setup RDS](./README-RDS-SETUP.md)
- 🎯 [Résumé Fonctionnalités](./FEATURES-SUMMARY.md)

---

**🎉 Projet complet prêt pour démonstration et production !** 🚀 