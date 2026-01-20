import { Message } from "@/lib/types";
import MessageList from "./MessageList";
import { useState } from "react";
import { sendMessageAPI } from "@/lib/api/messages";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (message: Message) => void;
  handleDeleteMessage: (id: number | null) => void;
}

export default function ChatWindow({
  userId,
  chatId,
  messages,
  setNewMessage,
}: ChatWindowProps) {
  const [content, setContent] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onSendMessage = async () => {
    if (chatId !== null) {
      const newMessage = await sendMessageAPI({ chatId, content });
      if (newMessage != null) {
        if (setNewMessage) setNewMessage(newMessage);
        setContent("");
      }
    }
  };

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative `}
    >
      {!chatId ? (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-lg font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
      ) : (
        <>
          {messages.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-[10px]">
              <MessageList messages={messages} userId={userId} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <h2 className="text-lg font-semibold">No messages yet</h2>
            </div>
          )}
          <div className="sticky bottom flex items-center space-x-2 p-4">
            <input
              value={content}
              onChange={onChange}
              placeholder="type message"
              type="text"
              className="w-full rounded-lg border px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={onSendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
