"use server";

import { cookies } from "next/headers";

import { cookieLabels } from "@/helpers/cookies";
import { Env } from "@/helpers/env";
import { createServerAction } from "zsa";

import {
  registerSchema,
  registerOutputSchema,
  TRegisterOutput,
} from "../_validators/register.validator";

import { fetcher } from "@/lib/fetcher";

export const register = createServerAction()
  .input(registerSchema, {
    type: "formData",
  })
  .output(registerOutputSchema)
  .handler(async ({ input }): Promise<TRegisterOutput> => {
    const result = await fetcher(`${Env.API_BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const { message, details, user } =
      (await result.json()) as TRegisterOutput & {
        details?: string;
      };

    if (!result.ok) {
      throw new Error(details ?? "SOMETHING_WENT_WRONG");
    }

    return {
      message,
      user,
    };
  });
