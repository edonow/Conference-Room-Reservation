const CheckPriceId = async (room: string, start: number, end: number) => {
  if (room === "プレゼンテーションルーム") {
    if (start === 9 && end === 12) return "price_1P61UURqgPxCRfWfBk2TFDZ6";
    if (start === 9 && end === 17) return "price_1P63jURqgPxCRfWfm7oe1rHJ";
    if (start === 9 && end === 21) return "price_1P66hZRqgPxCRfWfHlK13kko";
    if (start === 13 && end === 17) return "price_1P66iDRqgPxCRfWfNrDwjA7r";
    if (start === 13 && end === 21) return "price_1P66iURqgPxCRfWfprWgJQac";
    if (start === 18 && end === 21) return "price_1P66ilRqgPxCRfWfj0CdhiO1";
  }
  if (room === "プレゼンテーションルームA") {
    if (start === 9 && end === 12) return "price_1P66khRqgPxCRfWfI3Ne4HVD";
    if (start === 9 && end === 17) return "price_1P66kwRqgPxCRfWfCTnzTXQK";
    if (start === 9 && end === 21) return "price_1P66lJRqgPxCRfWfef6fzGy5";
    if (start === 13 && end === 17) return "price_1P66lcRqgPxCRfWfNVJrVcfM";
    if (start === 13 && end === 21) return "price_1P66mBRqgPxCRfWf3YL5Z38Z";
    if (start === 18 && end === 21) return "price_1P66mbRqgPxCRfWfbCsSL4FK";
  }
  if (room === "プレゼンテーションルームB") {
    if (start === 9 && end === 12) return "price_1P66nJRqgPxCRfWfkq2a9FbN";
    if (start === 9 && end === 17) return "price_1P66nXRqgPxCRfWfKN8CdMvA";
    if (start === 9 && end === 21) return "price_1P66npRqgPxCRfWfTKc4HVqx";
    if (start === 13 && end === 17) return "price_1P66oDRqgPxCRfWfFxZwTqiO";
    if (start === 13 && end === 21) return "price_1P66ogRqgPxCRfWfASfPwnv4";
    if (start === 18 && end === 21) return "price_1P66oyRqgPxCRfWfJSuLeFcb";
  }
  if (room === "研修室") {
    if (start === 9 && end === 12) return "price_1P66q5RqgPxCRfWfm1wgNr4q";
    if (start === 9 && end === 17) return "price_1P66qJRqgPxCRfWfCasJN1Xn";
    if (start === 9 && end === 21) return "price_1P66qZRqgPxCRfWftRofIbro";
    if (start === 13 && end === 17) return "price_1P66oDRqgPxCRfWfFxZwTqiO";
    if (start === 13 && end === 21) return "price_1P66ogRqgPxCRfWfASfPwnv4";
    if (start === 18 && end === 21) return "price_1P66rmRqgPxCRfWfZ49ruHIT";
  }
  if (room === "ミーティングルーム") {
    if (start === 9 && end === 12) return "price_1P66sNRqgPxCRfWfPpD56SIt";
    if (start === 9 && end === 17) return "price_1P66sgRqgPxCRfWfD3daXcvU";
    if (start === 9 && end === 21) return "price_1P66swRqgPxCRfWfxlsTCSgI";
    if (start === 13 && end === 17) return "price_1P66tKRqgPxCRfWf8tTwUplP";
    if (start === 13 && end === 21) return "price_1P66txRqgPxCRfWfKQPGZ8Da";
    if (start === 18 && end === 21) return "price_1P66uFRqgPxCRfWfb9dGbYAZ";
  }
  if (room === "インキュベートルーム") return "price_1P69VIRqgPxCRfWfuhUQzhMT";
};

export default CheckPriceId;
