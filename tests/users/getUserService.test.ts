import { getUsersService } from '@/services/users/getUserService';
import { createAppServerClient } from '@/supabase/server';

// Mock the Supabase client
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getUsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile when user is authenticated', async () => {
    const mockProfile = {
      id: 'test-user-id',
      email: 'test@example.com',
      points: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getUsersService();

    expect(result).toEqual({
      data: mockProfile,
      error: null,
    });
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
  });

  it('should return error when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getUsersService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized: User not found'),
    });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getUsersService();

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });
});
