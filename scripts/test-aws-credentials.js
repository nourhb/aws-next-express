#!/usr/bin/env node

// Test AWS Credentials and S3 Bucket Access
require('dotenv').config({ path: '.env.local' });

const { S3Client, ListBucketsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

console.log('🔍 AWS Next Express - Test des Credentials');
console.log('============================================');

// Vérifier les variables d'environnement
const requiredEnvVars = {
  'AWS_REGION': process.env.AWS_REGION,
  'AWS_ACCESS_KEY_ID': process.env.AWS_ACCESS_KEY_ID,
  'AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
  'AWS_S3_BUCKET_NAME': process.env.AWS_S3_BUCKET_NAME,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET
};

console.log('\n📋 Vérification des variables d\'environnement...');
let missingVars = false;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value && value !== 'your_aws_access_key_here' && value !== 'your_aws_secret_key_here') {
    console.log(`✅ ${key}: ${key.includes('SECRET') ? '***' : value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${key}: MANQUANT ou valeur d'exemple`);
    missingVars = true;
  }
});

if (missingVars) {
  console.log('\n❌ ERREUR: Variables d\'environnement manquantes');
  console.log('');
  console.log('📝 Instructions:');
  console.log('1. Copier: cp env.example .env.local');
  console.log('2. Éditer .env.local avec vos vraies credentials AWS');
  console.log('3. Relancer: node scripts/test-aws-credentials.js');
  console.log('');
  console.log('🔗 Guide complet: README-RDS-SETUP.md');
  process.exit(1);
}

// Test AWS S3
async function testS3() {
  console.log('\n🪣 Test de la connexion S3...');
  
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Test de liste des buckets
    const listBucketsResult = await s3Client.send(new ListBucketsCommand({}));
    console.log(`✅ Connexion S3 réussie - ${listBucketsResult.Buckets?.length || 0} buckets trouvés`);

    // Test du bucket spécifique
    try {
      await s3Client.send(new HeadBucketCommand({ 
        Bucket: process.env.AWS_S3_BUCKET_NAME 
      }));
      console.log(`✅ Bucket "${process.env.AWS_S3_BUCKET_NAME}" accessible`);
    } catch (bucketError) {
      console.log(`❌ Bucket "${process.env.AWS_S3_BUCKET_NAME}" non trouvé ou inaccessible`);
      console.log('💡 Créer le bucket:');
      console.log(`   aws s3 mb s3://${process.env.AWS_S3_BUCKET_NAME}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Erreur de connexion S3:', error.message);
    console.log('');
    console.log('🔧 Solutions possibles:');
    console.log('1. Vérifier AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY');
    console.log('2. Vérifier les permissions IAM (AmazonS3FullAccess)');
    console.log('3. Vérifier AWS_REGION');
    return false;
  }
}

// Test DynamoDB Local
async function testDynamoDB() {
  console.log('\n☁️ Test de la connexion DynamoDB Local...');
  
  try {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    const result = await dynamoClient.send(new ListTablesCommand({}));
    console.log(`✅ DynamoDB Local accessible - ${result.TableNames?.length || 0} tables`);
    
    if (result.TableNames?.includes('users') && result.TableNames?.includes('files')) {
      console.log('✅ Tables users et files trouvées');
    } else {
      console.log('⚠️ Tables manquantes - exécuter: node scripts/init-dynamodb.js');
    }
    
    return true;
  } catch (error) {
    console.log('❌ DynamoDB Local non accessible:', error.message);
    console.log('💡 Démarrer DynamoDB Local:');
    console.log('   docker-compose -f docker-compose.full.yml up -d dynamodb-local');
    return false;
  }
}

// Test complet
async function runTests() {
  const s3Success = await testS3();
  const dynamoSuccess = await testDynamoDB();

  console.log('\n🎉 RÉSUMÉ DES TESTS');
  console.log('====================');
  
  if (s3Success && dynamoSuccess) {
    console.log('✅ TOUS LES TESTS RÉUSSIS !');
    console.log('');
    console.log('🚀 Vous pouvez démarrer l\'application:');
    console.log('   docker-compose -f docker-compose.full.yml up -d');
    console.log('   npx prisma migrate dev');
    console.log('   node scripts/init-dynamodb.js');
    console.log('   npm run dev');
    console.log('');
    console.log('🌐 Puis aller sur: http://localhost:3000/database');
  } else {
    console.log('❌ CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('');
    console.log('🔧 Corriger les erreurs ci-dessus puis relancer ce test');
  }
}

// Exécuter les tests
runTests().catch(console.error); 