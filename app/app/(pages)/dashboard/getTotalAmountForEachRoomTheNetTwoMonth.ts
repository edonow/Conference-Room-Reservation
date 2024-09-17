import { adminGetAllReservationnfo_by_accessToken } from "@/app/utils/functions";
import { useEffect, useState } from "react";

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};
export const TotalAmountForEachRoomTheNetTwoMonth_for_Bar = (accessToken: string | null) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken != null) {
        adminGetAllReservationnfo_by_accessToken(accessToken)
          .then((res) => {
            const roomLabels: Record<string, string> = {
              プレゼンテーションルーム: "プレ全体",
              プレゼンテーションルームA: "プレA",
              プレゼンテーションルームB: "プレB",
              研修室: "研修室",
              ミーティングルーム: "ミーティングルーム",
            };

            const now = new Date();
            const twoMonthsLater = new Date();
            twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

            const roomPrices = res
              .filter((reservation: { room: string; date: string }) => {
                const reservationDate = new Date(reservation.date);
                return (
                  reservation.room !== "インキュベートルーム" &&
                  reservationDate >= now &&
                  reservationDate <= twoMonthsLater
                );
              })
              .reduce((prices: Record<string, number>, reservation: { room: string; price: number }) => {
                const room = reservation.room;
                if (!prices[room]) {
                  prices[room] = 0;
                }
                prices[room] += reservation.price;
                return prices;
              }, {});

            // ラベルとデータを生成
            const labels = Object.keys(roomLabels).map((room) => roomLabels[room]);
            const data = Object.keys(roomLabels).map((room) => roomPrices[room] || 0);

            setChartData({
              labels,
              datasets: [
                {
                  label: "Total Price",
                  data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
    fetchData();
  }, [accessToken]);

  return chartData;
};
