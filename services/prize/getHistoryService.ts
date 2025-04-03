import { createAppServerClient } from '@/supabase/server';
import { PointsHistory } from '@/types/types';

export const getHistoryService = async (): Promise<{
  data: PointsHistory[] | null;
  error: Error | null;
}> => {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error('Unauthorized: User not found') };
  }
  const { data, error } = await supabase
    .from('points_history')
    .select('*')
    .eq('user_id', user.id)
    .limit(5);

  if (error) {
    console.error('Erreur lors de la révélation du prix:', error);
    return { data: null, error: error };
  }
  return { data: data, error: null };
};
