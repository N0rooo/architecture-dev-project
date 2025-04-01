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
  let mockSelect: jest.Mock;
  let mockSingle: jest.Mock;
  let mockInsert: jest.Mock;

  const mockUser = {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    company: faker.company.name(),
  };

  const mockReturnData = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    created_at: faker.date.recent().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: mockInsert,
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  test('should successfully create a user', async () => {
    mockSingle.mockResolvedValue({ data: mockReturnData, error: null });

    const result = await createUserService({ user: mockUser });

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
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockReturnData,
      error: null,
    });
  });

  test('should handle errors from Supabase', async () => {
    const mockError = new Error('Database error');
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    const result = await createUserService({ user: mockUser });

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
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });
});
