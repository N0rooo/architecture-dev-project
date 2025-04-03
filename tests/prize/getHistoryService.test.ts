import { getHistoryService } from '@/services/prize/getHistoryService';
import { createAppServerClient } from '@/supabase/server';

jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getHistoryService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
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

  it('should successfully fetch history for authenticated user', async () => {
    const mockHistory = [
      { id: 1, points: 100, created_at: new Date().toISOString() },
      { id: 2, points: 200, created_at: new Date().toISOString() },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockHistory,
            error: null,
          }),
        }),
      }),
    });

    const result = await getHistoryService();

    expect(result).toEqual({ data: mockHistory, error: null });
    expect(mockSupabase.from).toHaveBeenCalledWith('points_history');
  });

  it('should return error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await getHistoryService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized: User not found'),
    });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      }),
    });

    const result = await getHistoryService();

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la révélation du prix:', mockError);
  });
});
