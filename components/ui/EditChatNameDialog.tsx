"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  onSave: (name: string) => void | Promise<void>;
  title?: string;
};

export default function EditChatNameDialog({
  open,
  onOpenChange,
  initialName,
  onSave,
  title = "Rename chat",
}: Props) {
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    if (open) {
      setValue(initialName);
    }
  }, [open, initialName]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[201] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <label
            className="mt-4 block text-sm text-gray-600"
            htmlFor="chat-name-input"
          >
            Name
          </label>
          <input
            id="chat-name-input"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void onSave(value);
              }
            }}
          />
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              onClick={() => void onSave(value)}
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
