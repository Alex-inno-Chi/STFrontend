import { Cross2Icon } from "@radix-ui/react-icons";
import { Chat, User } from "@/lib/types";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chat:Chat) => void;
  currentUserId: number |null;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onChatCreated,
  currentUserId
}: NewChatModalProps) {
  const handleCreateChat = () => {};

  if (!isOpen) return null;

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

        <div className="flex gap-2 mb-4">
          <button onClick={()=> setMode("private")}>
            Private Chat
          </button>
          <button onClick={()=> setMode("group")}>
            Group Chat
          </button>
        </div>


        {/* {Body modal window depens what type of chat} */}
        { mode === "group" ? (
          <>
            <div>
              <label>Group Name</label>
              <input></input>
            </div>

            <div>
              <label>Search users...</label>
              <input></input>
            </div>

            <div>
              {filteredUsers.map((u)=>{

              })}
              {filteredUsers.length === 0 && (
                <p>
                  No users found
                </p>
              )
              }
            </div>
          </>
        ):(
          <>
            <div>
              <label>Search users...</label>
              <input></input>
            </div>

            <div>
              {filteredUsers.map((u)=>{

              })}
              {filteredUsers.length === 0 && (
                <p>
                  No users found
                </p>
              )
              }
            </div>
          </>      
        )
        }
        <button
          onClick={handleCreateChat}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Chat
        </button>
      </div>
    </div>
  );
}
