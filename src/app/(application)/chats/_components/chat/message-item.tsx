import Image from "next/image";

import { useEffect, useMemo, useRef } from "react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/use-auth";

import { IMessage } from "@/@types/message";

interface IMessageItem extends ComponentProps<"div"> {
  message: IMessage;
  isLastMessage?: boolean;
}

export const MessageItem = ({
  message,
  isLastMessage,
  ...props
}: IMessageItem) => {
  const { loggedUser } = useAuth();
  const isMyMessage = message.user_id === loggedUser?.user_id;

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const mediaDisplay = useMemo(
    () => ({
      audio: MessageAsAudio,
      image: MessageAsImage,
      text: MessageAsText,
    }),
    [],
  );

  useEffect(() => {
    if (!lastMessageRef || !isLastMessage) return;
    if (lastMessageRef?.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLastMessage, lastMessageRef]);

  return mediaDisplay[message.type]({ message, isMyMessage });
};

interface IMessageAsProps {
  message: IMessage;
  isMyMessage?: boolean;
}

const MessageAsAudio = ({ message, isMyMessage }: IMessageAsProps) => {
  return (
    <div
      className={cn("w-full max-w-64", {
        "ml-auto mr-12": isMyMessage,
        "mr-auto bg-secondary": !isMyMessage,
      })}
    >
      <audio controls>
        <source src={message.content} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
};

const MessageAsImage = ({ message, isMyMessage }: IMessageAsProps) => {
  return (
    <div
      className={cn("relative aspect-video w-56 rounded-lg overflow-hidden", {
        "ml-auto mr-12": isMyMessage,
        "mr-auto": !isMyMessage,
      })}
    >
      <Image
        src={message.content}
        alt=""
        className="w-full object-cover"
        fill
      />
    </div>
  );
};

const MessageAsText = ({ message, isMyMessage }: IMessageAsProps) => {
  return (
    <p
      className={cn("max-w-64 rounded-lg p-2", {
        "ml-auto bg-primary text-primary-foreground": isMyMessage,
        "mr-auto bg-secondary": !isMyMessage,
      })}
    >
      {message.content}
    </p>
  );
};
