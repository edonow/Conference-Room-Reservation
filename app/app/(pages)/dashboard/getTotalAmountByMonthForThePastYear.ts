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

export const TotalAmountByMonthForThePastYear_Bar = (accessToken: string | null) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken != null) {
        adminGetAllReservationnfo_by_accessToken(accessToken)
          .then((res) => {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const now = new Date();

            // Initialize monthlyPrices with 0 for each month
            const monthlyPrices: Record<string, number> = {};
            for (let i = 1; i <= 12; i++) {
              monthlyPrices[i] = 0;
            }

            res
              .filter((reservation: { date: string; room: string }) => {
                const reservationDate = new Date(reservation.date);
                return (
                  reservation.room !== "インキュベートルーム" && reservationDate >= oneYearAgo && reservationDate <= now
                );
              })
              .forEach((reservation: { date: string; price: number }) => {
                const month = new Date(reservation.date).getMonth() + 1;
                monthlyPrices[month] += reservation.price;
              });

            const currentMonth = new Date().getMonth() + 1;
            const labels = [];
            const data = [];
            for (let i = 0; i < 12; i++) {
              const month = ((currentMonth + i) % 12) + 1;
              labels.push(`${month}月`);
              data.push(monthlyPrices[month]);
            }

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
