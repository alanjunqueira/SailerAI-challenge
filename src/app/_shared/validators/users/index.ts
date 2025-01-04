import { z } from "zod";

export const userPresenceSchema = z.enum(["online", "offline", "typing"]);

export enum EPresence {
  Online = "online",
  Offline = "offline",
  Typing = "typing",
}

export type TPresence = z.infer<typeof userPresenceSchema>;
