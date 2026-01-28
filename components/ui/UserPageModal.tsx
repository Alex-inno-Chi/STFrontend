import { User } from "@/lib/types";
import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { z } from "zod";
import { useUserStore } from "@/lib/store/user";
import { useUsersStatusStore } from "@/lib/store/users-status";
import { cn } from "@/lib/utils";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { fullFormatDate, calculateAge } from "@/helpers/formatDate";
import ChatAvatar from "./ChatAvatar";
import { userInfoSchema } from "@/lib/models";

interface FormErrors {
  avatarUrl?: string;
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  birthday?: string;
}

interface UserPageModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserPageModal({
  user,
  isOpen,
  onClose,
}: UserPageModalProps) {
  const [newUser, setNewUser] = useState<User>(user!);
  const { setUser } = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isBirthdayHidden, setBirthdayHidden] = useState(true);
  const { usersStatus } = useUsersStatusStore();
  const isOnline = user?.id ? usersStatus[user.id] : false;
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      const schema = userInfoSchema;
      schema.parse(newUser);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        e.errors.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const changeUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    //const user = await UpdateUserInfoAPI(formData); Типо обновление данных о пользователе
    //if (user !== null) else setIsLoading(false);
    setUser(newUser);
    setIsEdit(false);
    setIsLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 w-[100vw]">
      <div className="bg-white/95 shadow-xl rounded-lg w-full max-w-md p-6 relative">
        <div className="absolute right-4 top-4 text-gray-500 flex gap-2">
          <button onClick={() => setIsEdit(true)} type="button">
            <Pencil1Icon className="w-5 h-5 hover:text-gray-700" />
          </button>
          <button
            onClick={() => {
              onClose();
              setIsEdit(false);
              setErrors({});
            }}
            type="button"
          >
            <Cross2Icon className="w-5 h-5 hover:text-gray-700" />
          </button>
        </div>
        {!isEdit ? (
          <div>
            <div className="flex items-center gap-[20px]">
              <ChatAvatar
                name={"UserPhoto"}
                photoUrl={user?.avatarUrl}
                chatId={user?.id ?? 0}
                size="lg"
              />
              <div className="py-3">
                <h3>{user?.name || "No name"}</h3>
                <p
                  className={cn(
                    "text-sm",
                    isOnline ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="py-3">
              <h3>{user?.phone || "No name"}</h3>
              <p className="text-gray-600 text-sm">Phone</p>
            </div>
            <div className="py-3">
              <h3>@{user?.username || "No name"}</h3>
              <p className="text-gray-600 text-sm">Username</p>
            </div>
            <div className="py-3">
              <h3>{user?.email}</h3>
              <p className="text-gray-600 text-sm">E-mail</p>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <h3>
                  {user?.birthday &&
                    !isBirthdayHidden &&
                    fullFormatDate(user.birthday) +
                      ` (${calculateAge(user.birthday)} years old)`}
                </h3>
                <p className="text-gray-600 text-sm">Birthday</p>
              </div>
              <button
                onClick={() => setBirthdayHidden(!isBirthdayHidden)}
                className={cn(
                  "text-sm rounded py-1 px-2",
                  isBirthdayHidden
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                )}
              >
                {isBirthdayHidden ? "Show" : "Hide"}
              </button>
            </div>
          </div>
        ) : (
          <form className="flex-col flex gap-[10px]">
            <div>
              <label className="text-gray-600 text-sm">Avatar URL: </label>
              <input
                type="text"
                defaultValue={user?.avatarUrl}
                onChange={onChange}
                name="avatarUrl"
                className={cn(
                  "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                  errors.avatarUrl ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.avatarUrl}</p>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-sm">Name: </label>
              <input
                type="text"
                defaultValue={user?.name}
                onChange={onChange}
                name="name"
                className={cn(
                  "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                  errors.name ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="!my-phone">
              <label className="text-gray-600 text-sm">Phone: </label>
              <PhoneInput
                countrySelectorStyleProps={{
                  buttonClassName: "!px-4 !py-2 !rounded-lg !rounded-r-none",
                }}
                value={newUser?.phone}
                onChange={(phone) =>
                  setNewUser((prev) => ({ ...prev, phone: phone }))
                }
                name="phone"
                inputClassName={cn(
                  "!block !w-full !rounded-lg border !px-4 !py-2 !text-gray-900 transition-all !border-gray-300 !text-base !rounded-l-none",
                  errors.phone ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-sm">Username: </label>
              <input
                type="text"
                defaultValue={user?.username}
                onChange={onChange}
                name="username"
                className={cn(
                  "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                  errors.username ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-sm">E-mail: </label>
              <input
                type="text"
                defaultValue={user?.email}
                onChange={onChange}
                name="email"
                className={cn(
                  "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                  errors.email ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-sm">Birthday: </label>
              <input
                type="date"
                defaultValue={user?.birthday}
                onChange={onChange}
                name="birthday"
                className={cn(
                  "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#1A73E8] transition-all",
                  errors.birthday ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.birthday && (
                <p className="mt-1 text-sm text-red-500">{errors.birthday}</p>
              )}
            </div>
            <div className="flex gap-[5px]">
              <button
                type="submit"
                className={cn(
                  "w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed",
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
                onClick={changeUser}
              >
                {isLoading ? "Processing..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setErrors({});
                }}
                className="w-full bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
