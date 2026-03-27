import { Message } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Chat } from "@/lib/types";
import { websocketService } from "@/lib/websocket/service";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  activeChat: Chat | null;
  onRequestEditMessage: (messageId: number, content: string) => void;
  onRequestDeleteMessage: (messageId: number) => void;
  typingPeerName?: string | null;
  readMessageIds?: Set<number>;
  onMarkMessageRead?: (messageId: number) => void;
  onBackToChatList?: () => void;
}

export default function ChatWindow({
  chatId,
  userId,
  messages,
  setNewMessage,
  activeChat,
  onRequestEditMessage,
  onRequestDeleteMessage,
  typingPeerName,
  readMessageIds = new Set(),
  onMarkMessageRead,
  onBackToChatList,
}: ChatWindowProps) {
  const [inputValueMessage, setInputValueMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !chatId || !onMarkMessageRead || !userId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const id = el.dataset.messageId;
          if (!id) return;
          const messageId = Number(id);
          if (Number.isNaN(messageId)) return;
          onMarkMessageRead(messageId);
        });
      },
      { root, threshold: 0.25, rootMargin: "0px" }
    );

    const nodes = root.querySelectorAll<HTMLElement>("[data-message-id]");
    nodes.forEach((node) => observer.observe(node));

    return () => {
      nodes.forEach((node) => observer.unobserve(node));
      observer.disconnect();
    };
  }, [chatId, messages, onMarkMessageRead, userId]);

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

    websocketService.stopTyping(chatId);
    setNewMessage(messageText, chatId);
    setInputValueMessage("");
  };

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        {onBackToChatList ? (
          <button
            type="button"
            className="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] items-center justify-center"
            aria-label="К списку чатов"
            onClick={onBackToChatList}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}

        <h2 className="text-lg font-semibold text-gray-900">
          {activeChat?.name || "Chat"}
        </h2>

        {typingPeerName ? (
          <p className="text-sm text-gray-500 mt-1">
            {typingPeerName} blablabla…
          </p>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50"
      >
        {messages.map((message) => (
          <div
            key={message.id ?? `temp-${message.content}`}
            data-message-id={message.id ?? undefined}
            className="flex flex-col"
          >
            <MessageBubble
              key={message.id ?? `temp-${message.content}`}
              message={message}
              isMyOwnMessage={message.sender_id === userId}
              onRequestEdit={onRequestEditMessage}
              onRequestDelete={onRequestDeleteMessage}
              readByPeer={
                message.sender_id === userId &&
                message.id != null &&
                readMessageIds.has(message.id)
              }
            />
          </div>
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
            onChange={(e) => {
              setInputValueMessage(e.target.value);
              websocketService.startTyping(chatId);
            }}
            onBlur={() => websocketService.stopTyping(chatId)}
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
