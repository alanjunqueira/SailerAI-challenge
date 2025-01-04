import { z } from "zod";

export const getChatMessagesSchema = z.object({
  chat_id: z.string(),
});

export const getChatMessagesOutputSchema = z.array(
  z.object({
    id: z.string(),
    user_id: z.string(),
    type: z.enum(["text", "audio", "image"]),
    content: z.string(),
    timestamp: z.string(),
  }),
);

export type TGetChatMessagesOutput = z.output<
  typeof getChatMessagesOutputSchema
>;
