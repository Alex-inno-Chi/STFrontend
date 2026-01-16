"use client";

import { useEffect } from "react";
import { ApiEndpoints } from "@/lib/api/api-endpoints";
import { GET } from "@/lib/api/client";
import { useUserStore } from "@/lib/store/user";
import { toast } from "react-toastify";

export default function UserInitializer() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    let mounted = true;
    const initUser = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              if (mounted) setUser(user);
            } catch (error) {
              toast(`Error parsing stored user data: ${error}`);
            }
          }
        }
        const response = await GET(ApiEndpoints.USER);
        if (!mounted) return;
        if (response.ok) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (mounted) {
          toast(`Error: ${error}`);
          setUser(null);
        }
      }
    };
    initUser();
    return () => {
      mounted = false;
    };
  }, [setUser]);
  return null;
}
