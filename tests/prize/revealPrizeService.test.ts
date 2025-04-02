import { revealPrizeService } from '@/services/prize/revealPrizeService';
import { createAppServerClient } from '@/supabase/server';

jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('revealPrizeService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    rpc: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  it('should successfully reveal a prize', async () => {
    // Mock successful authentication
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock successful RPC call
    mockSupabase.rpc.mockResolvedValue({ data: true, error: null });

    const result = await revealPrizeService(1);

    expect(result).toEqual({ success: true, error: null });
    expect(mockSupabase.rpc).toHaveBeenCalledWith('reveal_prize', {
      p_attempt_id: 1,
    });
  });

  it('should return error when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await revealPrizeService(1);

    expect(result).toEqual({
      success: false,
      error: new Error('Unauthorized: User not found'),
    });
    expect(mockSupabase.rpc).not.toHaveBeenCalled();
  });

  it('should handle RPC errors', async () => {
    // Mock successful authentication
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock RPC error
    const mockError = new Error('Database error');
    mockSupabase.rpc.mockResolvedValue({ data: null, error: mockError });

    const result = await revealPrizeService(1);

    expect(result).toEqual({ success: false, error: mockError });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la révélation du prix:', mockError);
  });
});
