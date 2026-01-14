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
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Stethoscope,
  Hospital,
  Star,
  Info,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DemographicSatisfaction,
  ImprovementArea,
  UserTypeDistribution,
  VisitTimeAnalysis,
} from "@/app/actions/overview-actions";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pie as ChartJSPie, Bar as ChartJSBar } from "react-chartjs-2";
import "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "../utils/chart-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define custom plugins
// const barAveragePlugin = {
//   id: "barAverage",
//   afterDraw: (chart: any) => {
//     const { ctx, legend } = chart;
//     if (!legend || !legend.legendItems) return;

//     const dataset = chart.data.datasets[0];
//     const values = dataset.data;
//     const avg = values.length
//       ? values.reduce((sum: number, val: number) => sum + val, 0) /
//         values.length
//       : 0;

//     const formattedAvg = `Avg: ${avg.toFixed(2)}/5`;

//     const legendItem = legend.legendItems[0];
//     if (legendItem) {
//       ctx.textAlign = "left";
//       ctx.textBaseline = "middle";
//       ctx.fillStyle = "#666";
//       ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

//       const textX = legendItem.x + legendItem.width + 15;
//       const textY = legendItem.y + legendItem.height / 2;

//       ctx.fillText(formattedAvg, textX, textY);
//     }
//   },
// };

// const legendLabelsPlugin = {
//   id: "legendLabels",
//   afterDraw: (chart: any) => {
//     const { ctx, legend } = chart;
//     if (!legend || !legend.legendItems) return;

//     const data = chart.data;
//     const dataset = data.datasets[0];
//     const total = dataset.data.reduce(
//       (sum: number, val: number) => sum + val,
//       0
//     );

//     legend.legendItems.forEach((legendItem: any, i: number) => {
//       const value = dataset.data[i];
//       const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

//       ctx.textAlign = "left";
//       ctx.textBaseline = "middle";
//       ctx.fillStyle = "#666";
//       ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

//       const textX = legendItem.x + legendItem.width + 10;
//       const textY = legendItem.y + legendItem.height / 2;

//       ctx.fillText(`${value} (${percentage}%)`, textX, textY);
//     });
//   },
// };

// const legendValueLabelsPlugin = {
//   id: "legendValueLabels",
//   afterDraw: (chart: any) => {
//     const { ctx, legend } = chart;
//     if (!legend || !legend.legendItems) return;

//     const datasets = chart.data.datasets;

//     datasets.forEach((dataset: any, i: number) => {
//       const values = dataset.data as number[];
//       const avg = values.length
//         ? values.reduce((sum: number, val: number) => sum + val, 0) /
//           values.length
//         : 0;

//       const formattedAvg =
//         dataset.label === "Satisfaction Rating"
//           ? `Avg: ${avg.toFixed(2)}/5`
//           : `Avg: ${avg.toFixed(1)}%`;

//       const legendItem = legend.legendItems[i];
//       if (legendItem) {
//         ctx.textAlign = "left";
//         ctx.textBaseline = "middle";
//         ctx.fillStyle = "#666";
//         ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';

//         const textX = legendItem.x + legendItem.width + 15;
//         const textY = legendItem.y + legendItem.height / 2;

//         ctx.fillText(formattedAvg, textX, textY);
//       }
//     });
//   },
// };

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

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
  generalObservationStats?: {
    cleanliness: number;
    facilities: number;
    security: number;
    overall: number;
    [key: string]: number;
  };
}

interface NPSData {
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
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
  npsData?: NPSData;
  locations?: Array<{
    id: string;
    name: string;
    type: string;
    satisfaction: number;
    visitCount: number;
    recommendRate: number;
  }>;
  outpatientRecommendationRate?: number;
  inpatientRecommendationRate?: number;
}

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
  npsData,
  locations,
  outpatientRecommendationRate,
  inpatientRecommendationRate,
}: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
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

  // Unused variables removed to clean up the code

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Total Responses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Total Responses
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={14} className="text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Total number of survey submissions across all service
                      points within the selected date range.
                    </p>
                  </TooltipContent>
                </Tooltip>
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

          {/* Out-Patient Recommendation Rate Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Out-Patient Recommendation Rate
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={14} className="text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Fetches submissions from departments, occupational health, and canteen.
                      Counts how many respondents said "Yes" to recommending.
                      Divides by total submissions and multiplies by 100.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Out-patient includes: departments, occupational health unit, and canteen
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              {(outpatientRecommendationRate || 0) >= 75 ? (
                <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
              ) : (
                <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(outpatientRecommendationRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Out-patient recommendation rate
              </p>
            </CardContent>
          </Card>

          {/* In-Patient Recommendation Rate Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                In-Patient Recommendation Rate
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={14} className="text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Fetches submissions from wards.
                      Counts how many respondents said "Yes" to recommending.
                      Divides by total submissions and multiplies by 100.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      In-patient includes: all ward services
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              {(inpatientRecommendationRate || 0) >= 75 ? (
                <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
              ) : (
                <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(inpatientRecommendationRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                In-patient recommendation rate
              </p>
            </CardContent>
          </Card>

          {/* NPS Score Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Net Promoter Score
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={14} className="text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      NPS measures customer loyalty. Score = (% Promoters (9-10)
                      - % Detractors (0-6) + 100) / 2. Range: 0% to 100%. Above 50%
                      is good, above 75% is excellent.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{npsData?.score || 0}%</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-[#22c5bf]" />
                    <span className="font-medium">
                      {npsData?.promoters || 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#22c5bf]">Promoters</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 flex items-center justify-center">
                      <div className="h-0.5 w-2 bg-[#f6a050]" />
                    </div>
                    <span className="font-medium">
                      {npsData?.passives || 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#f6a050]">Passives</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3 text-[#e84e3c]" />
                    <span className="font-medium">
                      {npsData?.detractors || 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#e84e3c]">Detractors</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Common Visit Time Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Most Common Visit Time
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={14} className="text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Time period with the highest number of visits. Shows which
                      visit frequency is most common among respondents.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostCommonVisitTime.visitTime === "first-time"
                  ? "First time visiting"
                  : mostCommonVisitTime.visitTime === "less-than-month"
                    ? "< 1 month ago"
                    : mostCommonVisitTime.visitTime === "one-two-months"
                      ? "1-2 months ago"
                      : mostCommonVisitTime.visitTime === "three-six-months"
                        ? "3-6 months ago"
                        : mostCommonVisitTime.visitTime === "more-than-six-months"
                          ? "> 6 months ago"
                          : mostCommonVisitTime.visitTime}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                {mostCommonVisitTime.count} visits (
                {mostCommonVisitTime.recommendRate || 0}% recommended)
              </p> */}
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Info size={14} className="text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>
                        Compares satisfaction metrics between General Practice
                        visits and Occupational Health/Medicals visits. Metrics
                        are calculated separately for each visit purpose.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Comparing experiences between General Practice and
                  Occupational Health visits
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
                            <span className="text-sm flex items-center gap-1">
                              Overall Satisfaction:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Average of all ratings (reception,
                                    professionalism, understanding, promptness,
                                    overall, etc.) across all locations visited
                                    for General Practice visits. Patients rate
                                    from "Excellent" (5) to "Poor" (1).
                                    Calculated as: Sum of all ratings Ã· Number
                                    of ratings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
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
                                ? visitPurposeData.generalPractice
                                  .satisfaction * 20
                                : 0
                            }
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm flex items-center gap-1">
                              Recommendation Rate:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Percentage of General Practice patients who
                                    answered "Yes" to "Would you recommend our
                                    facility to others?" Calculated as: (Number
                                    of "Yes" responses Ã· Total responses) Ã—
                                    100.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="font-bold">
                              {typeof visitPurposeData.generalPractice
                                .recommendRate === "number"
                                ? visitPurposeData.generalPractice.recommendRate.toFixed(
                                  1
                                )
                                : visitPurposeData.generalPractice
                                  .recommendRate}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              visitPurposeData.generalPractice.recommendRate
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">Top Department:</span>
                          <span className="font-bold">
                            {
                              visitPurposeData.generalPractice.topDepartment
                                .name
                            }
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
                                      width: `${(loc.count /
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
                            <span className="text-sm flex items-center gap-1">
                              Overall Satisfaction:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Average of all ratings (reception,
                                    professionalism, understanding, promptness,
                                    overall, etc.) across all locations visited
                                    for Occupational Health visits. Patients
                                    rate from "Excellent" (5) to "Poor" (1).
                                    Calculated as: Sum of all ratings Ã· Number
                                    of ratings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
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
                            <span className="text-sm flex items-center gap-1">
                              Recommendation Rate:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Percentage of Occupational Health patients
                                    who answered "Yes" to "Would you recommend
                                    our facility to others?" Calculated as:
                                    (Number of "Yes" responses Ã· Total
                                    responses) Ã— 100.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
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
                                visitPurposeData.occupationalHealth
                                  .topDepartment.name
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
                            <span className="text-sm">
                              Area for Improvement:
                            </span>
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
                            <span className="text-sm">
                              Area for Improvement:
                            </span>
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
                                          width: `${(loc.count / maxCount) * 100
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Info size={14} className="text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>
                        Compares satisfaction and recommendation rates between
                        new and returning patients. User type distribution shows
                        the breakdown of respondents by employment category.
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
                          {satisfactionByDemographic.byPatientType.find(
                            (item) => item.patientType === "New Patient"
                          )?.count || 0}{" "}
                          patients
                        </Badge>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm flex items-center gap-1">
                              Overall Satisfaction:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Average of all ratings (reception,
                                    professionalism, understanding, promptness,
                                    overall, etc.) across all locations visited
                                    by new patients. Patients rate from
                                    "Excellent" (5) to "Poor" (1). Calculated
                                    as: Sum of all ratings from new patients Ã·
                                    Number of ratings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="font-bold">
                              {satisfactionByDemographic.byPatientType
                                .find(
                                  (item) => item.patientType === "New Patient"
                                )
                                ?.satisfaction.toFixed(1) || "0.0"}
                              /5.0
                            </span>
                          </div>
                          <Progress
                            value={
                              (satisfactionByDemographic.byPatientType.find(
                                (item) => item.patientType === "New Patient"
                              )?.satisfaction || 0) * 20
                            }
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm flex items-center gap-1">
                              Recommendation Rate:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Percentage of new patients who answered
                                    "Yes" to "Would you recommend our facility
                                    to others?" Calculated as: (Number of "Yes"
                                    responses from new patients Ã· Total new
                                    patient responses) Ã— 100.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="font-bold">
                              {satisfactionByDemographic.byPatientType.find(
                                (item) => item.patientType === "New Patient"
                              )?.recommendRate || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              satisfactionByDemographic.byPatientType.find(
                                (item) => item.patientType === "New Patient"
                              )?.recommendRate || 0
                            }
                            className="h-2"
                          />
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
                          {satisfactionByDemographic.byPatientType.find(
                            (item) => item.patientType === "Returning Patient"
                          )?.count || 0}{" "}
                          patients
                        </Badge>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm flex items-center gap-1">
                              Overall Satisfaction:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Average of all ratings (reception,
                                    professionalism, understanding, promptness,
                                    overall, etc.) across all locations visited
                                    by returning patients. Patients rate from
                                    "Excellent" (5) to "Poor" (1). Calculated
                                    as: Sum of all ratings from returning
                                    patients Ã· Number of ratings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="font-bold">
                              {satisfactionByDemographic.byPatientType
                                .find(
                                  (item) =>
                                    item.patientType === "Returning Patient"
                                )
                                ?.satisfaction.toFixed(1) || "0.0"}
                              /5.0
                            </span>
                          </div>
                          <Progress
                            value={
                              (satisfactionByDemographic.byPatientType.find(
                                (item) =>
                                  item.patientType === "Returning Patient"
                              )?.satisfaction || 0) * 20
                            }
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm flex items-center gap-1">
                              Recommendation Rate:
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Info
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>
                                    Percentage of returning patients who
                                    answered "Yes" to "Would you recommend our
                                    facility to others?" Calculated as: (Number
                                    of "Yes" responses from returning patients
                                    Ã· Total returning patient responses) Ã—
                                    100.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="font-bold">
                              {satisfactionByDemographic.byPatientType.find(
                                (item) =>
                                  item.patientType === "Returning Patient"
                              )?.recommendRate || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              satisfactionByDemographic.byPatientType.find(
                                (item) =>
                                  item.patientType === "Returning Patient"
                              )?.recommendRate || 0
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Separator className="my-8" />

                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users size={18} />
                    User Type Distribution & General Observations
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-[400px] w-full">
                      <ChartJSPie
                        data={{
                          labels: satisfactionByDemographic.byUserType.map(
                            (item) => item.userType
                          ),
                          datasets: [
                            {
                              data: satisfactionByDemographic.byUserType.map(
                                (item) => item.count
                              ),
                              backgroundColor: COLORS,
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </div>

                    <div className="h-[400px] w-full">
                      <ChartJSBar
                        data={{
                          labels: [
                            "Cleanliness",
                            "Facilities",
                            "Security",
                            "Overall",
                          ],
                          datasets: [
                            {
                              label: "Rating",
                              data: [
                                surveyData.generalObservationStats
                                  ?.cleanliness || 0,
                                surveyData.generalObservationStats
                                  ?.facilities || 0,
                                surveyData.generalObservationStats?.security ||
                                0,
                                surveyData.generalObservationStats?.overall ||
                                0,
                              ],
                              backgroundColor: "#22c5bf",
                              borderRadius: 4,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 5,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Separator className="my-8" />

                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Recommendation Rate by User Type & Rating Details
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium mb-3">
                        Recommendation Rate by User Type
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User Type</TableHead>
                            <TableHead className="text-right">
                              Recommend Rate
                            </TableHead>
                            <TableHead className="text-right">Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {satisfactionByDemographic.byUserType.map(
                            (item, index) => (
                              <TableRow key={`user-type-recommend-${index}`}>
                                <TableCell>{item.userType}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end gap-1">
                                    <span
                                      className={cn(
                                        "font-medium text-sm",
                                        item.recommendRate >= 75
                                          ? "text-[#22c5bf]"
                                          : "text-[#e84e3c]"
                                      )}
                                    >
                                      {item.recommendRate}%
                                    </span>
                                    <div className="flex items-center gap-1 w-full justify-end">
                                      <span className="text-xs text-[#22c5bf]">
                                        {Math.round(
                                          (item.count * item.recommendRate) /
                                          100
                                        )}
                                      </span>
                                      <Progress
                                        value={item.recommendRate}
                                        className={cn(
                                          "h-1.5 w-16",
                                          item.recommendRate >= 75
                                            ? "bg-[#22c5bf]/20"
                                            : "bg-[#e84e3c]/20"
                                        )}
                                      />
                                      <span className="text-xs text-[#e84e3c]">
                                        {Math.round(
                                          (item.count *
                                            (100 - item.recommendRate)) /
                                          100
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.count}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium mb-3">
                        Rating Details
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            id: "cleanliness",
                            label: "Cleanliness/serenity",
                          },
                          { id: "facilities", label: "Facilities" },
                          { id: "security", label: "Security" },
                          { id: "overall", label: "Overall impression" },
                        ].map((category) => {
                          const rating =
                            surveyData.generalObservationStats?.[category.id] ||
                            0;
                          return (
                            <div key={category.id} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">
                                  {category.label}
                                </span>
                                <span className="text-sm font-medium">
                                  {rating.toFixed(1)}/5.0
                                  <span className="text-xs ml-1 text-muted-foreground">
                                    ({valueToRating(rating)})
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={rating * 20}
                                className={cn(
                                  "h-2",
                                  rating >= 4
                                    ? "bg-[#22c5bf]/30"
                                    : rating >= 3
                                      ? "bg-[#f6a050]/30"
                                      : "bg-[#e84e3c]/30"
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 space-y-4">
                        <h4 className="text-sm font-medium">Key Insights</h4>
                        <ul className="space-y-2 text-sm">
                          {surveyData.generalObservationStats ? (
                            <>
                              <li className="flex items-start">
                                <span className="bg-[#22c5bf]/10 p-1 rounded mr-2">
                                  <Star className="h-4 w-4 text-[#22c5bf]" />
                                </span>
                                <span>
                                  {(() => {
                                    const categories = [
                                      {
                                        id: "cleanliness",
                                        label: "Cleanliness/serenity",
                                      },
                                      { id: "facilities", label: "Facilities" },
                                      { id: "security", label: "Security" },
                                      {
                                        id: "overall",
                                        label: "Overall impression",
                                      },
                                    ];
                                    const stats =
                                      surveyData.generalObservationStats || {};
                                    const topCategory = categories.reduce(
                                      (max, curr) => {
                                        if (!stats[curr.id] || !stats[max.id])
                                          return max;
                                        return stats[curr.id] > stats[max.id]
                                          ? curr
                                          : max;
                                      },
                                      categories[0]
                                    );
                                    return `${topCategory.label
                                      } is our highest-rated area with ${stats[topCategory.id]?.toFixed(1) || "0.0"
                                      }/5.0 score.`;
                                  })()}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-[#f6a050]/10 p-1 rounded mr-2">
                                  <AlertTriangle className="h-4 w-4 text-[#f6a050]" />
                                </span>
                                <span>
                                  {(() => {
                                    const categories = [
                                      {
                                        id: "cleanliness",
                                        label: "Cleanliness/serenity",
                                      },
                                      { id: "facilities", label: "Facilities" },
                                      { id: "security", label: "Security" },
                                      {
                                        id: "overall",
                                        label: "Overall impression",
                                      },
                                    ];
                                    const stats =
                                      surveyData.generalObservationStats || {};
                                    const lowestCategory = categories.reduce(
                                      (min, curr) => {
                                        if (!stats[curr.id] || !stats[min.id])
                                          return min;
                                        return stats[curr.id] < stats[min.id]
                                          ? curr
                                          : min;
                                      },
                                      categories[0]
                                    );
                                    return `${lowestCategory.label
                                      } may need attention with ${stats[lowestCategory.id]?.toFixed(1) ||
                                      "0.0"
                                      }/5.0 score.`;
                                  })()}
                                </span>
                              </li>
                            </>
                          ) : (
                            <li className="text-muted-foreground">
                              No general observation data available
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Info size={14} className="text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>
                        Analyzes how satisfaction varies based on visit recency.
                        Metrics show how recently patients visited the facility
                        and how this correlates with their satisfaction and
                        likelihood to recommend.
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                              {item.id === "first-time"
                                ? "First time visiting"
                                : item.id === "less-than-month"
                                  ? "< 1 month ago"
                                  : item.id === "one-two-months"
                                    ? "1-2 months ago"
                                    : item.id === "three-six-months"
                                      ? "3-6 months ago"
                                      : item.id === "more-than-six-months"
                                        ? "> 6 months ago"
                                        : item.name}
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
                                  {!isNaN(item.satisfaction)
                                    ? item.satisfaction.toFixed(1)
                                    : "0.0"}
                                  /5
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
