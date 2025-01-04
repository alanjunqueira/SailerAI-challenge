"use client";

import { parseAsString, useQueryState } from "nuqs";

import { Chat } from "./_components/chat";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ChatsPage() {
  const [chatId, _setChatId] = useQueryState("chatId", parseAsString);

  return <Chat />;
}
