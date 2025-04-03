import { createAppServerClient } from '@/supabase/server';

export const deleteUserService = async (
  id: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> => {
  const supabase = await createAppServerClient(true);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: new Error('Unauthorized'),
    };
  }

  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return {
      success: false,
      error: error,
    };
  }

  return { success: true, error: null };
};
