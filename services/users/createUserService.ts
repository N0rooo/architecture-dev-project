import { createAppServerClient } from "@/supabase/server";
import { User } from "@/types/types";

export const createUserService = async ({user}: {user: Omit<User, 'id' | 'created_at'>}): Promise<{ data: User | null, error: Error | null }> => {
  const supabase = await createAppServerClient();

  
  const { data, error } = await supabase.from("users").insert({
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    address: user.address,
    phone: user.phone,
    company: user.company,
  }); 
  if (error) {
    return {
      data: null,
      error: error,
    };
  }
  return {
    data,
    error,
  };
};
