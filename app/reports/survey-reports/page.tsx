"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ExportModal } from "@/components/export-modal";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  prepareSurveyDataForExport,
  prepareDepartmentDataForExport,
  prepareSummaryDataForExport,
  prepareOverviewDataForExport,
  prepareWardsDataForExport,
  prepareCanteenDataForExport,
  prepareMedicalsDataForExport,
  prepareFeedbackDataForExport,
  getExportFilename,
  ExportOptions,
  exportTabContentToPDF,
} from "@/app/reports/survey-reports/utils/export-utils";
import {
  generateOverviewTabHTML,
  generateDepartmentsTabHTML,
  generateWardsTabHTML,
  generateCanteenTabHTML,
  generateMedicalsTabHTML,
  generateFeedbackTabHTML,
} from "./utils/html-generators";

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
  fetchOverviewTabData,
  getSurveyOverviewData,
  getSatisfactionByDemographic,
  getVisitTimeAnalysis,
  getImprovementAreas,
  getVisitPurposeData,
  getPatientTypeData,
  getVisitTimeData,
  getUserTypeData,
  DemographicSatisfaction,
  VisitTimeAnalysis,
  ImprovementArea,
  UserTypeDistribution,
} from "@/app/actions/overview-actions";
import { OverviewTab } from "./components/overview-tab";
import { DepartmentsTab } from "./components/departments-tab";
import { WardsTab } from "./components/wards-tab";
import { CanteenTab } from "./components/canteen-tab";
import { MedicalsTab } from "./components/medicals-tab";
import { FeedbackTab } from "./components/feedback-tab";
import { fetchDepartmentTabData } from "@/app/actions/department-actions";
import { Department } from "@/app/actions/department-actions";
import { Ward, WardConcern, Recommendation } from "@/app/actions/ward-actions";
import { fetchWardTabData } from "@/app/actions/ward-actions";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { COLORS, satisfactionToText } from "./utils/chart-utils";
import { useExport } from "./utils/useExport";

// Define the data structure
interface EnhancedData {
  surveyData: any[];
  recommendations: any[];
  notRecommendReasons: any[];
  departmentConcerns: any[];
  visitTimeAnalysis: VisitTimeAnalysis[];
  satisfactionByDemographic: DemographicSatisfaction;
  improvementAreas: ImprovementArea[];
  userTypeData?: {
    distribution: UserTypeDistribution[];
    insight: string;
  };
}

// Define interfaces for location data
interface BaseLocation {
  id: string;
  name: string;
  type: string;
  satisfaction: number;
  visitCount: number;
  recommendRate: number;
}

interface DepartmentData extends BaseLocation {
  type: "department";
}

interface WardData extends BaseLocation {
  type: "ward";
}

// Update the getData function to fetch the enhanced data
const getData = async (
  locationFilter: string | null,
  dateRange: { from: string; to: string } | null,
  searchQuery: string | null
): Promise<EnhancedData> => {
  try {
    const [
      surveyData,
      satisfactionByDemographic,
      visitTimeAnalysis,
      improvementAreas,
    ] = await Promise.all([
      getSurveyOverviewData(),
      getSatisfactionByDemographic(),
      getVisitTimeAnalysis(),
      getImprovementAreas(),
    ]);

    // Mock data for recommendations, notRecommendReasons, departmentConcerns
    // In a real app, these would come from separate API calls
    const recommendations: any[] = [];
    const notRecommendReasons: any[] = [];
    const departmentConcerns: any[] = [];

    return {
      surveyData: [surveyData],
      recommendations,
      notRecommendReasons,
      departmentConcerns,
      visitTimeAnalysis,
      satisfactionByDemographic,
      improvementAreas,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      surveyData: [],
      recommendations: [],
      notRecommendReasons: [],
      departmentConcerns: [],
      visitTimeAnalysis: [],
      satisfactionByDemographic: {
        byUserType: [],
        byPatientType: [],
        insight: "Error fetching data",
      },
      improvementAreas: [],
    };
  }
};

export default function SurveyReportsPage() {
  const { toast } = useToast();
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
  const [overviewData, setOverviewData] = useState<any>({
    surveyData: {
      totalResponses: 0,
      recommendRate: 0,
      avgSatisfaction: 0,
      purposeDistribution: [],
    },
    satisfactionByDemographic: {
      byUserType: [],
      byPatientType: [],
      insight: "Error fetching data",
    },
    visitTimeAnalysis: [],
    improvementAreas: [],
    visitPurposeData: null,
    patientTypeData: null,
    visitTimeData: [],
    userTypeData: { distribution: [], insight: "" },
  });

  // Export state and refs
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<string>("overview");

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
      insight: "No data available",
    },
    improvementAreas: [],
  });

  // Add state for departments
  const [departments, setDepartments] = useState<Department[]>([]);

  // Add state for wards
  const [wards, setWards] = useState<Ward[]>([]);

  // Update the fetchData function to also fetch ward data
  const fetchData = async (dateRangeOption: string) => {
    try {
      setIsLoading(true);

      // Calculate date range based on selection
      let dateRangeFilter = null;
      if (dateRangeOption !== "all") {
        const endDate = new Date();
        const startDate = new Date();

        switch (dateRangeOption) {
          case "month":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(endDate.getMonth() - 3);
            break;
          case "year":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        }

        dateRangeFilter = {
          from: startDate.toISOString().split("T")[0],
          to: endDate.toISOString().split("T")[0],
        };
      }

      // Use the fetchOverviewTabData function to get all data at once
      const fetchedOverviewData = await fetchOverviewTabData();

      // Store the fetched data in the overviewData state
      setOverviewData(fetchedOverviewData);

      // For backward compatibility, create a surveyData array
      const surveyData = {
        totalResponses: fetchedOverviewData.surveyData.totalResponses,
        recommendRate: fetchedOverviewData.surveyData.recommendRate,
        avgSatisfaction: fetchedOverviewData.surveyData.avgSatisfaction,
        mostCommonPurpose: fetchedOverviewData.surveyData.mostCommonPurpose,
        purposeDistribution: fetchedOverviewData.surveyData.purposeDistribution,
      };

      // Set data state with the overview data
      setData({
        surveyData: [surveyData],
        recommendations: [surveyData],
        notRecommendReasons: [surveyData],
        departmentConcerns: [surveyData],
        visitTimeAnalysis: fetchedOverviewData.visitTimeAnalysis,
        satisfactionByDemographic:
          fetchedOverviewData.satisfactionByDemographic,
        improvementAreas: fetchedOverviewData.improvementAreas,
        userTypeData: fetchedOverviewData.userTypeData,
      });

      // Fetch department data using server action
      const departmentData = await fetchDepartmentTabData();
      setDepartments(departmentData.departments);

      // Fetch ward data using server action
      const wardData = await fetchWardTabData();
      setWards(wardData.wards);

      // Now combine departments and wards for locations
      const combinedLocations: (DepartmentData | WardData)[] = [
        ...departmentData.departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          type: "department" as const,
          satisfaction: dept.satisfaction,
          visitCount: dept.visitCount,
          recommendRate: dept.recommendRate,
        })),
        ...wardData.wards.map((ward) => ({
          id: ward.id,
          name: ward.name,
          type: "ward" as const,
          satisfaction: ward.satisfaction,
          visitCount: ward.visitCount,
          recommendRate: ward.recommendRate,
        })),
      ];

      // Set locations with real data
      setLocations(combinedLocations);

      // Continue with the rest of the data handling
      setVisitPurposeData(fetchedOverviewData.visitPurposeData || null);

      // Set patientTypeData with real data or fallback to dummy data with named departments if none available
      const realPatientTypeData = fetchedOverviewData.patientTypeData;
      if (realPatientTypeData) {
        // Create a copy with fallback data for departments that will be used if needed
        const enhancedPatientTypeData = {
          ...realPatientTypeData,
          newPatients: {
            ...realPatientTypeData.newPatients,
            // Only override if the departments are "No data" or empty
            topDepartment:
              realPatientTypeData.newPatients.topDepartment.name ===
                "No data" ||
              realPatientTypeData.newPatients.topDepartment.name === ""
                ? { name: "General Ward", score: 4.0 }
                : realPatientTypeData.newPatients.topDepartment,
            bottomDepartment:
              realPatientTypeData.newPatients.bottomDepartment.name ===
                "No data" ||
              realPatientTypeData.newPatients.bottomDepartment.name === ""
                ? { name: "Pharmacy", score: 3.2 }
                : realPatientTypeData.newPatients.bottomDepartment,
          },
        };

        setPatientTypeData(enhancedPatientTypeData);
      } else {
        // Fallback if no patient type data
        setPatientTypeData({
          newPatients: {
            count: 0,
            satisfaction: 0,
            recommendRate: 0,
            topDepartment: { name: "General Ward", score: 4.0 },
            bottomDepartment: { name: "Pharmacy", score: 3.2 },
          },
          returningPatients: {
            count: 0,
            satisfaction: 0,
            recommendRate: 0,
            topDepartment: { name: "Lying-In Ward", score: 4.0 },
            bottomDepartment: { name: "Dressing Room", score: 1.0 },
          },
        });
      }

      setVisitTimeData(fetchedOverviewData.visitTimeData || []);
      setImprovementPriorities(fetchedOverviewData.improvementAreas || []);

      // For text feedback, create a mock implementation
      // In a real app, this would come from separate API calls
      const feedbackData: any[] = [];
      const recommendationsData: any[] = [];
      const notRecommendData: any[] = [];

      // Process text feedback data
      if (
        feedbackData.length > 0 ||
        recommendationsData.length > 0 ||
        notRecommendData.length > 0
      ) {
        // Extract all concerns
        const allConcerns = feedbackData
          .map((f: any) => f.concern)
          .filter((c: any) => c && c.trim() !== "");

        // Extract all recommendations
        const allRecommendations = recommendationsData
          .map((r: any) => r.recommendation)
          .filter((r: any) => r && r.trim() !== "");

        // Extract all "why not recommend" reasons
        const allWhyNotRecommend = notRecommendData
          .map((r: any) => r.reason)
          .filter((r: any) => r && r.trim() !== "");

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
      // Reset to initial state if there's an error
      setDepartments([]);
      setWards([]);
      setData({
        surveyData: [],
        recommendations: [],
        notRecommendReasons: [],
        departmentConcerns: [],
        visitTimeAnalysis: [],
        satisfactionByDemographic: {
          byUserType: [],
          byPatientType: [],
          insight: "Error fetching data",
        },
        improvementAreas: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  // Add debug logging for visitTimeData
  useEffect(() => {}, [visitTimeData]);

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

  // Get the handleExport function from the hook
  const { handleExport: exportHandler } = useExport();

  // Function to handle exports from this component
  const handleExport = (
    format: string,
    dataType: string,
    options?: Record<string, any>
  ) => {
    return exportHandler(format, dataType, options || {}, {
      setIsLoading,
      dateRange,
      activeTabRef,
      overviewData,
      data,
      dashboardRef,
      visitPurposeData,
      patientTypeData,
      locations,
      visitTimeData,
      textFeedback,
      improvementPriorities,
      exportMultipleTabsToPDF: async (
        selectedTabs: string[],
        dateRangeText: string,
        orientation: string
      ) => {
        // Implementation for exporting multiple tabs to PDF
        // Placeholder implementation
      },
      exportMultipleTabsToExcel: async (
        selectedTabs: string[],
        dateRangeText: string
      ) => {
        // Implementation for exporting multiple tabs to Excel
        // Placeholder implementation
      },
      exportMultipleTabsToCSV: async (
        selectedTabs: string[],
        dateRangeText: string
      ) => {
        // Implementation for exporting multiple tabs to CSV
        // Placeholder implementation
      },
      generateOverviewTabHTML: (data) =>
        generateOverviewTabHTML(
          data,
          visitPurposeData,
          patientTypeData,
          locations
        ),
      generateDepartmentsTabHTML,
      generateWardsTabHTML,
      generateCanteenTabHTML,
      generateMedicalsTabHTML,
      generateFeedbackTabHTML,
    });
  };

  // Track the active tab
  const handleTabChange = (value: string) => {
    activeTabRef.current = value;

    // If the export modal is open, ensure it reflects the current tab
    if (isExportModalOpen) {
      // Force a re-render by closing and reopening the modal
      setIsExportModalOpen(false);
      setTimeout(() => setIsExportModalOpen(true), 10);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 overflow-x-hidden">
      <div
        className="max-w-7xl mx-auto"
        id="dashboard-content"
        ref={dashboardRef}
      >
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
                Survey Reports
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
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => fetchData(dateRange)}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <Card className="mb-3">
          <CardContent className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm font-medium">Date Range:</span>
              </div>
              <div className="w-48">
                <Select
                  value={dateRange}
                  onValueChange={(value) => {
                    setDateRange(value);
                    fetchData(value);
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue
                      placeholder="Select date range"
                      className="survey-date-range"
                    />
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
          </CardContent>
        </Card>

        <Tabs
          defaultValue="overview"
          className="mb-8"
          onValueChange={handleTabChange}
        >
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
            <TabsTrigger value="feedback">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Add Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            <OverviewTab
              surveyData={{
                totalResponses: overviewData.surveyData.totalResponses || 0,
                recommendRate: overviewData.surveyData.recommendRate || 0,
                avgSatisfaction: overviewData.surveyData.avgSatisfaction || 0,
                purposeDistribution:
                  overviewData.surveyData.purposeDistribution || [],
              }}
              isLoading={isLoading}
              satisfactionByDemographic={data.satisfactionByDemographic}
              visitTimeAnalysis={data.visitTimeAnalysis}
              improvementAreas={data.improvementAreas}
              visitPurposeData={visitPurposeData}
              patientTypeData={patientTypeData}
              visitTimeData={visitTimeData}
              userTypeData={
                data.userTypeData || { distribution: [], insight: "" }
              }
              locations={locations}
            />
          </TabsContent>

          {/* Add Departments Tab Content */}
          <TabsContent value="departments" className="space-y-4">
            <DepartmentsTab isLoading={isLoading} departments={departments} />
          </TabsContent>

          {/* Add Wards Tab Content */}
          <TabsContent value="wards" className="space-y-4">
            <WardsTab isLoading={isLoading} wards={wards} />
          </TabsContent>

          {/* Canteen Tab Content */}
          <TabsContent value="canteen">
            <CanteenTab isLoading={isLoading} departments={locations} />
          </TabsContent>

          {/* Occupational Health Tab Content */}
          <TabsContent value="occupational-health">
            <MedicalsTab isLoading={isLoading} />
          </TabsContent>

          {/* Feedback Tab Content */}
          <TabsContent value="feedback">
            <FeedbackTab isLoading={isLoading} surveyData={data.surveyData} />
          </TabsContent>
        </Tabs>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          currentTab={activeTabRef.current}
        />
      </div>
    </main>
  );
}
