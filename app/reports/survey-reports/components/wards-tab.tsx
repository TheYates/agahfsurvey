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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BedDouble,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

import { WardDetails } from "./ward-details";

import {
  Ward,
  WardConcern,
  fetchWardConcerns,
  fetchAllSurveyData,
  SurveySubmission,
} from "@/app/actions/ward-actions";
import {
  fetchVisitTimeData,
  fetchPatientTypeData,
} from "@/app/actions/department-actions";

// Add import for the Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extend the Ward interface to include the ward-specific ratings
export interface ExtendedWardRatings {
  admission: number;
  "nurse-professionalism": number;
  "doctor-professionalism": number;
  "food-quality": number;
  understanding: number;
  "promptness-care": number;
  "promptness-feedback": number;
  discharge: number;
  overall: number;
}

// Extend the Ward interface to use our extended ratings
export interface ExtendedWard extends Omit<Ward, "ratings"> {
  ratings: ExtendedWardRatings;
}

interface WardsTabProps {
  isLoading: boolean;
  wards: Ward[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  onLoadMore?: () => Promise<void>;
}

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

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

// Cache keys and expiration time
const CACHE_KEY_CONCERNS = "wardConcernsData";
const CACHE_KEY_RECOMMENDATIONS = "wardRecommendationsData";
const CACHE_KEY_WARDS = "wardsData";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export function WardsTab({
  isLoading,
  wards,
  pagination,
  onLoadMore,
}: WardsTabProps) {
  const [selectedWard, setSelectedWard] = useState<ExtendedWard | null>(null);
  const [wardConcerns, setWardConcerns] = useState<WardConcern[]>([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [departmentAverages, setDepartmentAverages] = useState<
    Record<string, number>
  >({});
  const [satisfactionTrend, setSatisfactionTrend] = useState<any[]>([]);

  // Fetch ward concerns with caching
  useEffect(() => {
    const loadWardConcerns = async () => {
      setIsLoadingConcerns(true);
      try {
        console.time("WardsTab concerns loading");

        // Check for cached data first
        const cachedData = sessionStorage.getItem(CACHE_KEY_CONCERNS);

        if (cachedData) {
          const { concerns, timestamp } = JSON.parse(cachedData);

          // Use cached data if it's less than 5 minutes old
          if (Date.now() - timestamp < CACHE_TIME) {
            console.log("WardsTab: Using cached concerns data");
            setWardConcerns(concerns);
            setIsLoadingConcerns(false);
            console.timeEnd("WardsTab concerns loading");
            return;
          }
        }

        // Fetch fresh data if no valid cache exists
        console.time("fetchWardConcerns");
        const concerns = await fetchWardConcerns();
        console.timeEnd("fetchWardConcerns");

        setWardConcerns(concerns);

        // Store in cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY_CONCERNS,
          JSON.stringify({
            concerns,
            timestamp: Date.now(),
          })
        );

        console.timeEnd("WardsTab concerns loading");
      } catch (error) {
        console.error("Error fetching ward concerns:", error);
        setWardConcerns([]);
        console.timeEnd("WardsTab concerns loading");
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadWardConcerns();
  }, []);

  // Cache ward data when it changes
  useEffect(() => {
    // Don't cache during initial loading or if there are no wards
    if (isLoading || wards.length === 0) return;

    try {
      console.time("WardsTab caching");

      // Store wards data in cache with pagination info
      sessionStorage.setItem(
        CACHE_KEY_WARDS,
        JSON.stringify({
          wards,
          pagination,
          timestamp: Date.now(),
        })
      );

      console.timeEnd("WardsTab caching");
    } catch (error) {
      console.error("Error caching wards data:", error);
      console.timeEnd("WardsTab caching");
    }
  }, [wards, pagination, isLoading]);

  // Generate satisfaction trend based on real survey data
  useEffect(() => {
    const generateSatisfactionTrend = async () => {
      try {
        // Fetch real survey data
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
        surveyData.forEach((submission: SurveySubmission) => {
          const date = new Date(submission.submittedAt);
          const month = date.toLocaleString("default", { month: "short" });

          if (monthlyData[month]) {
            // Use the overall satisfaction if available, or a default value
            const satisfaction =
              submission.Rating &&
              submission.Rating.length > 0 &&
              submission.Rating[0].overall
                ? ratingToValue(submission.Rating[0].overall)
                : 3.5;

            monthlyData[month].total += satisfaction;
            monthlyData[month].count += 1;
          }
        });

        // Convert monthly data to trend format and only include months with actual data
        const trend = months
          .map((month) => ({
            month,
            satisfaction:
              monthlyData[month].count > 0
                ? Math.round(
                    (monthlyData[month].total / monthlyData[month].count) * 10
                  ) / 10
                : null,
          }))
          .filter((item) => item.satisfaction !== null);

        setSatisfactionTrend(trend);
      } catch (error) {
        console.error("Error generating satisfaction trend:", error);
        // Provide minimal fallback data - just one data point for the current month
        const currentMonth = new Date().toLocaleString("default", {
          month: "short",
        });
        const fallbackData = [
          {
            month: currentMonth,
            satisfaction: selectedWard?.satisfaction || 3.5,
          },
        ];

        setSatisfactionTrend(fallbackData);
      }
    };

    // Calculate department averages for comparison with wards
    const calculateDepartmentAverages = async () => {
      try {
        // In a real implementation, you would fetch department data from your API
        // For now, we'll use reasonable defaults for ward comparison

        // Initialize department averages with default values
        const averages: Record<string, number> = {
          admission: 4.1,
          "nurse-professionalism": 4.3,
          "doctor-professionalism": 4.4,
          understanding: 4.2,
          "promptness-care": 3.9,
          "promptness-feedback": 3.8,
          "food-quality": 3.6,
          discharge: 4.0,
          overall: 4.1,
        };

        setDepartmentAverages(averages);
      } catch (error) {
        console.error("Error calculating department averages:", error);
        // Set fallback averages
        setDepartmentAverages({
          admission: 4.0,
          "nurse-professionalism": 4.0,
          "doctor-professionalism": 4.0,
          understanding: 4.0,
          "promptness-care": 4.0,
          "promptness-feedback": 4.0,
          "food-quality": 4.0,
          discharge: 4.0,
          overall: 4.0,
        });
      }
    };

    generateSatisfactionTrend();
    calculateDepartmentAverages();
  }, [selectedWard]);

  // Debug log the loaded data and satisfaction trend
  useEffect(() => {
    // Log satisfaction trend data whenever it changes
  }, [satisfactionTrend]);

  // Handler for loading more wards
  const handleLoadMore = async () => {
    if (onLoadMore && pagination?.hasMore) {
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } catch (error) {
        console.error("Error loading more wards:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for wards summary cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for ward ratings */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for wards table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-4 bg-muted/5">
                <div className="grid grid-cols-7 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              </div>
              <div className="border-t">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 border-b">
                    <div className="grid grid-cols-7 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <Skeleton key={j} className="h-5 w-full" />
                      ))}
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

  // Filter to only include wards (not departments)
  const wardsOnly = wards.filter((ward) => ward.type === "ward");

  if (wardsOnly.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">No ward data available.</p>
      </div>
    );
  }

  // Get total responses
  const totalResponses = wardsOnly.reduce(
    (sum, ward) => sum + ward.visitCount,
    0
  );

  // Get average satisfaction across all wards
  const avgSatisfaction =
    wardsOnly.reduce(
      (sum, ward) => sum + ward.satisfaction * ward.visitCount,
      0
    ) / Math.max(totalResponses, 1);

  // Get top performing ward
  const topWard = [...wardsOnly].sort(
    (a, b) => b.satisfaction - a.satisfaction
  )[0];

  // Get ward needing most attention
  const needsAttentionWard = [...wardsOnly].sort(
    (a, b) => a.satisfaction - b.satisfaction
  )[0];

  // Rating categories for ward ratings
  const ratingCategories = [
    { id: "admission", label: "Admission process" },
    { id: "nurse-professionalism", label: "Professionalism of nurse" },
    { id: "doctor-professionalism", label: "Professionalism of doctor" },
    { id: "food-quality", label: "Food quality and timely serving of food" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label:
        "Promptness of feedback - communicating delays, explaining medication, procedure, changes etc.",
    },
    { id: "discharge", label: "Discharge process" },
    { id: "overall", label: "Overall impression" },
  ];

  // Calculate average rating for each category across all wards
  const avgRatings = ratingCategories.reduce((acc, category) => {
    let sum = 0;
    let count = 0;

    wardsOnly.forEach((ward) => {
      // Handle potential field mapping from old schema to new schema
      let ratingValue = 0;
      let hasRating = false;

      // Check if the category exists directly in ward ratings
      if (ward.ratings && (ward.ratings as any)[category.id]) {
        ratingValue = (ward.ratings as any)[category.id];
        hasRating = true;
      }

      if (hasRating) {
        sum += ratingValue * ward.visitCount;
        count += ward.visitCount;
      }
    });

    acc[category.id] = count > 0 ? sum / count : 0;
    return acc;
  }, {} as Record<string, number>);

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  // Create combinedFeedback - use only concerns since the survey form combines concerns and recommendations
  const combinedFeedback = wardConcerns
    .filter((concern) =>
      // Filter concerns to only include those from ward-type locations
      wardsOnly.some((ward) => ward.name === concern.locationName)
    )
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
    .slice(0, 5); // Get the 5 most recent items

  // Update the handler for selecting a ward to load recommendations when needed
  const handleSelectWard = async (ward: Ward) => {
    setSelectedWard(ward as unknown as ExtendedWard);
  };

  if (selectedWard) {
    // Show individual ward details
    // Get ward ranking
    const wardRanking =
      wardsOnly
        .sort((a, b) => b.satisfaction - a.satisfaction)
        .findIndex((ward) => ward.id === selectedWard.id) + 1;

    // Use our new WardDetails component
    return (
      <WardDetails
        selectedWard={selectedWard}
        wardRanking={wardRanking}
        wardsOnly={wardsOnly}
        wardConcerns={wardConcerns}
        ratingCategories={ratingCategories}
        departmentAverages={departmentAverages}
        satisfactionTrend={satisfactionTrend}
        onBackClick={() => setSelectedWard(null)}
        valueToRating={valueToRating}
      />
    );
  }

  // Ward overview and list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Ward Performance Overview</h2>
        <div className="w-[240px]">
          <Select
            onValueChange={(value) => {
              const ward = wardsOnly.find((w) => w.id === value);
              if (ward) {
                handleSelectWard(ward);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a ward" />
            </SelectTrigger>
            <SelectContent>
              {wardsOnly
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ward) => (
                  <SelectItem key={ward.id} value={ward.id}>
                    {ward.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
              From {wardsOnly.length} wards
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
              {topWard.name}
              <Star className="h-4 w-4 text-amber-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {topWard.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({topWard.visitCount} responses)
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
              {needsAttentionWard.name}
              <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {needsAttentionWard.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({needsAttentionWard.visitCount} responses)
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
              const rating = avgRatings[category.id] || 0;
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
          <CardTitle>Ward Ratings</CardTitle>
          <CardDescription>
            Click on a ward to view detailed performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Response Count</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Top Rating</TableHead>
                <TableHead>Lowest Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wardsOnly
                .sort((a, b) => b.satisfaction - a.satisfaction)
                .map((ward, index) => {
                  // Find highest and lowest rated categories
                  const ratings = Object.entries(ward.ratings);
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
                    return category
                      ? category.label
                      : id
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
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
                      key={ward.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectWard(ward)}
                    >
                      <TableCell className="font-bold text-center">
                        {rankDisplay}
                      </TableCell>
                      <TableCell className="font-medium">{ward.name}</TableCell>
                      <TableCell>{ward.visitCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {ward.satisfaction.toFixed(1)}
                          </span>
                          <Progress
                            value={ward.satisfaction * 20}
                            className="h-2 w-16"
                          />
                        </div>
                      </TableCell>
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
          <CardTitle>Recent Ward Feedback</CardTitle>
          <CardDescription>Latest feedback from wards</CardDescription>
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
                  key={`${feedback.type}-${feedback.submissionId}-${index}`}
                  className={`border p-3 rounded-md border-l-4 border-l-amber-500`}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">
                          {feedback.locationName}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Feedback
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
              No ward feedback reported.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Load More button */}
      {pagination?.hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="w-full max-w-xs"
          >
            {isLoadingMore ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Loading more wards...
              </>
            ) : (
              <>
                Load More Wards ({wards.length} of {pagination.total})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
