'use client'

import { z } from "zod";

const publicEnSchema = z.object({
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),
});

console.log(process.env)

const _publicEnv = publicEnSchema.safeParse(process.env);
console.log("public env", _publicEnv.data);

if (_publicEnv.success === false) {
  console.error("❌ Invalid environment variable", _publicEnv.error.format());

  throw new Error("Invalid environment variables.");
}

export const PublicEnv = _publicEnv.data;
