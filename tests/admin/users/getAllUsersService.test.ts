import { getAllUsersService } from '@/services/admin/users/getAllUsersService';
import { createAppServerClient } from '@/supabase/server';

jest.mock('../../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getAllUsersService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('should successfully fetch all users for admin user', async () => {
    const mockUsers = [
      { id: '1', email: 'user1@test.com' },
      { id: '2', email: 'user2@test.com' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id' } },
    });

    // Mock the role check
    mockSupabase.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single:
            table === 'user_role'
              ? jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null })
              : jest.fn(),
        }),
        order:
          table === 'profiles'
            ? jest.fn().mockResolvedValue({ data: mockUsers, error: null })
            : jest.fn(),
      }),
    }));

    const result = await getAllUsersService();

    expect(result).toEqual({ data: mockUsers, error: null });
  });

  it('should return error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await getAllUsersService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized'),
    });
  });

  it('should return error when user is not admin', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-id' } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { role: 'user' }, error: null }),
        }),
      }),
    });

    const result = await getAllUsersService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized'),
    });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id' } },
    });

    // Mock successful role check but failed users fetch
    mockSupabase.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single:
            table === 'user_role'
              ? jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null })
              : jest.fn(),
        }),
        order:
          table === 'profiles'
            ? jest.fn().mockResolvedValue({ data: null, error: mockError })
            : jest.fn(),
      }),
    }));

    const result = await getAllUsersService();

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });
});
