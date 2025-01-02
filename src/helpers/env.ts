import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  PUBLIC_SOCKET_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variable", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const Env = _env.data;
