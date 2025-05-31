import { dynamoDB } from '../dynamodb';

describe('DynamoDB Operations', () => {
  const testTable = 'test-table';
  const testItem = {
    id: 'test-1',
    name: 'Test Item',
    createdAt: new Date().toISOString()
  };

  beforeAll(async () => {
    // Create test table if it doesn't exist
    // Note: In a real environment, you would use AWS SDK to create the table
  });

  test('should put and get an item', async () => {
    // Put item
    await dynamoDB.putItem(testTable, testItem);
    
    // Get item
    const result = await dynamoDB.getItem(testTable, { id: testItem.id });
    expect(result.Item).toEqual(testItem);
  });

  test('should query items', async () => {
    const result = await dynamoDB.queryItems(
      testTable,
      'id = :id',
      { ':id': testItem.id }
    );
    expect(result.Items).toContainEqual(testItem);
  });

  test('should delete an item', async () => {
    await dynamoDB.deleteItem(testTable, { id: testItem.id });
    const result = await dynamoDB.getItem(testTable, { id: testItem.id });
    expect(result.Item).toBeUndefined();
  });
}); 