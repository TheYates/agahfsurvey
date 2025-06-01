"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
} from "chart.js";
import { Chart, Bar, Pie } from "react-chartjs-2";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  Download,
  Filter,
  RefreshCw,
  Map,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  SurveyData,
  LocationVisit,
  DepartmentRating,
  SatisfactionDistribution,
} from "../types/survey-types";
import {
  getSurveyData,
  getLocationVisits,
  getDepartmentRatings,
  fetchOverallSatisfactionDistribution,
  getTotalSubmissionCount,
} from "../actions/report-actions";

// Register Chart.js components
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
  PieController
);

// Colors for charts
const COLORS = [
  "#4caf50", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [dateRange, setDateRange] = useState("all");
  const [submissions, setSubmissions] = useState<SurveyData[]>([]);
  const [satisfactionData, setSatisfactionData] = useState<
    { name: string; value: number }[]
  >([]);
  const [locationData, setLocationData] = useState<
    { name: string; count: number }[]
  >([]);
  const [recommendationRate, setRecommendationRate] = useState(0);
  const [averageSatisfaction, setAverageSatisfaction] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualAvgRating, setActualAvgRating] = useState<number | null>(null);
  const [weeklyResponses, setWeeklyResponses] = useState(0);
  const [recommendationRateChange, setRecommendationRateChange] = useState<
    number | null
  >(null);
  const [previousSatisfaction, setPreviousSatisfaction] = useState<
    string | null
  >(null);
  const [satisfactionByLocation, setSatisfactionByLocation] = useState<
    {
      name: string;
      excellent: number;
      veryGood: number;
      good: number;
      fair: number;
      poor: number;
    }[]
  >([]);

  // Log satisfaction data when it changes
  useEffect(() => {
    if (satisfactionData.length > 0) {
    }
  }, [satisfactionData]);

  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthChecked) {
      if (!isAuthenticated) {
        router.push("/");
      }
    }
  }, [isAuthenticated, router, isAuthChecked]);

  // Fetch data once when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch data when component mounts and user is authenticated
      fetchData();

      // Auto-refresh has been removed per user request
    }
  }, [isAuthenticated]);

  // Move fetchData outside of the other useEffect
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Get all submission data
      const surveyData = await getSurveyData();
      // Get the actual total count without filtering
      const totalCount = await getTotalSubmissionCount();

      // Set the TOTAL number of responses without filtering
      setTotalResponses(totalCount);

      const locationVisits = await getLocationVisits();
      const departmentRatings = await getDepartmentRatings();
      const satisfactionDistribution =
        await fetchOverallSatisfactionDistribution();

      if (surveyData?.length > 0) {
        // For debugging, examine the first few survey records
        // Show only the 5 most recent submissions for the table
        const tableSubmissions = surveyData.slice(0, 5);
        setSubmissions(tableSubmissions);

        // Calculate responses this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Filter only on dates, not on other criteria
        const responsesThisWeek = surveyData.filter((survey: SurveyData) => {
          const surveyDate = new Date(survey.created_at);
          return surveyDate >= oneWeekAgo;
        }).length;

        setWeeklyResponses(responsesThisWeek);

        // Use the enhanced satisfaction distribution data
        setSatisfactionData(satisfactionDistribution);

        // Process location data if available
        if (locationVisits?.length > 0) {
          const sortedLocations = locationVisits
            .sort(
              (a: LocationVisit, b: LocationVisit) =>
                b.visit_count - a.visit_count
            )
            .slice(0, 5) // Top 5 locations
            .map((location: LocationVisit) => ({
              name: location.location,
              count: location.visit_count,
            }));

          setLocationData(sortedLocations);
        } else {
          setLocationData([]);
        }

        // Calculate recommendation rate
        const totalRecommendations = surveyData.filter(
          (survey) => survey.wouldRecommend === true
        ).length;
        const recommendationPercentage =
          surveyData.length > 0
            ? Math.round((totalRecommendations / surveyData.length) * 100)
            : 0;
        setRecommendationRate(recommendationPercentage);

        // Calculate recommendation rate change compared to last month
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        // Current month data
        const currentMonthData = surveyData.filter((survey: SurveyData) => {
          const surveyDate = new Date(survey.created_at);
          return (
            surveyDate.getMonth() === currentDate.getMonth() &&
            surveyDate.getFullYear() === currentDate.getFullYear()
          );
        });

        // Last month data
        const lastMonthData = surveyData.filter((survey: SurveyData) => {
          const surveyDate = new Date(survey.created_at);
          return (
            surveyDate.getMonth() === lastMonthDate.getMonth() &&
            surveyDate.getFullYear() === lastMonthDate.getFullYear()
          );
        });

        // Calculate current month recommendation rate
        const currentMonthRecommendations = currentMonthData.reduce(
          (total: number, survey: SurveyData) => {
            return total + (survey.recommendation_rating || 0);
          },
          0
        );

        const currentMonthRate =
          currentMonthData.length > 0
            ? (currentMonthRecommendations / currentMonthData.length) * 10
            : 0;

        // Calculate last month recommendation rate
        const lastMonthRecommendations = lastMonthData.reduce(
          (total: number, survey: SurveyData) => {
            return total + (survey.recommendation_rating || 0);
          },
          0
        );

        const lastMonthRate =
          lastMonthData.length > 0
            ? (lastMonthRecommendations / lastMonthData.length) * 10
            : 0;

        // Calculate the change
        if (lastMonthRate > 0) {
          const change = currentMonthRate - lastMonthRate;
          setRecommendationRateChange(change);
        } else {
          // If no data for last month
          setRecommendationRateChange(null);
        }

        // Calculate average satisfaction
        const totalSatisfaction = surveyData.reduce(
          (total: number, survey: SurveyData) => {
            return total + survey.overall_rating;
          },
          0
        );
        const avgRating = totalSatisfaction / surveyData.length;
        setActualAvgRating(avgRating);

        // Convert numeric rating to text
        let ratingText = "Good";
        if (avgRating >= 4.5) ratingText = "Excellent";
        else if (avgRating >= 3.5) ratingText = "Very Good";
        else if (avgRating >= 2.5) ratingText = "Good";
        else if (avgRating >= 1.5) ratingText = "Fair";
        else ratingText = "Poor";

        setAverageSatisfaction(ratingText);

        // Calculate previous month's average satisfaction
        const lastMonthSatisfaction = lastMonthData.reduce(
          (total: number, survey: SurveyData) => {
            return total + survey.overall_rating;
          },
          0
        );

        if (lastMonthData.length > 0) {
          const lastMonthAvgRating =
            lastMonthSatisfaction / lastMonthData.length;

          // Convert numeric rating to text
          let lastMonthRatingText = "Good";
          if (lastMonthAvgRating >= 4.5) lastMonthRatingText = "Excellent";
          else if (lastMonthAvgRating >= 3.5) lastMonthRatingText = "Very Good";
          else if (lastMonthAvgRating >= 2.5) lastMonthRatingText = "Good";
          else if (lastMonthAvgRating >= 1.5) lastMonthRatingText = "Fair";
          else lastMonthRatingText = "Poor";

          setPreviousSatisfaction(lastMonthRatingText);
        } else {
          setPreviousSatisfaction(null);
        }
      }

      // Process department ratings data for location satisfaction
      if (departmentRatings?.length > 0) {
        const locationSatisfaction: Record<
          string,
          {
            excellent: number;
            veryGood: number;
            good: number;
            fair: number;
            poor: number;
          }
        > = {};

        departmentRatings.forEach((rating: DepartmentRating) => {
          // Make sure we have a valid locationName
          if (!rating.locationName) {
            console.warn("Rating missing locationName:", rating);
            return;
          }

          if (!locationSatisfaction[rating.locationName]) {
            locationSatisfaction[rating.locationName] = {
              excellent: 0,
              veryGood: 0,
              good: 0,
              fair: 0,
              poor: 0,
            };
          }

          // Increment the appropriate rating category based on the rating value
          const ratingValue = parseInt(rating.rating);
          if (ratingValue === 5) {
            locationSatisfaction[rating.locationName].excellent += rating.count;
          } else if (ratingValue === 4) {
            locationSatisfaction[rating.locationName].veryGood += rating.count;
          } else if (ratingValue === 3) {
            locationSatisfaction[rating.locationName].good += rating.count;
          } else if (ratingValue === 2) {
            locationSatisfaction[rating.locationName].fair += rating.count;
          } else if (ratingValue === 1) {
            locationSatisfaction[rating.locationName].poor += rating.count;
          }
        });

        // Update the sort logic to include all five categories
        const satisfactionChartData = Object.entries(locationSatisfaction)
          .map(([name, ratings]) => ({
            name,
            ...ratings,
          }))
          .sort((a, b) => {
            // Sort by highest total ratings
            const totalA = a.excellent + a.veryGood + a.good + a.fair + a.poor;
            const totalB = b.excellent + b.veryGood + b.good + b.fair + b.poor;
            return totalB - totalA;
          })
          .slice(0, 5); // Limit to top 5 locations

        setSatisfactionByLocation(satisfactionChartData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // In the component, add a useEffect to log the locationData changes
  useEffect(() => {
    if (locationData.length > 0) {
    }
  }, [locationData]);

  // If not authenticated, don't render the page content
  if (!isAuthenticated && isAuthChecked) {
    return null;
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <main className="min-h-screen p-4 md:p-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo white.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
                onError={(e) => {
                  console.error("Error loading logo image");
                  e.currentTarget.src = "/placeholder-logo.svg";
                }}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Survey Reports
              </h1>
            </div>
            <p className="text-muted-foreground">
              Analysis and visualization of patient satisfaction survey
              responses
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Responses
              </CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
              <p className="text-xs text-muted-foreground">
                {weeklyResponses} responses this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Recommendation Rate
              </CardTitle>
              <CardDescription>Patients who would recommend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recommendationRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {recommendationRateChange !== null ? (
                  <>
                    {recommendationRateChange > 0 ? "+" : ""}
                    {recommendationRateChange.toFixed(1)}% from last month
                  </>
                ) : (
                  "No prior month data"
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Satisfaction
              </CardTitle>
              <CardDescription>Overall impression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSatisfaction}</div>
              {actualAvgRating !== null && (
                <div className="text-sm text-muted-foreground">
                  {/* Avg: {actualAvgRating.toFixed(2)} / 5 */}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {previousSatisfaction
                  ? averageSatisfaction === previousSatisfaction
                    ? `Same as last month (${previousSatisfaction})`
                    : `${
                        averageSatisfaction > previousSatisfaction
                          ? "Improved"
                          : "Decreased"
                      } from "${previousSatisfaction}"`
                  : "No prior month data"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/reports/service-points"
            className="col-span-1 md:col-span-1"
          >
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map size={18} />
                  Service Points
                </CardTitle>
                <CardDescription>
                  Manage service locations and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and analyze performance across all service points.
                </p>
                <Button className="mt-4" size="sm">
                  View Service Points
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/reports/survey-reports"
            className="col-span-1 md:col-span-1"
          >
            <Card className="h-full transition-all hover:shadow-md text-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Advanced Analysis
                </CardTitle>
                <CardDescription>
                  Compare visit purposes, patient types, and get actionable
                  improvement recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare visit purposes, patient types, and get actionable
                  improvement recommendations.
                </p>
                <Button className="mt-4" size="sm">
                  View Enhanced Analysis
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/reports/submissions"
            className="col-span-1 md:col-span-1"
          >
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  Survey Submissions
                </CardTitle>
                <CardDescription>Individual survey details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse and analyze individual survey submissions with detailed
                  response information.
                </p>
                <Button className="mt-4" size="sm">
                  View Submissions
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Survey Analytics</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="quarter">Last quarter</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 w-full">
            <TabsTrigger className="w-full" value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="w-full" value="locations">
              Locations
            </TabsTrigger>
            <TabsTrigger className="w-full" value="responses">
              Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Satisfaction</CardTitle>
                  <CardDescription>
                    Distribution of satisfaction ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Pie
                      data={{
                        labels: satisfactionData
                          .slice()
                          .reverse()
                          .map((item) => {
                            // Map rating numbers to descriptive text
                            switch (item.name) {
                              case "1":
                                return "Poor";
                              case "2":
                                return "Fair";
                              case "3":
                                return "Good";
                              case "4":
                                return "Very Good";
                              case "5":
                                return "Excellent";
                              default:
                                return item.name;
                            }
                          }),
                        datasets: [
                          {
                            label: "Satisfaction Rating",
                            data: satisfactionData
                              .slice()
                              .reverse()
                              .map((item) => item.value),
                            backgroundColor: satisfactionData
                              .slice()
                              .reverse()
                              .map((item) => {
                                // Match colors to sentiment
                                switch (item.name) {
                                  case "1":
                                    return COLORS[4]; // Poor = red
                                  case "2":
                                    return COLORS[3]; // Fair = orange
                                  case "3":
                                    return COLORS[2]; // Good = beige
                                  case "4":
                                    return COLORS[1]; // Very Good = light teal
                                  case "5":
                                    return COLORS[0]; // Excellent = dark teal
                                  default:
                                    return "#cccccc"; // Default gray
                                }
                              }),
                            borderColor: satisfactionData
                              .slice()
                              .reverse()
                              .map((item) => {
                                // Match colors to sentiment
                                switch (item.name) {
                                  case "1":
                                    return COLORS[4]; // Poor = red
                                  case "2":
                                    return COLORS[3]; // Fair = orange
                                  case "3":
                                    return COLORS[2]; // Good = beige
                                  case "4":
                                    return COLORS[1]; // Very Good = light teal
                                  case "5":
                                    return COLORS[0]; // Excellent = dark teal
                                  default:
                                    return "#cccccc"; // Default gray
                                }
                              }),
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom" as const,
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                const label = context.label || "";
                                const value = context.raw || 0;
                                const dataset = context.dataset;
                                const total = dataset.data.reduce(
                                  (a: number, b: number) => a + b,
                                  0
                                );
                                const percentage = Math.round(
                                  (value / total) * 100
                                );
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Visited Locations</CardTitle>
                  <CardDescription>
                    Number of visits per location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : locationData.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No location data available
                    </div>
                  ) : (
                    <div className="h-80">
                      <Bar
                        data={{
                          labels: locationData.map((item) => item.name),
                          datasets: [
                            {
                              label: "Visit Count",
                              data: locationData.map((item) => item.count),
                              backgroundColor: locationData.map(
                                (_, index) => COLORS[index % COLORS.length]
                              ),
                              borderColor: locationData.map(
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
                              position: "bottom" as const,
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                            y: {
                              beginAtZero: true,
                              grid: {
                                display: true,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Location Satisfaction Ratings</CardTitle>
                <CardDescription>Average ratings by location</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : satisfactionByLocation.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No location satisfaction data available
                  </div>
                ) : (
                  <div className="h-96">
                    <Bar
                      data={{
                        labels: satisfactionByLocation.map((loc) => loc.name),
                        datasets: [
                          {
                            label: "Excellent",
                            data: satisfactionByLocation.map(
                              (loc) => loc.excellent
                            ),
                            backgroundColor: COLORS[1], // light teal
                            borderColor: COLORS[1],
                            borderWidth: 1,
                          },
                          {
                            label: "Very Good",
                            data: satisfactionByLocation.map(
                              (loc) => loc.veryGood
                            ),
                            backgroundColor: COLORS[0], // dark teal
                            borderColor: COLORS[0],
                            borderWidth: 1,
                          },
                          {
                            label: "Good",
                            data: satisfactionByLocation.map((loc) => loc.good),
                            backgroundColor: COLORS[2], // beige
                            borderColor: COLORS[2],
                            borderWidth: 1,
                          },
                          {
                            label: "Fair",
                            data: satisfactionByLocation.map((loc) => loc.fair),
                            backgroundColor: COLORS[3], // orange
                            borderColor: COLORS[3],
                            borderWidth: 1,
                          },
                          {
                            label: "Poor",
                            data: satisfactionByLocation.map((loc) => loc.poor),
                            backgroundColor: COLORS[4], // red
                            borderColor: COLORS[4],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: "y" as const,
                        scales: {
                          x: {
                            stacked: true,
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Ratings",
                            },
                            grid: {
                              display: true,
                            },
                          },
                          y: {
                            stacked: true,
                            grid: {
                              display: false,
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
                                const label = context.dataset.label || "";
                                return `${label}: ${context.raw}`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Recent Survey Responses</CardTitle>
                <CardDescription>Last 5 survey submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    A list of recent survey responses.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Visit Purpose</TableHead>
                      <TableHead>Locations</TableHead>
                      <TableHead>Recommend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((survey) => (
                      <TableRow key={survey.id}>
                        <TableCell className="font-medium align-middle">
                          {String(survey.id).substring(0, 8)}
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex flex-col">
                            <span>
                              {new Date(survey.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(survey.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          {survey.visit_purpose || "General"}
                        </TableCell>
                        <TableCell className="align-middle">
                          {survey.locations_visited?.join(", ") ||
                            "Not specified"}
                        </TableCell>
                        <TableCell className="align-middle">
                          {survey.recommendation_rating > 7 ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
