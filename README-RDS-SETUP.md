# 🚀 AWS Next Express - Guide de Configuration RDS

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration AWS](#configuration-aws)
- [Configuration RDS](#configuration-rds)
- [Développement local](#développement-local)
- [Fonctionnalités](#fonctionnalités)
- [API Endpoints](#api-endpoints)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

Application Next.js 15 full-stack avec :
- ✅ **RDS MySQL** pour les données utilisateurs
- ✅ **AWS S3** pour les fichiers et images
- ✅ **Prisma ORM** pour la gestion de base de données
- ✅ **Upload/Delete fichiers** S3
- ✅ **CRUD utilisateurs** avec photos de profil
- ✅ **Interface moderne** avec Tailwind CSS
- ✅ **Docker & Kubernetes** ready

## 🛠 Prérequis

- Node.js 18+
- pnpm/npm/yarn
- AWS Account
- MySQL database (local ou RDS)
- Docker (optionnel)

## 📦 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/nourhb/aws-next-express.git
cd aws-next-express
```

### 2. Installer les dépendances
```bash
pnpm install
# ou
npm install
```

### 3. Configuration automatique
```bash
# Exécuter le script de setup
bash scripts/setup-rds.sh
```

## ☁️ Configuration AWS

### 1. Créer un bucket S3
```bash
# Via AWS CLI
aws s3 mb s3://your-bucket-name
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration file://aws/s3-cors.json
```

### 2. Créer une instance RDS MySQL
```bash
# Via AWS CLI ou console AWS
aws rds create-db-instance \
  --db-instance-identifier aws-next-express-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

### 3. Configurer les variables d'environnement
Éditer `.env.local` :
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name

# Database RDS
DATABASE_URL="mysql://admin:password@your-rds-endpoint:3306/aws_next_express"

# Next.js
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ Configuration RDS

### 1. Générer le client Prisma
```bash
npx prisma generate
```

### 2. Exécuter les migrations
```bash
npx prisma migrate dev
```

### 3. Seed la base de données (optionnel)
```bash
npx tsx prisma/seed.ts
```

### 4. Ouvrir Prisma Studio
```bash
npx prisma studio
```

## 💻 Développement local

### Option 1: Avec MySQL local
```bash
# Démarrer MySQL avec Docker
docker-compose -f docker-compose.mysql.yml up -d

# Utiliser cette DATABASE_URL
DATABASE_URL="mysql://root:password@localhost:3306/aws_next_express"

# Démarrer l'application
pnpm dev
```

### Option 2: Avec RDS AWS
```bash
# Utiliser l'endpoint RDS dans .env.local
pnpm dev
```

### Accès aux services
- **Application**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080 (root/password)
- **Prisma Studio**: http://localhost:5555

## ✨ Fonctionnalités

### 🔄 Gestion des utilisateurs
- ✅ **Créer** un utilisateur avec photo de profil
- ✅ **Lister** tous les utilisateurs
- ✅ **Modifier** utilisateur (nom, email, photo)
- ✅ **Supprimer** utilisateur (+ suppression photo S3)

### 📁 Gestion des fichiers
- ✅ **Upload** fichiers vers S3
- ✅ **Lister** tous les fichiers
- ✅ **Télécharger** fichiers (URL pré-signées)
- ✅ **Supprimer** fichiers de S3

### 🎨 Interface utilisateur
- ✅ **Dashboard** avec statistiques
- ✅ **Formulaires** avec validation
- ✅ **Interface** moderne et responsive
- ✅ **Toasts** et confirmations

## 🔌 API Endpoints

### Utilisateurs
```http
GET    /api/users              # Lister les utilisateurs
POST   /api/users              # Créer un utilisateur
GET    /api/users/[id]          # Obtenir un utilisateur
PUT    /api/users/[id]          # Modifier un utilisateur
DELETE /api/users/[id]          # Supprimer un utilisateur
```

### Fichiers
```http
GET    /api/files              # Lister les fichiers S3
POST   /api/files              # Upload fichier vers S3
DELETE /api/files/[id]          # Supprimer fichier S3
```

## 🚀 Déploiement

### Docker
```bash
# Build et run
docker build -t aws-next-express .
docker run -p 3000:3000 aws-next-express
```

### Kubernetes
```bash
# Déployer sur K8s
kubectl apply -f k8s/
```

### AWS EC2 avec Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests en mode watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📝 Structure du projet

```
aws-next-express/
├── app/
│   ├── api/
│   │   ├── users/           # API CRUD utilisateurs
│   │   └── files/           # API gestion fichiers S3
│   ├── users/               # Pages utilisateurs
│   └── files/               # Pages fichiers
├── components/
│   ├── user-form.tsx        # Formulaire utilisateur
│   ├── user-list.tsx        # Liste utilisateurs
│   ├── file-uploader.tsx    # Upload fichiers
│   └── file-list.tsx        # Liste fichiers
├── lib/
│   ├── db/
│   │   ├── index.ts         # Prisma client
│   │   └── users.ts         # Fonctions utilisateurs
│   └── aws/
│       └── s3.ts            # Utilitaires S3
├── prisma/
│   ├── schema.prisma        # Schéma base de données
│   ├── migrations/          # Migrations
│   └── seed.ts              # Script de seed
├── terraform/               # Infrastructure AWS
├── k8s/                     # Manifests Kubernetes
└── docker-compose.mysql.yml # Docker MySQL
```

## 🎓 Pour ITEAM University

Cette application répond aux exigences du projet :

1. ✅ **Dépôt Next.js** complet avec TypeScript
2. ✅ **AWS S3 SDK** intégré pour les fichiers
3. ✅ **Upload/Delete fichiers** avec vérification S3
4. ✅ **Liste des fichiers** avec URLs pré-signées
5. ✅ **Base RDS** avec formulaires CRUD utilisateurs
6. ✅ **Images utilisateurs** stockées en S3, données en RDS
7. ✅ **Boutons upload/insert/delete** fonctionnels

## 🆘 Support

Pour toute question :
- 📧 Email: nour.bouajila@iteam.tn
- 📧 Email: ghofrane.nasri@iteam.tn
- 📁 GitHub: [aws-next-express](https://github.com/nourhb/aws-next-express)

---

**Développé par Nour el houda Bouajila & Ghofrane Nasri - ITEAM University** 🎓 