import { createAppServerClient } from '@/supabase/server';
import { Profile } from '@/types/types';

export const getUsersService = async (): Promise<{
  data: Profile | null;
  role: 'admin' | 'user' | undefined;
  error: Error | null;
}> => {
  // GET REAL DATA
  const supabase = await createAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: new Error('Unauthorized: User not found'),
      role: undefined,
    };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error) {
    return {
      data: null,
      error: error,
      role: undefined,
    };
  }

  const { data: roleData, error: roleError } = await supabase
    .from('user_role')
    .select('role')
    .eq('user_id', user.id);

  if (roleData?.length === 0) {
    return {
      data: data,
      error: null,
      role: 'user',
    };
  }

  if (roleError) {
    return {
      data: data,
      error: roleError,
      role: undefined,
    };
  }

  return { data: data, role: roleData?.[0]?.role, error: null };
};
