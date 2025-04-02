import { createAppServerClient } from '@/supabase/server';
import { getLeaderboardService } from '@/services/leaderboard/getLeaderboardService';
import { Profile } from '@/types/types';

// Mock the Supabase client
jest.mock('../../supabase/server', () => ({
  createAppServerClient: jest.fn(),
}));

describe('getLeaderboardService', () => {
  const mockProfiles: Profile[] = [
    {
      id: '1',
      username: 'user1',
      full_name: 'User One',
      avatar_url: 'https://example.com/avatar1.jpg',
      points: 100,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      website: null,
      last_opened_cashprize_at: null,
    },
    {
      id: '2',
      username: 'user2',
      full_name: 'User Two',
      avatar_url: 'https://example.com/avatar2.jpg',
      points: 80,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      website: null,
      last_opened_cashprize_at: null,
    },
  ];

  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('should return leaderboard data successfully', async () => {
    // Mock successful response
    mockSupabase.limit.mockResolvedValueOnce({
      data: mockProfiles,
      error: null,
    });

    const result = await getLeaderboardService(10);

    expect(result).toEqual({
      data: mockProfiles,
      error: null,
    });

    // Verify Supabase query construction
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSupabase.select).toHaveBeenCalledWith('*');
    expect(mockSupabase.order).toHaveBeenCalledWith('points', { ascending: false });
    expect(mockSupabase.limit).toHaveBeenCalledWith(10);
  });

  it('should handle empty leaderboard data', async () => {
    // Mock empty response
    mockSupabase.limit.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const result = await getLeaderboardService(10);

    expect(result).toEqual({
      data: [],
      error: null,
    });
  });

  it('should handle Supabase errors', async () => {
    // Mock error response
    const mockError = new Error('Database error');
    mockSupabase.limit.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    const result = await getLeaderboardService(10);

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });

  it('should use default limit of 10 when not specified', async () => {
    mockSupabase.limit.mockResolvedValueOnce({
      data: mockProfiles,
      error: null,
    });

    await getLeaderboardService();

    expect(mockSupabase.limit).toHaveBeenCalledWith(10);
  });

  it('should respect custom limit parameter', async () => {
    mockSupabase.limit.mockResolvedValueOnce({
      data: mockProfiles,
      error: null,
    });

    await getLeaderboardService(5);

    expect(mockSupabase.limit).toHaveBeenCalledWith(5);
  });
});
