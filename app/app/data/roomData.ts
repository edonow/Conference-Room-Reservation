type RoomsInfoType = {
  name: string;
  capacity: number;
  price: string;
};

type RoomTimePriceType = {
  name: string;
  capacity: number;
  timeZones: {
    time: string;
    start: number;
    end: number;
    price: number;
    isRoom?: boolean;
  }[];
};

export const roomsInfo: RoomsInfoType[] = [
  { name: "プレゼンテーションルーム", capacity: 40, price: "¥9,300 〜 (税込)" },
  { name: "プレゼンテーションルームA", capacity: 24, price: "¥5,300 〜 (税込)" },
  { name: "プレゼンテーションルームB", capacity: 16, price: "¥4,000 〜 (税込)" },
  { name: "研修室", capacity: 20, price: "¥6,600 〜 (税込)" },
  { name: "ミーティングルーム", capacity: 16, price: "¥3,600 〜 (税込)" },
  { name: "インキュベートルーム", capacity: 10, price: "¥1200 (税込)" },
  // { name: "カフェの貸切", capacity: 50, price: "¥9,500 〜 (税込) / 1 hour" },
  // { name: "レンタルルーム", capacity: 12, price: "¥1,500 (税込) / 1 hour" },
];

export const eachRooms: RoomTimePriceType[] = [
  {
    name: "プレゼンテーションルーム",
    capacity: 40,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 9300, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 15200, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 19400, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 11100, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 15200, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 11100, isRoom: false },
    ],
  },
  {
    name: "プレゼンテーションルームA",
    capacity: 24,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 5300, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 8300, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 10300, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 6200, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 8300, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 6200, isRoom: false },
    ],
  },
  {
    name: "プレゼンテーションルームB",
    capacity: 16,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 4000, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 6900, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 9100, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 4900, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 6900, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 4900, isRoom: false },
    ],
  },
  {
    name: "研修室",
    capacity: 20,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 6600, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 12500, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 15600, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 8000, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 12500, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 8000, isRoom: false },
    ],
  },
  {
    name: "ミーティングルーム",
    capacity: 16,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 3600, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 6500, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 8500, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 4600, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 6500, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 4600, isRoom: false },
    ],
  },
  {
    name: "インキュベートルーム",
    capacity: 10,
    timeZones: [
      { time: "9:00 - 12:00", start: 9, end: 12, price: 1200, isRoom: false },
      { time: "9:00 - 17:00", start: 9, end: 17, price: 1200, isRoom: false },
      { time: "9:00 - 21:00", start: 9, end: 21, price: 1200, isRoom: false },
      { time: "13:00 - 17:00", start: 13, end: 17, price: 1200, isRoom: false },
      { time: "13:00 - 21:00", start: 13, end: 21, price: 1200, isRoom: false },
      { time: "18:00 - 21:00", start: 18, end: 21, price: 1200, isRoom: false },
    ],
  },
];
