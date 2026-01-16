"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { logoutAPI } from "@/lib/api/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user?.id && pathname !== "/login") {
      router.push("/login");
      return;
    }
    if (user?.id && pathname === "/login") {
      router.replace("/");
      return;
    }
  }, [user?.id, router, pathname, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser && user?.id) {
        setUser(null);
        logoutAPI().catch(() => {});
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user?.id, pathname, isInitialized, setUser, router]);

  if (!isInitialized) return <div>Loading...</div>;
  return <>{children}</>;
}
