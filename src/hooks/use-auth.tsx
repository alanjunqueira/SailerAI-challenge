"use client";

import { useLayoutEffect, useState } from "react";

import { currentUser } from "@/app/_shared/actions/users/current-user";

import { IUser } from "@/@types/user";

interface IUseUser {
  loggedUser: IUser | null;
}

export const useAuth = (): IUseUser => {
  const [user, setUser] = useState<null | IUser>(null);
  useLayoutEffect(() => {
    const getUser = async () => {
      const data = await currentUser();

      if (data) {
        setUser(data);
      }
    };

    getUser();
  }, []);

  return { loggedUser: user };
};
