import { create } from "zustand";
import { User } from "../types";

interface UserStore {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (!user) {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    return set({ user: user, isInitialized: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
    return set({ user: null, isInitialized: true });
  },
}));
