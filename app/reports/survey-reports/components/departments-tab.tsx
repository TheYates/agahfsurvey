"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertTriangle,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  fetchDepartmentConcerns,
  fetchAllSurveyData,
  fetchVisitTimeData,
  fetchPatientTypeData,
  fetchRecommendations,
  DepartmentConcern,
  Recommendation,
} from "@/app/actions/report-actions-enhanced";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentRating {
  reception?: string;
  professionalism?: string;
  understanding?: string;
  "promptness-care"?: string;
  "promptness-feedback"?: string;
  overall?: string;
}

interface Department {
  id: string;
  name: string;
  type: string;
  visitCount: number;
  satisfaction: number;
  recommendRate: number;
  ratings: {
    reception: number;
    professionalism: number;
    understanding: number;
    "promptness-care": number;
    "promptness-feedback": number;
    overall: number;
  };
}

interface DepartmentsTabProps {
  isLoading: boolean;
  departments: Department[];
}

// Convert rating text to numeric value
const ratingToValue = (rating: string): number => {
  switch (rating) {
    case "Excellent":
      return 5;
    case "Very Good":
      return 4;
    case "Good":
      return 3;
    case "Fair":
      return 2;
    case "Poor":
      return 1;
    default:
      return 0;
  }
};

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

export function DepartmentsTab({
  isLoading,
  departments,
}: DepartmentsTabProps) {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [departmentConcerns, setDepartmentConcerns] = useState<
    DepartmentConcern[]
  >([]);
  const [departmentRecommendations, setDepartmentRecommendations] = useState<
    Recommendation[]
  >([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [satisfactionTrend, setSatisfactionTrend] = useState<any[]>([]);
  const [visitTimeData, setVisitTimeData] = useState<any[]>([]);
  const [patientTypeData, setPatientTypeData] = useState<any>(null);
  const [isLoadingAdditionalData, setIsLoadingAdditionalData] = useState(false);

  // Fetch department concerns and recommendations
  useEffect(() => {
    const loadDepartmentFeedback = async () => {
      setIsLoadingConcerns(true);
      try {
        const concerns = await fetchDepartmentConcerns();
        setDepartmentConcerns(concerns);

        const recommendations = await fetchRecommendations();

        setDepartmentRecommendations(recommendations);
      } catch (error) {
        setDepartmentConcerns([]);
        setDepartmentRecommendations([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadDepartmentFeedback();
  }, []);

  // Fetch additional metrics data
  useEffect(() => {
    const loadAdditionalData = async () => {
      setIsLoadingAdditionalData(true);
      try {
        // Fetch visit time data for calculating average visit times
        const timeData = await fetchVisitTimeData();

        setVisitTimeData(timeData);

        // Fetch patient type data for returning rates
        const ptData = await fetchPatientTypeData();
        setPatientTypeData(ptData);
      } catch (error) {
      } finally {
        setIsLoadingAdditionalData(false);
      }
    };

    loadAdditionalData();
  }, []);

  // Generate satisfaction trend based on available survey data
  useEffect(() => {
    const generateSatisfactionTrend = async () => {
      try {
        const surveyData = await fetchAllSurveyData();

        // Group by month and calculate average satisfaction
        const monthlyData: Record<string, { total: number; count: number }> =
          {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

        // Initialize months with empty data
        months.forEach((month) => {
          monthlyData[month] = { total: 0, count: 0 };
        });

        // Process survey data to calculate monthly averages
        surveyData.forEach((submission) => {
          const date = new Date(submission.submittedAt);
          const month = date.toLocaleString("default", { month: "short" });

          if (monthlyData[month]) {
            // Use the overall satisfaction if available, or a default value
            const satisfaction = submission.ratings?.overall
              ? ratingToValue(submission.ratings.overall)
              : 3.5;

            monthlyData[month].total += satisfaction;
            monthlyData[month].count += 1;
          }
        });

        // Convert monthly data to trend format
        const trend = months.map((month) => ({
          month,
          satisfaction:
            monthlyData[month].count > 0
              ? monthlyData[month].total / monthlyData[month].count
              : null,
        }));

        // Fill null values with nearby month data or defaults
        for (let i = 0; i < trend.length; i++) {
          if (trend[i].satisfaction === null) {
            // Look for previous or next valid value
            let prevValue = null;
            let nextValue = null;

            for (let j = i - 1; j >= 0; j--) {
              if (trend[j].satisfaction !== null) {
                prevValue = trend[j].satisfaction;
                break;
              }
            }

            for (let j = i + 1; j < trend.length; j++) {
              if (trend[j].satisfaction !== null) {
                nextValue = trend[j].satisfaction;
                break;
              }
            }

            if (prevValue !== null && nextValue !== null) {
              trend[i].satisfaction = (prevValue + nextValue) / 2;
            } else if (prevValue !== null) {
              trend[i].satisfaction = prevValue;
            } else if (nextValue !== null) {
              trend[i].satisfaction = nextValue;
            } else {
              trend[i].satisfaction = 3.5; // Default fallback
            }
          }
        }

        setSatisfactionTrend(trend);
      } catch (error) {
        // Provide fallback data
        setSatisfactionTrend([
          { month: "Jan", satisfaction: 0 },
          { month: "Feb", satisfaction: 0 },
          { month: "Mar", satisfaction: 0 },
          { month: "Apr", satisfaction: 0 },
          { month: "May", satisfaction: 0 },
          { month: "Jun", satisfaction: 0 },
        ]);
      }
    };

    generateSatisfactionTrend();
  }, []);

  if (isLoading || isLoadingAdditionalData) {
    return (
      <div className="space-y-6">
        {/* Skeleton for departments summary cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for department table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-full my-2" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-4">
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="border-t">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-4 border-b flex justify-between items-center"
                  >
                    <Skeleton className="h-5 w-32" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter to only include departments (not wards)
  const departmentsOnly = departments.filter(
    (dept) => dept.type === "department"
  );

  if (departmentsOnly.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">No department data available.</p>
      </div>
    );
  }

  // Get total responses
  const totalResponses = departmentsOnly.reduce(
    (sum, dept) => sum + dept.visitCount,
    0
  );

  // Get average satisfaction across all departments
  const avgSatisfaction =
    departmentsOnly.reduce(
      (sum, dept) => sum + dept.satisfaction * dept.visitCount,
      0
    ) / Math.max(totalResponses, 1);

  // Get top performing department
  const topDepartment = [...departmentsOnly].sort(
    (a, b) => b.satisfaction - a.satisfaction
  )[0];

  // Get department needing most attention
  const needsAttentionDepartment = [...departmentsOnly].sort(
    (a, b) => a.satisfaction - b.satisfaction
  )[0];

  // Rating categories for department ratings
  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of staff" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label:
        "Promptness of feedback - communicating delays, explaining medication, procedure, changes etc.",
    },
    { id: "overall", label: "Overall impression" },
  ];

  // Calculate average rating for each category across all departments
  const avgRatings = ratingCategories.reduce((acc, category) => {
    const sum = departmentsOnly.reduce((total, dept) => {
      const rating = dept.ratings[category.id as keyof typeof dept.ratings];
      return total + rating * dept.visitCount;
    }, 0);
    acc[category.id] = sum / Math.max(totalResponses, 1);
    return acc;
  }, {} as Record<string, number>);

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  // Get relevant department concerns and recommendations sorted by date
  const combinedFeedback = [
    ...departmentConcerns
      .filter((concern) =>
        departmentsOnly.some((dept) => dept.name === concern.locationName)
      )
      .map((concern) => ({
        id: `concern-${concern.submissionId}`,
        type: "concern",
        submissionId: concern.submissionId,
        submittedAt: concern.submittedAt,
        locationName: concern.locationName,
        text: concern.concern,
        userType: concern.userType,
      })),
    ...departmentRecommendations
      .filter((rec) =>
        departmentsOnly.some((dept) =>
          rec.recommendation.toLowerCase().includes(dept.name.toLowerCase())
        )
      )
      .map((rec) => ({
        id: `rec-${rec.submissionId}`,
        type: "recommendation",
        submissionId: rec.submissionId,
        submittedAt: rec.submittedAt,
        locationName:
          departmentsOnly.find((dept) =>
            rec.recommendation.toLowerCase().includes(dept.name.toLowerCase())
          )?.name || "Department",
        text: rec.recommendation,
        userType: rec.userType,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent items

  if (selectedDepartment) {
    // Show individual department details
    // Get department ranking
    const departmentRanking =
      departmentsOnly
        .sort((a, b) => b.satisfaction - a.satisfaction)
        .findIndex((dept) => dept.id === selectedDepartment.id) + 1;

    // Create ranking suffix
    const getRankingSuffix = (ranking: number) => {
      if (ranking === 1) return "st";
      if (ranking === 2) return "nd";
      if (ranking === 3) return "rd";
      return "th";
    };

    // Get department concerns for the selected department
    const departmentConcernsForSelected = departmentConcerns.filter(
      (concern) => concern.locationName === selectedDepartment.name
    );

    const departmentFeedbackForSelected = [
      ...departmentConcernsForSelected.map((concern) => ({
        id: `concern-${concern.submissionId}`,
        type: "concern",
        submissionId: concern.submissionId,
        submittedAt: concern.submittedAt,
        locationName: concern.locationName,
        text: concern.concern,
        userType: concern.userType,
      })),
      ...departmentRecommendations
        .filter((rec) =>
          rec.recommendation
            .toLowerCase()
            .includes(selectedDepartment.name.toLowerCase())
        )
        .map((rec) => ({
          id: `rec-${rec.submissionId}`,
          type: "recommendation",
          submissionId: rec.submissionId,
          submittedAt: rec.submittedAt,
          locationName: selectedDepartment.name,
          text: rec.recommendation,
          userType: rec.userType,
        })),
    ].sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Calculate metrics from real data
    // Get average visit time from visit time data if available
    let avgVisitTime = 0;
    if (visitTimeData.length > 0) {
      // Calculate weighted average based on counts
      const totalSamples = visitTimeData.reduce(
        (sum, item) => sum + item.count,
        0
      );
      if (totalSamples > 0) {
        // Each time period has different typical durations, this is an estimation
        const timeWeights = {
          "less-than-month": 15, // 15 minutes average for recent visits
          "one-two-months": 20,
          "three-six-months": 25,
          "more-than-six-months": 30,
        };

        avgVisitTime = Math.round(
          visitTimeData.reduce((sum, item) => {
            const weight =
              timeWeights[item.id as keyof typeof timeWeights] || 20;
            return sum + weight * item.count;
          }, 0) / totalSamples
        );
      } else {
        avgVisitTime = 20; // Default if no data
      }
    } else {
      // Fallback to estimation based on satisfaction
      avgVisitTime = 15 + Math.round(selectedDepartment.satisfaction * 2);
    }

    // Get returning rate from patient type data if available
    let returningRate = 0;
    if (patientTypeData) {
      const totalPatients =
        patientTypeData.newPatients.count +
        patientTypeData.returningPatients.count;
      if (totalPatients > 0) {
        returningRate = Math.round(
          (patientTypeData.returningPatients.count / totalPatients) * 100
        );
      } else {
        returningRate = Math.round(selectedDepartment.recommendRate); // Default to recommend rate
      }
    } else {
      // Fallback to department's recommend rate
      returningRate = Math.round(selectedDepartment.recommendRate);
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSelectedDepartment(null)}
          >
            <ArrowLeft size={16} />
            <span>Back to All Departments</span>
          </Button>
          <Badge variant="outline" className="text-sm py-1 px-3">
            {selectedDepartment.visitCount} responses
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building size={20} />
              {selectedDepartment.name}
            </CardTitle>
            <CardDescription>
              Department performance overview based on{" "}
              {selectedDepartment.visitCount} survey responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overall Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">
                      {selectedDepartment.satisfaction.toFixed(1)}
                    </div>
                    <Badge
                      className={cn(
                        selectedDepartment.satisfaction >= 4
                          ? "bg-green-100 text-green-800"
                          : selectedDepartment.satisfaction >= 3
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {valueToRating(selectedDepartment.satisfaction)}
                    </Badge>
                  </div>
                  <Progress
                    value={selectedDepartment.satisfaction * 20}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Department Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">
                      {departmentRanking}
                      <span className="text-sm">
                        {getRankingSuffix(departmentRanking)}
                      </span>
                    </div>
                    <span className="text-xs ml-2 text-muted-foreground">
                      of {departmentsOnly.length} departments
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on overall satisfaction rating
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      Response Share
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (selectedDepartment.visitCount / totalResponses) * 100
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share of total survey responses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <RefreshCcw size={16} />
                      Returning Rate
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{returningRate}%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Percentage of returning patients
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Ratings</CardTitle>
                <CardDescription>
                  Performance breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(selectedDepartment.ratings).map(
                    ([key, value]) => {
                      // Find matching category label
                      const category = ratingCategories.find(
                        (cat) => cat.id === key
                      ) || {
                        id: key,
                        label: key
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()),
                      };

                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {category.label}
                            </span>
                            <span className="text-sm font-medium">
                              {value.toFixed(1)}/5.0
                              <span className="text-xs ml-1 text-muted-foreground">
                                ({valueToRating(value)})
                              </span>
                            </span>
                          </div>
                          <Progress value={value * 20} className="h-2" />
                        </div>
                      );
                    }
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Ratings by Category
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(selectedDepartment.ratings).map(
                          ([key, value]) => {
                            // Find matching category label
                            const category = ratingCategories.find(
                              (cat) => cat.id === key
                            ) || {
                              id: key,
                              label: key
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase()),
                            };
                            return {
                              category: category.label,
                              rating: value,
                            };
                          }
                        )}
                        margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="category"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis domain={[0, 5]} />
                        <Tooltip
                          formatter={(value) => [
                            typeof value === "number"
                              ? value.toFixed(1)
                              : value,
                            "Rating",
                          ]}
                        />
                        <Bar
                          dataKey="rating"
                          fill="#7c3aed"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Satisfaction Trend (Last 6 Months)
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={satisfactionTrend}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip
                          formatter={(value) => [
                            typeof value === "number"
                              ? value.toFixed(1)
                              : value,
                            "Satisfaction",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="satisfaction"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Recent Department Feedback
              </h3>
              {departmentFeedbackForSelected.length > 0 ? (
                departmentFeedbackForSelected.map((feedback, index) => (
                  <div
                    key={`${feedback.id}-${index}`}
                    className={`border p-3 rounded-md ${
                      feedback.type === "recommendation"
                        ? "border-l-4 border-l-blue-500"
                        : "border-l-4 border-l-amber-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge
                        variant={
                          feedback.type === "recommendation"
                            ? "outline"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {feedback.type === "recommendation"
                          ? "Recommendation"
                          : "Concern"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(feedback.submittedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <p className="italic text-sm text-muted-foreground">
                      "{feedback.text}"
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        User: {feedback.userType}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    No specific feedback reported for this department.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Department overview and list
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              From {departmentsOnly.length} departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Top Performing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold flex items-center">
              {topDepartment.name}
              <Star className="h-4 w-4 text-amber-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {topDepartment.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({topDepartment.visitCount} responses)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold flex items-center">
              {needsAttentionDepartment.name}
              <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {needsAttentionDepartment.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({needsAttentionDepartment.visitCount} responses)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {avgSatisfaction.toFixed(1)}
              </div>
              <Badge
                className={cn(
                  "ml-2",
                  avgSatisfaction >= 4
                    ? "bg-green-100 text-green-800"
                    : avgSatisfaction >= 3
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {valueToRating(avgSatisfaction)}
              </Badge>
            </div>
            <Progress value={avgSatisfaction * 20} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Ratings by Category</CardTitle>
          <CardDescription>
            Overall performance for each rating category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratingCategories.map((category) => {
              const rating = avgRatings[category.id];
              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {category.label}
                    </span>
                    <span className="text-sm font-medium">
                      {rating.toFixed(1)}/5.0
                      <span className="text-xs ml-1 text-muted-foreground">
                        ({valueToRating(rating)})
                      </span>
                    </span>
                  </div>
                  <Progress value={rating * 20} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Ratings</CardTitle>
          <CardDescription>
            Click on a department to view detailed performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Response Count</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Recommend Rate</TableHead>
                <TableHead>Top Rating</TableHead>
                <TableHead>Lowest Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentsOnly
                .sort((a, b) => b.satisfaction - a.satisfaction)
                .map((dept, index) => {
                  // Find highest and lowest rated categories
                  const ratings = Object.entries(dept.ratings);
                  const topRated = ratings.reduce(
                    (max, curr) => (curr[1] > max[1] ? curr : max),
                    ratings[0]
                  );
                  const lowestRated = ratings.reduce(
                    (min, curr) => (curr[1] < min[1] ? curr : min),
                    ratings[0]
                  );

                  // Get label for category
                  const getLabel = (id: string) => {
                    const category = ratingCategories.find(
                      (cat) => cat.id === id
                    );
                    return category ? category.label : id;
                  };

                  // Create ranking suffix
                  const getRankingSuffix = (ranking: number) => {
                    if (ranking === 1) return "st";
                    if (ranking === 2) return "nd";
                    if (ranking === 3) return "rd";
                    return "th";
                  };

                  const rank = index + 1;
                  const rankDisplay = `${rank}${getRankingSuffix(rank)}`;

                  return (
                    <TableRow
                      key={dept.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      <TableCell className="font-bold text-center">
                        {rankDisplay}
                      </TableCell>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.visitCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {dept.satisfaction.toFixed(1)}
                          </span>
                          <Progress
                            value={dept.satisfaction * 20}
                            className="h-2 w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{dept.recommendRate.toFixed(0)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getLabel(topRated[0])}
                          <span className="text-xs ml-1">
                            ({topRated[1].toFixed(1)})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getLabel(lowestRated[0])}
                          <span className="text-xs ml-1">
                            ({lowestRated[1].toFixed(1)})
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Department Feedback</CardTitle>
          <CardDescription>
            Latest concerns and recommendations from departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConcerns ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : combinedFeedback.length > 0 ? (
            <div className="space-y-3">
              {combinedFeedback.map((feedback, index) => (
                <Card
                  key={`${feedback.id}-${index}`}
                  className={`${
                    feedback.type === "recommendation"
                      ? "border-l-4 border-l-blue-500"
                      : "border-l-4 border-l-amber-500"
                  }`}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">
                          {feedback.locationName}
                        </CardTitle>
                        <Badge
                          variant={
                            feedback.type === "recommendation"
                              ? "outline"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {feedback.type === "recommendation"
                            ? "Recommendation"
                            : "Concern"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(feedback.submittedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-sm italic text-muted-foreground">
                      "{feedback.text}"
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        User: {feedback.userType}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No department feedback reported.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
