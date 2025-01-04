"use client";

import { useState, useCallback, ChangeEvent } from "react";

import { listUsers } from "@/app/_shared/actions/users/list-users";
import { Plus, X, Loader2, Info } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { useServerAction } from "zsa-react";

import { createChat } from "../_actions/create-chat";
import { useChatsStore } from "../_store/chats.store";

import { Hint } from "@/components/hint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { IUser } from "@/@types/user";

export function CreateChatModal() {
  const { toast } = useToast();
  const [, setChatId] = useQueryState("chatId", { defaultValue: "" });
  const { addChat } = useChatsStore();
  const { loggedUser } = useAuth();

  const {
    execute: executeCreateChat,
    error,
    isPending,
  } = useServerAction(createChat, {
    onSuccess: ({ data }) => {
      toast({
        title: "Chat criado",
        description: "Chat criado com sucesso!",
      });
      setParticipants([]);
      setInputValue("");
      addChat(data);
      setChatId(data.chat_id);
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "Erro ao criar chat",
        description:
          "Ocorreu um erro ao criar o chat. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const { execute: executeSearchUsers, isPending: isSearching } =
    useServerAction(listUsers, {
      onSuccess: ({ data }) => {
        const usersWithoutLoggedUser = data.users.filter(
          (user: IUser) => user.user_id !== loggedUser?.user_id,
        );
        setSearchResults(usersWithoutLoggedUser);
      },
      onError: ({ err }) => {
        console.log(err);
        toast({
          title: "Erro ao buscar usuários",
          description:
            "Ocorreu um erro ao buscar usuários. Por favor, tente novamente.",
          variant: "destructive",
        });
      },
    });

  const [participants, setParticipants] = useState<IUser[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<IUser[]>([]);

  console.log("searchResults", searchResults);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    executeSearchUsers({ query });
  }, 400);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setInputValue(value);
      if (value.trim()) {
        debouncedSearch(value);
      } else {
        setSearchResults([]);
      }
    },
    [debouncedSearch],
  );

  const addParticipant = (user: IUser) => {
    const alreadyAdded = participants.some((p) => p.user_id === user.user_id);
    if (!alreadyAdded) {
      setParticipants((p) => [...p, user]);
    }

    if (alreadyAdded) {
      toast({
        title: "Participante já adicionado",
        description: "Este participante já foi adicionado.",
        variant: "destructive",
      });
    }
  };

  const removeParticipant = (userId: string) => {
    setParticipants((p) => p.filter((p) => p.user_id !== userId));
  };

  const toggleAddParticipant = (user: IUser) => {
    const alreadyAdded = participants.some((p) => p.user_id === user.user_id);
    if (alreadyAdded) {
      removeParticipant(user.user_id);
    } else {
      addParticipant(user);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateChat = () => {
    executeCreateChat({
      participants: participants.map((p) => p.user_id),
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
          <Plus /> Criar novo chat
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={handleCloseModal}
        onEscapeKeyDown={handleCloseModal}
      >
        <DialogHeader>
          <DialogTitle>Criar novo chat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="participants">Participantes</Label>
              <Hint text="Por padrão, você já é adicionado ao chat.">
                <Info className="size-5 text-primary" />
              </Hint>
            </div>

            <div className="rounded-lg border shadow-md">
              <Input
                id="participants"
                placeholder="Pesquisar usuários..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <div className="mt-2">
                <div
                  className={cn("flex items-center justify-center py-4", {
                    "py-0": searchResults.length > 0,
                  })}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : searchResults.length === 0 ? (
                    <p>Nenhum usuário encontrado</p>
                  ) : null}
                </div>
                <div className="flex h-full max-h-48 flex-col gap-2 overflow-y-auto px-4 py-2">
                  {searchResults.map((user) => {
                    const alreadyAdded = participants.some(
                      (p) => p.user_id === user.user_id,
                    );
                    return (
                      <div
                        key={user.user_id}
                        onClick={() => toggleAddParticipant(user)}
                        className="flex items-center justify-between gap-2 rounded-lg bg-secondary p-1 text-secondary-foreground shadow-sm hover:bg-secondary/80"
                      >
                        <div className="flex flex-1 cursor-pointer flex-col">
                          <p className="line-clamp-1">{user.name}</p>
                          <p className="line-clamp-1 text-sm leading-none text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="w-fit">
                          {alreadyAdded ? (
                            <X className="text-destructive" />
                          ) : (
                            <Plus className="text-primary" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {error?.fieldErrors?.participants && (
              <p className="text-sm text-destructive">
                {error.fieldErrors.participants}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <Badge key={participant.user_id} variant="secondary">
                {participant.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeParticipant(participant.user_id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Button
            onClick={handleCreateChat}
            disabled={isPending}
            className="mt-4 self-end"
          >
            Criar Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
