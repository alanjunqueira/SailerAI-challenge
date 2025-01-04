import { userPresenceSchema } from "@/app/_shared/validators/users";
import { z } from "zod";

export const updateUserPresenceSchema = z.object({
  status: userPresenceSchema,
  chatId: z.string()
});
export const updateUserPresenceOutputSchema = z.object({
  status: z.string()
});

export type TUpdateUserPresenceOutput = z.output<typeof updateUserPresenceOutputSchema>;
