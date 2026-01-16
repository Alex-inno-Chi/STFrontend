"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { logoutAPI } from "@/lib/api/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (redirectedRef.current) return;
    if (!user?.id && pathname !== "/login") {
      redirectedRef.current = true;
      router.push("/login");
      return;
    }
    if (user?.id && pathname === "/login") {
      redirectedRef.current = true;
      router.replace("/");
      return;
    }
  }, [user?.id, pathname, isInitialized, router]);
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
