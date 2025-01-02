import { z } from "zod";

export const listChatsSchema = z.object({});
export const listChatsOutputSchema = z.array(
  z.object({
    chat_id: z.string(),
    participants: z.array(z.string()),
  }),
);

export type TListChatsOutput = z.output<typeof listChatsOutputSchema>;
