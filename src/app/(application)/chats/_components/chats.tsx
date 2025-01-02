"use client";

import { useEffect } from "react";

import { createAvatarTag } from "@/helpers/name";
import { useQueryState } from "nuqs";

import { useChatsStore } from "../store/chats.store";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";

import { IChat } from "@/@types/chat";

interface IChats {
  initialChats: IChat[];
}
export const Chats = ({ initialChats }: IChats) => {
  const { initializeChats, chats } = useChatsStore();
  const [chatId, setChatId] = useQueryState("chatId");

  useEffect(() => {
    if (chats.length === 0) {
      initializeChats(initialChats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {chats.map((chat, index) => (
        <SidebarMenuButton
          key={chat.chat_id}
          className="flex items-center gap-2"
          onClick={() => setChatId(chat.chat_id)}
          data-active={chat.chat_id === chatId}
        >
          <Avatar className="size-8 bg-sidebar-accent">
            <AvatarFallback className="">
              {createAvatarTag(chat.chat_id)}
            </AvatarFallback>
          </Avatar>
          <span key={index}>{chat.chat_id}</span>
        </SidebarMenuButton>
      ))}
    </div>
  );
};
