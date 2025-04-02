import { createAppServerClient } from '@/supabase/server';
import { Ticket } from '@/types/types';

export const getTicketsService = async (): Promise<{
  data: Ticket[] | null;
  error: Error | null;
}> => {
  // GET REAL DATA
  const supabase = await createAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: new Error('Unauthorized: User not found'),
    };
  }

  const { data, error } = await supabase
    .from('user_prize_attempts')
    .select('*, prize(*)')
    .eq('user_id', user.id);
  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return { data: data, error: null };
};
