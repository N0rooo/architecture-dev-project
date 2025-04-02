import { getTicketsService } from '@/services/tickets/getTicketsService';
import { createAppServerClient } from '@/supabase/server';

jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getTicketsService', () => {
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

  it('should successfully fetch tickets for authenticated user', async () => {
    // Mock successful authentication
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock successful database query
    const mockTickets = [
      { id: 1, prize: { name: 'Test Prize' } },
      { id: 2, prize: { name: 'Another Prize' } },
    ];

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: mockTickets, error: null }),
      }),
    });

    const result = await getTicketsService();

    expect(result).toEqual({ data: mockTickets, error: null });
    expect(mockSupabase.from).toHaveBeenCalledWith('user_prize_attempts');
  });

  it('should return error when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await getTicketsService();

    expect(result).toEqual({
      data: null,
      error: new Error('Unauthorized: User not found'),
    });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('should handle database query errors', async () => {
    // Mock successful authentication
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock database error
    const mockError = new Error('Database error');
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      }),
    });

    const result = await getTicketsService();

    expect(result).toEqual({ data: null, error: mockError });
  });
});
