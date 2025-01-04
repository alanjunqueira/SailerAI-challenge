import { z } from "zod";

export const sendChatMessageSchema = z.object({
  type: z.enum(["text", "image", 'audio']),
  content: z.union([z.string(), z.instanceof(File)]),
  chatId: z.string()
});
export const sendChatMessageOutputSchema = z.object({
  status: z.string()
});

export type TSendChatMessageOutput = z.output<typeof sendChatMessageOutputSchema>;
