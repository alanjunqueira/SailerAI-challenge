"use client";

import { useState, FormEvent } from "react";

import { useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { markChatAsRead } from "../../_actions/mark-chat-as-read";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useToast } from "@/hooks/use-toast";

interface MarkChatAsReadModalProps {
  closeChatActionsFn: VoidFunction;
}

export function MarkChatAsReadModal({
  closeChatActionsFn,
}: MarkChatAsReadModalProps) {
  const { toast } = useToast();
  const [chatId] = useQueryState("chatId", { defaultValue: "" });
  const [markAsRead, setMarkAsRead] = useState(false);

  const {
    execute: executeMarkChatAsRead,
    error,
    isPending,
  } = useServerAction(markChatAsRead, {
    onSuccess: () => {
      toast({
        title: "Done!",
        description: "Chat marked as read!",
      });
      handleCloseModal();
      closeChatActionsFn();
    },
    onError: () => {
      toast({
        title: "Error!",
        description:
          "An error occur when marking chat as read. Please, try again.",
        variant: "destructive",
      });
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMarkChatAsRead = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await executeMarkChatAsRead({
      chatId,
    });
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="font-bold"
          onClick={handleOpenModal}
        >
          Read chat
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={handleCloseModal}
        onEscapeKeyDown={handleCloseModal}
        closeModalFn={handleCloseModal}
      >
        <DialogHeader>
          <DialogTitle>Read chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleMarkChatAsRead}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Mark as read</Label>
              <Switch
                name="markAsRead"
                checked={markAsRead}
                onCheckedChange={() => setMarkAsRead((prev) => !prev)}
              />
            </div>

            <Button
              type="submit"
              className="w-fit self-end"
              disabled={isPending || !markAsRead}
            >
              Read chat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
