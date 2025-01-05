"use client";

import { useState, FormEvent } from "react";

import { EPresence } from "@/app/_shared/validators/users";
import { useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { updateUserPresence } from "../../_actions/update-user-presense";
import { useChatStore } from "../../_store/chat.store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface UpdatePresenceModalProps {
  closeChatActionsFn: VoidFunction;
}

export function UpdatePresenceModal({
  closeChatActionsFn,
}: UpdatePresenceModalProps) {
  const { toast } = useToast();
  const [chatId] = useQueryState("chatId", { defaultValue: "" });
  const { loggedUser } = useAuth();
  const { upsertPresence } = useChatStore();

  const {
    execute: executeUpdatePresence,
    error,
    isPending,
  } = useServerAction(updateUserPresence, {
    onSuccess: ({ data }) => {
      toast({
        title: "Presença atualizada",
        description: "Presença atualizada com sucesso!",
      });
      upsertPresence({
        presence: data.status,
        user_id: loggedUser?.user_id as string,
      });
      handleCloseModal();
      closeChatActionsFn();
    },
    onError: ({ err }) => {
      toast({
        title: "Erro ao atualizar presença",
        description:
          "Ocorreu um erro ao atualizar a presença. Por favor, tente novamente.",
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

  const handleUpdatePresence = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("chatId", chatId);
    await executeUpdatePresence(formData);
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="font-bold"
          onClick={handleOpenModal}
        >
          Update presence
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={handleCloseModal}
        onEscapeKeyDown={handleCloseModal}
        closeModalFn={handleCloseModal}
      >
        <DialogHeader>
          <DialogTitle>Update presence</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdatePresence}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Status</Label>
              <Select name="status">
                <SelectTrigger>
                  <SelectValue placeholder="Select an status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EPresence).map((status) => {
                    return (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {error?.fieldErrors?.status && (
                <p className="text-sm text-destructive">
                  {error.fieldErrors.status}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-fit self-end"
              disabled={isPending}
            >
              Update presence
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
