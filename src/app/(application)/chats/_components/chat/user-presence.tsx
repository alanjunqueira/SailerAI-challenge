"use client";

import { useChatStore } from "../../_store/chat.store";

export function UserPresence() {
  const { presence } = useChatStore();
  return (
    <div className="flex max-h-14 w-full flex-col items-end space-x-2 overflow-y-auto">
      {presence.map((p) => (
        <div key={p.user_id} className="flex items-center gap-2">
          <span>{p.user_id}</span>
          <div
            className={`h-3 w-3 rounded-full ${
              p.presence === "online"
                ? "bg-green-500"
                : p.presence === "typing"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {p.presence === "online"
              ? "Online"
              : p.presence === "typing"
                ? "Typing..."
                : "Offline"}
          </span>
        </div>
      ))}
    </div>
  );
}
