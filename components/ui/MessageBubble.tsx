"use client"

import { Message } from "@/lib/types"
import { formatDate } from "@/helpers/formatDate";
import { TrashIcon } from "@radix-ui/react-icons";

interface MessageBubbleProps {
  message: Message;
  isMyOwnMessage: boolean;
  onDelete?: (messageId: number) => void;
}

export default function MessageBubble ({message, isMyOwnMessage, onDelete}: MessageBubbleProps){
    const displayName = message.sender?.username ?? message.sender?.email ?? "Unknown";
    const timeSend = message.sent_at;
    
    
    return (
        <div className={`flex flex-col max-w-[70%] ${isMyOwnMessage ? "ml-auto items-end" : "mr-auto items-start"}`}>
            <div className={`rounded-lg px-3 py-2 ${isMyOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
            {!isMyOwnMessage && (
                <p className="text-xs font-medium text-gray-600 mb-0.5">{displayName}</p>
            )}
            <p className="text-sm break-words">{message.content}</p>
            {timeSend && (
                <p className={`mt-1 text-xs ${isMyOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                    {formatDate(timeSend)}
                </p>
            )}
            
            </div>
            {isMyOwnMessage && onDelete && message.id && (
            <button
                onClick={() => onDelete(message.id as number)}
                className="mt-1 p-1.5 rounded hover:bg-red-100 text-red-600"
                aria-label="Delete message"
                type="button">
            <TrashIcon className="w-4 h-4" />
        </button>
      )}
        </div>
    )
}