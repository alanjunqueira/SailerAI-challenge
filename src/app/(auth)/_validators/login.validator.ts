import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginOutputSchema = z.object({
  message: z.string(),
  user: z
    .object({
      user_id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
});

export type TLoginOutput = z.output<typeof loginOutputSchema>;
