"use client";

import { ComponentProps } from "react";

import { Chats } from "../chats";
import { CreateChatModal } from "../create-chat-modal";

import { NavUser } from "./nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { IChat } from "@/@types/chat";
import { IUser } from "@/@types/user";

interface IChatsSidebarProps extends ComponentProps<typeof Sidebar> {
  initialChats: IChat[];
  user: IUser;
}

export const ChatsSidebar = ({
  initialChats,
  user,
  ...props
}: IChatsSidebarProps) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <CreateChatModal />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <Chats initialChats={initialChats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
