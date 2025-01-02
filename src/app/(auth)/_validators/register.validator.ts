import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().refine((d) => d.split(" ").length > 1, {
    message: "Name must be at least 2 words",
  }),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerOutputSchema = z.object({
  message: z.string(),
  user: z
    .object({
      user_id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
});

export type TRegisterOutput = z.output<typeof registerOutputSchema>;
