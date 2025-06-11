#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let hasErrors = false;

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.mjs',
  'tailwind.config.ts',
  'env.example',
  'prisma/schema.prisma',
  'app/api/users/route.ts',
  'app/api/files/route.ts',
  'lib/aws/dynamodb-service.ts',
  'lib/db/users.ts',
  'Dockerfile',
  'docker-compose.yml',
  'terraform/main.tf',
];

console.log('Pre-commit validation...');

// Check required files
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('Missing required files:', missingFiles.join(', '));
  hasErrors = true;
}

// Check package.json dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@aws-sdk/client-s3',
    '@aws-sdk/client-dynamodb',
    '@prisma/client',
    'next',
    'react',
    'typescript'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length > 0) {
    console.error('Missing dependencies:', missingDeps.join(', '));
    hasErrors = true;
  }
} catch (error) {
  console.error('Error reading package.json');
  hasErrors = true;
}

// Check environment variables
try {
  const envExample = fs.readFileSync('env.example', 'utf8');
  const requiredEnvVars = [
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'DATABASE_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !envExample.includes(envVar));
  if (missingEnvVars.length > 0) {
    console.error('Missing environment variables in env.example:', missingEnvVars.join(', '));
    hasErrors = true;
  }
} catch (error) {
  console.error('Error reading env.example');
  hasErrors = true;
}

if (hasErrors) {
  console.error('Pre-commit validation failed');
  process.exit(1);
} else {
  console.log('Pre-commit validation passed');
} 