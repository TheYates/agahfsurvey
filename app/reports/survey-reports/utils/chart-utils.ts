// Chart colors for consistent styling
export const COLORS = [
  "#0a6a74", // Dark teal
  "#22c5bf", // Light teal
  "#e8e5c0", // Beige
  "#f6a050", // Orange
  "#e84e3c", // Red/coral
];

// Convert numeric satisfaction to text
export const satisfactionToText = (score: number): string => {
  if (score >= 4.5) return "Excellent";
  if (score >= 3.5) return "Very Good";
  if (score >= 2.5) return "Good";
  if (score >= 1.5) return "Fair";
  return "Poor";
};

// Define custom plugins for ChartJS
export const barAveragePlugin = {
  id: "barAverage",
  afterDraw: (chart: any) => {
    const { ctx, legend } = chart;
    if (!legend || !legend.legendItems) return;

    const dataset = chart.data.datasets[0];
    const values = dataset.data;
    const avg = values.length
      ? values.reduce((sum: number, val: number) => sum + val, 0) /
        values.length
      : 0;

    const formattedAvg = `Avg: ${avg.toFixed(2)}/5`;

    const legendItem = legend.legendItems[0];
    if (legendItem) {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#666";
      ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

      const textX = legendItem.x + legendItem.width + 15;
      const textY = legendItem.y + legendItem.height / 2;

      ctx.fillText(formattedAvg, textX, textY);
    }
  },
};

export const legendLabelsPlugin = {
  id: "legendLabels",
  afterDraw: (chart: any) => {
    const { ctx, legend } = chart;
    if (!legend || !legend.legendItems) return;

    const data = chart.data;
    const dataset = data.datasets[0];
    const total = dataset.data.reduce(
      (sum: number, val: number) => sum + val,
      0
    );

    legend.legendItems.forEach((legendItem: any, i: number) => {
      const value = dataset.data[i];
      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#666";
      ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

      const textX = legendItem.x + legendItem.width + 10;
      const textY = legendItem.y + legendItem.height / 2;

      ctx.fillText(`${value} (${percentage}%)`, textX, textY);
    });
  },
};

export const legendValueLabelsPlugin = {
  id: "legendValueLabels",
  afterDraw: (chart: any) => {
    const { ctx, legend } = chart;
    if (!legend || !legend.legendItems) return;

    const datasets = chart.data.datasets;

    datasets.forEach((dataset: any, i: number) => {
      const values = dataset.data as number[];
      const avg = values.length
        ? values.reduce((sum: number, val: number) => sum + val, 0) /
          values.length
        : 0;

      const formattedAvg =
        dataset.label === "Satisfaction Rating"
          ? `Avg: ${avg.toFixed(2)}/5`
          : `Avg: ${avg.toFixed(1)}%`;

      const legendItem = legend.legendItems[i];
      if (legendItem) {
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#666";
        ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

        const textX = legendItem.x + legendItem.width + 15;
        const textY = legendItem.y + legendItem.height / 2;

        ctx.fillText(formattedAvg, textX, textY);
      }
    });
  },
};
