import { create } from "zustand";

import { IChat } from "@/@types/chat";

interface IChatsStoreState {
  chats: IChat[];
  addChat: (chat: IChat) => void;
  initializeChats: (initialChats: IChat[]) => void;
}

export const useChatsStore = create<IChatsStoreState>((set) => ({
  chats: [],
  addChat: (chat) => {
    set((state) => ({ chats: [chat, ...state.chats] }));
  },
  initializeChats: (initialChats) => {
    set({ chats: initialChats });
  },
}));
