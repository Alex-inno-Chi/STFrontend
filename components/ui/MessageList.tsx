import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/formatDate";

interface MessageListProps {
  messages: Message[];
  userId: number | null;
}

function MessageBubble({
  message,
  isMine,
}: {
  message: Message;
  isMine: boolean;
}) {
  const getMessageTime = () => {
    if (message.edited_at) return "edited at " + formatDate(message.edited_at);
    return formatDate(message.sent_at);
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
        className={cn(
          "max-w-[10vw] p-[10px] rounded-sm",
          isMine ? "bg-blue-500 text-white" : "bg-gray-300"
        )}
      >
        {!isMine && <div className="font-bold">{message.sender?.username}</div>}
        <div>{message.content}</div>
        <div className="text-xs opacity-70">{getMessageTime()}</div>
      </div>
    </div>
  );
}

export default function MessageList({ messages, userId }: MessageListProps) {
  return (
    <div>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={userId === message.sender_id}
        />
      ))}
    </div>
  );
}
