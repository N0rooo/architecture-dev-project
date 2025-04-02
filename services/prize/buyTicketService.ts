import { createAppServerClient } from '@/supabase/server';

export const buyTicketService = async ({
  ticketId,
}: {
  ticketId: number;
}): Promise<{ success: boolean; error: Error | null }> => {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: new Error('Unauthorized: User not found') };
  }

  const { data, error } = await supabase.rpc('purchase_ticket_and_generate_prize', {
    p_user_id: user.id,
    p_category_id: ticketId,
  });

  console.log({ data });

  if (error) {
    return { success: false, error: error };
  }

  return { success: true, error: null };
};
