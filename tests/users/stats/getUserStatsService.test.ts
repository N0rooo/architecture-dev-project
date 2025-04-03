import { getUserStatsService } from '@/services/users/stats/getUserStatsService';
import { createAppServerClient } from '@/supabase/server';

jest.mock('../../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getUserStatsService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    rpc: jest.fn(),
  };

  // Add console.error mock
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('should successfully fetch user stats for authenticated user', async () => {
    const mockStats = {
      total_points: 1000,
      rank: 1,
      tickets_used: 5,
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    mockSupabase.rpc.mockResolvedValue({
      data: mockStats,
      error: null,
    });

    const result = await getUserStatsService();

    expect(result).toEqual({ data: mockStats, error: null });
    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_stats', {
      p_user_id: 'test-user-id',
    });
  });

  it('should return error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await getUserStatsService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized: User not found'),
    });
  });

  it('should handle RPC errors', async () => {
    const mockError = new Error('RPC error');

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    mockSupabase.rpc.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await getUserStatsService();

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
    expect(console.error).toHaveBeenCalledWith('Error fetching user stats:', mockError);
  });
});
