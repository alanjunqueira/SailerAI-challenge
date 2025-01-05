"use client";

import { useState } from "react";

import { EPresence } from "@/app/_shared/validators/users";
import { Mic, Send, LucideImage } from "lucide-react";
import { useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { sendChatMessage } from "../../_actions/send-chat-message";
import { updateUserPresence } from "../../_actions/update-user-presense";

import { AudioRecordModal } from "./audio-record-modal";
import { ImageUploadModal } from "./image-upload-modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function MessageInput() {
  const { loggedUser } = useAuth();
  const [chatId, _setChatId] = useQueryState("chatId");
  const { toast } = useToast();

  const [message, setMessage] = useState("");

  const { execute: executeSendChatMessage } = useServerAction(sendChatMessage, {
    onError: () => {
      toast({
        title: "Error sending message",
        description:
          "An error occurred while sending the message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { execute: executeUpdateUserPresence } = useServerAction(
    updateUserPresence,
    {
      onError: () => {
        toast({
          title: "Error updating user presence",
          description:
            "An error occurred while updating user presence. Please try again.",
          variant: "destructive",
        });
      },
    },
  );

  const handleSendMessage = () => {
    if (message.trim() && chatId) {
      executeSendChatMessage({ content: message, type: "text", chatId });
      setMessage("");

      if (loggedUser) {
        const formData = new FormData();
        formData.append("chatId", chatId);
        formData.append("status", EPresence.Online);


        executeUpdateUserPresence(formData);
      }
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value;
    if (loggedUser && chatId) {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("status", message ? EPresence.Typing : EPresence.Online);
      executeUpdateUserPresence(formData);
    }
    setMessage(message);
  };

  return (
    <div className="flex items-center space-x-2 border-t p-4">
      <Input
        value={message}
        onChange={handleMessageChange}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <ImageUploadModal />
      <AudioRecordModal />
      <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
        <Send className="size-4" />
      </Button>
    </div>
  );
}
