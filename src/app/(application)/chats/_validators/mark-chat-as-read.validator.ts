import { z } from "zod";

export const markChatAsReadSchema = z.object({
  chatId: z.string(),
});
export const markChatAsReadOutputSchema = z.object({
  chat_id: z.string(),
  user_id: z.string(),
  last_read_message_id: z.string(),
});

export type TMarkChatAsReadOutput = z.output<typeof markChatAsReadOutputSchema>;
