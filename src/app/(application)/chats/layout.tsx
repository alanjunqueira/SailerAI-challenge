import type { Metadata } from "next";

import { currentUser } from "@/app/_shared/actions/users/current-user";

import { listChats } from "./_actions/list-chats";
import { ChatsSidebar } from "./_components/chat-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Chats",
};
export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [[chats, error], user] = await Promise.all([
    listChats({}),
    currentUser(),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <SidebarProvider className="flex h-screen">
      <ChatsSidebar initialChats={chats.reverse()} user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
