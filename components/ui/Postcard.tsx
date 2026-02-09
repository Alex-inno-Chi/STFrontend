import Image from "next/image";
import { Postcard } from "@/lib/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface CardProps {
  forBuy: boolean;
  postcard: Postcard;
  money: number;
  givenAmount?: number;
  buySellPostcard: (
    forBuy: boolean,
    postcard: Postcard,
    amount: number,
    money: number
  ) => void;
}

export default function Card({
  forBuy,
  postcard,
  money,
  givenAmount,
  buySellPostcard,
}: CardProps) {
  const [amount, setAmount] = useState(1);

  const processClick = () => {
    let newMoney = money;
    if (forBuy && amount * postcard.buyCost <= money)
      newMoney = money - amount * postcard.buyCost;
    else if (forBuy) {
      toast.error("You don't have enough money (");
      return;
    }
    if (!forBuy) newMoney = money + amount * postcard.sellCost;
    buySellPostcard(forBuy, postcard, amount, newMoney);
  };

  const increaseAmount = () => {
    if (forBuy) setAmount(amount + 1);
    else if (givenAmount && amount < givenAmount) setAmount(amount + 1);
  };

  return (
    <div className="rounded-lg p-4 border border-gray-300 max-w-[15vw]">
      <Image
        src={postcard.path}
        alt="Lol"
        width={512}
        height={512}
        className="w-full rounded-lg aspect-square"
      />
      <h3 className="text-lg font-bold mt-1">{postcard.name}</h3>
      <p className="text-gray-700">
        {forBuy ? postcard.description : "You have: " + givenAmount}
      </p>
      <div className="flex justify-between items-center mb-2 mt-1">
        <p className="font-bold flex flex-wrap items-center gap-1">
          {forBuy
            ? "Cost: " + postcard.buyCost * amount
            : "You'll get: " + postcard.sellCost * amount}
          <StarFilledIcon className="text-yellow-400" />
        </p>
        <div className="flex text-lg gap-2 rounded-full bg-gray-100 p-1">
          <button
            onClick={() => amount > 1 && setAmount(amount - 1)}
            className="bg-gray-200 rounded-full block h-[30px] w-[30px] font-bold border border-gray-400 hover:bg-gray-300"
          >
            –
          </button>
          <div>{amount}</div>
          <button
            onClick={increaseAmount}
            className="bg-gray-200 rounded-full block h-[30px] w-[30px] font-bold border border-gray-400 hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={processClick}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {forBuy ? "Buy" : "Sell"}
      </button>
    </div>
  );
}
