import { createAppServerClient } from '@/supabase/server';
import { Prize } from '@/types/types';

export const getFreePrizeService = async (): Promise<{
  success: boolean;
  timeRemaining: string;
  prize: Omit<
    Prize,
    'created_at' | 'updated_at' | 'is_active' | 'probability' | 'prize_category'
  > | null;
  error: Error | null;
}> => {
  try {
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
      .rpc('generate_free_prize', { p_user_id: user.id })
      .single();

    if (error) {
      console.error('[Expected Test Error] Error generating prize:', error);
      return { success: false, timeRemaining: '', prize: null, error: error };
    }

    if (!data) {
      return { success: false, timeRemaining: '', prize: null, error: null };
    }

    if (data.can_generate && data.prize_id && data.prize_name && data.prize_amount !== null) {
      return {
        success: true,
        prize: {
          id: data.prize_id,
          prize_name: data.prize_name,
          prize_amount: data.prize_amount,
        },
        timeRemaining: data.time_remaining || '',
        error: null,
      };
    } else {
      return {
        success: false,
        prize: null,
        timeRemaining: data.time_remaining || '',
        error: null,
      };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      timeRemaining: '',
      prize: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
};
