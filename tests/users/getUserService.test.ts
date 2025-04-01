import { getUsersService } from '@/services/users/getUserService';
import { createAppServerClient } from '@/supabase/server';
import { User } from '@/types/types';
import { faker } from '@faker-js/faker';
import '@testing-library/jest-dom';

// Properly mock the Supabase client with a complete method chain
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getUsersService', () => {
  // Set up mock return values
  let mockLimit: jest.Mock;
  let mockSelect: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLimit = jest.fn();
    mockSelect = jest.fn().mockReturnValue({
      limit: mockLimit,
    });
    mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    // Configure createAppServerClient mock with our chain
    (createAppServerClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });

    // Set default successful response
    mockLimit.mockResolvedValue({
      data: [],
      error: null,
    });
  });

  it('should handle successful user fetching', async () => {
    const limit = 5;
    const mockUsers: User[] = Array.from({ length: limit }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      created_at: faker.date.recent().toISOString(),
    }));

    // Set up mock to return our mock data
    mockLimit.mockResolvedValue({ data: mockUsers, error: null });

    const result = await getUsersService(limit);

    // Verify the function returns the expected data
    expect(result.data).toEqual(mockUsers);
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(limit);

    // Verify the correct limit was used
    expect(mockLimit).toHaveBeenCalledWith(limit);
  });

  // In your test
  it('should use the correct select query', async () => {
    await getUsersService(5);
    expect(mockFrom).toHaveBeenCalledWith('users');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it('should handle errors from Supabase', async () => {
    const mockError = new Error('Failed to fetch users');

    // Set up mock to return an error
    mockLimit.mockResolvedValue({ data: null, error: mockError });

    const result = await getUsersService();

    // Verify the function returns the error
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});
