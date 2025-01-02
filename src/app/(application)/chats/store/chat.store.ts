import { Env } from "@/helpers/env";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

import { IMessage } from "@/@types/message";

interface IChatStoreState {
  socket: Socket | null;
  messages: IMessage[];
  initializeSocket: (chatId: string) => Promise<void>;
  addMessage: (message: IMessage) => void;
}

export const useChatStore = create<IChatStoreState>((set, get) => ({
  socket: null,
  messages: [],
  initializeSocket: async (chatId: string) => {
    const apiUrl = `${Env.PUBLIC_SOCKET_URL}/${chatId}`;
    const socket = io(apiUrl);

    socket.on("message_received", (data: IMessage) => {
      get().addMessage(data);
    });

    set({ socket });
  },
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));
