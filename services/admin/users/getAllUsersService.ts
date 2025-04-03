import { createAppServerClient } from '@/supabase/server';
import { Profile } from '@/types/types';

export const getAllUsersService = async (): Promise<{
  data: Profile[] | null;
  error: Error | null;
}> => {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      data: null,
      error: new Error('Unauthorized'),
    };
  }
  const { data: roleData } = await supabase
    .from('user_role')
    .select('*')
    .eq('user_id', user.id)
    .single();
  const isAdmin = roleData?.role === 'admin';

  if (!isAdmin) {
    return {
      data: null,
      error: new Error('Unauthorized'),
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return { data: data, error: null };
};
