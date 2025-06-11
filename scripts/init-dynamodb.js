const { DynamoDBClient, CreateTableCommand, ListTablesCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const dynamoClient = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

async function tableExists(tableName) {
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    return false;
  }
}

async function createUsersTable() {
  const tableName = 'users';
  
  if (await tableExists(tableName)) {
    console.log(`Table ${tableName} already exists`);
    return;
  }

  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    await dynamoClient.send(new CreateTableCommand(params));
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error.message);
  }
}

async function createFilesTable() {
  const tableName = 'files';
  
  if (await tableExists(tableName)) {
    console.log(`Table ${tableName} already exists`);
    return;
  }

  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    await dynamoClient.send(new CreateTableCommand(params));
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error.message);
  }
}

async function waitForTables() {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    try {
      const usersExists = await tableExists('users');
      const filesExists = await tableExists('files');
      
      if (usersExists && filesExists) {
        console.log('All tables are ready');
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
  }
  
  console.warn('Timeout - tables taking longer than expected');
  return false;
}

async function initializeDynamoDB() {
  console.log('Initializing DynamoDB...');
  
  try {
    await dynamoClient.send(new ListTablesCommand({}));
    console.log('Connected to DynamoDB');
  } catch (error) {
    console.error('Cannot connect to DynamoDB:', error.message);
    console.error('Start DynamoDB Local: docker-compose -f docker-compose.full.yml up -d dynamodb-local');
    process.exit(1);
  }

  await createUsersTable();
  await createFilesTable();
  await waitForTables();

  try {
    const result = await dynamoClient.send(new ListTablesCommand({}));
    console.log('Available tables:', result.TableNames || []);
  } catch (error) {
    console.error('Error listing tables:', error.message);
  }

  console.log('DynamoDB initialization complete');
}

if (require.main === module) {
  initializeDynamoDB().catch(console.error);
}

module.exports = { initializeDynamoDB }; 