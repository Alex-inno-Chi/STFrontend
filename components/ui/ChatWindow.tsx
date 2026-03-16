import { Message } from "@/lib/types";
import {useState} from "react"
import MessageBubble from "./MessageBubble";
import { Chat } from "@/lib/types"; 
import { updateChatAPI, deleteChatAPI } from "@/lib/api/chats";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  handleDeleteMessage: (id: number | null) => void;
  onChatUpdated?: (chat: Chat)=> void;
  activeChat: Chat|null;
  onChatDeleted?: (chatId: number) => void;
}

export default function ChatWindow({ 
    chatId,
    userId,
    messages,
    setNewMessage,
    handleDeleteMessage,
    activeChat,
    onChatUpdated,
    onChatDeleted
 }: ChatWindowProps) {

  const [inputValueMessage, setInputValueMessage] = useState("");
  const [isEditing, setIsEditing] = useState (false);
  const [editName, setEditName] = useState ("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  if(!chatId){
    return (
          <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-lg font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
    )
  }

  const handleEditClick = () => {
    setEditName(activeChat?.name ?? "")
    setIsEditing(true);
  }

  const handleSaveEdit = async () => {
    if(!chatId || !onChatUpdated) {
      return;
    }

    const updated = await updateChatAPI(chatId, {name: editName});

    if(updated){
      onChatUpdated(updated);
      setIsEditing(false);
    }

  }

  const handleConfirmDelete = async () => {
    if(!chatId || !onChatDeleted){

      return;
    }

    const response = await deleteChatAPI(chatId)
  }
  
  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      {/* Header for chat */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
      {isEditing ? (
        <div className="flex gap-2 flex-1">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 border rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-gray-900">
          {activeChat?.name || "Chat"}
        </h2>
      )}
      {activeChat && !isEditing && (
        <div className="flex gap-2">
          {activeChat.chat_type === "group" && (
            <>
              <button
                onClick={handleEditClick}
                className="p-1.5 rounded hover:bg-gray-100"
                aria-label="Edit chat"
              >
                <Pencil1Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded hover:bg-gray-100 text-red-600"
                aria-label="Delete chat"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>


      {/* Scope for messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
        {messages.map((message)=>(
         <MessageBubble
         key = {message.id ?? `temp-${message.content}`}
         message={message}
         isMyOwnMessage = {message.sender_id === userId}
         />
        ))}
      </div>

      {/* Scope for input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
          type = "text"          
          value = {inputValueMessage}
          onChange={(e) => setInputValueMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg border-gray-300 "         
          />
          <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >Send</button>
        </div>
      </div>
    </div>
  );
}
