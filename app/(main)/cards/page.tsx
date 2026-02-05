"use client";
import { Postcard, UserPostcards } from "@/lib/types";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/user";
import { postcards } from "@/lib/postcards";
import Card from "@/components/ui/Postcard";
import BoughtCardsModal from "@/components/ui/BoughtCardsModal";
import BuyMoneyModal from "@/components/ui/BuyMoneyModal";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";

export default function Postcards() {
  const [isBuyMoneyModal, setBuyMoneyModal] = useState(false);
  const [isBoughtCardsModal, setBoughtCardsModal] = useState(false);
  const [userPostcards, setUserPostcards] = useState<UserPostcards>({
    money: 0,
    user_id: 0,
    postcards: [],
  });
  const { user } = useUserStore();

  const buyMoney = (newMoney: number) => {
    const oldMoney = userPostcards.money;
    setUserPostcards((prev) => {
      const newUserPostcards = { ...prev, money: oldMoney + newMoney };
      localStorage.setItem("userPostcards", JSON.stringify(newUserPostcards));

      return newUserPostcards;
    });
    toast.success("You've got stars!");
  };

  const buySellPostcard = (
    forBuy: boolean,
    postcard: Postcard,
    amount: number,
    money: number
  ) => {
    setUserPostcards((prev) => {
      let updatedPostcards;

      if (prev.postcards.some((card) => card.postcard.id === postcard.id)) {
        updatedPostcards = prev.postcards
          .map((card) => {
            if (card.postcard.id !== postcard.id) return card;
            return {
              ...card,
              amount: forBuy ? card.amount + amount : card.amount - amount,
            };
          })
          .filter((c) => c.amount > 0);
      } else {
        updatedPostcards = [...prev.postcards, { postcard, amount }];
      }

      const newUserPostcards = {
        ...prev,
        money: money,
        postcards: updatedPostcards,
      } as UserPostcards;

      localStorage.setItem("userPostcards", JSON.stringify(newUserPostcards));

      return newUserPostcards;
    });
    if (forBuy) toast.success("You bought card successfully!");
    else toast.success("You selled card successfully!");
  };

  useEffect(() => {
    function getUserPostcards() {
      const UserPostcards = localStorage.getItem("userPostcards");
      if (UserPostcards) setUserPostcards(JSON.parse(UserPostcards));
      else {
        const newUserPostcards = {
          user_id: user?.id,
          money: 50,
          postcards: [],
        } as UserPostcards;
        localStorage.setItem("userPostcards", JSON.stringify(newUserPostcards));
        setUserPostcards(newUserPostcards);
      }
    }
    getUserPostcards();
  }, [user]);

  return (
    <div className="overflow-y-auto h-full max-h-">
      <div className="w-[80%] mx-[auto]">
        <div className="flex gap-3 py-5">
          <div className="text-lg px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-100 flex gap-5">
            <div className="flex items-center gap-1">
              Stars: {userPostcards.money}{" "}
              <StarFilledIcon className="text-yellow-400" />
            </div>
            <button
              onClick={() => setBuyMoneyModal(true)}
              className="bg-gray-200 rounded-full block h-[30px] w-[30px] font-bold border border-gray-400 hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <button
            onClick={() => setBoughtCardsModal(true)}
            className="text-lg px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            My postcards
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {postcards.map((postcard) => (
            <Card
              forBuy={true}
              postcard={postcard}
              key={postcard.id}
              money={userPostcards.money}
              buySellPostcard={buySellPostcard}
            />
          ))}
        </div>
      </div>
      <BoughtCardsModal
        isOpen={isBoughtCardsModal}
        onClose={() => setBoughtCardsModal(false)}
        userPostcards={userPostcards}
        buySellPostcard={buySellPostcard}
      />
      <BuyMoneyModal
        isOpen={isBuyMoneyModal}
        onClose={() => setBuyMoneyModal(false)}
        buyMoney={buyMoney}
      />
    </div>
  );
}
