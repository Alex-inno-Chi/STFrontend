"use client";
import { useEffect, useState, useCallback } from "react";
import ChatList from "@/components/ui/ChatList";
import ChatWindow from "@/components/ui/ChatWindow";
import { Chat, Message } from "@/lib/types";
import { getChatsAPI } from "@/lib/api/chats";
import { getMessagesAPI } from "@/lib/api/messages";
import NewChatModal from "@/components/ui/NewChatModal";
import WebSocketProvider, { useAuthToken } from "@/providers/WebSocketProvider";
import { useMessageEvents, useChatEvents } from "@/lib/websocket/hooks";
import { useChatStore } from "@/lib/store/chats";
import { getCurrentUserAPI } from "@/lib/api/auth";

function ChatContent() {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const { activeChatId, setActiveChatId } = useChatStore();
  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;


  const handleChatUpdated = useCallback((updated: Chat)=>{
    setChats((prev) => prev.map((c)=>(c.id === updated.id? updated:c)))
  }, [])

  // WebSocket event handlers
  const handleNewMessage = useCallback(
    (message: Message) => {
      if (message.chat_id === activeChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    },
    [activeChatId]
  );

  const handleMessageDeleted = useCallback(
    (payload: { chatId: number; messageId: number }) => {
      if (payload.chatId === activeChatId) {
        setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
      }
    },
    [activeChatId]
  );

  const handleNewChat = useCallback(
    (chat: Chat) => {
      setChats((prev) => {
        if (prev.some((c) => c.id === chat.id)) return prev;
        return [...prev, chat];
      });
      setActiveChatId(chat.id);
    },
    [setActiveChatId]
  );

  const handleChatDeleted = useCallback(
    (payload: { chatId: number }) => {
      setChats((prev) => prev.filter((c) => c.id !== payload.chatId));
      if (activeChatId === payload.chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    },
    [activeChatId, setActiveChatId]
  );

  useMessageEvents(handleNewMessage, handleMessageDeleted);
  useChatEvents(handleNewChat, handleChatDeleted);

  useEffect(() => {
    function extractChatId(hash: string): string {
      if (hash.startsWith("#chat/")) {
        return hash.replace("#chat/", "");
      }
      return "";
    }
    if (!activeChatId && extractChatId(window.location.hash)) {
      setActiveChatId(+extractChatId(window.location.hash));
    }
  }, [activeChatId, setActiveChatId]);

  function setNewMessage() {}

  const handleDeleteMessage = () => {};

  useEffect(() => {
    async function getChats() {
      const chatsData = await getChatsAPI();
      setChats(chatsData || []);
    }
    getChats();
  }, []);

  useEffect(() => {
    async function getMessages(chatId: number) {
      const messagesData = await getMessagesAPI(chatId);
      setMessages(messagesData || []);
    }
    if (activeChatId) {
      getMessages(activeChatId);
    }
  }, [activeChatId]);

  function onSetActiveChat(activeChat: number) {
    setActiveChatId(activeChat);
  }

  useEffect(()=>{
    async function loadCurrentUser() {
      const user = await getCurrentUserAPI();
      setCurrentUserId(user?.id ?? null);
    } 
    loadCurrentUser();
  },[])

  return (
    <div className="flex h-full">
      <ChatList
        chats={chats}
        activeChat={activeChatId}
        setActiveChat={onSetActiveChat}
        onAddNewChat={() => setIsNewChatModalOpen(true)}
        currentUserId={currentUserId}
      />

      {
        <ChatWindow
          userId={currentUserId}
          chatId={activeChatId}
          messages={messages}
          setNewMessage={setNewMessage}
          handleDeleteMessage={handleDeleteMessage}
          activeChat = {activeChat}
          onChatUpdated={handleChatUpdated}
          onChatDeleted={handleChatDeleted}
        />
      }

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onChatCreated={(chat) => {
          setChats((prev) => {
          if (prev.some((c) => c.id === chat.id)) return prev;

          return [...prev, chat];
          });
          
          setActiveChatId(chat.id);
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default function Home() {
  const token = useAuthToken();

  return (
    <WebSocketProvider token={token}>
      <ChatContent />
    </WebSocketProvider>
  );
}
