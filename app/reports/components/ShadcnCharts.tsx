"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Pie Chart Component
interface CustomPieChartProps {
  data: Array<{ name: string; value: number }>;
}

export function CustomPieChart({ data }: CustomPieChartProps) {
  const chartConfig = {
    value: {
      label: "Count",
    },
    excellent: {
      label: "Excellent",
      color: "hsl(var(--chart-1))",
    },
    veryGood: {
      label: "Very Good",
      color: "hsl(var(--chart-2))",
    },
    good: {
      label: "Good",
      color: "hsl(var(--chart-3))",
    },
    fair: {
      label: "Fair",
      color: "hsl(var(--chart-4))",
    },
    poor: {
      label: "Poor",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

// Bar Chart Component
interface CustomBarChartProps {
  data: Array<{ name: string; value: number }>;
}

export function CustomBarChart({ data }: CustomBarChartProps) {
  const chartConfig = {
    value: {
      label: "Visit Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
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
  const chartConfig = {
    excellent: {
      label: "Excellent",
      color: "hsl(var(--chart-1))",
    },
    veryGood: {
      label: "Very Good",
      color: "hsl(var(--chart-2))",
    },
    good: {
      label: "Good",
      color: "hsl(var(--chart-3))",
    },
    fair: {
      label: "Fair",
      color: "hsl(var(--chart-4))",
    },
    poor: {
      label: "Poor",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart layout="vertical" data={data}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="excellent" stackId="a" fill="hsl(var(--chart-1))" />
        <Bar dataKey="veryGood" stackId="a" fill="hsl(var(--chart-2))" />
        <Bar dataKey="good" stackId="a" fill="hsl(var(--chart-3))" />
        <Bar dataKey="fair" stackId="a" fill="hsl(var(--chart-4))" />
        <Bar dataKey="poor" stackId="a" fill="hsl(var(--chart-5))" />
      </BarChart>
    </ChartContainer>
  );
}
