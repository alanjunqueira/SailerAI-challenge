"use server";

import { Env } from "@/helpers/env/env";
import { buildParams } from "@/helpers/params";
import { createServerAction } from "zsa";

import {
  listUsersSchema,
  listUsersOutputSchema,
  TListUsersOutput,
} from "../../validators/users/list-users.validator";

import { fetcher } from "@/lib/fetcher";

export const listUsers = createServerAction()
  .input(listUsersSchema)
  .output(listUsersOutputSchema)
  .handler(async ({ input }): Promise<TListUsersOutput> => {
    const params = buildParams(input);
    const result = await fetcher(`${Env.API_BASE_URL}/users?${params}`);

    const { details, users } = (await result.json()) as TListUsersOutput & {
      details?: string;
    };

    if (!result.ok) {
      throw new Error(details ?? "SOMETHING_WENT_WRONG");
    }

    return {
      users,
    };
  });
