import { createAppServerClient } from '@/supabase/server';
import { Profile } from '@/types/types';

export const getUsersService = async (
  limit = 10,
): Promise<{ data: Profile | null; error: Error | null }> => {
  // GET REAL DATA
  const supabase = await createAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: new Error('Unauthorized: User not found'),
    };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return { data: data, error: null };
};
