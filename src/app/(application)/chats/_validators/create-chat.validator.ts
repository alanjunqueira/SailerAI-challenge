import { z } from "zod";

export const createChatSchema = z.object({
  participants: z.array(z.string()).default([]),
});
export const createChatOutputSchema = z.object({
  chat_id: z.string(),
  participants: z.array(z.string()),
});

export type TCreateChatOutput = z.output<typeof createChatOutputSchema>;
