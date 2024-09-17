import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { FC } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false, // 追加
  // aspectRatio: 1, // 追加
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
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export const sampleData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Dataset 1",
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [33, 25, 35, 51, 54, 76],
      fill: false,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
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
export const AreaChart: FC<ChartProps> = ({ data }) => {
  let isAllZero = false;
  if (data) {
    isAllZero = data.datasets.every((dataset) => dataset.data.reduce((a: number, b: number) => a + b, 0) === 0);
  }
  if (!data || isAllZero) {
    return (
      <div className="w-full h-[95%] p-3 flex justify-center items-center">
        <Line options={options} data={sampleData} />
      </div>
    );
  }

  return (
    <div className="w-full h-[95%] p-3 flex justify-center items-center">
      <Line options={options} data={data} />
    </div>
  );
};
