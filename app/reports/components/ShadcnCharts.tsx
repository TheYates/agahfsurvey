"use client";

import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

// Chart colors
const COLORS = [
  "#0a6a74", // Dark teal
  "#22c5bf", // Light teal
  "#e8e5c0", // Beige
  "#f6a050", // Orange
  "#e84e3c", // Red/coral
];

// Pie Chart Component
interface CustomPieChartProps {
  data: Array<{ name: string; value: number }>;
}

export function CustomPieChart({ data }: CustomPieChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color + "80"),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Pie data={chartData} options={options} />
    </div>
  );
}

// Bar Chart Component
interface CustomBarChartProps {
  data: Array<{ name: string; value: number }>;
}

export function CustomBarChart({ data }: CustomBarChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Visits",
        data: data.map((item) => item.value),
        backgroundColor: "#22c5bf",
        borderColor: "#1a9b96",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Stacked Bar Chart Component
interface CustomStackedBarChartProps {
  data: Array<{
    name: string;
    excellent: number;
    veryGood: number;
    good: number;
    fair: number;
    poor: number;
  }>;
}

export function CustomStackedBarChart({ data }: CustomStackedBarChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Excellent",
        data: data.map((item) => item.excellent),
        backgroundColor: COLORS[0],
      },
      {
        label: "Very Good",
        data: data.map((item) => item.veryGood),
        backgroundColor: COLORS[1],
      },
      {
        label: "Good",
        data: data.map((item) => item.good),
        backgroundColor: COLORS[2],
      },
      {
        label: "Fair",
        data: data.map((item) => item.fair),
        backgroundColor: COLORS[3],
      },
      {
        label: "Poor",
        data: data.map((item) => item.poor),
        backgroundColor: COLORS[4],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
