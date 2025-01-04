"use server";

import { cookies } from "next/headers";

import { cookieLabels } from "@/helpers/cookies";
import { Env } from "@/helpers/env/env";
import { createServerAction } from "zsa";

import {
  loginSchema,
  loginOutputSchema,
  TLoginOutput,
} from "../_validators/login.validator";

import { fetcher } from "@/lib/fetcher";

export const login = createServerAction()
  .input(loginSchema, {
    type: "formData",
  })
  .output(loginOutputSchema)
  .handler(async ({ input }): Promise<TLoginOutput> => {
    const result = await fetcher(`${Env.API_BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const { message, details, user } = (await result.json()) as TLoginOutput & {
      details?: string;
    };

    if (!result.ok) {
      throw new Error(details ?? "INVALID_CREDENTIALS");
    }

    cookies().set(cookieLabels.user, JSON.stringify(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      message,
      user,
    };
  });
