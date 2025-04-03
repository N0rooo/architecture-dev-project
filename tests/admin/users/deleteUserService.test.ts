import { deleteUserService } from '@/services/admin/users/deleteUserService';
import { createAppServerClient } from '@/supabase/server';

// Mock the supabase client
jest.mock('../../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('deleteUserService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      admin: {
        deleteUser: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('should successfully delete a user', async () => {
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id' } },
    });

    // Mock successful user deletion
    mockSupabase.auth.admin.deleteUser.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const result = await deleteUserService('user-id-to-delete');

    expect(result).toEqual({ success: true, error: null });
    expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-id-to-delete');
  });

  it('should return error when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await deleteUserService('user-id-to-delete');

    expect(result).toEqual({
      success: false,
      error: new Error('Unauthorized'),
    });
    expect(mockSupabase.auth.admin.deleteUser).not.toHaveBeenCalled();
  });

  it('should handle deletion errors', async () => {
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id' } },
    });

    // Mock deletion error
    const mockError = new Error('Deletion failed');
    mockSupabase.auth.admin.deleteUser.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await deleteUserService('user-id-to-delete');

    expect(result).toEqual({
      success: false,
      error: mockError,
    });
    expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-id-to-delete');
  });
});
