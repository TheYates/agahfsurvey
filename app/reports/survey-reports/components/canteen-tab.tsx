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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Coffee,
  Utensils,
  AlertTriangle,
  StarIcon,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NPSCard } from "@/components/ui/nps-card";
import { NPSFeedbackCard } from "@/components/ui/nps-feedback-card";
import { fetchNPSFeedback } from "@/app/actions/department-actions";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  fetchCanteenData,
  fetchCanteenConcerns,
  getCanteenSubmissionCount,
  CanteenData,
  DepartmentConcern,
} from "@/app/actions/canteen-actions";

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

// Color palette for charts and highlights
const COLORS = [
  "#0a6a74", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

// Cache keys and expiration time
const CACHE_KEY_CANTEEN = "canteenTabData";
const CACHE_KEY_CONCERNS = "canteenConcernsData";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface NPSFeedback {
  submissionId: string;
  submittedAt: string;
  locationName: string;
  npsRating: number;
  npsFeedback: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  category: 'promoter' | 'passive' | 'detractor';
}

interface CanteenTabProps {
  isLoading: boolean;
  departments: any[];
  dateRange?: { from: string; to: string } | null;
  npsData?: {
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    total: number;
  } | null;
}

// Before the component definition, add this helper function
function fetchCanteenReviews(): Promise<any[]> {
  // Mock implementation for reviews
  return Promise.resolve([]);
}

export function CanteenTab({ isLoading, departments, dateRange, npsData }: CanteenTabProps) {
  const [canteenData, setCanteenData] = useState<CanteenData | null>(null);
  const [canteenConcerns, setCanteenConcerns] = useState<DepartmentConcern[]>(
    []
  );
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [foodTypeData, setFoodTypeData] = useState<any[]>([]);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [npsFeedback, setNpsFeedback] = useState<NPSFeedback[]>([]);

  // Fetch canteen data when component mounts or dateRange changes
  useEffect(() => {
    const CACHE_KEY = dateRange
      ? `canteenTabData_${dateRange.from}_${dateRange.to}`
      : "canteenTabData";
    const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
    const instanceId = Math.random().toString(36).substring(2, 9);
    const timerName = `CanteenTab_data_loading_${instanceId}`;

    const loadCanteenData = async () => {
      try {
        // Check cache first
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Date.now() - parsed.timestamp < CACHE_TIME) {
            setCanteenData(parsed.data.canteenData);
            setSubmissionCount(parsed.data.count || 0);
            setIsLoadingData(false);
            try {
            } catch (e) {
              // Ignore timer errors
            }
            return;
          }
        }

        setIsLoadingData(true);

        // Fetch the data with date range
        const data = await fetchCanteenData(departments, dateRange);
        const count = await getCanteenSubmissionCount(dateRange);

        setCanteenData(data);
        setSubmissionCount(count);

        // Cache the results
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: { canteenData: data, count },
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          console.error("Error caching canteen data:", error);
        }

        try {
        } catch (e) {
          // Ignore timer errors
        }
      } catch (error) {
        console.error("Error in loadCanteenData:", error);
        try {
        } catch (e) {
          // Ignore timer errors
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    if (departments && departments.length > 0) {
      loadCanteenData();
    }
  }, [departments, dateRange]);

  // Fetch NPS feedback
  useEffect(() => {
    async function loadNPSFeedback() {
      try {
        const feedback = await fetchNPSFeedback('canteen', dateRange);
        setNpsFeedback(feedback);
      } catch (error) {
        console.error('Error fetching NPS feedback:', error);
      }
    }
    loadNPSFeedback();
  }, [dateRange]);

  // Fetch canteen concerns with caching
  useEffect(() => {
    const concernsCacheKey = dateRange
      ? `${CACHE_KEY_CONCERNS}_${dateRange.from}_${dateRange.to}`
      : CACHE_KEY_CONCERNS;

    const loadCanteenConcerns = async () => {
      setIsLoadingConcerns(true);
      try {
        // Check for cached concerns
        const cachedConcerns = sessionStorage.getItem(concernsCacheKey);

        if (cachedConcerns) {
          const { concerns, timestamp } = JSON.parse(cachedConcerns);

          // Use cached concerns if less than 5 minutes old
          if (Date.now() - timestamp < CACHE_TIME) {
            setCanteenConcerns(concerns);
            setIsLoadingConcerns(false);
            return;
          }
        }

        // Fetch fresh concerns if no valid cache exists
        const concerns = await fetchCanteenConcerns(dateRange);
        setCanteenConcerns(concerns);

        // Store in cache with timestamp
        sessionStorage.setItem(
          concernsCacheKey,
          JSON.stringify({
            concerns,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error fetching canteen concerns:", error);
        setCanteenConcerns([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadCanteenConcerns();
  }, [dateRange]);

  // Show skeleton if either parent is loading OR internal data is loading
  if (isLoading || isLoadingData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skeleton for summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-9 w-16 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Skeleton for detailed ratings - single column */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skeleton for feedback */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-l-4 border-l-amber-500/30">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6 mb-1" />
                        <Skeleton className="h-4 w-4/6" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canteenData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">No canteen data available.</p>
      </div>
    );
  }

  // Rating categories specific to canteen
  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of staff" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label: "Promptness of feedback - communicating delays, changes etc.",
    },
    { id: "food-quality", label: "Food quality and timely serving of food" },
    { id: "overall", label: "Overall impression" },
  ];

  // Get relevant canteen concerns sorted by date
  const recentCanteenConcerns = canteenConcerns
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent concerns

  // Prepare ratings data for chart
  const ratingsChartData = Object.entries(canteenData.ratings).map(
    ([key, value]) => {
      const category = ratingCategories.find((cat) => cat.id === key) || {
        id: key,
        label: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      };

      return {
        category: category.label,
        rating: value,
      };
    }
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Utensils size={20} />
              {canteenData.name}
            </CardTitle>
            {/* <CardDescription>
            Canteen Services performance overview based on {submissionCount}{" "}
            survey responses
          </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                          Total number of survey submissions for Canteen
                          Services within the selected date range.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissionCount}</div>
                  <p className="text-xs text-muted-foreground">
                    with {canteenConcerns.length} providing feedback
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    Recommend Rate
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <Info size={14} className="text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>
                          Percentage of respondents who answered "Yes" to
                          whether they would recommend the Canteen Services.
                          Calculated as: (Total "Yes" responses ÷ Total
                          responses) × 100.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  {canteenData.recommendRate >= 75 ? (
                    <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {canteenData.recommendRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    would recommend
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    Top Performing
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <Info size={14} className="text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>
                          The highest-rated service category for Canteen
                          Services. This indicates the strongest aspect of the
                          canteen's performance based on customer feedback.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <Star className="h-4 w-4 text-[#f6a050]" />
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Find top rated category
                    const ratings = Object.entries(canteenData.ratings);
                    const topRated = ratings.reduce(
                      (max, curr) => (curr[1] > max[1] ? curr : max),
                      ratings[0]
                    );

                    // Get label for the category
                    const category = ratingCategories.find(
                      (cat) => cat.id === topRated[0]
                    ) || {
                      id: topRated[0],
                      label: topRated[0]
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                    };

                    return (
                      <>
                        <div className="text-lg font-bold">
                          {category.label}
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            {topRated[1].toFixed(1)}/5.0
                          </span>
                          <span className="text-xs ml-2 text-muted-foreground">
                            ({valueToRating(topRated[1])})
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    Needs Attention
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <Info size={14} className="text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>
                          The lowest-rated service category for Canteen
                          Services. This area requires immediate attention and
                          improvement to enhance overall customer satisfaction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#e84e3c]" />
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Find lowest rated category
                    const ratings = Object.entries(canteenData.ratings);
                    const lowestRated = ratings.reduce(
                      (min, curr) => (curr[1] < min[1] ? curr : min),
                      ratings[0]
                    );

                    // Get label for the category
                    const category = ratingCategories.find(
                      (cat) => cat.id === lowestRated[0]
                    ) || {
                      id: lowestRated[0],
                      label: lowestRated[0]
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                    };

                    return (
                      <>
                        <div className="text-lg font-bold">
                          {category.label}
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            {lowestRated[1].toFixed(1)}/5.0
                          </span>
                          <span className="text-xs ml-2 text-muted-foreground">
                            ({valueToRating(lowestRated[1])})
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <NPSCard npsData={npsData} title="Canteen NPS" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Ratings</CardTitle>
                <CardDescription>
                  Performance breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingCategories.map((category) => {
                    const rating =
                      canteenData.ratings[
                        category.id as keyof typeof canteenData.ratings
                      ] || 0;
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                          <span className="text-sm font-medium">
                            {rating.toFixed(1)}/5.0
                            <span className="text-xs ml-2 text-muted-foreground">
                              ({valueToRating(rating)})
                            </span>
                          </span>
                        </div>
                        <Progress value={rating * 20} className="h-3" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* NPS Feedback Section */}
            {npsFeedback && npsFeedback.length > 0 && (
              <NPSFeedbackCard
                feedback={npsFeedback}
                title="Canteen NPS Feedback"
                description="Customer feedback based on Net Promoter Score ratings"
                showLocationFilter={false}
                initialLimit={5}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Canteen Feedback</CardTitle>
                <CardDescription>
                  Latest feedback and concerns about the Canteen Services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConcerns ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : recentCanteenConcerns.length > 0 ? (
                  <div className="space-y-3">
                    {recentCanteenConcerns.map((concern, index) => (
                      <Card
                        key={`${concern.submissionId}-${index}`}
                        className="border-l-4 border-l-amber-500"
                      >
                        <CardHeader className="p-3 pb-1">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">
                              {concern.locationName}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">
                              {new Date(concern.submittedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                          <p className="text-sm italic text-muted-foreground">
                            "{concern.concern}"
                          </p>
                          <div className="flex justify-end mt-1">
                            <span className="text-xs text-muted-foreground">
                              User: {concern.userType}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No canteen feedback reported.
                  </p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
