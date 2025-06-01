const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
});

async function createUsersTable() {
  const tableName = process.env.DYNAMODB_USERS_TABLE || 'users';
  
  try {
    // Check if table exists
    const listTablesResult = await client.send(new ListTablesCommand({}));
    if (listTablesResult.TableNames?.includes(tableName)) {
      console.log(`✅ Table ${tableName} already exists`);
      return;
    }

    // Create users table
    const createTableParams = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'email',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'EmailIndex',
          KeySchema: [
            {
              AttributeName: 'email',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          BillingMode: 'PAY_PER_REQUEST',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };

    await client.send(new CreateTableCommand(createTableParams));
    console.log(`✅ Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`❌ Error creating users table:`, error.message);
    throw error;
  }
}

async function createFilesTable() {
  const tableName = process.env.DYNAMODB_FILES_TABLE || 'files';
  
  try {
    // Check if table exists
    const listTablesResult = await client.send(new ListTablesCommand({}));
    if (listTablesResult.TableNames?.includes(tableName)) {
      console.log(`✅ Table ${tableName} already exists`);
      return;
    }

    // Create files table
    const createTableParams = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'key',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'KeyIndex',
          KeySchema: [
            {
              AttributeName: 'key',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          BillingMode: 'PAY_PER_REQUEST',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };

    await client.send(new CreateTableCommand(createTableParams));
    console.log(`✅ Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`❌ Error creating files table:`, error.message);
    throw error;
  }
}

async function waitForTables() {
  // Wait a bit for tables to be fully ready
  console.log('⏳ Waiting for tables to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));
}

async function listAllTables() {
  try {
    const result = await client.send(new ListTablesCommand({}));
    console.log('📋 Available DynamoDB tables:', result.TableNames || []);
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
  }
}

async function main() {
  console.log('🚀 Initializing DynamoDB tables...');
  console.log(`📍 DynamoDB Endpoint: ${process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'}`);
  
  try {
    // Test connection first
    await client.send(new ListTablesCommand({}));
    console.log('✅ DynamoDB connection successful');

    // Create tables
    await createUsersTable();
    await createFilesTable();
    
    // Wait for tables to be ready
    await waitForTables();
    
    // List all tables
    await listAllTables();
    
    console.log('🎉 DynamoDB initialization completed successfully!');
  } catch (error) {
    console.error('❌ DynamoDB initialization failed:', error.message);
    
    // Don't exit with error code in development to allow app to continue
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuing in development mode...');
      return;
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createUsersTable, createFilesTable, main }; 