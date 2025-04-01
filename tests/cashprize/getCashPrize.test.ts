import { getCashPrizeService } from '@/services/cashprize/getCashPrize';
import { createAppServerClient } from '@/supabase/server';

// Mock the Supabase client
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getCashPrizeService', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return prize data when user is authorized and can generate prize', async () => {
    // Mock successful user auth and prize generation
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      rpc: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            can_generate: true,
            prize_id: 1,
            prize_name: 'Test Prize',
            prize_amount: 100.0,
            time_remaining: '0 min 0 sec',
          },
          error: null,
        }),
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getCashPrizeService();

    expect(result).toEqual({
      success: true,
      timeRemaining: '0 min 0 sec',
      prize: {
        id: 1,
        prize_name: 'Test Prize',
        prize_amount: 100.0,
      },
      error: null,
    });
    expect(mockSupabase.rpc).toHaveBeenCalledWith('generate_user_prize', {
      p_user_id: 'test-user-id',
    });
  });

  it('should return error when user is not authenticated', async () => {
    // Mock unauthorized user
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getCashPrizeService();

    expect(result).toEqual({
      success: false,
      timeRemaining: '',
      prize: null,
      error: new Error('Unauthorized: User not found'),
    });
  });

  it('should return failure when user cannot generate prize yet', async () => {
    // Mock user who needs to wait
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      rpc: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            can_generate: false,
            prize_id: null,
            time_remaining: '30 min 0 sec',
          },
          error: null,
        }),
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getCashPrizeService();

    expect(result).toEqual({
      success: false,
      timeRemaining: '30 min 0 sec',
      prize: null,
      error: null,
    });
  });

  it('should handle RPC errors', async () => {
    // Mock RPC error
    const mockError = new Error('Database error');
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      rpc: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      }),
    };

    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await getCashPrizeService();

    expect(result).toEqual({
      success: false,
      timeRemaining: '',
      prize: null,
      error: mockError,
    });
    expect(mockSupabase.rpc).toHaveBeenCalledWith('generate_user_prize', {
      p_user_id: 'test-user-id',
    });
  });
});
