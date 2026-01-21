import { create } from "zustand";

interface UsersStatusStore {
  usersStatus: { [userId: number]: boolean };
  setUserStatus: (userId: number, isOnline: boolean) => void;
}

export const useUsersStatusStore = create<UsersStatusStore>((set) => ({
  usersStatus: {},
  setUserStatus: (userId, isOnline) => {
    set((state) => ({
      usersStatus: { ...state.usersStatus, [userId]: isOnline },
    }));
  },
}));
