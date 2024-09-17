import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false, // 追加

  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          size: 10,
        },
        boxWidth: 8,
        padding: 15,
      },
    },
    title: {
      display: false,
      text: "Usage situation of each room",
      font: {
        size: 20,
      },
    },
  },
};

export const sampleData = {
  labels: ["RoomA", "RoomB", "RoomC", "RoomD", "RoomE"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2],
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
};

type ChartProps = {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  } | null; // nullを許容
};

export const DoughnutChart: FC<ChartProps> = ({ data }) => {
  let isAllZero = false;
  if (data) {
    isAllZero = data.datasets.every((dataset) => dataset.data.reduce((a: number, b: number) => a + b, 0) === 0);
  }

  if (!data || isAllZero) {
    return (
      <div className="w-full h-[95%] p-3 flex justify-center items-center">
        <Doughnut options={options} data={sampleData} />
      </div>
    );
  }

  return (
    <div className="w-full h-[95%] p-3 flex justify-center items-center">
      <Doughnut options={options} data={data} />
    </div>
  );
};
