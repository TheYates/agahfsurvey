"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Stethoscope,
  Hospital,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DemographicSatisfaction,
  ImprovementArea,
  UserTypeDistribution,
  VisitTimeAnalysis,
} from "@/app/actions/report-actions-enhanced";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  PieController,
  RadarController,
  RadialLinearScale,
} from "chart.js";
import { Chart, Bar, Pie, Line, Radar } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";

// Define custom plugins
const barAveragePlugin = {
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

const legendLabelsPlugin = {
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

const legendValueLabelsPlugin = {
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  PieController,
  RadarController,
  RadialLinearScale,
  barAveragePlugin,
  legendLabelsPlugin,
  legendValueLabelsPlugin
);

interface SurveyData {
  totalResponses: number;
  recommendRate: number;
  avgSatisfaction: number;
  mostCommonPurpose?: string;
  purposeDistribution: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
}

interface OverviewTabProps {
  surveyData: SurveyData;
  isLoading: boolean;
  satisfactionByDemographic: DemographicSatisfaction;
  visitTimeAnalysis: VisitTimeAnalysis[];
  improvementAreas: ImprovementArea[];
  visitPurposeData: any;
  patientTypeData: any;
  visitTimeData: any;
  userTypeData: {
    distribution: UserTypeDistribution[];
    insight: string;
  };
}

const COLORS = [
  "#0a6a74", // Dark teal
  "#22c5bf", // Light teal
  "#e8e5c0", // Beige
  "#f6a050", // Orange
  "#e84e3c", // Red/coral
];

export function OverviewTab({
  surveyData,
  isLoading,
  satisfactionByDemographic,
  visitTimeAnalysis,
  improvementAreas,
  visitPurposeData,
  patientTypeData,
  visitTimeData,
  userTypeData,
}: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            </div>

            <Skeleton className="h-80 w-full mt-8" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find the most common visit time based on count
  const mostCommonVisitTime =
    visitTimeAnalysis && visitTimeAnalysis.length > 0
      ? visitTimeAnalysis.reduce(
          (max, current) => (current.count > max.count ? current : max),
          visitTimeAnalysis[0]
        )
      : { visitTime: "N/A", count: 0, recommendRate: 0 };

  // Get quick wins (high impact + easy to implement)
  const quickWins = improvementAreas.filter((area) => area.isQuickWin);

  // Get critical issues (low satisfaction + high visit count)
  const criticalIssues = improvementAreas.filter((area) => area.isCritical);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Responses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveyData.totalResponses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Surveys completed in selected date range
            </p>
          </CardContent>
        </Card>

        {/* Recommendation Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommendation Rate
            </CardTitle>
            {surveyData.recommendRate >= 75 ? (
              <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveyData.recommendRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Would recommend our facility to others
            </p>
          </CardContent>
        </Card>

        {/* Average Satisfaction Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span
                className={cn(
                  surveyData.avgSatisfaction >= 4
                    ? "text-[#22c5bf]"
                    : surveyData.avgSatisfaction >= 3
                    ? "text-[#f6a050]"
                    : "text-[#e84e3c]"
                )}
              >
                {surveyData.avgSatisfaction
                  ? surveyData.avgSatisfaction.toFixed(1)
                  : "0"}
              </span>
              <span className="text-sm ml-1 text-muted-foreground">/ 5</span>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => {
                let barColor = "bg-muted";
                if (rating <= Math.round(surveyData.avgSatisfaction || 0)) {
                  if (surveyData.avgSatisfaction >= 4) {
                    barColor = "bg-[#22c5bf]"; // teal
                  } else if (surveyData.avgSatisfaction >= 3) {
                    barColor = "bg-[#f6a050]"; // orange
                  } else {
                    barColor = "bg-[#e84e3c]"; // red
                  }
                }
                return (
                  <div
                    key={rating}
                    className={cn("h-2 w-1/5 rounded-full", barColor)}
                  />
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Overall experience rating
            </p>
          </CardContent>
        </Card>

        {/* Most Common Visit Time Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Common Visit Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostCommonVisitTime.visitTime}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostCommonVisitTime.count} visits (
              {mostCommonVisitTime.recommendRate || 0}% recommended)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Visit Purpose Comparison */}
        {visitPurposeData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope size={18} />
                Visit Purpose Comparison
              </CardTitle>
              <CardDescription>
                Comparing experiences between General Practice and Occupational
                Health visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Hospital size={18} />
                      General Practice
                      <Badge variant="outline" className="ml-2">
                        {visitPurposeData.generalPractice.count} visits
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Satisfaction:</span>
                          <span className="font-bold">
                            {typeof visitPurposeData.generalPractice
                              .satisfaction === "number"
                              ? visitPurposeData.generalPractice.satisfaction.toFixed(
                                  1
                                )
                              : visitPurposeData.generalPractice.satisfaction}
                            /5.0
                          </span>
                        </div>
                        <Progress
                          value={
                            typeof visitPurposeData.generalPractice
                              .satisfaction === "number"
                              ? visitPurposeData.generalPractice.satisfaction *
                                20
                              : 0
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Recommendation Rate:</span>
                          <span className="font-bold">
                            {typeof visitPurposeData.generalPractice
                              .recommendRate === "number"
                              ? visitPurposeData.generalPractice.recommendRate.toFixed(
                                  1
                                )
                              : visitPurposeData.generalPractice.recommendRate}
                            %
                          </span>
                        </div>
                        <Progress
                          value={visitPurposeData.generalPractice.recommendRate}
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Top Department:</span>
                        <span className="font-bold">
                          {visitPurposeData.generalPractice.topDepartment.name}
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof visitPurposeData.generalPractice
                              .topDepartment.score === "number"
                              ? visitPurposeData.generalPractice.topDepartment.score.toFixed(
                                  1
                                )
                              : visitPurposeData.generalPractice.topDepartment
                                  .score}
                            /5.0)
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Area for Improvement:</span>
                        <span className="font-bold">
                          {
                            visitPurposeData.generalPractice.bottomDepartment
                              .name
                          }
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof visitPurposeData.generalPractice
                              .bottomDepartment.score === "number"
                              ? visitPurposeData.generalPractice.bottomDepartment.score.toFixed(
                                  1
                                )
                              : visitPurposeData.generalPractice
                                  .bottomDepartment.score}
                            /5.0)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Most Visited Locations
                    </h4>
                    <div className="space-y-2">
                      {visitPurposeData.generalPractice.commonLocations.map(
                        (loc: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{loc.name}</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">
                                {loc.count} visits
                              </span>
                              <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#22c5bf] h-full rounded-full"
                                  style={{
                                    width: `${
                                      (loc.count /
                                        visitPurposeData.generalPractice
                                          .commonLocations[0].count) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Stethoscope size={18} />
                      Medicals
                      <Badge variant="outline" className="ml-2">
                        {visitPurposeData.occupationalHealth.count} visits
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Satisfaction:</span>
                          <span className="font-bold">
                            {typeof visitPurposeData.occupationalHealth
                              .satisfaction === "number"
                              ? visitPurposeData.occupationalHealth.satisfaction.toFixed(
                                  1
                                )
                              : visitPurposeData.occupationalHealth
                                  .satisfaction}
                            /5.0
                          </span>
                        </div>
                        <Progress
                          value={
                            typeof visitPurposeData.occupationalHealth
                              .satisfaction === "number"
                              ? visitPurposeData.occupationalHealth
                                  .satisfaction * 20
                              : 0
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Recommendation Rate:</span>
                          <span className="font-bold">
                            {typeof visitPurposeData.occupationalHealth
                              .recommendRate === "number"
                              ? visitPurposeData.occupationalHealth.recommendRate.toFixed(
                                  1
                                )
                              : visitPurposeData.occupationalHealth
                                  .recommendRate}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            visitPurposeData.occupationalHealth.recommendRate
                          }
                          className="h-2"
                        />
                      </div>

                      {visitPurposeData.occupationalHealth.topDepartment
                        .name !== "Occupational Health Unit (Medicals)" ? (
                        <div className="flex justify-between">
                          <span className="text-sm">Top Department:</span>
                          <span className="font-bold">
                            {
                              visitPurposeData.occupationalHealth.topDepartment
                                .name
                            }
                            <span className="text-sm font-normal ml-1">
                              (
                              {typeof visitPurposeData.occupationalHealth
                                .topDepartment.score === "number"
                                ? visitPurposeData.occupationalHealth.topDepartment.score.toFixed(
                                    1
                                  )
                                : visitPurposeData.occupationalHealth
                                    .topDepartment.score}
                              /5.0)
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-sm">Top Department:</span>
                          <span className="font-bold">
                            N/A
                            <span className="text-sm font-normal ml-1">
                              (Insufficient ratings)
                            </span>
                          </span>
                        </div>
                      )}

                      {visitPurposeData.occupationalHealth.bottomDepartment
                        .name !== "Occupational Health Unit (Medicals)" ? (
                        <div className="flex justify-between">
                          <span className="text-sm">Area for Improvement:</span>
                          <span className="font-bold">
                            {
                              visitPurposeData.occupationalHealth
                                .bottomDepartment.name
                            }
                            <span className="text-sm font-normal ml-1">
                              (
                              {typeof visitPurposeData.occupationalHealth
                                .bottomDepartment.score === "number"
                                ? visitPurposeData.occupationalHealth.bottomDepartment.score.toFixed(
                                    1
                                  )
                                : visitPurposeData.occupationalHealth
                                    .bottomDepartment.score}
                              /5.0)
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-sm">Area for Improvement:</span>
                          <span className="font-bold">
                            N/A
                            <span className="text-sm font-normal ml-1">
                              (Insufficient ratings)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Most Visited Locations
                    </h4>
                    <div className="space-y-2">
                      {visitPurposeData.occupationalHealth.commonLocations
                        .filter(
                          (loc: { name: string }) =>
                            loc.name !== "Occupational Health Unit (Medicals)"
                        )
                        .slice(0, 3)
                        .map(
                          (
                            loc: { name: string; count: number },
                            index: number
                          ) => {
                            // Find the highest count to calculate percentages properly
                            const maxCount = Math.max(
                              ...visitPurposeData.occupationalHealth.commonLocations
                                .filter(
                                  (l: { name: string }) =>
                                    l.name !==
                                    "Occupational Health Unit (Medicals)"
                                )
                                .map((l: { count: number }) => l.count)
                            );

                            return (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <span className="text-sm">{loc.name}</span>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium mr-2">
                                    {loc.count} visits
                                  </span>
                                  <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-[#22c5bf] h-full rounded-full"
                                      style={{
                                        width: `${
                                          (loc.count / maxCount) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      {visitPurposeData.occupationalHealth.commonLocations.filter(
                        (loc: { name: string }) =>
                          loc.name !== "Occupational Health Unit (Medicals)"
                      ).length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          No other locations visited
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  Satisfaction Comparison
                </h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: ["General Practice", "Occupational Health"],
                      datasets: [
                        {
                          label: "Satisfaction",
                          data: [
                            visitPurposeData.generalPractice.satisfaction,
                            visitPurposeData.occupationalHealth.satisfaction,
                          ],
                          backgroundColor: ["#0a6a74", "#22c5bf"],
                          borderColor: ["#0a6a74", "#22c5bf"],
                          tension: 0.3,
                          fill: false,
                          pointBackgroundColor: "#0a6a74",
                          pointRadius: 6,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              const value = context.parsed.y;
                              return `Rating: ${value.toFixed(2)}/5`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Type Comparison */}
        {patientTypeData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={18} />
                Patient & User Type Analysis
              </CardTitle>
              <CardDescription>
                Comparing experiences between different patient types and
                analyzing user demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Users size={18} />
                      New Patients
                      <Badge variant="outline" className="ml-2">
                        {patientTypeData.newPatients.count} patients
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Satisfaction:</span>
                          <span className="font-bold">
                            {typeof patientTypeData.newPatients.satisfaction ===
                            "number"
                              ? patientTypeData.newPatients.satisfaction.toFixed(
                                  1
                                )
                              : patientTypeData.newPatients.satisfaction}
                            /5.0
                          </span>
                        </div>
                        <Progress
                          value={
                            typeof patientTypeData.newPatients.satisfaction ===
                            "number"
                              ? patientTypeData.newPatients.satisfaction * 20
                              : 0
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Recommendation Rate:</span>
                          <span className="font-bold">
                            {typeof patientTypeData.newPatients
                              .recommendRate === "number"
                              ? patientTypeData.newPatients.recommendRate.toFixed(
                                  1
                                )
                              : patientTypeData.newPatients.recommendRate}
                            %
                          </span>
                        </div>
                        <Progress
                          value={patientTypeData.newPatients.recommendRate}
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Top Department:</span>
                        <span className="font-bold">
                          {patientTypeData.newPatients.topDepartment.name}
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof patientTypeData.newPatients.topDepartment
                              .score === "number"
                              ? patientTypeData.newPatients.topDepartment.score.toFixed(
                                  1
                                )
                              : patientTypeData.newPatients.topDepartment.score}
                            /5.0)
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Area for Improvement:</span>
                        <span className="font-bold">
                          {patientTypeData.newPatients.bottomDepartment.name}
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof patientTypeData.newPatients.bottomDepartment
                              .score === "number"
                              ? patientTypeData.newPatients.bottomDepartment.score.toFixed(
                                  1
                                )
                              : patientTypeData.newPatients.bottomDepartment
                                  .score}
                            /5.0)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Users size={18} />
                      Returning Patients
                      <Badge variant="outline" className="ml-2">
                        {patientTypeData.returningPatients.count} patients
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Satisfaction:</span>
                          <span className="font-bold">
                            {typeof patientTypeData.returningPatients
                              .satisfaction === "number"
                              ? patientTypeData.returningPatients.satisfaction.toFixed(
                                  1
                                )
                              : patientTypeData.returningPatients.satisfaction}
                            /5.0
                          </span>
                        </div>
                        <Progress
                          value={
                            typeof patientTypeData.returningPatients
                              .satisfaction === "number"
                              ? patientTypeData.returningPatients.satisfaction *
                                20
                              : 0
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Recommendation Rate:</span>
                          <span className="font-bold">
                            {typeof patientTypeData.returningPatients
                              .recommendRate === "number"
                              ? patientTypeData.returningPatients.recommendRate.toFixed(
                                  1
                                )
                              : patientTypeData.returningPatients.recommendRate}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            patientTypeData.returningPatients.recommendRate
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Top Department:</span>
                        <span className="font-bold">
                          {patientTypeData.returningPatients.topDepartment.name}
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof patientTypeData.returningPatients
                              .topDepartment.score === "number"
                              ? patientTypeData.returningPatients.topDepartment.score.toFixed(
                                  1
                                )
                              : patientTypeData.returningPatients.topDepartment
                                  .score}
                            /5.0)
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Area for Improvement:</span>
                        <span className="font-bold">
                          {
                            patientTypeData.returningPatients.bottomDepartment
                              .name
                          }
                          <span className="text-sm font-normal ml-1">
                            (
                            {typeof patientTypeData.returningPatients
                              .bottomDepartment.score === "number"
                              ? patientTypeData.returningPatients.bottomDepartment.score.toFixed(
                                  1
                                )
                              : patientTypeData.returningPatients
                                  .bottomDepartment.score}
                            /5.0)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Separator className="my-8" />
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Users size={18} />
                  User Type Distribution
                </h3>
                <div className="h-80 w-full">
                  <Pie
                    data={{
                      labels: userTypeData.distribution.map(
                        (item) => item.name
                      ),
                      datasets: [
                        {
                          label: "User Types",
                          data: userTypeData.distribution.map(
                            (item) => item.value
                          ),
                          backgroundColor: userTypeData.distribution.map(
                            (_, index) => COLORS[index % COLORS.length]
                          ),
                          borderColor: userTypeData.distribution.map(
                            (_, index) => COLORS[index % COLORS.length]
                          ),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right" as const,
                          labels: {
                            boxWidth: 15,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              const total = (
                                context.dataset.data as number[]
                              ).reduce((a, b) => a + b, 0);
                              const percentage =
                                total > 0
                                  ? Math.round((value / total) * 100)
                                  : 0;
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                {userTypeData.insight && (
                  <div className="mt-6">
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Insight</AlertTitle>
                      <AlertDescription>
                        {userTypeData.insight}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Key Observations</h4>
                  <ul className="space-y-2 text-sm">
                    {userTypeData.distribution &&
                    userTypeData.distribution.length > 0 ? (
                      <>
                        <li className="flex items-start">
                          <span className="bg-[#0a6a74]/10 p-1 rounded mr-2">
                            <Users className="h-4 w-4 text-[#0a6a74]" />
                          </span>
                          <span>
                            {(() => {
                              const sorted = [
                                ...userTypeData.distribution,
                              ].sort((a, b) => b.value - a.value);
                              const topType = sorted[0];
                              const total = sorted.reduce(
                                (sum, item) => sum + item.value,
                                0
                              );
                              const percentage = total
                                ? ((topType.value / total) * 100).toFixed(1)
                                : "0";

                              return `${topType.name} represents ${percentage}% of all respondents, making it the largest user group.`;
                            })()}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-[#0a6a74]/10 p-1 rounded mr-2">
                            <TrendingUp className="h-4 w-4 text-[#0a6a74]" />
                          </span>
                          <span>
                            Understanding the distribution helps tailor services
                            to specific workforce needs.
                          </span>
                        </li>
                      </>
                    ) : (
                      <li className="text-muted-foreground">
                        No user type data available
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visit Time Analysis */}
        {visitTimeData && visitTimeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} />
                Visit Time Analysis
              </CardTitle>
              <CardDescription>
                How satisfaction varies based on when patients last visited
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  Visit Recency Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {visitTimeData &&
                    visitTimeData.map((item: any, index: number) => (
                      <Card
                        key={item.id}
                        className="border-l-4"
                        style={{
                          borderLeftColor: COLORS[index % COLORS.length],
                        }}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Visits:
                            </span>
                            <span className="font-medium">{item.count}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Satisfaction:
                              </span>
                              <span
                                className={cn(
                                  item.satisfaction >= 4
                                    ? "text-[#22c5bf]"
                                    : item.satisfaction >= 3
                                    ? "text-[#f6a050]"
                                    : "text-[#e84e3c]"
                                )}
                              >
                                {item.satisfaction.toFixed(1)}/5
                              </span>
                            </div>
                            <Progress
                              value={item.satisfaction * 20}
                              className="h-1.5"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Recommend:
                              </span>
                              <span
                                className={cn(
                                  item.recommendRate >= 75
                                    ? "text-[#22c5bf]"
                                    : item.recommendRate >= 50
                                    ? "text-[#f6a050]"
                                    : "text-[#e84e3c]"
                                )}
                              >
                                {item.recommendRate}%
                              </span>
                            </div>
                            <Progress
                              value={item.recommendRate}
                              className="h-1.5"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Satisfaction & Recommendation Rate by Visit Recency
                  </h3>
                  <div className="h-96">
                    <Chart
                      type="bar"
                      data={{
                        labels: visitTimeData.map((item: any) => item.name),
                        datasets: [
                          {
                            type: "bar",
                            label: "Satisfaction Rating",
                            data: visitTimeData.map(
                              (item: any) => item.satisfaction
                            ),
                            backgroundColor: "#4caf50",
                            order: 2,
                            yAxisID: "y",
                          },
                          {
                            type: "line",
                            label: "Recommendation Rate",
                            data: visitTimeData.map(
                              (item: any) => item.recommendRate
                            ),
                            borderColor: "#f6a050",
                            borderWidth: 2,
                            backgroundColor: "#f6a050",
                            pointBackgroundColor: "#f6a050",
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: false,
                            tension: 0.3,
                            order: 1,
                            yAxisID: "y1",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            type: "linear",
                            display: true,
                            position: "left",
                            beginAtZero: true,
                            max: 5,
                            title: {
                              display: true,
                              text: "Satisfaction Rating (0-5)",
                            },
                            ticks: {
                              stepSize: 1,
                              callback: function (value) {
                                return value.toString();
                              },
                            },
                            grid: {
                              drawOnChartArea: true,
                            },
                          },
                          y1: {
                            type: "linear",
                            display: true,
                            position: "right",
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: "Recommendation Rate (%)",
                            },
                            ticks: {
                              callback: function (value) {
                                return value + "%";
                              },
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                        interaction: {
                          mode: "index",
                          intersect: false,
                        },
                        plugins: {
                          legend: {
                            position: "bottom" as const,
                            labels: {
                              usePointStyle: true,
                              pointStyle: "circle" as const,
                              padding: 25,
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                const label = context.dataset.label || "";
                                const value = context.raw as number;

                                if (label === "Satisfaction Rating") {
                                  return `${label}: ${value.toFixed(2)}/5`;
                                } else if (label === "Recommendation Rate") {
                                  return `${label}: ${value.toFixed(1)}%`;
                                }
                                return `${label}: ${value}`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Critical issues and quick wins badges */}
        {criticalIssues.length > 0 && (
          <Alert className="mb-4 border-[#e84e3c]/50 bg-[#e84e3c]/5">
            <AlertTriangle className="h-4 w-4 text-[#e84e3c]" />
            <AlertTitle className="text-[#e84e3c]">Critical Issues</AlertTitle>
            <AlertDescription>
              {criticalIssues.length} critical issues identified that require
              immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {quickWins.length > 0 && (
          <Alert className="mb-4 border-[#22c5bf]/50 bg-[#22c5bf]/5">
            <CheckCircle2 className="h-4 w-4 text-[#22c5bf]" />
            <AlertTitle className="text-[#22c5bf]">Quick Wins</AlertTitle>
            <AlertDescription>
              {quickWins.length} easy-to-implement improvements with high
              impact.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
