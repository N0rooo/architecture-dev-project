import { loginSchema, signupSchema, userSchema } from "@/lib/schema";
import { z } from "zod";

export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;