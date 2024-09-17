import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { FC } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  maintainAspectRatio: false, // 追加
  // aspectRatio: 1, // 追加
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
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
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May"];
const data1 = [12, 11, 14, 52, 14];
const data2 = [22, 31, 17, 32, 24];

const sampleData = {
  labels, // x軸のラベルの配列
  datasets: [
    {
      label: "Dataset 1", // 凡例
      data: data1, // データの配列(labelsと要素数同じ)
      backgroundColor: "rgba(255, 99, 132, 0.5)", // グラフの棒の色
    },
    {
      label: "Dataset 2",
      data: data2,
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

export const VerticalBar: FC<ChartProps> = ({ data }) => {
  let isAllZero = false;
  if (data) {
    isAllZero = data.datasets.every((dataset) => dataset.data.reduce((a: number, b: number) => a + b, 0) === 0);
  }

  if (!data || isAllZero) {
    return (
      <div className="w-full h-[95%] p-3 flex justify-center items-center">
        <Bar options={options} data={sampleData} />
      </div>
    );
  }

  return (
    <div className="w-full h-[95%] p-3 flex justify-center items-center">
      <Bar options={options} data={data} />
    </div>
  );
};
