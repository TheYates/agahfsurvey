"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

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
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
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
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading insights...</p>
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
              <ThumbsUp className="h-4 w-4 text-green-500" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-red-500" />
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
            <span
              className={cn(
                "text-xs font-medium",
                surveyData.avgSatisfaction >= 4
                  ? "text-green-500"
                  : surveyData.avgSatisfaction >= 3
                  ? "text-amber-500"
                  : "text-red-500"
              )}
            >
              {surveyData.avgSatisfaction
                ? surveyData.avgSatisfaction.toFixed(1)
                : "0"}{" "}
              / 5
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div
                  key={rating}
                  className={cn(
                    "h-2 w-1/5 rounded-full",
                    rating <= Math.round(surveyData.avgSatisfaction || 0)
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
              ))}
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
                      <Stethoscope size={18} />
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
                                  className="bg-green-500 h-full rounded-full"
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
                      Occupational Health
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

                      <div className="flex justify-between">
                        <span className="text-sm">Area for Improvement:</span>
                        <span className="font-bold">
                          {
                            visitPurposeData.occupationalHealth.bottomDepartment
                              .name
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
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Most Visited Locations
                    </h4>
                    <div className="space-y-2">
                      {visitPurposeData.occupationalHealth.commonLocations.map(
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
                                  className="bg-green-500 h-full rounded-full"
                                  style={{
                                    width: `${
                                      (loc.count /
                                        visitPurposeData.occupationalHealth
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
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  Satisfaction Comparison
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          category: "Overall",
                          "General Practice":
                            visitPurposeData.generalPractice.satisfaction,
                          "Occupational Health":
                            visitPurposeData.occupationalHealth.satisfaction,
                        },
                        {
                          category: "Recommendation",
                          "General Practice":
                            visitPurposeData.generalPractice.recommendRate / 20, // Scale to 0-5
                          "Occupational Health":
                            visitPurposeData.occupationalHealth.recommendRate /
                            20,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip
                        formatter={(value) => [
                          typeof value === "number" ? value.toFixed(2) : value,
                          "",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="General Practice" fill="#4b5563" />
                      <Bar dataKey="Occupational Health" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-medium mb-4">
                      User Type Composition
                    </h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userTypeData.distribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(1)}%`
                            }
                          >
                            {userTypeData.distribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              `${value} responses`,
                              "Count",
                            ]}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium mb-4">
                      User Type Analysis
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Type</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                          <TableHead className="text-right">
                            Percentage
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userTypeData.distribution.map((item, index) => {
                          const total = userTypeData.distribution.reduce(
                            (sum, entry) => sum + entry.value,
                            0
                          );
                          const percentage = total
                            ? ((item.value / total) * 100).toFixed(1)
                            : "0.0";

                          return (
                            <TableRow key={`user-type-${index}`}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {item.value}
                              </TableCell>
                              <TableCell className="text-right">
                                {percentage}%
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

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
                              <span className="bg-primary/10 p-1 rounded mr-2">
                                <Users className="h-4 w-4 text-primary" />
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
                              <span className="bg-primary/10 p-1 rounded mr-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </span>
                              <span>
                                Understanding the distribution helps tailor
                                services to specific workforce needs.
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
                                    ? "text-green-500"
                                    : item.satisfaction >= 3
                                    ? "text-amber-500"
                                    : "text-red-500"
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
                                    ? "text-green-500"
                                    : item.recommendRate >= 50
                                    ? "text-amber-500"
                                    : "text-red-500"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Satisfaction by Visit Recency
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={visitTimeData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip
                          formatter={(value) => [
                            typeof value === "number"
                              ? value.toFixed(2)
                              : value,
                            "Rating",
                          ]}
                        />
                        <Legend />
                        <Bar
                          dataKey="satisfaction"
                          fill="#4b5563"
                          name="Satisfaction Rating"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Recommendation Rate by Visit Recency
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={visitTimeData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value) => [
                            typeof value === "number"
                              ? value.toFixed(1) + "%"
                              : value,
                            "Recommendation Rate",
                          ]}
                        />
                        <Legend />
                        <Bar
                          dataKey="recommendRate"
                          fill="#6b7280"
                          name="Recommendation Rate"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
