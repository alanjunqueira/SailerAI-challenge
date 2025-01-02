"use server";

import { cookies } from "next/headers";

import { cookieLabels } from "@/helpers/cookies";

export const logout = async (): Promise<void> => {
  const userCookie = cookies().delete(cookieLabels.user);
};
