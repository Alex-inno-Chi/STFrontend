import { Cross2Icon } from "@radix-ui/react-icons";
import { Chat, User } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { getUsersAPI } from "@/lib/api/users";
import { createPrivateChatAPI, createGroupChatAPI } from "@/lib/api/chats";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chat: Chat) => void;
  currentUserId: number | null;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onChatCreated,
  currentUserId,
}: NewChatModalProps) {
  const [mode, setMode] = useState<"private" | "group">("group");
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedPrivateId, setSelectedPrivateId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    getUsersAPI().then((list) => {
      setUsers(list.filter((u) => u.id !== currentUserId));
    });

    setMode("private");
    setSearch("");
    setGroupName("");
    setSelectedIds([]);
    setSelectedPrivateId(null);
  }, [isOpen, currentUserId]);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase().trim();

        if (!q) return true;

        const label = (u.username || u.email || "").toLowerCase();

        return label.includes(q);
      }),
    [users, search]
  );

  if (!isOpen) return null;

  const toggleMember = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canCreateGroup = groupName.trim().length > 0 && selectedIds.length > 0;
  const canCreatePrivate = !!selectedPrivateId;

  const handleCreateChat = async () => {
    if (mode === "group") {
      if (!canCreateGroup) return;

      setLoading(true);

      const chat = await createGroupChatAPI({
        name: groupName.trim(),
        memberIds: selectedIds,
      });

      setLoading(false);

      if (chat) {
        onChatCreated(chat);
        onClose();
      }
    } else {
      if (!canCreatePrivate) return;

      setLoading(true);

      const chat = await createPrivateChatAPI(selectedPrivateId!);

      setLoading(false);

      if (chat) {
        onChatCreated(chat);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 shadow-xl rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>

        <div className="mb-4 flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            onClick={() => setMode("private")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              mode === "private"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Private Chat
          </button>
          <button
            type="button"
            onClick={() => setMode("group")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              mode === "group"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Group Chat
          </button>
        </div>

        {/* {Body modal window depens what type of chat} */}
        {mode === "group" ? (
          <>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>

            <div className="mb-2">
              <p className="mb-1 text-xs font-medium text-gray-600">
                Selected Users:
              </p>
              {selectedIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id) => {
                    const u = users.find((x) => x.id === id);
                    const label = u?.username || u?.email || "Unknown user";
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleMember(id)}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {label}
                        <span className="text-blue-500">×</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No users selected</p>
              )}
            </div>

            <div className="mb-4 max-h-48 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-1">
              {filteredUsers.map((u) => {
                const label = u.username || u.email || "Unknown user";
                const selected = selectedIds.includes(u.id!);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleMember(u.id!)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                      selected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                      {label[0]?.toUpperCase()}
                    </div>
                    <span className="truncate text-gray-900">{label}</span>
                  </button>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="px-2 py-3 text-center text-xs text-gray-400">
                  No users found
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>

            <div className="mb-2">
              <p className="mb-1 text-xs font-medium text-gray-600">
                Selected Users:
              </p>
              {selectedPrivateId ? (
                (() => {
                  const u = users.find((x) => x.id === selectedPrivateId);
                  const label = u?.username || u?.email || "Unknown user";
                  return (
                    <button
                      type="button"
                      onClick={() => setSelectedPrivateId(null)}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {label}
                      <span className="text-blue-500">×</span>
                    </button>
                  );
                })()
              ) : (
                <p className="text-xs text-gray-400">No user selected</p>
              )}
            </div>

            <div className="mb-4 max-h-56 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-1">
              {filteredUsers.map((u) => {
                const label = u.username || u.email || "Unknown user";
                const selected = selectedPrivateId === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedPrivateId(u.id!)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                      selected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                      {label[0]?.toUpperCase()}
                    </div>
                    <span className="truncate text-gray-900">{label}</span>
                  </button>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="px-2 py-3 text-center text-xs text-gray-400">
                  No users found
                </p>
              )}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleCreateChat}
          disabled={
            loading || (mode === "group" ? !canCreateGroup : !canCreatePrivate)
          }
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Chat"}
        </button>
      </div>
    </div>
  );
}
