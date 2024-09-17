import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { FC } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 20,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "right" as const,
    },
    title: {
      display: false,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May"];
const data1 = [12, 11, 14, 52, 14];
const data2 = [22, 31, 17, 32, 24];

export const sampleData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: data1,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: data2,
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

export const HorizontalBar: FC<ChartProps> = ({ data }) => {
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
    <div className="w-full h-[90%] p-3 flex justify-center items-center">
      <Bar options={options} data={data} />
    </div>
  );
};
