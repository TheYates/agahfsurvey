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
} from "lucide-react";
import {
  fetchRecommendations,
  fetchNotRecommendReasons,
  fetchDepartmentConcerns,
  fetchVisitTimeAnalysis,
  fetchSatisfactionByDemographic,
  fetchTopImprovementAreas,
  fetchAllSurveyData,
  VisitTimeAnalysis,
  DemographicSatisfaction,
  ImprovementArea,
  fetchOverviewData,
} from "../../actions/report-actions-enhanced";
import { OverviewTab } from "./components/overview-tab";

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
      console.log("Starting to fetch overview data...");
      // Fetch overview data using the new endpoint
      const overviewData = await fetchOverviewData();
      console.log(
        "Overview data fetch complete:",
        JSON.stringify(overviewData, null, 2)
      );

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

      console.log("Data state set with:", {
        surveyCount: overviewData.surveyData?.length || 0,
        recommendRate: overviewData.surveyData?.length
          ? Math.round(
              (overviewData.surveyData.filter((s) => s?.wouldRecommend === true)
                .length /
                Math.max(overviewData.surveyData.length, 1)) *
                100
            )
          : 0,
        timeAnalysis: overviewData.visitTimeAnalysis?.length || 0,
        satisfactionData: {
          userTypesCount:
            overviewData.satisfactionByDemographic?.byUserType?.length || 0,
          patientTypesCount:
            overviewData.satisfactionByDemographic?.byPatientType?.length || 0,
        },
        improvementAreas: overviewData.improvementAreas?.length || 0,
      });

      // Set state for each section with the real data
      setVisitPurposeData(overviewData.visitPurposeData || null);
      setPatientTypeData(overviewData.patientTypeData || null);
      setVisitTimeData(overviewData.visitTimeData || []);
      setImprovementPriorities(overviewData.improvementAreas || []);

      console.log("Starting to fetch text feedback data...");
      // For text feedback, we can use the API
      const feedbackData = await fetchDepartmentConcerns();
      const recommendationsData = await fetchRecommendations();
      const notRecommendData = await fetchNotRecommendReasons();

      console.log("Text feedback data fetched:", {
        feedbackCount: feedbackData.length,
        recommendationsCount: recommendationsData.length,
        notRecommendCount: notRecommendData.length,
      });

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
      console.log("Data fetching complete, isLoading set to false");
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
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </span>
            </TabsTrigger>
            {/* <TabsTrigger value="visit-purpose">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Visit Purpose</span>
              </span>
            </TabsTrigger> */}
            {/* <TabsTrigger value="patient-type">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Patient Type</span>
              </span>
            </TabsTrigger> */}
            {/* <TabsTrigger value="visit-time">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Visit Time</span>
              </span>
            </TabsTrigger> */}
            <TabsTrigger value="improvement">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Improvement</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="text-analysis">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Text Analysis</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="raw-feedback">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Raw Feedback</span>
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

          {/* Visit Purpose Comparison */}
          <TabsContent value="visit-purpose">
            {visitPurposeData && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope size={18} />
                      Visit Purpose Comparison
                    </CardTitle>
                    <CardDescription>
                      Comparing experiences between General Practice and
                      Occupational Health visits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Building size={18} />
                            General Practice
                            <Badge variant="outline" className="ml-2">
                              {visitPurposeData.generalPractice.count} visits
                            </Badge>
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Overall Satisfaction:
                                </span>
                                <span className="font-bold">
                                  {visitPurposeData.generalPractice.satisfaction.toFixed(
                                    1
                                  )}
                                  /5.0
                                  <span className="text-sm font-normal ml-1">
                                    (
                                    {satisfactionToText(
                                      visitPurposeData.generalPractice
                                        .satisfaction
                                    )}
                                    )
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={
                                  visitPurposeData.generalPractice
                                    .satisfaction * 20
                                }
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Recommendation Rate:
                                </span>
                                <span className="font-bold">
                                  {visitPurposeData.generalPractice.recommendRate.toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  visitPurposeData.generalPractice.recommendRate
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">Top Department:</span>
                              <span className="font-bold">
                                {
                                  visitPurposeData.generalPractice.topDepartment
                                    .name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {visitPurposeData.generalPractice.topDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">
                                Area for Improvement:
                              </span>
                              <span className="font-bold">
                                {
                                  visitPurposeData.generalPractice
                                    .bottomDepartment.name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {visitPurposeData.generalPractice.bottomDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Most Visited Locations
                          </h4>
                          <div className="space-y-2">
                            {visitPurposeData.generalPractice.commonLocations.map(
                              (loc: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm">{loc.name}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">
                                      {loc.count} visits
                                    </span>
                                    <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-green-500 h-full rounded-full"
                                        style={{
                                          width: `${
                                            (loc.count /
                                              visitPurposeData.generalPractice
                                                .commonLocations[0].count) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Stethoscope size={18} />
                            Occupational Health
                            <Badge variant="outline" className="ml-2">
                              {visitPurposeData.occupationalHealth.count} visits
                            </Badge>
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Overall Satisfaction:
                                </span>
                                <span className="font-bold">
                                  {visitPurposeData.occupationalHealth.satisfaction.toFixed(
                                    1
                                  )}
                                  /5.0
                                  <span className="text-sm font-normal ml-1">
                                    (
                                    {satisfactionToText(
                                      visitPurposeData.occupationalHealth
                                        .satisfaction
                                    )}
                                    )
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={
                                  visitPurposeData.occupationalHealth
                                    .satisfaction * 20
                                }
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Recommendation Rate:
                                </span>
                                <span className="font-bold">
                                  {visitPurposeData.occupationalHealth.recommendRate.toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  visitPurposeData.occupationalHealth
                                    .recommendRate
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">Top Department:</span>
                              <span className="font-bold">
                                {
                                  visitPurposeData.occupationalHealth
                                    .topDepartment.name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {visitPurposeData.occupationalHealth.topDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">
                                Area for Improvement:
                              </span>
                              <span className="font-bold">
                                {
                                  visitPurposeData.occupationalHealth
                                    .bottomDepartment.name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {visitPurposeData.occupationalHealth.bottomDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Most Visited Locations
                          </h4>
                          <div className="space-y-2">
                            {visitPurposeData.occupationalHealth.commonLocations.map(
                              (loc: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm">{loc.name}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">
                                      {loc.count} visits
                                    </span>
                                    <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-green-500 h-full rounded-full"
                                        style={{
                                          width: `${
                                            (loc.count /
                                              visitPurposeData
                                                .occupationalHealth
                                                .commonLocations[0].count) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Satisfaction Comparison
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                category: "Overall",
                                "General Practice":
                                  visitPurposeData.generalPractice.satisfaction,
                                "Occupational Health":
                                  visitPurposeData.occupationalHealth
                                    .satisfaction,
                              },
                              {
                                category: "Recommendation",
                                "General Practice":
                                  visitPurposeData.generalPractice
                                    .recommendRate / 20, // Scale to 0-5
                                "Occupational Health":
                                  visitPurposeData.occupationalHealth
                                    .recommendRate / 20,
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip
                              formatter={(value) => [
                                typeof value === "number"
                                  ? value.toFixed(2)
                                  : value,
                                "",
                              ]}
                            />
                            <Legend />
                            <Bar dataKey="General Practice" fill="#4b5563" />
                            <Bar dataKey="Occupational Health" fill="#6b7280" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Patient Type Comparison */}
          <TabsContent value="patient-type">
            {patientTypeData && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users size={18} />
                      Patient Type Comparison
                    </CardTitle>
                    <CardDescription>
                      Comparing experiences between new and returning patients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Users size={18} />
                            New Patients
                            <Badge variant="outline" className="ml-2">
                              {patientTypeData.newPatients.count} patients
                            </Badge>
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Overall Satisfaction:
                                </span>
                                <span className="font-bold">
                                  {patientTypeData.newPatients.satisfaction.toFixed(
                                    1
                                  )}
                                  /5.0
                                  <span className="text-sm font-normal ml-1">
                                    (
                                    {satisfactionToText(
                                      patientTypeData.newPatients.satisfaction
                                    )}
                                    )
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={
                                  patientTypeData.newPatients.satisfaction * 20
                                }
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Recommendation Rate:
                                </span>
                                <span className="font-bold">
                                  {patientTypeData.newPatients.recommendRate.toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  patientTypeData.newPatients.recommendRate
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">Top Department:</span>
                              <span className="font-bold">
                                {patientTypeData.newPatients.topDepartment.name}
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {patientTypeData.newPatients.topDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">
                                Area for Improvement:
                              </span>
                              <span className="font-bold">
                                {
                                  patientTypeData.newPatients.bottomDepartment
                                    .name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {patientTypeData.newPatients.bottomDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Users size={18} />
                            Returning Patients
                            <Badge variant="outline" className="ml-2">
                              {patientTypeData.returningPatients.count} patients
                            </Badge>
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Overall Satisfaction:
                                </span>
                                <span className="font-bold">
                                  {patientTypeData.returningPatients.satisfaction.toFixed(
                                    1
                                  )}
                                  /5.0
                                  <span className="text-sm font-normal ml-1">
                                    (
                                    {satisfactionToText(
                                      patientTypeData.returningPatients
                                        .satisfaction
                                    )}
                                    )
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={
                                  patientTypeData.returningPatients
                                    .satisfaction * 20
                                }
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">
                                  Recommendation Rate:
                                </span>
                                <span className="font-bold">
                                  {patientTypeData.returningPatients.recommendRate.toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  patientTypeData.returningPatients
                                    .recommendRate
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">Top Department:</span>
                              <span className="font-bold">
                                {
                                  patientTypeData.returningPatients
                                    .topDepartment.name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {patientTypeData.returningPatients.topDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm">
                                Area for Improvement:
                              </span>
                              <span className="font-bold">
                                {
                                  patientTypeData.returningPatients
                                    .bottomDepartment.name
                                }
                                <span className="text-sm font-normal ml-1">
                                  (
                                  {patientTypeData.returningPatients.bottomDepartment.score.toFixed(
                                    1
                                  )}
                                  /5.0)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Satisfaction Comparison
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            outerRadius={150}
                            data={[
                              {
                                subject: "Overall Satisfaction",
                                "New Patient":
                                  patientTypeData.newPatients.satisfaction,
                                "Returning Patient":
                                  patientTypeData.returningPatients
                                    .satisfaction,
                                fullMark: 5,
                              },
                              {
                                subject: "Recommendation Rate",
                                "New Patient":
                                  patientTypeData.newPatients.recommendRate /
                                  20, // Scale to 0-5
                                "Returning Patient":
                                  patientTypeData.returningPatients
                                    .recommendRate / 20,
                                fullMark: 5,
                              },
                              {
                                subject: "Top Department Rating",
                                "New Patient":
                                  patientTypeData.newPatients.topDepartment
                                    .score,
                                "Returning Patient":
                                  patientTypeData.returningPatients
                                    .topDepartment.score,
                                fullMark: 5,
                              },
                              {
                                subject: "Bottom Department Rating",
                                "New Patient":
                                  patientTypeData.newPatients.bottomDepartment
                                    .score,
                                "Returning Patient":
                                  patientTypeData.returningPatients
                                    .bottomDepartment.score,
                                fullMark: 5,
                              },
                            ]}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 5]} />
                            <Radar
                              name="New Patient"
                              dataKey="New Patient"
                              stroke="#4b5563"
                              fill="#4b5563"
                              fillOpacity={0.6}
                            />
                            <Radar
                              name="Returning Patient"
                              dataKey="Returning Patient"
                              stroke="#6b7280"
                              fill="#6b7280"
                              fillOpacity={0.6}
                            />
                            <Legend />
                            <Tooltip
                              formatter={(value) => [
                                typeof value === "number"
                                  ? value.toFixed(2)
                                  : value,
                                "",
                              ]}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Visit Time Analysis */}
          <TabsContent value="visit-time">
            {visitTimeData.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock size={18} />
                      Visit Time Analysis
                    </CardTitle>
                    <CardDescription>
                      How satisfaction varies based on when patients last
                      visited
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Satisfaction by Visit Recency
                        </h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={visitTimeData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 5]} />
                              <Tooltip
                                formatter={(value) => [
                                  typeof value === "number"
                                    ? value.toFixed(2)
                                    : value,
                                  "Rating",
                                ]}
                              />
                              <Legend />
                              <Bar
                                dataKey="satisfaction"
                                fill="#4b5563"
                                name="Satisfaction Rating"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Recommendation Rate by Visit Recency
                        </h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={visitTimeData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip
                                formatter={(value) => [
                                  typeof value === "number"
                                    ? value.toFixed(1) + "%"
                                    : value,
                                  "Recommendation Rate",
                                ]}
                              />
                              <Legend />
                              <Bar
                                dataKey="recommendRate"
                                fill="#6b7280"
                                name="Recommendation Rate"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Visit Recency Distribution
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={visitTimeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {visitTimeData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, "Visits"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {visitTimeData.map((data, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {data.name}
                            </CardTitle>
                            <CardDescription>
                              {data.count} visits
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Satisfaction:</span>
                                  <span className="font-medium">
                                    {typeof data.satisfaction === "number"
                                      ? data.satisfaction.toFixed(1)
                                      : data.satisfaction}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    typeof data.satisfaction === "number"
                                      ? data.satisfaction * 20
                                      : 0
                                  }
                                  className="h-1.5"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Recommend:</span>
                                  <span className="font-medium">
                                    {typeof data.recommendRate === "number"
                                      ? data.recommendRate.toFixed(1)
                                      : data.recommendRate}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    typeof data.recommendRate === "number"
                                      ? data.recommendRate
                                      : 0
                                  }
                                  className="h-1.5"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Improvement Priorities */}
          <TabsContent value="improvement">
            {improvementPriorities.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={18} />
                      Improvement Priorities
                    </CardTitle>
                    <CardDescription>
                      Actionable insights to improve patient satisfaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle
                              size={16}
                              className="text-amber-500"
                            />
                            Critical Areas
                          </CardTitle>
                          <CardDescription>
                            Departments with low satisfaction
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {
                              improvementPriorities.filter((p) => p.isCritical)
                                .length
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Departments with satisfaction rating below 3.0
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-500" />
                            Quick Wins
                          </CardTitle>
                          <CardDescription>
                            Easy improvements with high impact
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {
                              improvementPriorities.filter((p) => p.isQuickWin)
                                .length
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Departments with satisfaction between 3.0-4.0
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle2
                              size={16}
                              className="text-green-500"
                            />
                            Excellence Areas
                          </CardTitle>
                          <CardDescription>
                            Departments with high satisfaction
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {
                              improvementPriorities.filter(
                                (p) => !p.isQuickWin && !p.isCritical
                              ).length
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Departments with satisfaction above 4.0
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Lightbulb size={18} />
                          Improvement Priorities
                        </h3>
                        <div className="space-y-4">
                          {improvementPriorities.map((priority, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {priority.isCritical ? (
                                    <AlertTriangle
                                      size={16}
                                      className="text-red-500"
                                    />
                                  ) : priority.isQuickWin ? (
                                    <Sparkles
                                      size={16}
                                      className="text-blue-500"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={16}
                                      className="text-green-500"
                                    />
                                  )}
                                  <h4 className="font-medium">
                                    {priority.location}
                                  </h4>
                                  {priority.isCritical && (
                                    <Badge variant="destructive">
                                      Critical
                                    </Badge>
                                  )}
                                  {priority.isQuickWin && (
                                    <Badge variant="secondary">Quick Win</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">Impact Score:</span>
                                  <span className="font-bold">
                                    {priority.impactScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Satisfaction:</span>
                                    <span className="font-medium">
                                      {priority.satisfaction.toFixed(1)}/5.0
                                    </span>
                                  </div>
                                  <Progress
                                    value={priority.satisfaction * 20}
                                    className={`h-2 ${
                                      priority.satisfaction < 3
                                        ? "bg-red-100"
                                        : priority.satisfaction < 4
                                        ? "bg-amber-100"
                                        : "bg-green-100"
                                    }`}
                                  />
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Visit Volume:</span>
                                    <span className="font-medium">
                                      {priority.visitCount} visits
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (priority.visitCount /
                                        improvementPriorities[0].visitCount) *
                                      100
                                    }
                                    className="h-2"
                                  />
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Improvement Impact:</span>
                                    <span className="font-medium">
                                      {priority.isCritical
                                        ? "High"
                                        : priority.isQuickWin
                                        ? "Medium"
                                        : "Low"}
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      priority.isCritical
                                        ? 90
                                        : priority.isQuickWin
                                        ? 60
                                        : 30
                                    }
                                    className={`h-2 ${
                                      priority.isCritical
                                        ? "bg-red-100"
                                        : priority.isQuickWin
                                        ? "bg-amber-100"
                                        : "bg-green-100"
                                    }`}
                                  />
                                </div>
                              </div>

                              <div className="mt-4 text-sm">
                                <p>
                                  {priority.isCritical
                                    ? `Critical area requiring immediate attention. Improving satisfaction in ${priority.location} would significantly impact overall patient experience.`
                                    : priority.isQuickWin
                                    ? `Quick win opportunity. ${priority.location} has moderate satisfaction but high visit volume. Small improvements could have significant impact.`
                                    : `Maintain excellence. ${priority.location} is performing well with high satisfaction ratings.`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Text Analysis */}
          <TabsContent value="text-analysis">
            {textFeedback && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare size={18} />
                      Text Feedback Analysis
                    </CardTitle>
                    <CardDescription>
                      Analysis of open-ended feedback from patients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Department Concerns
                          </CardTitle>
                          <CardDescription>
                            {textFeedback.totalConcerns} comments
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {textFeedback.concernWords
                              .slice(0, 10)
                              .map((word: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-sm py-1 px-2"
                                  style={{
                                    fontSize: `${Math.max(
                                      0.8,
                                      Math.min(1.5, 0.8 + word.value / 10)
                                    )}rem`,
                                    opacity: Math.max(
                                      0.6,
                                      Math.min(1, 0.6 + word.value / 20)
                                    ),
                                  }}
                                >
                                  {word.text} ({word.value})
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Recommendations
                          </CardTitle>
                          <CardDescription>
                            {textFeedback.totalRecommendations} comments
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {textFeedback.recommendationWords
                              .slice(0, 10)
                              .map((word: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-sm py-1 px-2"
                                  style={{
                                    fontSize: `${Math.max(
                                      0.8,
                                      Math.min(1.5, 0.8 + word.value / 10)
                                    )}rem`,
                                    opacity: Math.max(
                                      0.6,
                                      Math.min(1, 0.6 + word.value / 20)
                                    ),
                                  }}
                                >
                                  {word.text} ({word.value})
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Why Not Recommend
                          </CardTitle>
                          <CardDescription>
                            {textFeedback.totalWhyNotRecommend} comments
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {textFeedback.whyNotRecommendWords
                              .slice(0, 10)
                              .map((word: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-sm py-1 px-2"
                                  style={{
                                    fontSize: `${Math.max(
                                      0.8,
                                      Math.min(1.5, 0.8 + word.value / 10)
                                    )}rem`,
                                    opacity: Math.max(
                                      0.6,
                                      Math.min(1, 0.6 + word.value / 20)
                                    ),
                                  }}
                                >
                                  {word.text} ({word.value})
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Common Themes in Feedback
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium mb-3">
                            Positive Themes
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">
                                Staff Professionalism
                              </span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  High
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-green-500 h-full rounded-full"
                                    style={{ width: "85%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Cleanliness</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  Medium
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-green-500 h-full rounded-full"
                                    style={{ width: "65%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Treatment Quality</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  High
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-green-500 h-full rounded-full"
                                    style={{ width: "80%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-medium mb-3">
                            Areas for Improvement
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Wait Times</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  High
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-red-500 h-full rounded-full"
                                    style={{ width: "90%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Communication</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  Medium
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-amber-500 h-full rounded-full"
                                    style={{ width: "60%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Food Quality</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">
                                  Low
                                </span>
                                <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-amber-500 h-full rounded-full"
                                    style={{ width: "40%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Sentiment Analysis
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Positive", value: 65 },
                                { name: "Neutral", value: 25 },
                                { name: "Negative", value: 10 },
                              ]}
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
                              <Cell fill="#4b5563" />
                              <Cell fill="#9ca3af" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Actionable Insights from Text Feedback
                      </h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2
                              size={18}
                              className="text-green-600"
                            />
                            <h4 className="font-medium">
                              Strengths to Maintain
                            </h4>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                              Staff professionalism is highly appreciated by
                              patients
                            </li>
                            <li>
                              Cleanliness of facilities receives positive
                              feedback
                            </li>
                            <li>
                              Treatment quality is generally well-regarded
                            </li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4 bg-amber-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={18} className="text-amber-600" />
                            <h4 className="font-medium">Quick Wins</h4>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Improve communication about wait times</li>
                            <li>Enhance food quality in the canteen</li>
                            <li>Provide more information about procedures</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-4 bg-red-50">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} className="text-red-600" />
                            <h4 className="font-medium">Critical Areas</h4>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                              Reduce wait times, especially in high-traffic
                              departments
                            </li>
                            <li>Address staffing issues during peak hours</li>
                            <li>
                              Improve the check-in process to reduce delays
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Raw Feedback */}
          <TabsContent value="raw-feedback">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    Raw Feedback Responses
                  </CardTitle>
                  <CardDescription>
                    Actual text responses from patients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="concerns">
                    <TabsList className="mb-4">
                      <TabsTrigger value="concerns">
                        Department Concerns
                      </TabsTrigger>
                      <TabsTrigger value="recommendations">
                        Recommendations
                      </TabsTrigger>
                      <TabsTrigger value="why-not">
                        Why Not Recommend
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="concerns">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            Department Concerns
                          </h3>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Filter by department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Departments
                              </SelectItem>
                              <SelectItem value="OPD">
                                Out-Patient Department
                              </SelectItem>
                              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                              <SelectItem value="Laboratory">
                                Laboratory
                              </SelectItem>
                              <SelectItem value="Emergency">
                                Emergency Unit
                              </SelectItem>
                              <SelectItem value="Canteen">
                                Canteen Services
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {data.departmentConcerns.length > 0 ? (
                          data.departmentConcerns.map((concern, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <Badge variant="outline">
                                    {concern.locationName}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {concern.submittedAt
                                      ? concern.submittedAt.split("T")[0]
                                      : "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">
                                  {concern.concern || "No specific concern"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {concern.visitPurpose || "N/A"}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {concern.patientType || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground py-4">
                            No department concerns available.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          General Recommendations
                        </h3>

                        {data.recommendations.length > 0 ? (
                          data.recommendations.map((rec, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <Badge variant="outline">
                                    Recommendation
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {rec.submittedAt
                                      ? rec.submittedAt.split("T")[0]
                                      : "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">
                                  {rec.recommendation ||
                                    "No recommendation provided"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {rec.visitPurpose || "N/A"}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {rec.patientType || "N/A"}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {rec.userType || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground py-4">
                            No recommendations available.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="why-not">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Why Patients Would Not Recommend
                        </h3>

                        {data.notRecommendReasons.length > 0 ? (
                          data.notRecommendReasons.map((reason, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50"
                                  >
                                    Would Not Recommend
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {reason.submittedAt
                                      ? reason.submittedAt.split("T")[0]
                                      : "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">
                                  {reason.reason || "No reason provided"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {reason.visitPurpose || "N/A"}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {reason.patientType || "N/A"}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Visited:{" "}
                                    {reason.locations
                                      ? reason.locations.join(", ")
                                      : "N/A"}
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground py-4">
                            No "would not recommend" reasons available.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
