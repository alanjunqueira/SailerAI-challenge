"use server";

import { Env } from "@/helpers/env/env";
import { createServerAction } from "zsa";

import {
  getChatMessagesOutputSchema,
  getChatMessagesSchema,
} from "../_validators/get-chat-messages.validator";

import { fetcher } from "@/lib/fetcher";

export const getChatMessages = createServerAction()
  .input(getChatMessagesSchema)
  .output(getChatMessagesOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input }) => {
    const result = await fetcher(
      `${Env.API_BASE_URL}/chats/${input.chat_id}/messages`,
    );

    if (!result.ok) {
      throw new Error("Failed to fetch chat messages");
    }

    return await result.json();
  });
