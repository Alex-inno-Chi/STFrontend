"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ isLoading, setIsLoading] = useState(true);
  const [ isAuthenticated, setIsAuthentificated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname?.startsWith("/login");
 
  useEffect(() => {
    if (isLoginPage){
      set
    }


  }, [router, pathname, isLoginPage]);

  return <>{children}</>;
}
// no authorized users 