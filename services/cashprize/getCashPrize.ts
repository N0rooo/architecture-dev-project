import { createAppServerClient } from "@/supabase/server"
import { CashPrize, User } from "@/types/types"

export const getCashPrizeService = async (): Promise<{ data: Omit<CashPrize, "created_at" | "updated_at" | "is_active" | "probability"> | null; error: Error | null }> => {
	// GET REAL DATA

	const supabase = await createAppServerClient()
	const { data, error } = await supabase.rpc("select_random_prize").single()
	if (error) {
		return {
			data: null,
			error: error,
		}
	}

	return { data: data, error: null }
}
