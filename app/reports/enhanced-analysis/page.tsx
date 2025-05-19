"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  Calendar,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Stethoscope,
  Building,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BedDouble,
  LineChart,
  Utensils,
  Star,
} from "lucide-react";
import {
  fetchRecommendations,
  fetchNotRecommendReasons,
  fetchDepartmentConcerns,
  fetchVisitTimeAnalysis,
  fetchSatisfactionByDemographic,
  fetchTopImprovementAreas,
  fetchAllSurveyData,
  fetchDepartments,
  fetchWards,
  VisitTimeAnalysis,
  DemographicSatisfaction,
  ImprovementArea,
  DepartmentData,
  WardData,
  fetchOverviewData,
} from "../../actions/report-actions-enhanced";
import { OverviewTab } from "./components/overview-tab";
import { DepartmentsTab } from "./components/departments-tab";
import { WardsTab } from "./components/wards-tab";
import { CanteenTab } from "./components/canteen-tab";
import { OccupationalHealthTab } from "./components/occupational-health-tab";

// Colors for charts
const COLORS = [
  "#2a8d46",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ff9800",
  "#f44336",
];

// Convert numeric satisfaction to text
const satisfactionToText = (score: number): string => {
  if (score >= 4.5) return "Excellent";
  if (score >= 3.5) return "Very Good";
  if (score >= 2.5) return "Good";
  if (score >= 1.5) return "Fair";
  return "Poor";
};

// Define the data structure
interface EnhancedData {
  surveyData: any[];
  recommendations: any[];
  notRecommendReasons: any[];
  departmentConcerns: any[];
  visitTimeAnalysis: VisitTimeAnalysis[];
  satisfactionByDemographic: DemographicSatisfaction;
  improvementAreas: ImprovementArea[];
}

// Update the getData function to fetch the enhanced data
const getData = async (
  locationFilter: string | null,
  dateRange: { from: string; to: string } | null,
  searchQuery: string | null
): Promise<EnhancedData> => {
  const [
    surveyData,
    recommendations,
    notRecommendReasons,
    departmentConcerns,
    visitTimeAnalysis,
    satisfactionByDemographic,
    improvementAreas,
  ] = await Promise.all([
    fetchAllSurveyData(locationFilter, dateRange),
    fetchRecommendations(),
    fetchNotRecommendReasons(),
    fetchDepartmentConcerns(),
    fetchVisitTimeAnalysis(),
    fetchSatisfactionByDemographic(),
    fetchTopImprovementAreas(),
  ]);

  return {
    surveyData,
    recommendations,
    notRecommendReasons,
    departmentConcerns,
    visitTimeAnalysis,
    satisfactionByDemographic,
    improvementAreas,
  };
};

export default function EnhancedAnalysisPage() {
  const [dateRange, setDateRange] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("all");

  const [visitPurposeData, setVisitPurposeData] = useState<any>(null);
  const [patientTypeData, setPatientTypeData] = useState<any>(null);
  const [visitTimeData, setVisitTimeData] = useState<any[]>([]);
  const [improvementPriorities, setImprovementPriorities] = useState<any[]>([]);
  const [textFeedback, setTextFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<(DepartmentData | WardData)[]>([]);

  // Move the state initialization here
  const [data, setData] = useState<EnhancedData>({
    surveyData: [],
    recommendations: [],
    notRecommendReasons: [],
    departmentConcerns: [],
    visitTimeAnalysis: [],
    satisfactionByDemographic: {
      byUserType: [],
      byPatientType: [],
    },
    improvementAreas: [],
  });

  // Add this function to fetch data from the server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch overview data using the new endpoint
      const overviewData = await fetchOverviewData();

      // Fetch real department data
      console.log("EnhancedAnalysisPage: Fetching departments data...");
      const departmentsData = await fetchDepartments();
      console.log(
        "EnhancedAnalysisPage: Received departments data:",
        departmentsData
      );

      // Fetch real ward data
      console.log("EnhancedAnalysisPage: Fetching wards data...");
      const wardsData = await fetchWards();
      console.log("EnhancedAnalysisPage: Received wards data:", wardsData);

      // Set data state
      setData({
        surveyData: overviewData.surveyData || [],
        recommendations: overviewData.surveyData || [],
        notRecommendReasons: overviewData.surveyData || [],
        departmentConcerns: overviewData.surveyData || [],
        visitTimeAnalysis: overviewData.visitTimeAnalysis || [],
        satisfactionByDemographic: overviewData.satisfactionByDemographic || {
          byUserType: [],
          byPatientType: [],
        },
        improvementAreas: overviewData.improvementAreas || [],
      });

      // Combine departments and wards into locations
      setLocations([...departmentsData, ...wardsData]);

      // Set state for each section with the real data
      setVisitPurposeData(overviewData.visitPurposeData || null);
      setPatientTypeData(overviewData.patientTypeData || null);
      setVisitTimeData(overviewData.visitTimeData || []);
      setImprovementPriorities(overviewData.improvementAreas || []);

      // For text feedback, we can use the API
      const feedbackData = await fetchDepartmentConcerns();
      const recommendationsData = await fetchRecommendations();
      const notRecommendData = await fetchNotRecommendReasons();

      // Process text feedback data
      if (
        feedbackData.length > 0 ||
        recommendationsData.length > 0 ||
        notRecommendData.length > 0
      ) {
        // Extract all concerns
        const allConcerns = feedbackData
          .map((f) => f.concern)
          .filter((c) => c && c.trim() !== "");

        // Extract all recommendations
        const allRecommendations = recommendationsData
          .map((r) => r.recommendation)
          .filter((r) => r && r.trim() !== "");

        // Extract all "why not recommend" reasons
        const allWhyNotRecommend = notRecommendData
          .map((r) => r.reason)
          .filter((r) => r && r.trim() !== "");

        // Simple word frequency analysis
        const concernWords = extractCommonWords(allConcerns);
        const recommendationWords = extractCommonWords(allRecommendations);
        const whyNotRecommendWords = extractCommonWords(allWhyNotRecommend);

        setTextFeedback({
          concernWords: concernWords.slice(0, 20),
          recommendationWords: recommendationWords.slice(0, 20),
          whyNotRecommendWords: whyNotRecommendWords.slice(0, 20),
          totalConcerns: allConcerns.length,
          totalRecommendations: allRecommendations.length,
          totalWhyNotRecommend: allWhyNotRecommend.length,
        });
      } else {
        // Fallback to empty data
        setTextFeedback({
          concernWords: [],
          recommendationWords: [],
          whyNotRecommendWords: [],
          totalConcerns: 0,
          totalRecommendations: 0,
          totalWhyNotRecommend: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // If there's an error, provide empty data
      setLocations([]);
      // Set default empty states
      setVisitPurposeData(null);
      setPatientTypeData(null);
      setVisitTimeData([]);
      setImprovementPriorities([]);
      setTextFeedback({
        concernWords: [],
        recommendationWords: [],
        whyNotRecommendWords: [],
        totalConcerns: 0,
        totalRecommendations: 0,
        totalWhyNotRecommend: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function for word frequency analysis
  const extractCommonWords = (
    texts: string[]
  ): { text: string; value: number }[] => {
    // Combine all texts
    const combinedText = texts.join(" ").toLowerCase();

    // Remove common stop words
    const stopWords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "was",
      "were",
      "is",
      "are",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "but",
      "or",
      "as",
      "if",
      "then",
      "else",
      "when",
      "up",
      "down",
      "in",
      "out",
      "no",
      "yes",
      "not",
      "so",
      "that",
      "this",
      "these",
      "those",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "us",
      "them",
    ];

    // Split into words and count frequency
    const wordCounts: Record<string, number> = {};

    combinedText.split(/\s+/).forEach((word) => {
      // Clean the word (remove punctuation)
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

      // Skip if empty or a stop word or too short
      if (cleanWord && !stopWords.includes(cleanWord) && cleanWord.length > 2) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    // Convert to array and sort by frequency
    return Object.entries(wordCounts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Word cloud data for visualization
  const wordCloudData = useMemo(() => {
    if (!textFeedback) return [];

    // Combine all word data
    return [
      ...textFeedback.concernWords.map((item: any) => ({
        ...item,
        category: "concern",
        color: "#4caf50",
      })),
      ...textFeedback.recommendationWords.map((item: any) => ({
        ...item,
        category: "recommendation",
        color: "#2196f3",
      })),
      ...textFeedback.whyNotRecommendWords.map((item: any) => ({
        ...item,
        category: "issue",
        color: "#f44336",
      })),
    ];
  }, [textFeedback]);

  return (
    <main className="min-h-screen p-4 md:p-8  overflow-x-hidden">
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
                Enhanced Analysis
              </h1>
            </div>
            <p className="text-muted-foreground">
              Advanced insights and actionable recommendations from survey data
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back to Reports</span>
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
              onClick={fetchData}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter size={18} />
              Global Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Date Range</span>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
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

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} />
                  <span className="text-sm font-medium">Filter Type</span>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">No filter</SelectItem>
                    <SelectItem value="visitPurpose">Visit Purpose</SelectItem>
                    <SelectItem value="patientType">Patient Type</SelectItem>
                    <SelectItem value="userType">User Type</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} />
                  <span className="text-sm font-medium">Filter Value</span>
                </div>
                <Select
                  value={filterValue}
                  onValueChange={setFilterValue}
                  disabled={filterType === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter value" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterType === "visitPurpose" && (
                      <>
                        <SelectItem value="General Practice">
                          General Practice
                        </SelectItem>
                        <SelectItem value="Medicals (Occupational Health)">
                          Occupational Health
                        </SelectItem>
                      </>
                    )}
                    {filterType === "patientType" && (
                      <>
                        <SelectItem value="New Patient">New Patient</SelectItem>
                        <SelectItem value="Returning Patient">
                          Returning Patient
                        </SelectItem>
                      </>
                    )}
                    {filterType === "userType" && (
                      <>
                        <SelectItem value="AGAG Employee">
                          AGAG Employee
                        </SelectItem>
                        <SelectItem value="AGAG/Contractor Dependant">
                          AGAG/Contractor Dependant
                        </SelectItem>
                        <SelectItem value="Other Corporate Employee">
                          Other Corporate Employee
                        </SelectItem>
                        <SelectItem value="Contractor Employee">
                          Contractor Employee
                        </SelectItem>
                      </>
                    )}
                    {filterType === "location" && (
                      <>
                        <SelectItem value="Out-Patient Department (OPD)">
                          OPD
                        </SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Emergency Unit">
                          Emergency
                        </SelectItem>
                        <SelectItem value="Canteen Services">
                          Canteen
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full" disabled={filterType === "all"}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mb-6">
            <CardContent className="flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading data...</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="overview">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="departments">
              <span className="flex items-center gap-1.5">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Departments</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="wards">
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" />
                <span className="hidden sm:inline">Wards</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="canteen">
              <span className="flex items-center gap-1.5">
                <Utensils className="h-4 w-4" />
                <span className="hidden sm:inline">Canteen</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="occupational-health">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Medicals</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="ratings">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Ratings</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Add Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            <OverviewTab
              surveyData={{
                totalResponses: data.surveyData?.length || 0,
                recommendRate: data.surveyData?.length
                  ? Math.round(
                      (data.surveyData.filter((s) => s?.wouldRecommend === true)
                        .length /
                        Math.max(data.surveyData.length, 1)) *
                        100
                    )
                  : 0,
                avgSatisfaction: data.satisfactionByDemographic?.byUserType
                  ?.length
                  ? data.satisfactionByDemographic.byUserType.reduce(
                      (acc, curr) => acc + curr.satisfaction,
                      0
                    ) /
                    Math.max(
                      data.satisfactionByDemographic.byUserType.length,
                      1
                    )
                  : data.surveyData?.reduce(
                      (sum, s) => sum + (s.satisfaction || 0),
                      0
                    ) / Math.max(data.surveyData?.length || 0, 1),
                purposeDistribution: data.surveyData?.length
                  ? [
                      {
                        name: "General Practice",
                        value: data.surveyData.filter(
                          (s) => s?.visitPurpose === "General Practice"
                        ).length,
                        color: "#0088FE",
                      },
                      {
                        name: "Medicals (Occupational Health)",
                        value: data.surveyData.filter(
                          (s) =>
                            s?.visitPurpose === "Medicals (Occupational Health)"
                        ).length,
                        color: "#00C49F",
                      },
                    ]
                  : [],
              }}
              isLoading={isLoading}
              satisfactionByDemographic={data.satisfactionByDemographic}
              visitTimeAnalysis={data.visitTimeAnalysis}
              improvementAreas={data.improvementAreas}
              visitPurposeData={visitPurposeData}
              patientTypeData={patientTypeData}
              visitTimeData={visitTimeData}
            />
          </TabsContent>

          {/* Add Departments Tab Content */}
          <TabsContent value="departments" className="space-y-4">
            <DepartmentsTab isLoading={isLoading} departments={locations} />
          </TabsContent>

          {/* Add Wards Tab Content */}
          <TabsContent value="wards" className="space-y-4">
            <WardsTab
              isLoading={isLoading}
              wards={locations.filter((loc) => loc.type === "ward")}
            />
          </TabsContent>

          {/* Canteen Tab Content */}
          <TabsContent value="canteen">
            <CanteenTab isLoading={isLoading} departments={locations} />
          </TabsContent>

          {/* Occupational Health Tab Content */}
          <TabsContent value="occupational-health">
            <OccupationalHealthTab
              isLoading={isLoading}
              departments={locations}
            />
          </TabsContent>

          {/* Ratings Tab Content */}
          <TabsContent value="ratings">
            {/* Ratings content will be implemented here */}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
