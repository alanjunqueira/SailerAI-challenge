"use server";

import { Env } from "@/helpers/env";
import { buildParams } from "@/helpers/params";
import { createServerAction } from "zsa";

import {
  listChatsOutputSchema,
  listChatsSchema,
} from "../_validators/list-chat.validator";

import { fetcher } from "@/lib/fetcher";

export const listChats = createServerAction()
  .input(listChatsSchema)
  .output(listChatsOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input }) => {
    const params = buildParams(input);

    const result = await fetcher(`${Env.API_BASE_URL}/chats?${params}`);

    if (!result.ok) {
      throw new Error("Failed to fetch chats");
    }

    return await result.json();
  });
