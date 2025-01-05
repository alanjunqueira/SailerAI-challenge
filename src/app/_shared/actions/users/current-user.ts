"use server";

import { cookies } from "next/headers";

import { cookieLabels } from "@/helpers/cookies";
import { Env } from "@/helpers/env/env";
import { z } from "zod";

import { fetcher } from "@/lib/fetcher";

import { IUser } from "@/@types/user";

type TCurrentUserData = {
  user_id: string;
  name: string;
  email: string;
};

const userSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const currentUser = async (): Promise<TCurrentUserData | null> => {
  const userCookie = cookies().get(cookieLabels.user)?.value;

  if (!userCookie) {
    return null;
  }

  try {
    let exists = false;
    const user = await userSchema.parseAsync(JSON.parse(userCookie));

    const result = await fetcher(`${Env.API_BASE_URL}/users/${user.user_id}`);

    if (result.ok) {
      exists = true;
    }

    return exists ? user : null;
  } catch (error) {
    return null;
  }
};
