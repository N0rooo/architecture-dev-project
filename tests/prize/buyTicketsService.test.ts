import { buyTicketService } from '@/services/prize/buyTicketService';
import { createAppServerClient } from '@/supabase/server';

// Mock the Supabase client
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('buyTicketService', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    rpc: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('should successfully buy a ticket', async () => {
    // Mock successful authentication
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock successful RPC call
    mockSupabase.rpc.mockResolvedValue({ data: true, error: null });

    const result = await buyTicketService({ ticketId: 1 });

    expect(result).toEqual({ success: true, error: null });
    expect(mockSupabase.rpc).toHaveBeenCalledWith('purchase_ticket_and_generate_prize', {
      p_user_id: 'test-user-id',
      p_category_id: 1,
    });
  });

  it('should return error when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await buyTicketService({ ticketId: 1 });

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

    const result = await buyTicketService({ ticketId: 1 });

    expect(result).toEqual({ success: false, error: mockError });
  });
});
