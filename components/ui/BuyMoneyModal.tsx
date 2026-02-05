import { Cross2Icon, StarFilledIcon } from "@radix-ui/react-icons";
import { MoneyTariff } from "@/lib/types";
import { moneyTariffs } from "@/lib/postcards";

interface BuyMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyMoney: (money: number) => void;
}

function MoneyTariffEl({
  moneyTariff,
  buyMoney,
}: {
  moneyTariff: MoneyTariff;
  buyMoney: (money: number) => void;
}) {
  return (
    <div className="w-[10vw] rounded-lg p-4 border border-gray-300">
      <StarFilledIcon className="text-yellow-400 block w-[5vh] h-[5vh] mx-[auto]" />
      <div className="text-center text-lg font-bold">
        {moneyTariff.thisMoney}
      </div>
      <button
        onClick={() => buyMoney(moneyTariff.thisMoney)}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
      >
        {moneyTariff.realMoney}$
      </button>
    </div>
  );
}

export default function BuyMoneyModal({
  isOpen,
  onClose,
  buyMoney,
}: BuyMoneyModalProps) {
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
        <div className="grid grid-cols-3 gap-3">
          {moneyTariffs.map((tariff) => (
            <MoneyTariffEl
              key={tariff.id}
              moneyTariff={tariff}
              buyMoney={buyMoney}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
