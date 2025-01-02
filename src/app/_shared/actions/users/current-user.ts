"use server";

import { cookies } from "next/headers";

import { cookieLabels } from "@/helpers/cookies";
import { z } from "zod";

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
    const user = userSchema.parseAsync(JSON.parse(userCookie));
    return user;
  } catch (error) {
    return null;
  }
};
