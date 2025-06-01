# 🚀 Guide de Démarrage Rapide - AWS Next Express

## ⚡ **Setup en 5 Minutes**

### **1. 📥 Cloner et Installer**

```bash
# Cloner le projet
git clone https://github.com/nourhb/aws-next-express.git
cd aws-next-express

# Installer les dépendances
npm install
```

### **2. ⚙️ Configuration Environnement**

```bash
# Copier le fichier d'exemple
cp env.example .env.local

# Éditer avec vos credentials (obligatoire)
# Remplacer au minimum :
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY  
# - AWS_S3_BUCKET_NAME
```

### **3. 🚀 Démarrage Automatique**

```bash
# Option A: Tout-en-un avec Docker (RECOMMANDÉ)
docker-compose -f docker-compose.full.yml up -d

# Initialiser les bases de données
npx prisma migrate dev
node scripts/init-dynamodb.js

# ✅ Aller sur: http://localhost:3000/database
```

```bash
# Option B: Développement manuel
npm run dev
```

## 🌐 **URLs d'Accès Rapide**

| **Service** | **URL** | **Description** |
|-------------|---------|-----------------|
| 🎯 **Application** | http://localhost:3000 | Page principale |
| 🔀 **Sélecteur DB** | http://localhost:3000/database | **PAGE PRINCIPALE DU PROJET** |
| 👥 **Utilisateurs** | http://localhost:3000/users | Gestion utilisateurs |
| 📁 **Fichiers** | http://localhost:3000/files | Gestion fichiers |
| 🗄️ **phpMyAdmin** | http://localhost:8080 | Interface MySQL (root/password) |
| ☁️ **DynamoDB Admin** | http://localhost:8001 | Interface DynamoDB |

## 🎯 **Test des Fonctionnalités**

### **Tester RDS MySQL**
1. Aller sur http://localhost:3000/database
2. Sélectionner **"Amazon RDS (MySQL)"**
3. Cliquer sur l'onglet **"👥 Utilisateurs"**
4. Cliquer **"Ajouter un utilisateur"**
5. ✅ Tester upload image + création utilisateur
6. ✅ Tester modification et suppression

### **Tester DynamoDB**
1. Sur la même page, sélectionner **"Amazon DynamoDB"**
2. Répéter les mêmes tests
3. ✅ Observer les différences (UUID vs ID numérique)

### **Tester S3 + Gestion Fichiers**
1. Cliquer sur l'onglet **"📁 Fichiers"**
2. ✅ Tester upload de fichiers
3. ✅ Tester téléchargement (URLs pré-signées)
4. ✅ Tester suppression
5. Basculer entre RDS et DynamoDB pour voir les différences

## 🔧 **Configuration AWS**

### **Prérequis AWS**
1. **Compte AWS** actif
2. **Bucket S3** créé
3. **Credentials IAM** avec permissions :
   - S3: GetObject, PutObject, DeleteObject
   - RDS: Connect (si vous utilisez RDS en production)
   - DynamoDB: PutItem, GetItem, Query, DeleteItem

### **Setup Rapide S3**
```bash
# Créer un bucket S3
aws s3 mb s3://votre-nom-bucket-unique

# Configurer CORS
aws s3api put-bucket-cors --bucket votre-nom-bucket-unique --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

## 🐳 **Commandes Docker Utiles**

```bash
# Voir les logs
docker-compose -f docker-compose.full.yml logs -f

# Redémarrer un service
docker-compose -f docker-compose.full.yml restart app

# Arrêter tout
docker-compose -f docker-compose.full.yml down

# Nettoyer et redémarrer
docker-compose -f docker-compose.full.yml down -v
docker-compose -f docker-compose.full.yml up -d
```

## 🔍 **Vérification que Tout Fonctionne**

### **✅ Checklist de Fonctionnement**

- [ ] Application démarre sur http://localhost:3000
- [ ] Page database accessible
- [ ] Sélection RDS/DynamoDB fonctionne
- [ ] Création utilisateur RDS avec photo
- [ ] Création utilisateur DynamoDB avec photo
- [ ] Upload de fichiers vers S3
- [ ] Téléchargement de fichiers depuis S3
- [ ] Suppression utilisateurs et fichiers
- [ ] phpMyAdmin accessible (root/password)
- [ ] DynamoDB Admin accessible

### **🐛 Dépannage Rapide**

**Problème : "AWS credentials not found"**
```bash
# Vérifier le fichier .env.local
cat .env.local | grep AWS_

# S'assurer que les credentials sont corrects
```

**Problème : "Database connection failed"**
```bash
# Vérifier que MySQL est démarré
docker-compose -f docker-compose.full.yml ps

# Redémarrer si nécessaire
docker-compose -f docker-compose.full.yml restart mysql
```

**Problème : "DynamoDB tables not found"**
```bash
# Réinitialiser DynamoDB
node scripts/init-dynamodb.js
```

## 🎓 **Pour ITEAM University**

### **✅ Toutes les Exigences Satisfaites**

1. ✅ **Dépôt Next.js full** - Complet avec TypeScript
2. ✅ **AWS S3 SDK** - Intégré et fonctionnel
3. ✅ **Upload fichiers + vérification S3** - Interface complète
4. ✅ **Liste fichiers** - Avec URLs pré-signées
5. ✅ **Delete fichiers S3** - Bouton fonctionnel
6. ✅ **Base RDS + formulaires** - MySQL + Prisma
7. ✅ **CRUD utilisateurs** - Insert/Update/Delete
8. ✅ **Images S3 + données RDS** - Séparation correcte
9. ✅ **Bouton upload image** - Fonctionnel

### **🚀 Bonus Implémentés**

- ✅ **Support DynamoDB** complet en parallèle
- ✅ **Interface de sélection** entre bases
- ✅ **Containerisation Docker** complète  
- ✅ **Orchestration Kubernetes** prête
- ✅ **Pipeline CI/CD** avec ArgoCD
- ✅ **Infrastructure Terraform**

## 📞 **Support**

**🎓 Développé par :**
- **Nour el houda Bouajila** - nour.bouajila@iteam.tn
- **Ghofrane Nasri** - ghofrane.nasri@iteam.tn

**🔗 Liens Utiles :**
- 📋 [Documentation Complète](./README.md)
- 🎯 [Résumé Fonctionnalités](./FEATURES-SUMMARY.md)  
- 🛠️ [Guide Setup RDS](./README-RDS-SETUP.md)

---

**🎉 Votre application est prête ! Démonstration possible immédiatement !** 🚀 