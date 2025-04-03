import { createAppServerClient } from '@/supabase/server';
import { UserStats } from '@/types/types';

export const getUserStatsService = async (): Promise<{
  data: UserStats | null;
  error: Error | null;
}> => {
  const supabase = await createAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: new Error('Unauthorized: User not found'),
    };
  }
  const { data, error } = await supabase.rpc('get_user_stats', { p_user_id: user.id });

  if (error) {
    console.error('Error fetching user stats:', error);
    return {
      data: null,
      error: error,
    };
  }

  return {
    data: data as UserStats,
    error: null,
  };
};
