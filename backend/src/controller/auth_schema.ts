import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(6).max(100),
    userAgent: z.string().optional(),
});

export const registerSchema = loginSchema.extend({
    // email: z.string().email().min(1).max(100),
    // password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    // userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

