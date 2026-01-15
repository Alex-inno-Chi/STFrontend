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
  setUser: (user) => set({ user: user, isInitialized: true }),
  logout: () => set({ user: null, isInitialized: true }),
}));
