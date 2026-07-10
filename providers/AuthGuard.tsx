"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUserAPI } from "@/lib/api/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname?.startsWith("/login");

  useEffect(() => {
    if (isLoginPage) {
      (async () => {
        const user = await getCurrentUserAPI();
        if (user) {
          router.push("/");
          return;
        }
        setIsLoading(false);
        setIsAuthenticated(false);
      })();
      return;
    }

    (async () => {
      const user = await getCurrentUserAPI();
      if (!user) {
        router.push("/login");

        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    })();
  }, [router, pathname, isLoginPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Loading....</span>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
