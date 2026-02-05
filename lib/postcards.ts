import { Postcard, MoneyTariff } from "@/lib/types";

export const postcards: Postcard[] = [
  {
    id: 1,
    path: "/cards/1.jpg",
    name: "Party Cow",
    description:
      "A cow wearing a party hat blowing a blue balloon with confetti",
    buyCost: 10,
    sellCost: 8,
  },
  {
    id: 2,
    path: "/cards/2.jpg",
    name: "Flower Boy",
    description:
      "A young boy holding out a large bouquet of red and white flowers",
    buyCost: 20,
    sellCost: 17,
  },
  {
    id: 3,
    path: "/cards/3.jpg",
    name: "Shy Flower",
    description: "A cute yellow emoji holding a pink flower and looking shy",
    buyCost: 5,
    sellCost: 3,
  },
  {
    id: 4,
    path: "/cards/4.jpg",
    name: "Heart Hug",
    description: "A happy emoji smiling while holding a large red heart",
    buyCost: 5,
    sellCost: 3,
  },
  {
    id: 5,
    path: "/cards/5.jpg",
    name: "Birthday Kitten",
    description:
      "A kitten celebrating with a birthday cake, candles, and balloons",
    buyCost: 12,
    sellCost: 10,
  },
  {
    id: 6,
    path: "/cards/6.jpg",
    name: "Star Celebration",
    description:
      "A smiling star character surrounded by colorful balloons and party poppers",
    buyCost: 13,
    sellCost: 11,
  },
  {
    id: 7,
    path: "/cards/7.jpg",
    name: "Pizza Party",
    description:
      "A dog and cat wearing party hats and holding a birthday pizza",
    buyCost: 15,
    sellCost: 13,
  },
  {
    id: 8,
    path: "/cards/8.jpg",
    name: "Heart Face Dog",
    description: "A brown dog looking through a pink heart-shaped cutout",
    buyCost: 17,
    sellCost: 14,
  },
  {
    id: 9,
    path: "/cards/9.jpg",
    name: "Clown Cat",
    description: "A cat in a rainbow wig and glasses holding a party popper",
    buyCost: 7,
    sellCost: 5,
  },
  {
    id: 10,
    path: "/cards/10.jpg",
    name: "Surprise Parrot",
    description:
      "An African Grey parrot popping out of a white gift box with a red ribbon",
    buyCost: 10,
    sellCost: 8,
  },
  {
    id: 11,
    path: "/cards/11.jpg",
    name: "Fancy Shrimp",
    description: "A shrimp wearing a black top hat against a white background",
    buyCost: 15,
    sellCost: 13,
  },
  {
    id: 12,
    path: "/cards/12.jpg",
    name: "Musical Dolphin",
    description:
      "A dolphin swimming underwater while wearing a pair of black headphones",
    buyCost: 17,
    sellCost: 15,
  },
];

export const moneyTariffs: MoneyTariff[] = [
  {
    id: 1,
    thisMoney: 5,
    realMoney: 1.99,
  },
  {
    id: 2,
    thisMoney: 10,
    realMoney: 3.49,
  },
  {
    id: 3,
    thisMoney: 20,
    realMoney: 4.99,
  },
  {
    id: 4,
    thisMoney: 50,
    realMoney: 6.49,
  },
  {
    id: 5,
    thisMoney: 75,
    realMoney: 7.99,
  },
  {
    id: 6,
    thisMoney: 100,
    realMoney: 8.99,
  },
];
