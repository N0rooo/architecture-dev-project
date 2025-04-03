import { createAppServerClient } from '@/supabase/server';

export const loginService = async (email: string, password: string) => {
  const supabase = await createAppServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return {
    data,
    error: null,
  };
};

export const signupService = async (email: string, password: string, username: string) => {
  const supabase = await createAppServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return {
    data,
    error: null,
  };
};

export const logoutService = async () => {
  const supabase = await createAppServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return {
    data: true,
    error: null,
  };
};
