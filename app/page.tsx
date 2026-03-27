"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import ChatList from "@/components/ui/ChatList";
import ChatWindow from "@/components/ui/ChatWindow";
import { Chat, Message } from "@/lib/types";
import { getChatsAPI, deleteChatAPI, updateChatAPI } from "@/lib/api/chats";
import { getMessagesAPI } from "@/lib/api/messages";
import NewChatModal from "@/components/ui/NewChatModal";
import WebSocketProvider, { useAuthToken } from "@/providers/WebSocketProvider";
import {
  useMessageEvents,
  useChatEvents,
  useMessageReadStatus,
} from "@/lib/websocket/hooks";
import { useChatStore } from "@/lib/store/chats";
import { getCurrentUserAPI } from "@/lib/api/auth";
import {
  sendMessageAPI,
  deleteMessageAPI,
  editMessageAPI,
} from "@/lib/api/messages";
import EditChatNameDialog from "@/components/ui/EditChatNameDialog";
import EditMessageDialog from "@/components/ui/EditMessageDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { websocketService } from "@/lib/websocket/service";
import {
  ServerEvents,
  MessageReadStatusPayload,
  UserTypingPayload,
} from "@/lib/websocket";

function ChatContent() {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { activeChatId, setActiveChatId } = useChatStore();
  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const [renameChatTarget, setRenameChatTarget] = useState<Chat | null>(null);
  const [deleteChatTarget, setDeleteChatTarget] = useState<Chat | null>(null);
  const [editMessageState, setEditMessageState] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);

  const [typingUserId, setTypingUserId] = useState<number | null>(null);
  const [readMessageIds, setReadMessageIds] = useState<Set<number>>(
    () => new Set()
  );
  const { markAsRead } = useMessageReadStatus();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleChatUpdated = useCallback((updated: Chat) => {
    setChats((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

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

  const handleMessageUpdated = useCallback(
    (updated: Message) => {
      if (updated.chat_id !== activeChatId) {
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
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

  useMessageEvents(
    handleNewMessage,
    handleMessageDeleted,
    handleMessageUpdated
  );
  useChatEvents(handleNewChat, handleChatDeleted);

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    websocketService.joinChat(activeChatId);

    return () => {
      websocketService.leaveChat(activeChatId);
    };
  }, [activeChatId]);

  useEffect(() => {
    setTypingUserId(null);
    setReadMessageIds(new Set());
  }, [activeChatId]);

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

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const unsubscribe = websocketService.on(
      ServerEvents.MESSAGE_READ_STATUS,
      (payload: unknown) => {
        const payloadForMessage = payload as MessageReadStatusPayload;
        const target = messagesRef.current.find(
          (m) => m.id === payloadForMessage.messageId
        );

        if (target?.sender_id === currentUserId) {
          setReadMessageIds((prev) =>
            new Set(prev).add(payloadForMessage.messageId)
          );
        }
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  useEffect(() => {
    if (!activeChatId || currentUserId == null) return;

    const unsubTyping = websocketService.on(
      ServerEvents.USER_TYPING,
      (raw: unknown) => {
        const p = raw as UserTypingPayload;
        if (p.chatId !== activeChatId) return;
        if (p.userId === currentUserId) return;
        setTypingUserId(p.userId);
      }
    );
    const unsubStopped = websocketService.on(
      ServerEvents.USER_STOPPED_TYPING,
      (raw: unknown) => {
        const p = raw as UserTypingPayload;
        if (p.chatId !== activeChatId) return;
        setTypingUserId((id) => (id === p.userId ? null : id));
      }
    );

    return () => {
      unsubTyping();
      unsubStopped();
    };
  }, [activeChatId, currentUserId]);

  const setNewMessage = useCallback(
    async (messageText: string, chatId: number | null) => {
      if (!chatId) {
        return;
      }

      const message = await sendMessageAPI(chatId, messageText);

      if (message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }

          return [...prev, message];
        });
      }
    },
    []
  );

  const handleDeleteMessage = useCallback(
    async (id: number | null) => {
      if (!id || !activeChatId) return;

      const ok = await deleteMessageAPI(activeChatId, id);

      if (ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    },
    [activeChatId]
  );

  const handleEditMessage = useCallback(
    async (messageId: number, newText: string) => {
      if (!activeChatId) return;
      const text = newText.trim();
      if (!text) return;

      const updated = await editMessageAPI(activeChatId, messageId, text);
      if (updated) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updated : m))
        );
      }
    },
    [activeChatId]
  );

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

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUserAPI();
      setCurrentUserId(user?.id ?? null);
    }
    loadCurrentUser();
  }, []);

  const typingMemberName =
    typingUserId != null && activeChat
      ? (activeChat.members.find((m) => m.id === typingUserId)?.username ??
        activeChat.members.find((m) => m.id === typingUserId)?.email ??
        null)
      : null;

  return (
    <div className="flex h-full">
      <ChatList
        chats={chats}
        activeChat={activeChatId}
        setActiveChat={onSetActiveChat}
        onAddNewChat={() => setIsNewChatModalOpen(true)}
        currentUserId={currentUserId}
        onRequestRenameChat={setRenameChatTarget}
        onRequestDeleteChat={setDeleteChatTarget}
      />

      {
        <ChatWindow
          userId={currentUserId}
          chatId={activeChatId}
          messages={messages}
          setNewMessage={setNewMessage}
          activeChat={activeChat}
          onRequestEditMessage={(id, content) =>
            setEditMessageState({ id, content })
          }
          onRequestDeleteMessage={setDeleteMessageId}
          typingPeerName={typingMemberName}
          readMessageIds={readMessageIds}
          onMarkMessageRead={(messageId) => {
            if (!activeChatId || currentUserId == null) return;

            const msg = messagesRef.current.find((m) => m.id === messageId);

            if (!msg || msg.sender_id === currentUserId) return;

            markAsRead(messageId, activeChatId);
          }}
          onBackToChatList={() => setActiveChatId(null)}
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
      <EditChatNameDialog
        open={renameChatTarget !== null}
        onOpenChange={(o) => !o && setRenameChatTarget(null)}
        initialName={renameChatTarget?.name ?? ""}
        onSave={async (name) => {
          if (!renameChatTarget) return;
          const updated = await updateChatAPI(renameChatTarget.id, { name });
          if (updated) {
            handleChatUpdated(updated);
            setRenameChatTarget(null);
          }
        }}
      />
      <ConfirmDialog
        open={deleteChatTarget !== null}
        onOpenChange={(o) => !o && setDeleteChatTarget(null)}
        title="Delete chat?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (!deleteChatTarget) return;
          const ok = await deleteChatAPI(deleteChatTarget.id);
          if (ok) {
            handleChatDeleted({ chatId: deleteChatTarget.id });
            setDeleteChatTarget(null);
          }
        }}
      />
      <EditMessageDialog
        open={editMessageState !== null}
        onOpenChange={(o) => !o && setEditMessageState(null)}
        initialContent={editMessageState?.content ?? ""}
        onSave={async (text) => {
          if (!editMessageState) return;
          await handleEditMessage(editMessageState.id, text);
          setEditMessageState(null);
        }}
      />
      <ConfirmDialog
        open={deleteMessageId !== null}
        onOpenChange={(o) => !o && setDeleteMessageId(null)}
        title="Delete message?"
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteMessageId == null) return;
          await handleDeleteMessage(deleteMessageId);
          setDeleteMessageId(null);
        }}
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
