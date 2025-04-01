import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  address: z.string(),
  phone: z.string(),
  company: z.string(),
  created_at: z.string(),
});

