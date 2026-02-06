import { create } from "zustand";
import { UserPostcards } from "@/lib/types";

interface UserPostcardsStore {
  userPostcards: UserPostcards;
  setUserPostcards: (newUserPostcards: UserPostcards) => void;
}

export const useUserPostcardsStore = create<UserPostcardsStore>((set) => {
  return {
    userPostcards: {
      money: 0,
      user_id: 0,
      postcards: [],
    },
    setUserPostcards: (newUserPostcards: UserPostcards) => {
      const jsonCards = localStorage.getItem("usersPostcards");
      const usersPostcards = jsonCards ? JSON.parse(jsonCards) : [];
      if (
        !usersPostcards.find(
          (card: UserPostcards) => card.user_id === newUserPostcards.user_id
        )
      )
        usersPostcards.push(newUserPostcards);
      localStorage.setItem("usersPostcards", JSON.stringify(usersPostcards));
      set({ userPostcards: newUserPostcards });
    },
  };
});
