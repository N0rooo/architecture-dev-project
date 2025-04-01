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

export const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Invalid email address",
  }),
  password: z.string({
    required_error: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters long",
  })
});

export const signupSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Invalid email address",
  }),
  password: z.string({
    required_error: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string({
    required_error: "Confirm password is required",
  }).min(8, {
    message: "Confirm password must be at least 8 characters long",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});