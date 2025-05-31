import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Utility functions for DynamoDB operations
export const dynamoDB = {
  // Create or update an item
  async putItem(tableName: string, item: any) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
    return await docClient.send(command);
  },

  // Get an item by primary key
  async getItem(tableName: string, key: any) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    return await docClient.send(command);
  },

  // Query items
  async queryItems(tableName: string, keyConditionExpression: string, expressionAttributeValues: any) {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    return await docClient.send(command);
  },

  // Delete an item
  async deleteItem(tableName: string, key: any) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    return await docClient.send(command);
  },

  // Scan all items in a table
  async scanItems(tableName: string) {
    const command = new ScanCommand({
      TableName: tableName,
    });
    return await docClient.send(command);
  },
}; 