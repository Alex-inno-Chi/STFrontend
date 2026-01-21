import { Message } from "@/lib/types";
import MessageList from "./MessageList";
import { useState } from "react";
import { sendMessageAPI, deleteMessageAPI } from "@/lib/api/messages";

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
  handleDeleteMessage,
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

  const deleteMessage = async (id: number) => {
    if (chatId !== null) {
      const deletedMessage = await deleteMessageAPI({ chatId, id });
      if (deletedMessage != null) {
        if (handleDeleteMessage) handleDeleteMessage(id);
      }
    }
  };

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
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
              <MessageList
                messages={messages}
                userId={userId}
                deleteMessage={deleteMessage}
              />
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
              className="mt-1 w-full rounded-lg border px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all border-gray-300 bg-white"
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
