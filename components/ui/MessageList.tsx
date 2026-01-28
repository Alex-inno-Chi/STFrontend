import { Message, MessageFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/formatDate";
import React, { useState, useRef, useEffect } from "react";
import { FileIcon } from "@radix-ui/react-icons";

interface MessageListProps {
  messages: Message[];
  files: MessageFile[];
  userId: number | null;
  deleteMessage: (id: number) => void;
}

interface MessageBubbleProps {
  message: Message;
  files: MessageFile[];
  isMine: boolean;
  openPopup: (x: number, y: number, message: Message) => void;
}

function MessageInFile({ file }: { file: MessageFile }) {
  return (
    <div className="flex rounded-sm items-center bg-blue-400 gap-3 py-1 px-2 hover:bg-blue-300 mb-2">
      <div>
        <FileIcon className="w-[25px] h-[25px]" />
      </div>
      <div>{file.name}</div>
    </div>
  );
}

function MessageBubble({
  message,
  files,
  isMine,
  openPopup,
}: MessageBubbleProps) {
  const getMessageTime = () => {
    if (message.edited_at && message.edited_at !== message.sent_at)
      return "edited at " + formatDate(message.edited_at);
    return formatDate(message.sent_at);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMine && openPopup) openPopup(e.clientX, e.clientY, message);
  };

  return (
    <div
      className={cn(
        "flex mb-4 relative",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        key={message.id}
        onContextMenu={onContextMenu}
        className={cn(
          "max-w-[15vw] p-[10px] rounded-sm",
          isMine ? "bg-blue-500 text-white" : "bg-gray-300"
        )}
      >
        {!isMine && <div className="font-bold">{message.sender?.username}</div>}
        <div className="flex flex-col">
          {files.map((file) => (
            <MessageInFile file={file} key={file.size} />
          ))}
        </div>
        <div>{message.content}</div>
        <div className="text-xs opacity-70">{getMessageTime()}</div>
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  files,
  userId,
  deleteMessage,
}: MessageListProps) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  function openPopup(clientX: number, clientY: number, message: Message) {
    setSelectedMessage(message);
    setPopupOpen(true);
    setCoords({ x: clientX - 20, y: clientY + 20 });
  }

  function closePopup() {
    setPopupOpen(false);
    setSelectedMessage(null);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isPopupOpen &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div>
      {messages
        .filter((message) => !message.is_deleted)
        .map((message) => (
          <MessageBubble
            key={message.id}
            files={files.filter((file) => file.message_id === message.id)}
            message={message}
            isMine={userId === message.sender_id}
            openPopup={openPopup}
          />
        ))}
      {selectedMessage && isPopupOpen && (
        <div
          ref={popupRef}
          onClick={closePopup}
          className="flex-col bg-white p-2 drop-shadow-md rounded-md p-2 gap-[3px] flex text-sm"
          style={{ position: "fixed", left: coords.x, top: coords.y }}
        >
          <button className="rounded-md hover:bg-gray-100 p-2">Edit</button>
          <button
            className="rounded-md hover:bg-gray-100 p-2 text-red-500 text-sm"
            onClick={() => deleteMessage(selectedMessage.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
