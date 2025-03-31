import { faker } from '@faker-js/faker';
import { createUserService } from '@/services/users/createUserService';
import { SupabaseClient } from '@supabase/supabase-js';
import { createAppServerClient } from '@/supabase/server';

// Mock the Supabase client
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('createUserService', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let mockInsert: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockInsert = jest.fn();
    
    mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: mockInsert,
      }),
    };
    
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  test('should successfully create a user', async () => {
    // Mock data to be returned from Supabase
    const mockReturnData = [{ id: 1, email: 'test@example.com' }];
    mockInsert.mockResolvedValue({ data: mockReturnData, error: null });

    // Create mock user data
    const mockUser = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      company: faker.company.name(),

    };

    // Call the service
    const result = await createUserService({ user: mockUser });

    // Assertions
    expect(createAppServerClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('users');
    expect(mockInsert).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.name,
      avatar: mockUser.avatar,
      address: mockUser.address,
      phone: mockUser.phone,
      company: mockUser.company,
    });
    expect(result).toEqual({
      data: mockReturnData,
      error: null,
    });
  });

  test('should handle errors from Supabase', async () => {
    const mockError = { message: 'Database error', code: 'ERROR_CODE' };
    mockInsert.mockResolvedValue({ data: null, error: mockError });

    // Create mock user data
    const mockUser = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      company: faker.company.name(),
    };

    // Call the service
    const result = await createUserService({ user: mockUser });

    // Assertions
    expect(createAppServerClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('users');
    expect(mockInsert).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.name,
      avatar: mockUser.avatar,
      address: mockUser.address,
      phone: mockUser.phone,
      company: mockUser.company,
    });
    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });
});