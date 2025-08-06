"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
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
import { Bar, Pie, Line } from "react-chartjs-2";
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
  QrCode,
  TrendingUp,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  getServicePointsSummary,
  getServicePointFeedback,
  getServicePointRatingDistribution,
  getServicePointFeedbackTrends,
  ServicePointSummary,
  ServicePointFeedback,
  ServicePointRatingDistribution,
} from "@/app/actions/service_point-actions";

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
  "#4caf50", // green
  "#22c5bf", // teal
  "#FFA500", // orange
  "#f6a050", // light orange
  "#e84e3c", // red
];

// Emoji mapping for ratings
const RATING_EMOJIS = {
  1: "😡",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

export default function ServicePointReportsPage() {
  const { isAuthenticated } = useSupabaseAuth();
  const router = useRouter();

  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const [selectedServicePoint, setSelectedServicePoint] = useState<
    number | null
  >(null);
  const [servicePoints, setServicePoints] = useState<ServicePointSummary[]>([]);
  const [feedbackData, setFeedbackData] = useState<ServicePointFeedback[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<
    ServicePointRatingDistribution[]
  >([]);
  const [feedbackTrends, setFeedbackTrends] = useState<
    { date: string; average_rating: number; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [weeklyFeedback, setWeeklyFeedback] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      fetchData();
    }
  }, [isAuthenticated, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const summaryData = await getServicePointsSummary();
      setServicePoints(summaryData);

      // Set default selected service point if none is selected
      if (summaryData.length > 0 && !selectedServicePoint) {
        setSelectedServicePoint(summaryData[0].id);
      }

      // Calculate totals
      const totalRatings = summaryData.reduce(
        (sum, sp) => sum + sp.total_feedback,
        0
      );
      const totalWeekly = summaryData.reduce(
        (sum, sp) => sum + sp.feedback_this_week,
        0
      );
      const weightedRatingSum = summaryData.reduce(
        (sum, sp) => sum + sp.average_rating * sp.total_feedback,
        0
      );
      const overallAverage =
        totalRatings > 0
          ? parseFloat((weightedRatingSum / totalRatings).toFixed(2))
          : 0;

      setTotalFeedback(totalRatings);
      setWeeklyFeedback(totalWeekly);
      setAverageRating(overallAverage);

      // If we have a selected service point, get its detailed data
      if (selectedServicePoint) {
        await fetchServicePointDetails(selectedServicePoint);
      }
    } catch (error) {
      console.error("Error fetching service point data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServicePointDetails = async (servicePointId: number) => {
    try {
      // Get days based on selected timeframe
      const days = timeframeTodays(selectedTimeframe);

      // Fetch detailed data for the selected service point
      const [feedback, distribution, trends] = await Promise.all([
        getServicePointFeedback(servicePointId),
        getServicePointRatingDistribution(servicePointId),
        getServicePointFeedbackTrends(servicePointId, days),
      ]);

      setFeedbackData(feedback);
      setRatingDistribution(distribution);
      setFeedbackTrends(trends);
    } catch (error) {
      console.error(
        `Error fetching details for service point ${servicePointId}:`,
        error
      );
    }
  };

  // Convert timeframe selection to number of days
  const timeframeTodays = (timeframe: string): number => {
    switch (timeframe) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      case "1year":
        return 365;
      default:
        return 30;
    }
  };

  // Handle service point change
  const handleServicePointChange = (id: string) => {
    const numericId = parseInt(id);
    setSelectedServicePoint(numericId);
    fetchServicePointDetails(numericId);
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    if (selectedServicePoint) {
      getServicePointFeedbackTrends(
        selectedServicePoint,
        timeframeTodays(value)
      ).then((data) => {
        setFeedbackTrends(data);
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Prepare chart data for rating distribution
  const distributionChartData = {
    labels: ratingDistribution.map(
      (item) =>
        `${RATING_EMOJIS[item.rating as keyof typeof RATING_EMOJIS]} (${
          item.rating
        })`
    ),
    datasets: [
      {
        label: "Feedback Count",
        data: ratingDistribution.map((item) => item.count),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for trends
  const trendChartData = {
    labels: feedbackTrends.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: "Average Rating",
        data: feedbackTrends.map((item) => item.average_rating),
        borderColor: COLORS[0],
        backgroundColor: `${COLORS[0]}33`,
        tension: 0.4,
        fill: true,
      },
      // Use a separate bar chart for counts
    ],
  };

  // Chart data for feedback counts
  const countChartData = {
    labels: feedbackTrends.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: "Feedback Count",
        data: feedbackTrends.map((item) => item.count),
        backgroundColor: COLORS[1],
      },
    ],
  };

  // Get selected service point name
  const getSelectedServicePointName = () => {
    if (!selectedServicePoint) return "All Service Points";
    const selectedPoint = servicePoints.find(
      (sp) => sp.id === selectedServicePoint
    );
    return selectedPoint ? selectedPoint.name : "Unknown Service Point";
  };

  // If user is not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

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
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Service Point Reports
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and analyze feedback from service point quick surveys
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <BarChart3 size={16} />
                <span className="hidden md:inline">All Reports</span>
              </Button>
            </Link>
            <Link href="/reports/service-points/settings">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Settings size={16} />
                <span className="hidden md:inline">Manage Service Points</span>
              </Button>
            </Link>
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
          </div>
        </div>

        {/* Overall metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-2xl">
                  {averageRating >= 4.5
                    ? "😄"
                    : averageRating >= 3.5
                    ? "🙂"
                    : averageRating >= 2.5
                    ? "😐"
                    : averageRating >= 1.5
                    ? "😕"
                    : "😡"}
                </div>
                <div className="text-sm text-muted-foreground">/ 5</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Feedback Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFeedback}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Feedback This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weeklyFeedback}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Select
              value={selectedServicePoint?.toString() || ""}
              onValueChange={handleServicePointChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service point" />
              </SelectTrigger>
              <SelectContent>
                {servicePoints.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id.toString()}>
                    {sp.name} {!sp.active && "(Inactive)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <Select
              value={selectedTimeframe}
              onValueChange={handleTimeframeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 w-full">
            <TabsTrigger className="w-full" value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="w-full" value="trends">
              Trends
            </TabsTrigger>
            <TabsTrigger className="w-full" value="feedback">
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of ratings for {getSelectedServicePointName()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {ratingDistribution.length > 0 ? (
                    <Pie
                      data={distributionChartData}
                      options={{
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const dataset = context.dataset;
                                const index = context.dataIndex;
                                const value = dataset.data[index] as number;
                                const percentage =
                                  ratingDistribution[index]?.percentage || 0;
                                return `Count: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No rating data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Point Comparison</CardTitle>
                  <CardDescription>
                    Average rating by service point
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Bar
                    data={{
                      labels: servicePoints.map((sp) => sp.name),
                      datasets: [
                        {
                          label: "Average Rating",
                          data: servicePoints.map((sp) => sp.average_rating),
                          backgroundColor: COLORS[0],
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Service Points Summary</CardTitle>
                  <CardDescription>
                    Overview of all service points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Point</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Average Rating</TableHead>
                        <TableHead>Total Feedback</TableHead>
                        <TableHead>Last 7 Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servicePoints.map((sp) => (
                        <TableRow key={sp.id}>
                          <TableCell className="font-medium">
                            {sp.name}
                          </TableCell>
                          <TableCell>{sp.location_type}</TableCell>
                          <TableCell>
                            {sp.average_rating > 0 ? (
                              <div className="flex items-center">
                                {sp.average_rating.toFixed(1)}
                                <span className="ml-2">
                                  {sp.average_rating >= 4.5
                                    ? "😄"
                                    : sp.average_rating >= 3.5
                                    ? "🙂"
                                    : sp.average_rating >= 2.5
                                    ? "😐"
                                    : sp.average_rating >= 1.5
                                    ? "😕"
                                    : "😡"}
                                </span>
                              </div>
                            ) : (
                              "No ratings"
                            )}
                          </TableCell>
                          <TableCell>{sp.total_feedback}</TableCell>
                          <TableCell>{sp.feedback_this_week}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                sp.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {sp.active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Trends</CardTitle>
                <CardDescription>
                  Rating trends for {getSelectedServicePointName()} over the
                  selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {feedbackTrends.length > 0 ? (
                  <div className="relative h-full">
                    <Line
                      data={trendChartData}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                            title: {
                              display: true,
                              text: "Average Rating",
                            },
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                    <div className="mt-8">
                      <Bar
                        data={countChartData}
                        options={{
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: "Feedback Count",
                              },
                            },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No trend data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>
                  Latest feedback for {getSelectedServicePointName()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackData.slice(0, 10).map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>
                            {formatDate(feedback.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {feedback.rating}
                              <span className="ml-2 text-xl">
                                {
                                  RATING_EMOJIS[
                                    feedback.rating as keyof typeof RATING_EMOJIS
                                  ]
                                }
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {feedback.comment || (
                              <span className="text-muted-foreground italic">
                                No comment provided
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No feedback available for this service point
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
