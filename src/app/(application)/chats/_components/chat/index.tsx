"use client";

import { useEffect, useRef } from "react";

import { parseAsString, useQueryState } from "nuqs";

import { useChatStore } from "../../_store/chat.store";
import {
  chatReadSchema,
  eventSchema,
  messageReceivedSchema,
  presenceUpdatedSchema,
} from "../../_validators/events";

import { ChatActions } from "./chat-actions";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { UserPresence } from "./user-presence";

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

export const Chat = () => {
  const [chatId, _setChatId] = useQueryState("chatId", parseAsString);
  const { addMessage, upsertPresence, resetMessages, resetPresence } =
    useChatStore();

  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chatId) return;
    resetMessages();
    resetPresence();

    const newSocket = new WebSocket(`ws://localhost:8000/ws/${chatId}`);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      socket.current = newSocket;
    };

    newSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const { event } = eventSchema.parse(data);
        console.log("Event received:", data);

        switch (event) {
          case "message_received":
            const messageReceived = messageReceivedSchema.parse(data.data);
            addMessage(messageReceived);
            break;
          case "presence_updated":
            const presenceUpdated = presenceUpdatedSchema.parse(data.data);

            upsertPresence({
              presence: presenceUpdated.status,
              user_id: presenceUpdated.user_id,
            });
            break;
          case "chat_read":
            const chatRead = chatReadSchema.parse(data.data);
            console.log("Chat marked as read:", chatRead);
            break;
          default:
            console.log("Unknown event:", data.event);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      socket.current = null;
    };

    return () => {
      console.log("Cleaning up WebSocket...");
      newSocket.close();
    };
  }, [addMessage, chatId, resetMessages, resetPresence, upsertPresence]);

  return (
    <div className="flex h-screen flex-1 flex-col">
      <header className="flex w-full flex-col items-start border-b p-2">
        <div className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Chats</BreadcrumbLink>
                </BreadcrumbItem>
                {chatId && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="line-clamp-1">
                        {chatId}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ChatActions />
        </div>
        <Separator className="mb-2" />
        <UserPresence />
      </header>
      <MessageList />
      <MessageInput />
    </div>
  );
};
