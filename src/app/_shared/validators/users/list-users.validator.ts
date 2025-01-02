import { z } from "zod";

export const listUsersSchema = z.object({
  query: z.string().optional(),
});

export const listUsersOutputSchema = z
  .object({
    users: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
        }),
      )
      .default([]),
  })
  .transform((d) => ({
    users: d.users.map((user: any) => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
    })),
  }));

export type TListUsersOutput = z.output<typeof listUsersOutputSchema>;
