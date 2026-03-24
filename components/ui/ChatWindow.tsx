import { Message } from "@/lib/types";
import { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { Chat } from "@/lib/types";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  activeChat: Chat | null;
  onRequestEditMessage: (messageId: number, content: string) => void;
  onRequestDeleteMessage: (messageId: number) => void;
}

export default function ChatWindow({
  chatId,
  userId,
  messages,
  setNewMessage,
  activeChat,
  onRequestEditMessage,
  onRequestDeleteMessage,
}: ChatWindowProps) {
  const [inputValueMessage, setInputValueMessage] = useState("");

  if (!chatId) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h2 className="text-lg font-semibold">
          Select a chat to start messaging
        </h2>
      </div>
    );
  }

  const handleSend = () => {
    const messageText = inputValueMessage.trim();

    if (!messageText || !chatId) {
      return;
    }

    setNewMessage(messageText, chatId);
    setInputValueMessage("");
  };

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {activeChat?.name || "Chat"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.id ?? `temp-${message.content}`}
            message={message}
            isMyOwnMessage={message.sender_id === userId}
            onRequestEdit={onRequestEditMessage}
            onRequestDelete={onRequestDeleteMessage}
          />
        ))}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            type="text"
            value={inputValueMessage}
            onChange={(e) => setInputValueMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg border-gray-300 "
          />
          <button
            onClick={handleSend}
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
