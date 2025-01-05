"use server";

import { authedProcedure } from "@/app/_shared/procedures/authedProcedure";
import { Env } from "@/helpers/env/env";

import {
  updateUserPresenceSchema,
  updateUserPresenceOutputSchema,
} from "../_validators/update-user-presence.validator";

import { fetcher } from "@/lib/fetcher";

export const updateUserPresence = authedProcedure
  .createServerAction()
  .input(updateUserPresenceSchema, {
    type: "formData",
  })
  .output(updateUserPresenceOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input: { chatId, ...input }, ctx }) => {
    const result = await fetcher(
      `${Env.API_BASE_URL}/chats/${chatId}/presence`,
      {
        method: "POST",
        body: JSON.stringify({ user_id: ctx.user.user_id, ...input }),
      },
    );

    if (!result.ok) {
      throw new Error("Failed to update presence");
    }

    return await result.json();
  });
