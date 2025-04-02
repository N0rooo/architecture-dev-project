import { createAppServerClient } from '@/supabase/server';
import { Profile } from '@/types/types';

export const getLeaderboardService = async (
  limit = 10,
): Promise<{ data: Profile[] | null; error: Error | null }> => {
  const supabase = await createAppServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(limit);

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return { data: data, error: null };
};
