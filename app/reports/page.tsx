"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import Image from "next/image";
import Link from "next/link";
import {
  CustomPieChart,
  CustomBarChart,
  CustomStackedBarChart,
} from "./components/ShadcnCharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
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
  Filter,
  RefreshCw,
  Map,
  BarChart3,
  FileText,
  Info,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
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
  getRecommendationRate,
  getOutpatientRecommendationRate,
  getInpatientRecommendationRate,
  getAverageSatisfaction,
  getSatisfactionByLocation,
  getNPS,
} from "../actions/report-actions";
import "chart.js/auto";

// Colors for charts
const COLORS = [
  "#4caf50", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

// Helper function to shorten location names
const shortenLocationName = (name: string): string => {
  // Remove common prefixes in parentheses
  let shortened = name.replace(/Out-Patient Department \(OPD\)/gi, "OPD");
  shortened = shortened.replace(/In-Patient Department \(IPD\)/gi, "IPD");
  shortened = shortened.replace(
    /Occupational Health Unit \(Medicals\)/gi,
    "Occupational Health"
  );

  // Remove "Department" if it comes after the main location name
  shortened = shortened.replace(/Department/gi, "Dept");

  return shortened;
};

export default function ReportsPage() {
  const { isAuthenticated, loading: authLoading } = useSupabaseAuth();
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
  const [outpatientRecommendationRate, setOutpatientRecommendationRate] = useState(0);
  const [inpatientRecommendationRate, setInpatientRecommendationRate] = useState(0);
  const [averageSatisfaction, setAverageSatisfaction] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyResponses, setWeeklyResponses] = useState(0);
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
  const [npsData, setNpsData] = useState<{
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    total: number;
  }>({ score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 });

  // Redirect to home if not authenticated (only after auth check completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

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

      // Execute all API calls in parallel for better performance
      const [
        surveyData,
        totalCount,
        locationVisits,
        departmentRatings,
        satisfactionDistribution,
        recommendationRateData,
        outpatientRecommendationRateData,
        inpatientRecommendationRateData,
        averageSatisfactionData,
        satisfactionByLocationData,
        nps,
      ] = await Promise.all([
        getSurveyData(),
        getTotalSubmissionCount(),
        getLocationVisits(),
        getDepartmentRatings(),
        fetchOverallSatisfactionDistribution(),
        getRecommendationRate(),
        getOutpatientRecommendationRate(),
        getInpatientRecommendationRate(),
        getAverageSatisfaction(),
        getSatisfactionByLocation(),
        getNPS(),
      ]);

      // Set the TOTAL number of responses without filtering
      setTotalResponses(totalCount);
      setRecommendationRate(recommendationRateData);
      setOutpatientRecommendationRate(outpatientRecommendationRateData);
      setInpatientRecommendationRate(inpatientRecommendationRateData);
      setAverageSatisfaction(averageSatisfactionData);
      setNpsData(nps);
      // Apply location name shortening to satisfaction by location data
      const shortenedSatisfactionByLocation = satisfactionByLocationData.map(
        (loc: any) => ({
          ...loc,
          name: shortenLocationName(loc.name),
        })
      );
      setSatisfactionByLocation(shortenedSatisfactionByLocation);

      if (surveyData?.length > 0) {
        // For debugging, examine the first few survey records
        // Show only the 5 most recent submissions for the table
        const tableSubmissions = surveyData.slice(0, 5);
        setSubmissions(tableSubmissions);

        // Calculate responses this week (week starts on Monday)
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Calculate days since Monday (if Sunday, go back 6 days; if Monday, 0 days; etc.)
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - daysSinceMonday);
        startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

        // Filter only on dates, not on other criteria
        const responsesThisWeek = surveyData.filter((survey: SurveyData) => {
          const surveyDate = new Date(survey.created_at);
          return surveyDate >= startOfWeek;
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
              name: shortenLocationName(location.location),
              count: location.visit_count,
            }));

          setLocationData(sortedLocations);
        } else {
          setLocationData([]);
        }

        // Use the pre-fetched recommendation rate and average satisfaction from API
        // These values are already set from the parallel API calls above
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
            name: shortenLocationName(name),
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

  // Show nothing while auth is loading or if not authenticated
  if (authLoading) {
    return null;
  }

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
              onClick={fetchData}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Out-Patient Recommendation Rate
                </CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">How it's calculated:</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>
                          Fetches submissions from departments, occupational health, and canteen
                        </li>
                        <li>
                          Counts how many respondents said "Yes" to recommending
                        </li>
                        <li>
                          Divides by total submissions and multiplies by 100
                        </li>
                      </ol>
                      <div className="text-xs text-muted-foreground mt-2">
                        Out-patient includes: departments, occupational health unit, and canteen
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription>Out-patient services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {outpatientRecommendationRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Out-patient recommendation rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  In-Patient Recommendation Rate
                </CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">How it's calculated:</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>
                          Fetches submissions from wards
                        </li>
                        <li>
                          Counts how many respondents said "Yes" to recommending
                        </li>
                        <li>
                          Divides by total submissions and multiplies by 100
                        </li>
                      </ol>
                      <div className="text-xs text-muted-foreground mt-2">
                        In-patient includes: all ward services
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription>In-patient services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inpatientRecommendationRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                In-patient recommendation rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Average Satisfaction
                </CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">How it's calculated:</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Fetches all ratings from the database</li>
                        <li>
                          Converts text ratings to numbers (Excellent=5, Very
                          Good=4, Good=3, Fair=2, Poor=1)
                        </li>
                        <li>Calculates the average of all ratings</li>
                        <li>Converts the numeric average back to text</li>
                      </ol>
                      <div className="text-xs text-muted-foreground mt-2">
                        Example: If average is 4.3, it shows "Very Good"
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription>Overall impression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSatisfaction}</div>
              <p className="text-xs text-muted-foreground">
                Based on all ratings across all locations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Net Promoter Score
                </CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">How it's calculated:</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>
                          Promoters (9-10): Customers who gave ratings of 9 or
                          10
                        </li>
                        <li>
                          Passives (7-8): Customers who gave ratings of 7 or 8
                        </li>
                        <li>
                          Detractors (0-6): Customers who gave ratings of 0-6
                        </li>
                        <li>NPS = ((% Promoters) - (% Detractors) + 100) / 2</li>
                      </ol>
                      <div className="text-xs text-muted-foreground mt-2">
                        Score ranges from 0% to 100%. Higher scores indicate
                        better customer loyalty.
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription>Customer loyalty metric</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 text-center">
                  <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
                  <div className="text-xl font-bold text-[#22c5bf]">
                    {npsData.promoters || 0}
                  </div>
                  <span className="text-[10px] text-[#22c5bf]">
                    Promoters {npsData.total ? Math.round((npsData.promoters / npsData.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="h-4 w-4 flex items-center justify-center">
                    <div className="h-0.5 w-3 bg-[#f6a050]" />
                  </div>
                  <div className="text-xl font-bold text-[#f6a050]">
                    {npsData.passives || 0}
                  </div>
                  <span className="text-[10px] text-[#f6a050]">
                    Passives {npsData.total ? Math.round((npsData.passives / npsData.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                  <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
                  <div className="text-xl font-bold text-[#e84e3c]">
                    {npsData.detractors || 0}
                  </div>
                  <span className="text-[10px] text-[#e84e3c]">
                    Detractors {npsData.total ? Math.round((npsData.detractors / npsData.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/reports/service-points"
            className="col-span-1 md:col-span-1 group"
          >
            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Map size={20} className="text-primary" />
                    Service Points
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </CardTitle>
                <CardDescription>
                  Manage service locations and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4">
                  View and analyze performance across all service points.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  View Service Points
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/reports/survey-reports"
            className="col-span-1 md:col-span-1 group"
          >
            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-green-900 hover:border-primary cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" />
                    Advanced Analysis
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </CardTitle>
                <CardDescription>
                  Compare visit purposes, patient types, and get actionable
                  improvement recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4">
                  Compare visit purposes, patient types, and get actionable
                  improvement recommendations.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  View Enhanced Analysis
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/reports/submissions"
            className="col-span-1 md:col-span-1 group"
          >
            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Survey Submissions
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </CardTitle>
                <CardDescription>Individual survey details</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4">
                  Browse and analyze individual survey submissions with detailed
                  response information.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  View Submissions
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Overall Satisfaction</CardTitle>
                      <CardDescription>
                        Distribution of satisfaction ratings
                      </CardDescription>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">
                            How it's calculated:
                          </h4>
                          <ol className="text-sm space-y-1 list-decimal list-inside">
                            <li>Fetches all ratings from the database</li>
                            <li>
                              Converts text ratings to numbers (Excellent=5,
                              Very Good=4, etc.)
                            </li>
                            <li>Counts how many times each rating appears</li>
                            <li>Shows the distribution as a pie chart</li>
                          </ol>
                          <div className="text-xs text-muted-foreground mt-2">
                            Example: If you have 50 "Excellent" and 30 "Very
                            Good", the chart shows 50% and 30%
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <CustomPieChart
                      data={satisfactionData
                        .slice()
                        .reverse()
                        .map((item) => ({
                          name:
                            item.name === "1"
                              ? "Poor"
                              : item.name === "2"
                                ? "Fair"
                                : item.name === "3"
                                  ? "Good"
                                  : item.name === "4"
                                    ? "Very Good"
                                    : item.name === "5"
                                      ? "Excellent"
                                      : item.name,
                          value: item.value,
                        }))}
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
                      <CustomBarChart
                        data={locationData.map((item) => ({
                          name: item.name,
                          value: item.count,
                        }))}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Location Satisfaction Ratings</CardTitle>
                    <CardDescription>
                      Average ratings by location
                    </CardDescription>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold">How it's calculated:</h4>
                        <ol className="text-sm space-y-1 list-decimal list-inside">
                          <li>
                            Fetches all ratings with their associated locations
                          </li>
                          <li>
                            Groups ratings by location and rating level (1-5)
                          </li>
                          <li>
                            Counts each rating type (Excellent, Very Good, Good,
                            Fair, Poor) per location
                          </li>
                          <li>
                            Displays as a stacked horizontal bar chart showing
                            the breakdown
                          </li>
                        </ol>
                        <div className="text-xs text-muted-foreground mt-2">
                          This shows the distribution of satisfaction levels
                          across different service locations
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
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
                    <CustomStackedBarChart data={satisfactionByLocation} />
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
                              {new Date(survey.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
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
                          {survey.locations_visited &&
                            survey.locations_visited.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {survey.locations_visited.length <= 2
                                  ? survey.locations_visited.join(", ")
                                  : `${survey.locations_visited
                                    .slice(0, 2)
                                    .join(", ")}...`}
                              </span>
                              {survey.locations_visited.length > 2 && (
                                <Link href="/reports/submissions">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    +{survey.locations_visited.length - 2} more
                                  </Button>
                                </Link>
                              )}
                            </div>
                          ) : (
                            "Not specified"
                          )}
                        </TableCell>
                        <TableCell className="align-middle">
                          <Badge
                            variant={
                              survey.wouldRecommend ? "default" : "destructive"
                            }
                            className="whitespace-nowrap"
                          >
                            {survey.wouldRecommend ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-center">
                  <Link href="/reports/submissions">
                    <Button variant="outline" className="gap-2">
                      <FileText size={16} />
                      View All Submissions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
