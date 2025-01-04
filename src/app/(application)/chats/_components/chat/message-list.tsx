import { useEffect, useRef } from "react";

import { parseAsString, useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { getChatMessages } from "../../_actions/get-chat-messages";
import { useChatStore } from "../../_store/chat.store";

import { MessageItem } from "./message-item";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useToast } from "@/hooks/use-toast";

export function MessageList() {
  const { initMessages, messages } = useChatStore();
  const [chatId, _setChatId] = useQueryState("chatId", parseAsString);
  const { toast } = useToast();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { execute: executeGetChatMessages, isPending } = useServerAction(
    getChatMessages,
    {
      onSuccess: ({ data }) => {
        initMessages(data);
      },
      onError: ({ err }) => {
        console.log("err", err);
        toast({
          title: "Erro ao listar as mensagens",
          description:
            "Ocorreu um erro ao listar as mensagens do chat. Por favor, atualize a página e tente novamente.",
          variant: "destructive",
        });
      },
    },
  );

  useEffect(() => {
    if (chatId) {
      executeGetChatMessages({ chat_id: chatId });
    }
  }, [chatId, executeGetChatMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      {isPending && <div>Carregando...</div>}
      <div className="flex w-full flex-col gap-2">
        {messages.map((message, _, arr) => (
          <MessageItem
            message={message}
            key={message.id}
            isLastMessage={message.id === arr[arr.length - 1].id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
