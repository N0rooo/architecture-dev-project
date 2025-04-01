import { userSchema } from "@/lib/schema";
import { z } from "zod";

export type User = z.infer<typeof userSchema>;