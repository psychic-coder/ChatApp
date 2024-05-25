import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  CategoryScale,
} from "chart.js";
import { orange, orangeLight, purple, purpleLight } from "../../../constants/color";
import { getLast7Days } from "../../../lib/features";

ChartJS.register(
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  CategoryScale
);

const lineChartOptions = {
  responsive: "true",
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};
const labels = getLast7Days();
export const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: value,
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout:120,
};

export const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [purpleLight,orangeLight],
        borderColor: [purple, orange],
        offset:30,
        hoverBackgroundColor:[purple,orange]
      },
    ],
  };
  return <Doughnut style={{
    zIndex:10
  }} data={data} options={doughnutChartOptions} />;
};
