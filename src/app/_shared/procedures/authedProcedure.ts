import { createServerActionProcedure } from "zsa";

import { currentUser } from "../actions/users/current-user";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const user = await currentUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      return {
        user,
      };
    } catch {
      throw new Error("User not authenticated");
    }
  },
);
