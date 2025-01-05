import { useState } from "react";

import { Ellipsis } from "lucide-react";

import { MarkChatAsReadModal } from "./mark-chat-as-read-modal";
import { UpdatePresenceModal } from "./update-presence-modal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ChatActions = () => {
  const [isChatActionOpen, setIsChatActionOpen] = useState(false);

  const handleOpenChatActions = () => {
    setIsChatActionOpen(true);
  };

  const handleCloseChatActions = () => {
    setIsChatActionOpen(false);
  };

  return (
    <DropdownMenu open={isChatActionOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="ml-auto" onClick={handleOpenChatActions}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onEscapeKeyDown={handleCloseChatActions}
        onInteractOutside={handleCloseChatActions}
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="flex flex-col gap-1">
          <UpdatePresenceModal closeChatActionsFn={handleCloseChatActions} />
          <MarkChatAsReadModal closeChatActionsFn={handleCloseChatActions} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
