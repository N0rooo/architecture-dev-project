import { loginSchema, signupSchema, userSchema } from "@/lib/schema";
import { z } from "zod";
import { Database } from "./supabase";


// ZOD TYPES
export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

// SUPABASE TYPES
export type CashPrize = Database["public"]["Tables"]["cashprize"]["Row"];
