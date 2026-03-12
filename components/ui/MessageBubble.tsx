"use client"

import { Message } from "@/lib/types"

interface MessageBubbleProps {
    message: Message;
    isMyOwnMessage: boolean;
}

export default function MessageBubble ({message, isMyOwnMessage}: MessageBubbleProps){
    const displayName = message.sender?.username ?? message.sender?.email ?? "Unknown";
    const timeSend = message.sent_at;
    
    
    return (
        <div className={`flex flex-col max-w-[70%] ${isMyOwnMessage ? "ml-auto items-end" : "mr-auto items-start"}`}>
            <div className={`rounded-lg px-3 py-2 ${isMyOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
            {!isMyOwnMessage && (
                <p>{displayName}</p>
            )}
            <p>{message.content}</p>
            {timeSend && (
                <p>
                    {timeSend}
                </p>
            )}
            </div>
        </div>
    )
}