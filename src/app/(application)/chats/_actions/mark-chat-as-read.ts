"use server";

import { authedProcedure } from "@/app/_shared/procedures/authedProcedure";
import { Env } from "@/helpers/env/env";

import {
  markChatAsReadSchema,
  markChatAsReadOutputSchema,
} from "../_validators/mark-chat-as-read.validator";

import { fetcher } from "@/lib/fetcher";

export const markChatAsRead = authedProcedure
  .createServerAction()
  .input(markChatAsReadSchema)
  .output(markChatAsReadOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input: { chatId }, ctx }) => {
    const result = await fetcher(`${Env.API_BASE_URL}/chats/${chatId}/read`, {
      method: "POST",
      body: JSON.stringify({ user_id: ctx.user.user_id }),
    });

    if (!result.ok) {
      throw new Error("READ_CHAT_ERROR");
    }

    return await result.json();
  });
