"use server";

import { uploadFile } from "@/app/_shared/actions/files/upload-file";
import { authedProcedure } from "@/app/_shared/procedures/authedProcedure";
import { Env } from "@/helpers/env/env";

import {
  sendChatMessageSchema,
  sendChatMessageOutputSchema,
} from "../_validators/send-chat-message.validator";

import { fetcher } from "@/lib/fetcher";

export const sendChatMessage = authedProcedure
  .createServerAction()
  .input(sendChatMessageSchema)
  .output(sendChatMessageOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input: { chatId, content, ...input }, ctx }) => {
    let contentToUse = content;

    if (content instanceof File) {
      const [data, error] = await uploadFile({ file: content });

      if (error) {
        throw error;
      }

      contentToUse = data.url;
    }

    const result = await fetcher(
      `${Env.API_BASE_URL}/chats/${chatId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          user_id: ctx.user.user_id,
          content: contentToUse,
          ...input,
        }),
      },
    );

    if (!result.ok) {
      throw new Error("Failed to send message");
    }

    return await result.json();
  });
