"use client";

import { Message } from "@/lib/types";
import { formatDate } from "@/helpers/formatDate";
import { AppContextMenu } from "./AppContextMenu";

interface MessageBubbleProps {
  message: Message;
  isMyOwnMessage: boolean;
  onRequestEdit?: (messageId: number, currentContent: string) => void;
  onRequestDelete?: (messageId: number) => void;
  readByPeer?: boolean;
}

export default function MessageBubble({
  message,
  isMyOwnMessage,
  onRequestEdit,
  onRequestDelete,
  readByPeer = false,
}: MessageBubbleProps) {
  const displayName =
    message.sender?.username ?? message.sender?.email ?? "Unknown";
  const timeSend = message.sent_at;
  const bubbleClassName = isMyOwnMessage
    ? "bg-blue-500 text-white"
    : "bg-gray-200 text-gray-900";

  const bubbleBody = (
    <>
      {!isMyOwnMessage && (
        <p className="text-xs font-medium text-gray-600 mb-0.5">
          {displayName}
        </p>
      )}

      <p className="min-w-0 max-w-full text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">
        {message.content}
      </p>

      {timeSend && (
        <p
          className={`mt-1 text-xs ${isMyOwnMessage ? "text-blue-100" : "text-gray-500"}`}
        >
          {formatDate(timeSend)}
        </p>
      )}
      {isMyOwnMessage && readByPeer ? (
        <span className="font-medium" title="Прочитано">
          ✓✓
        </span>
      ) : null}
    </>
  );

  const bubbleShell = (
    <div
      className={`rounded-lg min-w-0 max-w-full px-3 py-2 ${bubbleClassName}`}
    >
      {bubbleBody}
    </div>
  );

  return (
    <div
      className={`flex flex-col min-w-0 max-w-[70%] ${isMyOwnMessage ? "ml-auto items-end" : "mr-auto items-start"}`}
    >
      {isMyOwnMessage && message.id ? (
        <AppContextMenu
          items={[
            {
              label: "Edit",
              onSelect: () =>
                onRequestEdit?.(message.id as number, message.content),
            },
            {
              label: "Delete",
              onSelect: () => onRequestDelete?.(message.id as number),
              destructive: true,
            },
          ]}
        >
          {bubbleShell}
        </AppContextMenu>
      ) : (
        bubbleShell
      )}
    </div>
  );
}
