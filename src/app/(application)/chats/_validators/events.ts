import { z } from "zod";

export const eventSchema = z.object({
  event: z.enum(["message_received", "presence_updated", "chat_read"]),
})

export const messageReceivedSchema = z.object({
  content: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['text', 'image', 'audio']),
  user_id: z.string(),
});

export const presenceUpdatedSchema = z.object({
  user_id: z.string(),
  status: z.enum(["online", "offline", "typing"]),
  last_seen: z.string(),
});

export const chatReadSchema = z.object({
  user_id: z.string(),
  chat_id: z.string(),
  last_read_message_id: z.string(),
});

