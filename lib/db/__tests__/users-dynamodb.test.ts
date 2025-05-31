import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../users-dynamodb';

// Mock the dynamoDB module
jest.mock('../../aws/dynamodb', () => ({
  dynamoDB: {
    scanItems: jest.fn(),
    getItem: jest.fn(),
    putItem: jest.fn(),
    deleteItem: jest.fn(),
    queryItems: jest.fn(),
  },
}));

import { dynamoDB } from '../../aws/dynamodb';

describe('Users DynamoDB Operations', () => {
  const mockUser = {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    profilePictureUrl: 'https://example.com/pic.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      (dynamoDB.scanItems as jest.Mock).mockResolvedValue({
        Items: [mockUser],
      });

      const result = await getUsers();
      expect(result).toEqual([mockUser]);
      expect(dynamoDB.scanItems).toHaveBeenCalledWith('users');
    });

    it('should return empty array when no users', async () => {
      (dynamoDB.scanItems as jest.Mock).mockResolvedValue({
        Items: undefined,
      });

      const result = await getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      (dynamoDB.getItem as jest.Mock).mockResolvedValue({
        Item: mockUser,
      });

      const result = await getUserById('test-id');
      expect(result).toEqual(mockUser);
      expect(dynamoDB.getItem).toHaveBeenCalledWith('users', { id: 'test-id' });
    });

    it('should return null when user not found', async () => {
      (dynamoDB.getItem as jest.Mock).mockResolvedValue({
        Item: undefined,
      });

      const result = await getUserById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      (dynamoDB.putItem as jest.Mock).mockResolvedValue({});

      const userData = {
        name: 'New User',
        email: 'new@example.com',
        profilePictureUrl: 'https://example.com/new.jpg',
      };

      const result = await createUser(userData);
      
      expect(result).toMatchObject(userData);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(dynamoDB.putItem).toHaveBeenCalledWith('users', result);
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      (dynamoDB.getItem as jest.Mock).mockResolvedValue({
        Item: mockUser,
      });
      (dynamoDB.putItem as jest.Mock).mockResolvedValue({});

      const updateData = { name: 'Updated Name' };
      const result = await updateUser('test-id', updateData);

      expect(result).toMatchObject({
        ...mockUser,
        name: 'Updated Name',
      });
      expect(result?.updatedAt).not.toBe(mockUser.updatedAt);
    });

    it('should return null when user not found', async () => {
      (dynamoDB.getItem as jest.Mock).mockResolvedValue({
        Item: undefined,
      });

      const result = await updateUser('non-existent', { name: 'New Name' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      (dynamoDB.deleteItem as jest.Mock).mockResolvedValue({});

      const result = await deleteUser('test-id');
      expect(result).toBe(true);
      expect(dynamoDB.deleteItem).toHaveBeenCalledWith('users', { id: 'test-id' });
    });
  });
}); 