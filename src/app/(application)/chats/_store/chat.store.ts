import { TPresence } from "@/app/_shared/validators/users";
import { create } from "zustand";

import { IMessage } from "@/@types/message";

interface IChatPresence {
  user_id: string;
  presence: TPresence;
}

interface IChatStoreState {
  messages: IMessage[];
  initMessages: (messages: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
  resetMessages: VoidFunction;

  presence: IChatPresence[];
  upsertPresence: (presence: IChatPresence) => void;
  resetPresence: VoidFunction;
}

export const useChatStore = create<IChatStoreState>((set, get) => ({
  messages: [],
  initMessages: (messages) => {
    set({ messages });
  },
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  resetMessages: () => {
    set({ messages: [] });
  },

  presence: [],
  upsertPresence: (presence: IChatPresence) => {
    set((state) => {
      const existingPresence = state.presence.find(
        (p) => p.user_id === presence.user_id,
      );

      if (existingPresence) {
        existingPresence.presence = presence.presence;
        return { presence: [...state.presence] };
      }

      return { presence: [...state.presence, presence] };
    });
  },
  resetPresence: () => {
    set({ presence: [] });
  },
}));
