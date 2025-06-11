#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const { S3Client, ListBucketsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID', 
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET_NAME'
];

async function validateEnvironment() {
  const missing = requiredEnvVars.filter(key => !process.env[key] || process.env[key].includes('your-'));
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing.join(', '));
    console.error('Copy env.example to .env.local and configure your AWS credentials');
    return false;
  }
  
  return true;
}

async function testS3Connection() {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const listBucketsResult = await s3Client.send(new ListBucketsCommand({}));
    console.log(`S3 connection successful - ${listBucketsResult.Buckets?.length || 0} buckets found`);

    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME }));
      console.log(`Bucket "${process.env.AWS_S3_BUCKET_NAME}" is accessible`);
    } catch (error) {
      console.warn(`Bucket "${process.env.AWS_S3_BUCKET_NAME}" not found or inaccessible`);
      console.warn(`Create bucket: aws s3 mb s3://${process.env.AWS_S3_BUCKET_NAME}`);
    }

    return true;
  } catch (error) {
    console.error('S3 connection failed:', error.message);
    return false;
  }
}

async function testDynamoDBConnection() {
  try {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      ...(process.env.DYNAMODB_ENDPOINT && { endpoint: process.env.DYNAMODB_ENDPOINT }),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const result = await dynamoClient.send(new ListTablesCommand({}));
    console.log(`DynamoDB connection successful - ${result.TableNames?.length || 0} tables found`);

    if (result.TableNames?.length > 0) {
      console.log('Available tables:', result.TableNames.join(', '));
    }

    return true;
  } catch (error) {
    console.error('DynamoDB connection failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.warn('Start DynamoDB Local: docker run -p 8000:8000 amazon/dynamodb-local');
    }
    return false;
  }
}

async function runTests() {
  console.log('Testing AWS services...');
  
  if (!await validateEnvironment()) {
    process.exit(1);
  }

  const s3Success = await testS3Connection();
  const dynamoSuccess = await testDynamoDBConnection();

  console.log('\nTest Results:');
  console.log(`S3: ${s3Success ? 'OK' : 'FAILED'}`);
  console.log(`DynamoDB: ${dynamoSuccess ? 'OK' : 'FAILED'}`);

  if (s3Success && dynamoSuccess) {
    console.log('\nAll AWS services are operational!');
    console.log('Start the application: npm run dev');
  } else {
    console.error('\nSome services are not configured correctly.');
    process.exit(1);
  }
}

runTests().catch(console.error);

if (require.main === module) {
  runTests();
} 