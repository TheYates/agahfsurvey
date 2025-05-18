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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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
} from "lucide-react";
import {
  getSurveyData,
  getLocationVisits,
  getDepartmentRatings,
  SurveyData,
  LocationVisit,
  DepartmentRating,
} from "../actions/report-actions";

// Colors for charts
const COLORS = ["#2a8d46", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b"];

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

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const surveyData = await getSurveyData();
        const locationVisits = await getLocationVisits();
        const departmentRatings = await getDepartmentRatings();

        if (surveyData?.length > 0) {
          // Show only the 5 most recent submissions for the table
          setSubmissions(surveyData.slice(0, 5));
          setTotalResponses(surveyData.length);

          // Calculate satisfaction distribution
          const distribution: Record<string, number> = {};
          surveyData.forEach((survey: SurveyData) => {
            const rating = survey.overall_rating.toString();
            distribution[rating] = (distribution[rating] || 0) + 1;
          });

          const satisfactionChartData = Object.entries(distribution).map(
            ([name, value]) => ({
              name,
              value: value as number,
            })
          );
          setSatisfactionData(satisfactionChartData);

          // Process location data if available
          if (locationVisits?.length > 0) {
            const sortedLocations = locationVisits
              .sort(
                (a: LocationVisit, b: LocationVisit) =>
                  b.visit_count - a.visit_count
              )
              .slice(0, 7) // Top 7 locations
              .map((location: LocationVisit) => ({
                name: location.location,
                count: location.visit_count,
              }));
            setLocationData(sortedLocations);
          }

          // Calculate recommendation rate
          const totalRecommendations = surveyData.reduce(
            (total: number, survey: SurveyData) => {
              return total + (survey.recommendation_rating || 0);
            },
            0
          );
          setRecommendationRate(
            (totalRecommendations / surveyData.length) * 10
          );

          // Calculate average satisfaction
          const totalSatisfaction = surveyData.reduce(
            (total: number, survey: SurveyData) => {
              return total + survey.overall_rating;
            },
            0
          );
          const avgRating = totalSatisfaction / surveyData.length;

          // Convert numeric rating to text
          let ratingText = "Good";
          if (avgRating >= 4.5) ratingText = "Excellent";
          else if (avgRating >= 3.5) ratingText = "Very Good";
          else if (avgRating >= 2.5) ratingText = "Good";
          else if (avgRating >= 1.5) ratingText = "Fair";
          else ratingText = "Poor";

          setAverageSatisfaction(ratingText);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // If not authenticated, don't render the page content
  if (!isAuthenticated && isAuthChecked) {
    return null;
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo svg.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
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
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
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
                +12% from last month
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
                +3% from last month
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
              <p className="text-xs text-muted-foreground">
                Improved from "Good"
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/reports/advanced-analysis"
            className="col-span-1 md:col-span-1"
          >
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  Advanced Analysis
                </CardTitle>
                <CardDescription>
                  In-depth analysis of survey data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore detailed trends, correlations, and demographic
                  breakdowns of survey responses.
                </p>
                <Button className="mt-4" size="sm">
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/reports/enhanced-analysis"
            className="col-span-1 md:col-span-1"
          >
            <Card className="h-full transition-all hover:shadow-md bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Enhanced Analysis
                </CardTitle>
                <CardDescription>New actionable insights</CardDescription>
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

          <Link href="/reports/heatmap" className="col-span-1 md:col-span-1">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map size={18} />
                  Satisfaction Heatmap
                </CardTitle>
                <CardDescription>
                  Visual representation of ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View a color-coded heatmap of satisfaction ratings by
                  department and category.
                </p>
                <Button className="mt-4" size="sm">
                  View Heatmap
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
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
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
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={satisfactionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {satisfactionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#4b5563",
                                  "#6b7280",
                                  "#9ca3af",
                                  "#d1d5db",
                                  "#e5e7eb",
                                ][index % 5]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={locationData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4b5563" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                ) : locationData.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No location data available
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={locationData.map((loc) => ({
                          name: loc.name,
                          visits: loc.count,
                        }))}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip
                          formatter={(value) => [`${value} visits`, "Visits"]}
                        />
                        <Legend />
                        <Bar
                          dataKey="visits"
                          fill="#4b5563"
                          name="Visit Count"
                        />
                      </BarChart>
                    </ResponsiveContainer>
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
                      <TableHead>Overall</TableHead>
                      <TableHead>Recommend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((survey) => (
                      <TableRow key={survey.id}>
                        <TableCell className="font-medium">
                          {survey.id}
                        </TableCell>
                        <TableCell>
                          {
                            new Date(survey.created_at)
                              .toISOString()
                              .split("T")[0]
                          }
                        </TableCell>
                        <TableCell>
                          {survey.visit_purpose || "General"}
                        </TableCell>
                        <TableCell>
                          {survey.locations_visited?.join(", ") ||
                            "Not specified"}
                        </TableCell>
                        <TableCell>{survey.overall_rating}</TableCell>
                        <TableCell>
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
