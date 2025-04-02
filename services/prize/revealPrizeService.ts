// const revealPrize = async (attemptId: number) => {
//   const { data, error } = await supabase.rpc('reveal_prize', {
//     p_attempt_id: attemptId
//   });

import { createAppServerClient } from '@/supabase/server';
import { NextResponse } from 'next/server';

//   if (error) {
//     console.error('Erreur lors de la révélation du prix:', error);
//     return null;
//   }

//   return data;
// };

// // Utilisation dans un composant React
// const handleRevealClick = async () => {
//   const result = await revealPrize(prizeAttemptId);
//   if (result && result.success) {
//     // Mettre à jour l'interface utilisateur
//     setUserPoints(currentPoints => currentPoints + result.prize_amount);
//     showPrizeAnimation(result.prize_name, result.prize_amount);
//   }
// };

export const revealPrizeService = async (
  attemptId: number,
): Promise<{ success: boolean; error: Error | null }> => {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: new Error('Unauthorized: User not found') };
  }
  const { data, error } = await supabase.rpc('reveal_prize', {
    p_attempt_id: attemptId,
  });

  if (error) {
    console.error('Erreur lors de la révélation du prix:', error);
    return { success: false, error: error };
  }
  return { success: true, error: null };
};
