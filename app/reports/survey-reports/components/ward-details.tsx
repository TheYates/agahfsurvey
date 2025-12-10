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
import { BedDouble, ArrowLeft, ThumbsUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { WardConcern, SurveySubmission, fetchAllSurveyData } from "@/app/actions/ward-actions";
import { ExtendedWard } from "./wards-tab";
import { COLORS, barAveragePlugin } from "../utils/chart-utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Helper to convert text rating to number
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

interface WardDetailsProps {
  selectedWard: ExtendedWard;
  wardRanking: number;
  wardsOnly: any[];
  wardConcerns: WardConcern[];
  ratingCategories: { id: string; label: string }[];
  departmentAverages: Record<string, number>;
  satisfactionTrend: any[];
  onBackClick: () => void;
  valueToRating: (value: number) => string;
  wardRecommendations?: any[]; // Optional for backward compatibility
}

// Cache keys and expiration time
const CACHE_KEY_RECOMMENDATIONS = "wardRecommendationsData";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export function WardDetails({
  selectedWard,
  wardRanking,
  wardsOnly,
  wardConcerns,
  ratingCategories,
  departmentAverages,
  satisfactionTrend: _ignoredTrend,
  onBackClick,
  valueToRating,
}: WardDetailsProps) {
  const [wardSatisfactionTrend, setWardSatisfactionTrend] = useState<any[]>([]);
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);

  // Calculate ward-specific satisfaction trend
  useEffect(() => {
    const generateWardSatisfactionTrend = async () => {
      setIsLoadingTrend(true);
      try {
        // Fetch real survey data
        const surveyData = await fetchAllSurveyData();

        // Filter submissions for this specific ward
        const wardSubmissions = surveyData.filter((submission: SurveySubmission) => {
          return submission.Rating?.some(
            (rating) => rating.locationId === parseInt(selectedWard.id as string)
          );
        });

        // Group by month and calculate average satisfaction
        const monthlyData: Record<string, { total: number; count: number }> = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

        // Initialize months with empty data
        months.forEach((month) => {
          monthlyData[month] = { total: 0, count: 0 };
        });

        // Process ward-specific survey data
        wardSubmissions.forEach((submission: SurveySubmission) => {
          const date = new Date(submission.submittedAt);
          const month = date.toLocaleString("default", { month: "short" });

          if (monthlyData[month]) {
            const wardRating = submission.Rating?.find(
              (rating) => rating.locationId === parseInt(selectedWard.id as string)
            );

            if (wardRating?.overall) {
              const satisfaction = ratingToValue(wardRating.overall);
              monthlyData[month].total += satisfaction;
              monthlyData[month].count += 1;
            }
          }
        });

        // Convert to trend format
        const trend = months
          .map((month) => ({
            month,
            satisfaction:
              monthlyData[month].count > 0
                ? Math.round((monthlyData[month].total / monthlyData[month].count) * 10) / 10
                : null,
          }))
          .filter((item) => item.satisfaction !== null);

        setWardSatisfactionTrend(trend.length > 0 ? trend : [
          {
            month: new Date().toLocaleString("default", { month: "short" }),
            satisfaction: selectedWard.satisfaction || 3.5,
          },
        ]);
      } catch (error) {
        console.error("Error generating ward satisfaction trend:", error);
        setWardSatisfactionTrend([
          {
            month: new Date().toLocaleString("default", { month: "short" }),
            satisfaction: selectedWard.satisfaction || 3.5,
          },
        ]);
      } finally {
        setIsLoadingTrend(false);
      }
    };

    generateWardSatisfactionTrend();
  }, [selectedWard.id, selectedWard.satisfaction]);

  // Create ranking suffix
  const getRankingSuffix = (ranking: number) => {
    if (ranking === 1) return "st";
    if (ranking === 2) return "nd";
    if (ranking === 3) return "rd";
    return "th";
  };

  // Calculate metrics based on real data
  const patientSatisfaction = Math.round(selectedWard.recommendRate); // Use real data

  // Get ward-specific feedback (both concerns and recommendations)
  const wardFeedback = wardConcerns
    .filter((concern) => concern.locationName === selectedWard.name)
    .map((concern) => ({
      id: `feedback-${concern.submissionId}`,
      type: "feedback",
      submissionId: concern.submissionId,
      submittedAt: concern.submittedAt,
      locationName: concern.locationName,
      text: concern.concern,
      userType: concern.userType || "Anonymous",
    }))
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 5); // Show only the 5 most recent items

  // Prepare data for radar chart comparing ward to department average
  const radarData = [
    {
      category: "Admission",
      ward: (selectedWard.ratings as any)["admission"] || 0,
      average: (departmentAverages as any)["admission"] || 0,
    },
    {
      category: "Nurse Prof.",
      ward: (selectedWard.ratings as any)["nurse-professionalism"] || 0,
      average: (departmentAverages as any)["nurse-professionalism"] || 0,
    },
    {
      category: "Doctor Prof.",
      ward: (selectedWard.ratings as any)["doctor-professionalism"] || 0,
      average: (departmentAverages as any)["doctor-professionalism"] || 0,
    },
    {
      category: "Understanding",
      ward: selectedWard.ratings.understanding,
      average: departmentAverages.understanding || 0,
    },
    {
      category: "Promptness (Care)",
      ward: selectedWard.ratings["promptness-care"],
      average: departmentAverages["promptness-care"] || 0,
    },
    {
      category: "Promptness (Feedback)",
      ward: selectedWard.ratings["promptness-feedback"],
      average: departmentAverages["promptness-feedback"] || 0,
    },
    {
      category: "Food Quality",
      ward: (selectedWard.ratings as any)["food-quality"] || 0,
      average: (departmentAverages as any)["food-quality"] || 0,
    },
    {
      category: "Discharge",
      ward: (selectedWard.ratings as any)["discharge"] || 0,
      average: (departmentAverages as any)["discharge"] || 0,
    },
  ];

  // Debug log
  useEffect(() => {}, [selectedWard.name, wardSatisfactionTrend]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onBackClick}
        >
          <ArrowLeft size={16} />
          <span>Back to All Wards</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BedDouble size={20} />
            {selectedWard.name}
          </CardTitle>
          <CardDescription>
            Ward performance overview based on {selectedWard.visitCount} survey
            responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    Responses
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedWard.visitCount}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total survey responses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {selectedWard.satisfaction.toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      selectedWard.satisfaction >= 4
                        ? "bg-green-100 text-green-800"
                        : selectedWard.satisfaction >= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {valueToRating(selectedWard.satisfaction)}
                  </Badge>
                </div>
                <Progress
                  value={selectedWard.satisfaction * 20}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Ward Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {wardRanking}
                    <span className="text-sm">
                      {getRankingSuffix(wardRanking)}
                    </span>
                  </div>
                  <span className="text-xs ml-2 text-muted-foreground">
                    of {wardsOnly.length} wards
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
                    <ThumbsUp size={16} />
                    Recommend Rate
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(selectedWard.recommendRate)}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Would recommend this ward
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
                {ratingCategories.map((category) => {
                  const key = category.id;
                  const value = (selectedWard.ratings as any)[key] || 0;

                  // Skip reception and professionalism fields
                  if (key === "reception" || key === "professionalism") {
                    return null;
                  }

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                        <span className="text-sm font-medium">
                          {value ? `${value.toFixed(1)}/5.0` : "No data"}
                          {value > 0 && (
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({valueToRating(value)})
                            </span>
                          )}
                        </span>
                      </div>
                      <Progress value={value * 20} className="h-2" />
                    </div>
                  );
                })}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Rating Comparison</h4>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: ratingCategories
                        .filter(
                          (category) =>
                            category.id !== "reception" &&
                            category.id !== "professionalism"
                        )
                        .map((category) => category.label),
                      datasets: [
                        {
                          label: "Rating",
                          data: ratingCategories
                            .filter(
                              (category) =>
                                category.id !== "reception" &&
                                category.id !== "professionalism"
                            )
                            .map((category) => {
                              const value =
                                (selectedWard.ratings as any)[category.id] || 0;
                              return value;
                            }),
                          backgroundColor: "#4caf50",
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top" as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `Rating: ${context.parsed.y.toFixed(1)}`;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Satisfaction Trend (Last 6 Months) - {selectedWard.name}
                </h4>
                <div className="h-80">
                  {isLoadingTrend ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <Line
                      data={{
                        labels: wardSatisfactionTrend.map((item) => item.month),
                        datasets: [
                          {
                            label: "Satisfaction",
                            data: wardSatisfactionTrend.map(
                              (item) => item.satisfaction
                            ),
                            borderColor: "#7c3aed",
                            backgroundColor: "rgba(124, 58, 237, 0.1)",
                            borderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top" as const,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `Satisfaction: ${context.parsed.y.toFixed(
                                  1
                                )}`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Comments & Feedback</h3>
            {wardFeedback.length > 0 ? (
              wardFeedback.map((feedback, index) => (
                <div
                  key={`${feedback.type}-${feedback.submissionId}-${index}`}
                  className={`border p-3 rounded-md border-l-4 border-l-amber-500`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {feedback.type === "feedback"
                        ? "Feedback"
                        : "Recommendation"}
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
                  No specific feedback reported for this ward.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
