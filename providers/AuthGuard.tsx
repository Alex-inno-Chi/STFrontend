"use client";

import { useUserStore } from "@/lib/store/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useUserStore((state) => ({
    user: state.user,
    isInitialized: state.isInitialized,
  }));
  const router = useRouter();
  const checkAuth = useCallback(() => {
    if (!isInitialized) return;
    if (user === null) router.push("/login");
  }, [user, isInitialized, router]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  //toDo spinner
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }
  return <>{children}</>;
}
