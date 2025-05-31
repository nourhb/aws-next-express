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
      console.log(`Table ${tableName} already exists`);
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
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

async function initializeTables() {
  console.log('Initializing DynamoDB tables...');
  await createUsersTable();
  console.log('All tables initialized successfully');
}

// Run if called directly
if (require.main === module) {
  initializeTables().catch(console.error);
}

module.exports = { initializeTables }; 