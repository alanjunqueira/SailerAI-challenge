"use server";

import { authedProcedure } from "@/app/_shared/procedures/authedProcedure";
import { Env } from "@/helpers/env";

import {
  createChatSchema,
  createChatOutputSchema,
} from "../_validators/create-chat.validator";

import { fetcher } from "@/lib/fetcher";

export const createChat = authedProcedure
  .createServerAction()
  .input(createChatSchema)
  .output(createChatOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input, ctx }) => {
    const result = await fetcher(`${Env.API_BASE_URL}/chats`, {
      method: "POST",
      body: JSON.stringify({
        participants: [ctx.user.user_id, ...input.participants],
      }),
    });

    if (!result.ok) {
      throw new Error("Failed to fetch chats");
    }

    return await result.json();
  });
