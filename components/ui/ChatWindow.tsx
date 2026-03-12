import { Message } from "@/lib/types";
import {useState} from "react"

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  handleDeleteMessage: (id: number | null) => void;
}

export default function ChatWindow({ 
    chatId,
    userId,
    messages,
    setNewMessage,
    handleDeleteMessage,
 }: ChatWindowProps) {

  const [inputValueMessage, setInputValueMessage] = useState("");

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      {!chatId && (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-lg font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
        {/* {messages.map((messages)=>{
         <MessageBubble></MessageBubble>
        })} */}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div>
          <input/>
          <button>Send</button>
        </div>
      </div>
    </div>
  );
}
