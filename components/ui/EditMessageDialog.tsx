"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
  onSave: (text: string) => void | Promise<void>;
};

export default function EditMessageDialog({
  open,
  onOpenChange,
  initialContent,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialContent);

  useEffect(() => {
    if (open) {
      setValue(initialContent);
    }
  }, [open, initialContent]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[201] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Edit message
            </Dialog.Title>
            <Dialog.Close
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <textarea
            className="mt-4 min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
