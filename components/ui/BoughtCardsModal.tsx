import { Cross2Icon } from "@radix-ui/react-icons";
import { UserPostcards, Postcard } from "@/lib/types";
import Card from "./Postcard";

interface BoughtCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  buySellPostcard: (
    forBuy: boolean,
    postcard: Postcard,
    amount: number,
    money: number
  ) => void;
  userPostcards: UserPostcards;
}

export default function BoughtCardsModal({
  isOpen,
  onClose,
  buySellPostcard,
  userPostcards,
}: BoughtCardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 shadow-xl rounded-lg p-10 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
        <div className="max-h-[60vh] overflow-y-auto max-w-[50vw]">
          <div className="flex flex-wrap gap-4 mx-[auto]">
            {userPostcards.postcards.length > 0 ? (
              userPostcards.postcards.map((boughtCard) => (
                <Card
                  key={boughtCard.postcard.id}
                  forBuy={false}
                  postcard={boughtCard.postcard}
                  givenAmount={boughtCard.amount}
                  money={userPostcards.money}
                  buySellPostcard={buySellPostcard}
                />
              ))
            ) : (
              <div className="py-2">You have no cards yet ((</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
