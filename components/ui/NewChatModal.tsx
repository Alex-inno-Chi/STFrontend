import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { User } from "@/lib/types";
import { createPrivateChatApi, createGroupChatApi } from "@/lib/api/chats";
import { z } from "zod";
import { privateChatSchema, groupChatSchema } from "@/lib/models";
import { cn } from "@/lib/utils";
import UserSelect from "./UserSelect";

export interface FormErrors {
  otherUserId?: string;
  name?: string;
  memberIds?: string;
}

interface NewChatModalProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  otherUserId: undefined | number;
  name: string;
  memberIds: [] | number[];
}

export default function NewChatModal({
  users = [],
  isOpen,
  onClose,
}: NewChatModalProps) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    otherUserId: undefined,
    name: "",
    memberIds: [],
  });
  const [selected, setSelected] = useState<User[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      const validatedDFormData = parseFormData();
      const newChat =
        "otherUserId" in validatedDFormData
          ? await createPrivateChatApi(validatedDFormData)
          : await createGroupChatApi(validatedDFormData);
      setIsLoading(false);
      if (newChat != null) {
        onClose();
      }
    } catch (e) {
      setIsLoading(false);
      if (e instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        e.errors.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const parseFormData = () => {
    const schema = isPrivate ? privateChatSchema : groupChatSchema;
    return schema.parse(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (selectedObjects: User[]) => {
    setSelected(selectedObjects);
    if (isPrivate) {
      const value = selectedObjects[0]?.id || undefined;
      setFormData((prev) => ({ ...prev, otherUserId: value }));
    } else {
      const finalValue = Array.from(selectedObjects).map((u) => u.id!);
      setFormData((prev) => ({ ...prev, memberIds: finalValue }));
    }
  };

  const switchType = () => {
    setIsPrivate(!isPrivate);
    setSelected([]);
    setFormData({ otherUserId: undefined, name: "", memberIds: [] });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 shadow-xl rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
        <form onSubmit={handleCreateChat} className="flex-col flex gap-[10px]">
          <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
          <div className="flex justify-between">
            <button
              type="button"
              className={cn(
                "py-2 px-4 rounded-md hover:bg-blue-600 w-[48%]",
                isPrivate ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              )}
              onClick={switchType}
            >
              Private chat
            </button>
            <button
              type="button"
              className={cn(
                "py-2 px-4 rounded-md hover:bg-blue-600 w-[48%]",
                !isPrivate ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              )}
              onClick={switchType}
            >
              Group chat
            </button>
          </div>
          <input
            type="text"
            hidden={isPrivate}
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
            className={cn(
              "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
              errors.name ? "border-red-300" : "border-gray-300"
            )}
            name="name"
          ></input>
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
          <UserSelect
            options={users}
            selected={selected}
            isMulti={!isPrivate}
            onChange={handleUserChange}
            errors={errors}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Create Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}
