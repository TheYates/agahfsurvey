"use client";

import { useState, useEffect, useMemo } from "react";
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
  Stethoscope,
  ArrowLeft,
  Star,
  AlertTriangle,
  Activity,
  UserCheck,
  Clock,
  Users,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
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
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  fetchOccupationalHealthData,
  fetchAllSurveyData,
  type UserTypeData,
  type LocationRating,
  type OccupationalHealthData,
  type DepartmentConcern,
} from "@/app/actions/medicals-actions";
import { Skeleton } from "@/components/ui/skeleton";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement
);

interface OccupationalHealthTabProps {
  isLoading: boolean;
  dateRange?: { from: string; to: string } | null;
}

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

export function MedicalsTab({ isLoading, dateRange }: OccupationalHealthTabProps) {
  const [ohData, setOhData] = useState<OccupationalHealthData | null>(null);
  const [ohConcerns, setOhConcerns] = useState<DepartmentConcern[]>([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);

  // Default user types data if none is provided
  const defaultUserTypes = [
    { name: "AGAG Employee", value: 0 },
    { name: "AGAG/Contractor Dependant", value: 0 },
    { name: "Other Corporate Employee", value: 0 },
    { name: "Contractor Employee", value: 0 },
    { name: "Community", value: 0 },
  ];

  // Use useMemo for userTypeData to ensure all user types are included
  const userTypeData = useMemo(() => {
    if (!ohData?.userTypeDistribution) return defaultUserTypes;

    // Create a map of existing user types
    const existingUserTypes = new Map(
      ohData.userTypeDistribution.map((item) => [item.name, item.value])
    );

    // Create complete list including defaults
    return defaultUserTypes.map((defaultType) => ({
      name: defaultType.name,
      value: existingUserTypes.get(defaultType.name) || 0,
    }));
  }, [ohData?.userTypeDistribution]);

  // Fetch occupational health data directly from the dedicated endpoint
  useEffect(() => {
    const CACHE_KEY = dateRange
      ? `medicalsTabData_${dateRange.from}_${dateRange.to}`
      : "medicalsTabData";
    const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
    const instanceId = Math.random().toString(36).substring(2, 9); // Unique ID for this instance
    const timerName = `MedicalsTab_data_loading_${instanceId}`;

    const loadOccupationalHealthData = async () => {
      // Check for cached data first
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Use cache if less than 5 minutes old
          if (Date.now() - timestamp < CACHE_TIME) {
            setOhData(data.ohData);
            setOhConcerns(data.ohConcerns);
            setIsLoadingConcerns(false);

            return;
          }
        }
      } catch (err) {
        // If cache read fails, just continue with normal data fetching
      }

      setIsLoadingConcerns(true);
      try {
        const fetchTimerName = `OccupationalHealthTab_fetch_${instanceId}`;

        const { ohData: fetchedData, ohConcerns: fetchedConcerns } =
          await fetchOccupationalHealthData(dateRange);

        // Also fetch all survey data to get user type distribution
        const surveyDataTimerName = `OccupationalHealthTab_survey_data_${instanceId}`;

        const allSurveyData = await fetchAllSurveyData(dateRange);

        // If fetchedData exists, enhance it with real user type distribution

        // If fetchedData exists, enhance it with real user type distribution
        if (fetchedData) {
          const typedData = fetchedData as OccupationalHealthData;

          // Calculate real user type distribution from survey data
          // Filter for occupational health visits only
          const processTimerName = `Process_user_type_distribution_${instanceId}`;

          const ohVisits = allSurveyData.filter(
            (survey) => survey.visitPurpose === "Medicals (Occupational Health)"
          );

          // Count user types from these visits
          const userTypeCounts: Record<string, number> = {};

          ohVisits.forEach((visit) => {
            if (visit.userType) {
              userTypeCounts[visit.userType] =
                (userTypeCounts[visit.userType] || 0) + 1;
            }
          });

          // Format data for visualization
          const userTypeDistribution: UserTypeData[] = Object.entries(
            userTypeCounts
          )
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by count, descending

          // Ensure we have at least some data - use empty categories if no data found
          typedData.userTypeDistribution =
            userTypeDistribution.length > 0
              ? userTypeDistribution
              : [
                  { name: "AGAG Employee", value: 0 },
                  { name: "AGAG/Contractor Dependant", value: 0 },
                  { name: "Other Corporate Employee", value: 0 },
                  { name: "Contractor Employee", value: 0 },
                  { name: "Community", value: 0 },
                ];

          // Generate insight based on the real data
          if (userTypeDistribution.length > 0) {
            const topUserType = userTypeDistribution[0];
            const totalVisits = userTypeDistribution.reduce(
              (sum, item) => sum + item.value,
              0
            );
            const topPercentage = (
              (topUserType.value / totalVisits) *
              100
            ).toFixed(1);

            typedData.userTypeInsight = `${topUserType.name} represents the largest group utilizing occupational health services at ${topPercentage}% of visits. This helps prioritize resources for this key demographic.`;
          }

          setOhData(typedData);

          // Store results in cache
          try {
            const cacheData = {
              data: {
                ohData: typedData,
                ohConcerns: fetchedConcerns,
              },
              timestamp: Date.now(),
            };
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          } catch (error) {
            console.error("Error storing cache:", error);
          }
        } else {
          setOhData(null);
        }
        setOhConcerns(fetchedConcerns);
      } catch (error) {
        console.error("Error fetching occupational health data:", error);
        setOhData(null);
        setOhConcerns([]);
        // Still end the timer to avoid orphaned timers
        try {
        } catch (e) {
          console.error("Error ending timer:", e);
        }
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadOccupationalHealthData();
  }, [dateRange]);

  if (isLoading || isLoadingConcerns) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72 mt-1" />
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
                  {[1, 2, 3, 4, 5, 6].map((i) => (
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

            {/* Skeleton for locations analysis */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-72 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="border rounded-md">
                      <div className="p-3 border-b">
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border-b">
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="border rounded-md">
                      <div className="p-3 border-b">
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border-b">
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skeleton for user type analysis */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="border rounded-md">
                      <div className="p-3 border-b">
                        <div className="grid grid-cols-3 gap-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-3 border-b">
                          <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-muted/30 rounded-md">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skeleton for feedback */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-72 mt-1" />
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

  if (!ohData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">
          No occupational health data available.
        </p>
      </div>
    );
  }

  // Rating categories specific to occupational health
  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of personnel" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label:
        "Promptness of feedback - communicating delays, explaining medication, procedure, changes etc.",
    },
    { id: "overall", label: "Overall impression" },
  ];

  // Get relevant occupational health concerns sorted by date
  const recentOhConcerns = ohConcerns
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent concerns

  // Prepare ratings data for chart
  const ratingsChartData = Object.entries(ohData.ratings).map(
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
              <Stethoscope size={20} />
              {ohData.name}
            </CardTitle>
            {/* <CardDescription>
            Occupational Health Unit performance overview based on{" "}
            {ohData.visitCount} survey responses
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
                          Total number of survey submissions for Occupational
                          Health Unit within the selected date range.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ohData.visitCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {ohConcerns.length} total concerns from occupational health
                    visits
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
                          whether they would recommend the Occupational Health
                          services. Calculated as: (Total "Yes" responses ÷
                          Total responses) × 100.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  {(ohData.recommendRate || 0) >= 75 ? (
                    <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(ohData.recommendRate || 0).toFixed(0)}%
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
                          The highest-rated service category for Occupational
                          Health. This indicates the strongest aspect of the
                          health unit's performance based on patient feedback.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <Star className="h-4 w-4 text-[#f6a050]" />
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Find top rated category
                    const ratings = Object.entries(ohData.ratings);
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

                    // Truncate label if too long
                    const displayLabel =
                      category.label.length > 30
                        ? category.label.substring(0, 30) + "..."
                        : category.label;

                    return (
                      <>
                        <div className="text-lg font-bold">
                          <span className="line-clamp-2">{displayLabel}</span>
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
                          The lowest-rated service category for Occupational
                          Health. This area requires immediate attention and
                          improvement to enhance overall patient satisfaction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#e84e3c]" />
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Find lowest rated category
                    const ratings = Object.entries(ohData.ratings);
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

                    // Truncate label if too long
                    const displayLabel =
                      category.label.length > 30
                        ? category.label.substring(0, 30) + "..."
                        : category.label;

                    return (
                      <>
                        <div className="text-lg font-bold">
                          <span className="line-clamp-2">{displayLabel}</span>
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    Overall Satisfaction
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <Info size={14} className="text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>
                          Average satisfaction rating for Occupational Health
                          services on a 5-point scale. Calculated as: Sum of all
                          category ratings ÷ Number of rating categories.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">
                      {ohData.satisfaction.toFixed(1)}
                    </div>
                    <Badge
                      className={cn(
                        ohData.satisfaction >= 4
                          ? "bg-[#22c5bf]/20 text-[#22c5bf] border-[#22c5bf]"
                          : ohData.satisfaction >= 3
                          ? "bg-[#f6a050]/20 text-[#f6a050] border-[#f6a050]"
                          : "bg-[#e84e3c]/20 text-[#e84e3c] border-[#e84e3c]"
                      )}
                    >
                      {valueToRating(ohData.satisfaction)}
                    </Badge>
                  </div>
                  <Progress
                    value={ohData.satisfaction * 20}
                    className={
                      ohData.satisfaction >= 4
                        ? "h-2 bg-[#22c5bf]/30"
                        : ohData.satisfaction >= 3
                        ? "h-2 bg-[#f6a050]/30"
                        : "h-2 bg-[#e84e3c]/30"
                    }
                  />
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
              <CardContent>
                <div className="space-y-4">
                  {ratingCategories.map((category) => {
                    const rating =
                      ohData.ratings[
                        category.id as keyof typeof ohData.ratings
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

            {/* Location Ratings Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    Locations Performance Analysis
                  </div>
                </CardTitle>
                <CardDescription>
                  Top and lowest-rated locations visited during occupational
                  health processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-base mb-3 flex items-center">
                      <Star className="h-4 w-4 text-[#f6a050] mr-2" />
                      Top Rated Locations
                    </h3>
                    {ohData.topRatedLocations &&
                    ohData.topRatedLocations.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ohData.topRatedLocations.map((location, index) => (
                            <TableRow key={`top-${index}`}>
                              <TableCell>{location.name}</TableCell>
                              <TableCell className="text-right">
                                <span className="font-medium">
                                  {location.rating.toFixed(1)}
                                </span>
                                <span className="text-xs ml-1 text-muted-foreground">
                                  ({valueToRating(location.rating)})
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No rating data available
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-base mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-[#e84e3c] mr-2" />
                      Needs Improvement
                    </h3>
                    {ohData.lowestRatedLocations &&
                    ohData.lowestRatedLocations.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ohData.lowestRatedLocations.map(
                            (location, index) => (
                              <TableRow key={`low-${index}`}>
                                <TableCell>{location.name}</TableCell>
                                <TableCell className="text-right">
                                  <span className="font-medium">
                                    {location.rating.toFixed(1)}
                                  </span>
                                  <span className="text-xs ml-1 text-muted-foreground">
                                    ({valueToRating(location.rating)})
                                  </span>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No rating data available
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Type Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    User Type Analysis
                  </div>
                </CardTitle>
                <CardDescription>
                  Distribution of user types utilizing occupational health
                  services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-base mb-3 flex items-center justify-between">
                      <span>User Type Distribution</span>
                    </h3>
                    <div className="h-[250px]">
                      <Pie
                        data={{
                          labels: userTypeData.map((item) => item.name),
                          datasets: [
                            {
                              label: "User Types",
                              data: userTypeData.map((item) => item.value),
                              backgroundColor: userTypeData.map(
                                (_, index) => COLORS[index % COLORS.length]
                              ),
                              borderColor: userTypeData.map(
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
                              position: "right",
                              labels: {
                                boxWidth: 15,
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  const label = context.label || "";
                                  const value = (context.raw as number) || 0;
                                  const total = context.dataset.data.reduce(
                                    (a, b) => a + b,
                                    0
                                  );
                                  const percentage =
                                    total > 0
                                      ? Math.round((value / total) * 100)
                                      : 0;
                                  return `${label}: ${value} users (${percentage}%)`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-base mb-3">
                      User Type Breakdown
                    </h3>
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
                        {userTypeData.map(
                          (item: UserTypeData, index: number) => {
                            const total = userTypeData.reduce(
                              (sum: number, entry: UserTypeData) =>
                                sum + entry.value,
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
                          }
                        )}
                      </TableBody>
                    </Table>

                    <div className="mt-4 p-3 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {ohData.userTypeInsight ||
                          "Understanding the distribution of user types helps in tailoring occupational health services to specific workforce needs."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Occupational Health Feedback</CardTitle>
                <CardDescription>
                  Latest feedback and concerns about the Occupational Health
                  Unit
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConcerns ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : recentOhConcerns.length > 0 ? (
                  <div className="space-y-3">
                    {recentOhConcerns.map((concern, index) => (
                      <Card
                        key={`${concern.submissionId}-${index}`}
                        className="border-l-4 border-l-[#f6a050]"
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
                              {concern.userType}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No occupational health feedback reported.
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
