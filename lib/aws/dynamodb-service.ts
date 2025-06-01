import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  DeleteCommand, 
  ScanCommand,
  UpdateCommand 
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  credentials: process.env.DYNAMODB_ENDPOINT ? {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  } : {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Tables
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || 'users';
const FILES_TABLE = process.env.DYNAMODB_FILES_TABLE || 'files';

// User Interface for DynamoDB
export interface DynamoUser {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

// File Interface for DynamoDB
export interface DynamoFile {
  id: string;
  name: string;
  key: string;
  size: number;
  contentType: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export class DynamoDBService {
  // ================== USER OPERATIONS ==================
  
  async createUser(userData: Omit<DynamoUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoUser> {
    const now = new Date().toISOString();
    const user: DynamoUser = {
      id: uuidv4(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: "attribute_not_exists(id)",
    });

    try {
      await docClient.send(command);
      return user;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new Error("User with this ID already exists");
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<DynamoUser | null> {
    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: { id },
    });

    const result = await docClient.send(command);
    return result.Item as DynamoUser || null;
  }

  async getUserByEmail(email: string): Promise<DynamoUser | null> {
    const command = new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });

    const result = await docClient.send(command);
    return result.Items?.[0] as DynamoUser || null;
  }

  async getAllUsers(): Promise<DynamoUser[]> {
    const command = new ScanCommand({
      TableName: USERS_TABLE,
    });

    const result = await docClient.send(command);
    return (result.Items as DynamoUser[]) || [];
  }

  async updateUser(id: string, updates: Partial<Omit<DynamoUser, 'id' | 'createdAt'>>): Promise<DynamoUser | null> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update the updatedAt field
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes as DynamoUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: USERS_TABLE,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        return false; // User doesn't exist
      }
      throw error;
    }
  }

  // ================== FILE OPERATIONS ==================

  async createFile(fileData: Omit<DynamoFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoFile> {
    const now = new Date().toISOString();
    const file: DynamoFile = {
      id: uuidv4(),
      ...fileData,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: FILES_TABLE,
      Item: file,
    });

    await docClient.send(command);
    return file;
  }

  async getFileById(id: string): Promise<DynamoFile | null> {
    const command = new GetCommand({
      TableName: FILES_TABLE,
      Key: { id },
    });

    const result = await docClient.send(command);
    return result.Item as DynamoFile || null;
  }

  async getAllFiles(): Promise<DynamoFile[]> {
    const command = new ScanCommand({
      TableName: FILES_TABLE,
    });

    const result = await docClient.send(command);
    return (result.Items as DynamoFile[]) || [];
  }

  async updateFile(id: string, updates: Partial<Omit<DynamoFile, 'id' | 'createdAt'>>): Promise<DynamoFile | null> {
    const existingFile = await this.getFileById(id);
    if (!existingFile) {
      return null;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update the updatedAt field
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: FILES_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes as DynamoFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: FILES_TABLE,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        return false; // File doesn't exist
      }
      throw error;
    }
  }

  // ================== UTILITY OPERATIONS ==================

  async initializeTables(): Promise<void> {
    // This method could be used to create tables if they don't exist
    // In a real application, you'd use CDK or Terraform to create tables
    console.log("DynamoDB tables should be created via infrastructure as code");
  }

  async healthCheck(): Promise<boolean> {
    try {
      const command = new ScanCommand({
        TableName: USERS_TABLE,
        Limit: 1,
      });
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error("DynamoDB health check failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const dynamoService = new DynamoDBService(); 