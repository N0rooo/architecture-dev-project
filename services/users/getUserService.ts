import { createAppServerClient } from "@/supabase/server"
import { User } from "@/types/types"

export const getUsersService = async (limit: number = 10): Promise<{ data: User[] | null; error: Error | null }> => {
	// GET REAL DATA

	const supabase = await createAppServerClient()
	const { data, error } = await supabase.from("users").select("*").limit(limit)
	if (error) {
		return {
			data: null,
			error: error,
		}
	}

	return { data: data, error: null }
}
