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
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

import { Skeleton } from "@/components/ui/skeleton";

import {
  DepartmentConcern,
  Recommendation,
  fetchDepartmentConcerns,
  fetchRecommendations,
  fetchVisitTimeData,
  fetchPatientTypeData,
  fetchAllSurveyData,
} from "@/app/actions/department-actions";

// Import the new DepartmentDetails component
import { DepartmentDetails } from "./department-details";

// Add import for the Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Cache keys and expiration time
const CACHE_KEY_CONCERNS = "departmentConcernsData";
const CACHE_KEY_ADDITIONAL = "departmentAdditionalData";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  // Fetch department concerns and recommendations with caching
  useEffect(() => {
    const loadDepartmentFeedback = async () => {
      setIsLoadingConcerns(true);
      try {
        console.time("DepartmentsTab data loading");

        // Check for cached data first
        const cachedData = sessionStorage.getItem(CACHE_KEY_CONCERNS);

        if (cachedData) {
          const { concerns, recommendations, timestamp } =
            JSON.parse(cachedData);

          // Use cached data if it's less than 5 minutes old
          if (Date.now() - timestamp < CACHE_TIME) {
            console.log("DepartmentsTab: Using cached data");
            setDepartmentConcerns(concerns);
            setDepartmentRecommendations(recommendations);
            setIsLoadingConcerns(false);
            console.timeEnd("DepartmentsTab data loading");
            return;
          }
        }

        // Fetch fresh data if no valid cache exists
        console.time("fetchDepartmentConcerns");
        const concerns = await fetchDepartmentConcerns();
        console.timeEnd("fetchDepartmentConcerns");
        setDepartmentConcerns(concerns);

        console.time("fetchRecommendations");
        const recommendations = await fetchRecommendations();
        console.timeEnd("fetchRecommendations");
        setDepartmentRecommendations(recommendations);

        // Store in cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY_CONCERNS,
          JSON.stringify({
            concerns,
            recommendations,
            timestamp: Date.now(),
          })
        );

        console.timeEnd("DepartmentsTab data loading");
      } catch (error) {
        console.error("Error fetching department feedback:", error);
        setDepartmentConcerns([]);
        setDepartmentRecommendations([]);
        console.timeEnd("DepartmentsTab data loading");
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadDepartmentFeedback();
  }, []);

  // Fetch additional data with caching
  useEffect(() => {
    const loadAdditionalData = async () => {
      setIsLoadingAdditionalData(true);
      try {
        // Check for cached data first
        const cachedData = sessionStorage.getItem(CACHE_KEY_ADDITIONAL);

        if (cachedData) {
          const { timeData, ptData, timestamp } = JSON.parse(cachedData);

          // Use cached data if it's less than 5 minutes old
          if (Date.now() - timestamp < CACHE_TIME) {
            setVisitTimeData(timeData);
            setPatientTypeData(ptData);
            setIsLoadingAdditionalData(false);
            return;
          }
        }

        // Fetch fresh data if no valid cache exists
        // Fetch visit time data for calculating average visit times
        const timeData = await fetchVisitTimeData();
        setVisitTimeData(timeData);

        // Fetch patient type data for returning rates
        const ptData = await fetchPatientTypeData();
        setPatientTypeData(ptData);

        // Store in cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY_ADDITIONAL,
          JSON.stringify({
            timeData,
            ptData,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error fetching additional department data:", error);
        setVisitTimeData([]);
        setPatientTypeData(null);
      } finally {
        setIsLoadingAdditionalData(false);
      }
    };

    loadAdditionalData();
  }, []);

  // Generate satisfaction trend with caching (using the same additional data cache)
  useEffect(() => {
    const generateSatisfactionTrend = async () => {
      try {
        // Check if we already have cached data
        const cachedData = sessionStorage.getItem(CACHE_KEY_ADDITIONAL);

        if (cachedData) {
          const { satisfactionData, timestamp } = JSON.parse(cachedData);

          // Use cached data if it's less than 5 minutes old and contains satisfaction data
          if (satisfactionData && Date.now() - timestamp < CACHE_TIME) {
            setSatisfactionTrend(satisfactionData);
            return;
          }
        }

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

        // After calculating the trend data, update the existing cache
        try {
          const cachedData = sessionStorage.getItem(CACHE_KEY_ADDITIONAL);
          if (cachedData) {
            const parsedCache = JSON.parse(cachedData);
            parsedCache.satisfactionData = satisfactionTrend;
            sessionStorage.setItem(
              CACHE_KEY_ADDITIONAL,
              JSON.stringify(parsedCache)
            );
          }
        } catch (error) {
          console.error("Error updating satisfaction trend cache:", error);
        }
      } catch (error) {
        console.error("Error generating satisfaction trend:", error);
        // Provide minimal fallback data - just one data point for the current month
        const currentMonth = new Date().toLocaleString("default", {
          month: "short",
        });
        const fallbackData = [
          {
            month: currentMonth,
            satisfaction: selectedDepartment?.satisfaction || 3.5,
          },
        ];

        setSatisfactionTrend(fallbackData);
      }
    };

    generateSatisfactionTrend();
  }, []);

  useEffect(() => {}, [departmentConcerns, departmentRecommendations]);

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

  // Only include department concerns from locations with locationType = "department"
  const combinedFeedback = departmentConcerns
    .filter((concern) =>
      // Filter concerns to only include those from department-type locations
      departmentsOnly.some((dept) => dept.name === concern.locationName)
    )
    .map((concern) => ({
      submissionId: concern.submissionId,
      type: "concern",
      locationName: concern.locationName,
      text: concern.concern,
      submittedAt: concern.submittedAt,
      userType: concern.userType,
    }))
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3);

  if (selectedDepartment) {
    // Show individual department details
    // Get department ranking
    const departmentRanking =
      departmentsOnly
        .sort((a, b) => b.satisfaction - a.satisfaction)
        .findIndex((dept) => dept.id === selectedDepartment.id) + 1;

    return (
      <DepartmentDetails
        selectedDepartment={selectedDepartment}
        departmentRanking={departmentRanking}
        departmentsOnly={departmentsOnly}
        departmentConcerns={departmentConcerns}
        departmentRecommendations={departmentRecommendations}
        ratingCategories={ratingCategories}
        satisfactionTrend={satisfactionTrend}
        onBackClick={() => setSelectedDepartment(null)}
        valueToRating={valueToRating}
      />
    );
  }

  // Department overview and list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Department Performance Overview</h2>
        <div className="w-[280px]">
          <Select
            onValueChange={(value) => {
              const dept = departmentsOnly.find((d) => d.id === value);
              if (dept) {
                setSelectedDepartment(dept);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsOnly
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
            <LoadingSpinner />
          ) : combinedFeedback.length > 0 ? (
            <div className="space-y-3">
              {combinedFeedback.map((feedback, index) => (
                <Card
                  key={`${feedback.type}-${feedback.submissionId}-${index}`}
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
            <p>No department feedback reported.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
