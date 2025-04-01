import { createAppServerClient } from '@/supabase/server';
import { CashPrize, User } from '@/types/types';

export const getCashPrizeService = async (): Promise<{
  success: boolean;
  timeRemaining: string;
  prize: Omit<CashPrize, 'created_at' | 'updated_at' | 'is_active' | 'probability'> | null;
  error: Error | null;
}> => {
  const supabase = await createAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      success: false,
      timeRemaining: '',
      prize: null,
      error: new Error('Unauthorized: User not found'),
    };
  }

  const { data, error } = await supabase
    .rpc('generate_user_prize', { p_user_id: user.id })
    .single();

  if (error) {
    console.error('Error generating prize:', error);
    return { success: false, timeRemaining: '', prize: null, error: error };
  }

  if (data.can_generate && data.prize_id) {
    return {
      success: true,
      prize: {
        id: data.prize_id,
        prize_name: data.prize_name,
        prize_amount: data.prize_amount,
      },
      timeRemaining: data.time_remaining,
      error: null,
    };
  } else {
    return {
      success: false,
      prize: null,
      timeRemaining: data.time_remaining,
      error: null,
    };
  }
};
