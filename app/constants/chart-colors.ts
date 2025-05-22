"use client";

import { useTheme } from "next-themes";

// Function to convert HSL values from CSS variables to hex color
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Function to get CSS variable value
const getCssVar = (variableName: string): string => {
  if (typeof window === "undefined") return "";

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return value;
};

// Parse CSS variable in the format "h s% l%"
const parseCssHsl = (variable: string): { h: number; s: number; l: number } => {
  const values = getCssVar(variable).split(" ");
  return {
    h: parseFloat(values[0]),
    s: parseFloat(values[1]),
    l: parseFloat(values[2]),
  };
};

export const useChartColors = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Generate colors based on theme
  const colors = {
    // Primary colors
    teal: isDark ? hslToHex(180, 70, 40) : "#0d6354",
    mint: isDark ? hslToHex(175, 65, 45) : "#16a89e",
    lightBlue: isDark ? hslToHex(190, 60, 60) : "#7fc7c0",
    cream: isDark ? hslToHex(45, 70, 70) : "#e1d289",
    orange: isDark ? hslToHex(35, 90, 60) : "#f5a742",
    red: isDark ? hslToHex(10, 75, 55) : "#e94f37",

    // Additional chart colors
    blue: isDark ? hslToHex(210, 80, 60) : "#2196f3",
    purple: isDark ? hslToHex(260, 50, 65) : "#8884d8",
    green: isDark ? hslToHex(120, 60, 50) : "#4caf50",
  };

  // Sequential array for charts
  const sequence = [
    colors.teal,
    colors.mint,
    colors.lightBlue,
    colors.blue,
    colors.purple,
    colors.cream,
    colors.orange,
    colors.red,
    colors.green,
  ];

  return {
    ...colors,
    sequence,
  };
};

// For backward compatibility, provide a static version
export const CHART_COLORS = {
  // Primary colors
  teal: "var(--chart-1)",
  mint: "var(--chart-2)",
  lightBlue: "var(--chart-3)",
  cream: "var(--chart-4)",
  orange: "var(--chart-5)",
  red: "#e94f37",

  // Additional chart colors
  blue: "#2196f3",
  purple: "#8884d8",
  green: "#4caf50",

  // Sequential array for charts
  sequence: [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "#2196f3",
    "#8884d8",
    "var(--chart-4)",
    "var(--chart-5)",
    "#e94f37",
    "#4caf50",
  ],
};
