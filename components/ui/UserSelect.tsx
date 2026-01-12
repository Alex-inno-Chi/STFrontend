import React, { useState, useMemo } from "react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FormErrors } from "./NewChatModal";
import ChatAvatar from "./ChatAvatar";

export default function UserSelect({
  options = [],
  selected = [],
  onChange,
  isMulti,
  errors,
}: {
  options: User[];
  selected: User[];
  onChange: (selected: User[]) => void;
  isMulti: boolean;
  errors: FormErrors;
}) {
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    return options.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const toggleUser = (user: User) => {
    let newSelected;
    if (isMulti) {
      const isAlreadySelected = selected.find((u: User) => u.id === user.id);
      if (isAlreadySelected) {
        newSelected = selected.filter((u: User) => u.id !== user.id);
      } else {
        newSelected = [...selected, user];
      }
    } else {
      newSelected = [user];
    }
    if (onChange) onChange(newSelected);
  };

  const removeUser = (id: number) => {
    const newSelected = selected.filter((u) => u.id !== id);
    if (onChange) onChange(newSelected);
  };

  return (
    <div className="flex-col flex gap-[5px]">
      <input
        type="text"
        placeholder="Type to find user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
          errors.otherUserId || errors.memberIds
            ? "border-red-300"
            : "border-gray-300"
        )}
      />
      {selected.length > 0 ? (
        <div>
          <p>Selected users: </p>
          <div className="flex gap-2 wrap">
            {selected.map((user) => (
              <div
                key={user.id}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-[13px] flex items-center gap-2 shadow-sm"
              >
                {user.username}
                <span
                  onClick={() => removeUser(user.id!)}
                  className="cursor-pointer font-bold hover:text-blue-200 transition-colors"
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="border border-gray-100 rounded-md max-h-[180px] overflow-y-auto bg-gray-50">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isSelected = selected.some((u) => u.id === user.id);
            return (
              <div
                key={user.id}
                onClick={() => toggleUser(user)}
                className={cn(
                  "px-[15px] py-2.5 cursor-pointer flex justify-between items-center border-b border-white last:border-none transition-all duration-200",
                  isSelected ? "bg-blue-100" : ""
                )}
              >
                <div className="flex items-center gap-[10px]">
                  <ChatAvatar
                    name={"Chat"}
                    photoUrl={null}
                    chatId={user.id!}
                    size="sm"
                  />
                  <span>{user.username}</span>
                </div>
                {isSelected && <span className="text-[12px]">✓</span>}
              </div>
            );
          })
        ) : (
          <div className="bg-gray-100 p-[10px] text-center">
            No such user found
          </div>
        )}
      </div>
      {errors.otherUserId && (
        <p className="mt-1 text-sm text-red-500">{errors.otherUserId}</p>
      )}
      {errors.memberIds && (
        <p className="mt-1 text-sm text-red-500">{errors.memberIds}</p>
      )}
    </div>
  );
}
