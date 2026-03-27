"use client";

import { useAdminStore } from "@/lib/store/admin";

export default function Header() {
  const { setSidebarIsOpen } = useAdminStore();

  return (
    <div className="h-18 bg-white border-b border-gray-200 flex items-center px-4">
      <button
        type="button"
        className="sm:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Открыть меню"
        onClick={() => setSidebarIsOpen(true)}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold text-gray-900 sm:ml-0 ml-1">
        Chats
      </h1>
    </div>
  );
}
