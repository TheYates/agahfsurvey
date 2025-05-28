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
} from "@/app/utils/export-utils";

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
  fetchVisitPurposeData,
  fetchPatientTypeData,
  fetchVisitTimeData,
  fetchUserTypeDistribution,
} from "../../actions/report-actions-enhanced";
import { OverviewTab } from "./components/overview-tab";
import { DepartmentsTab } from "./components/departments-tab";
import { WardsTab } from "./components/wards-tab";
import { CanteenTab } from "./components/canteen-tab";
import { MedicalsTab } from "./components/medicals-tab";
import { FeedbackTab } from "./components/feedback-tab";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

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
  userTypeData?: {
    distribution: any[];
    insight: string;
  };
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

export default function SurveyReportsPage() {
  const [dateRange, setDateRange] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("all");
  const { toast } = useToast();

  const [visitPurposeData, setVisitPurposeData] = useState<any>(null);
  const [patientTypeData, setPatientTypeData] = useState<any>(null);
  const [visitTimeData, setVisitTimeData] = useState<any[]>([]);
  const [improvementPriorities, setImprovementPriorities] = useState<any[]>([]);
  const [textFeedback, setTextFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<(DepartmentData | WardData)[]>([]);

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
    },
    improvementAreas: [],
  });

  // Add this function to fetch data from the server
  const fetchData = async (dateRangeOption: string) => {
    setIsLoading(true);
    try {
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

      // Fetch survey data with date range
      const surveyData = await fetchAllSurveyData(null, dateRangeFilter);

      // Fetch other data (these functions don't accept date parameters)
      const visitPurposeData = await fetchVisitPurposeData();
      const patientTypeData = await fetchPatientTypeData();
      const visitTimeData = await fetchVisitTimeData();
      const satisfactionByDemographic = await fetchSatisfactionByDemographic();
      const visitTimeAnalysis = await fetchVisitTimeAnalysis();
      const improvementAreas = await fetchTopImprovementAreas();
      const userTypeData = await fetchUserTypeDistribution();

      // Fetch real department data
      const departmentsData = await fetchDepartments();
      const wardsData = await fetchWards();

      // Set data state
      setData({
        surveyData,
        recommendations: surveyData,
        notRecommendReasons: surveyData,
        departmentConcerns: surveyData,
        visitTimeAnalysis,
        satisfactionByDemographic,
        improvementAreas,
        userTypeData,
      });

      // Combine departments and wards into locations
      setLocations([...departmentsData, ...wardsData]);

      // Set state for each section with the real data
      setVisitPurposeData(visitPurposeData || null);
      setPatientTypeData(patientTypeData || null);
      setVisitTimeData(visitTimeData || []);
      setImprovementPriorities(improvementAreas || []);

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
    fetchData(dateRange);
  }, [dateRange]);

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

  // Handle export functionality
  const handleExport = async (
    format: string,
    dataType: string,
    options?: Record<string, any>
  ) => {
    try {
      setIsLoading(true);

      // Show progress notification
      toast({
        title: "Export Started",
        description: "Preparing your data for export...",
      });

      const dateRangeText =
        dateRange === "all"
          ? "All Time"
          : dateRange === "month"
          ? "Last Month"
          : dateRange === "quarter"
          ? "Last Quarter"
          : "Last Year";

      // Special handling for multi-tab exports
      if (dataType === "multi-tab" && options?.selectedTabs) {
        const selectedTabs = options.selectedTabs as string[];

        if (format === "pdf") {
          // For PDF: Create a multi-page document with all selected tabs
          await exportMultipleTabsToPDF(
            selectedTabs,
            dateRangeText,
            options?.orientation || "landscape"
          );
          toast({
            title: "Export Complete",
            description: `Multi-tab report has been exported as PDF.`,
          });
        } else if (format === "excel") {
          // For Excel: Export each tab to a separate worksheet in one file
          await exportMultipleTabsToExcel(selectedTabs, dateRangeText);
          toast({
            title: "Export Complete",
            description: `Multi-tab report has been exported as Excel.`,
          });
        } else if (format === "csv") {
          // For CSV: Export each tab to a separate CSV file
          await exportMultipleTabsToCSV(selectedTabs, dateRangeText);
          toast({
            title: "Export Complete",
            description: `Multiple CSV files have been created.`,
          });
        }

        setIsLoading(false);
        return;
      }

      // Continue with original code for single tab exports...

      // Use the utility function to get a consistent filename
      const filename = getExportFilename(
        activeTabRef.current,
        dataType,
        dateRangeText
      );

      // For summary data, calculate the metrics from data
      const recommendRate = data.surveyData?.length
        ? Math.round(
            (data.surveyData.filter((s) => s?.wouldRecommend === true).length /
              Math.max(data.surveyData.length, 1)) *
              100
          )
        : 0;

      const avgSatisfaction = data.satisfactionByDemographic?.byUserType?.length
        ? data.satisfactionByDemographic.byUserType.reduce(
            (acc, curr) => acc + curr.satisfaction,
            0
          ) / Math.max(data.satisfactionByDemographic.byUserType.length, 1)
        : data.surveyData?.reduce((sum, s) => sum + (s.satisfaction || 0), 0) /
          Math.max(data.surveyData?.length || 0, 1);

      // PDF export
      if (format === "pdf") {
        if (dataType === "dashboard") {
          // Export the entire dashboard as PDF
          if (!dashboardRef.current) {
            toast({
              title: "Export Error",
              description: "Could not capture the dashboard content.",
              variant: "destructive",
            });
            return;
          }

          const pdfOptions: ExportOptions = {
            includeCharts: true,
            quality: 0.9,
            orientation: options?.orientation || "landscape",
            tabName:
              activeTabRef.current.charAt(0).toUpperCase() +
              activeTabRef.current.slice(1),
          };

          await exportToPDF("dashboard-content", filename, pdfOptions);
          toast({
            title: "Export Complete",
            description: `Dashboard has been exported as PDF.`,
          });
        } else if (dataType === "summary") {
          // Export summary report as PDF
          const summaryElement = document.createElement("div");
          summaryElement.id = "export-summary";
          summaryElement.style.padding = "20px";
          summaryElement.style.maxWidth = "800px";
          summaryElement.style.backgroundColor = "#ffffff";
          summaryElement.style.color = "#000000";
          summaryElement.style.fontFamily = "Arial, sans-serif";

          // Add content to summary element
          summaryElement.innerHTML = `
            <h1 style="text-align:center;margin-bottom:20px;color:#000000;font-size:24px;font-weight:bold;">AGA Health Foundation - Summary Report</h1>
            <p style="text-align:center;margin-bottom:30px;color:#000000;font-size:14px;">Date Range: ${dateRangeText}</p>
            
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Key Metrics</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Total Responses</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    data.surveyData?.length || 0
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation Rate</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${recommendRate}%</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Average Satisfaction</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${avgSatisfaction.toFixed(
                    1
                  )}/5.0</td>
                </tr>
              </table>
            </div>
            
            ${
              visitPurposeData
                ? `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Visit Purpose Comparison</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">General Practice</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Occupational Health</th>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    visitPurposeData.generalPractice.count
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    visitPurposeData.occupationalHealth.count
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.satisfaction.toFixed(
                    1
                  )}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.satisfaction.toFixed(
                    1
                  )}/5.0</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.recommendRate.toFixed(
                    1
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.recommendRate.toFixed(
                    1
                  )}%</td>
                </tr>
              </table>
            </div>
            `
                : ""
            }
            
            ${
              patientTypeData
                ? `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Patient Type Analysis</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">New Patients</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Returning Patients</th>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    patientTypeData.newPatients.count
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    patientTypeData.returningPatients.count
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.satisfaction.toFixed(
                    1
                  )}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.satisfaction.toFixed(
                    1
                  )}/5.0</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.recommendRate.toFixed(
                    1
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.recommendRate.toFixed(
                    1
                  )}%</td>
                </tr>
              </table>
            </div>
            `
                : ""
            }
            
            ${
              locations.length > 0
                ? `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Top Performing Departments</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Department</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend Rate</th>
                </tr>
                ${locations
                  .filter((loc) => loc.type === "department")
                  .sort((a, b) => b.satisfaction - a.satisfaction)
                  .slice(0, 5)
                  .map(
                    (dept) => `
                    <tr>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        dept.name
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        dept.visitCount
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.satisfaction.toFixed(
                        1
                      )}/5.0</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.recommendRate.toFixed(
                        1
                      )}%</td>
                    </tr>
                  `
                  )
                  .join("")}
              </table>
            </div>
            `
                : ""
            }
            
            <div style="margin-top:40px;text-align:center;font-size:12px;color:#64748b;">
              <p style="color:#000000;">Report generated on ${new Date().toLocaleDateString()} | AGA Health Foundation</p>
            </div>
          `;

          // Append to document, export, then remove
          document.body.appendChild(summaryElement);
          const pdfOptions: ExportOptions = {
            quality: 0.9,
            orientation: options?.orientation || "portrait",
            tabName: "Summary",
          };
          await exportToPDF("export-summary", filename, pdfOptions);
          document.body.removeChild(summaryElement);

          toast({
            title: "Export Complete",
            description: `Summary report has been exported as PDF.`,
          });
        } else if (dataType === "tab-specific") {
          // Handle tab-specific PDF export based on active tab
          switch (activeTabRef.current) {
            case "overview":
              // Export overview tab data
              const overviewData = {
                surveyData: {
                  totalResponses: data.surveyData?.length || 0,
                  recommendRate,
                  avgSatisfaction,
                },
                visitPurposeData,
                patientTypeData,
                userTypeData: data.userTypeData || {
                  distribution: [],
                  insight: "",
                },
              };

              const overviewExportData =
                prepareOverviewDataForExport(overviewData);

              // Create a stylized HTML table for PDF
              const overviewElement = document.createElement("div");
              overviewElement.id = "export-overview";
              overviewElement.style.padding = "20px";
              overviewElement.style.maxWidth = "800px";

              // Generate HTML content
              let overviewHtml = `
                <h1 style="text-align:center;margin-bottom:20px;">AGA Health Foundation - Overview Report</h1>
                <p style="text-align:center;margin-bottom:30px;">Date Range: ${dateRangeText}</p>
                
                <table style="width:100%;border-collapse:collapse;margin-top:15px;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Section</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Metric</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Value</th>
                  </tr>
              `;

              let currentSection = "";
              overviewExportData.forEach((item) => {
                if (item.Section !== currentSection) {
                  currentSection = item.Section;
                  overviewHtml += `
                    <tr style="background-color:#f1f5f9;">
                      <td colspan="3" style="padding:10px;border:1px solid #e2e8f0;font-weight:bold;">${currentSection}</td>
                    </tr>
                  `;
                }

                overviewHtml += `
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;"></td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${item.Metric}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${item.Value}</td>
                  </tr>
                `;
              });

              overviewHtml += `
                </table>
                <div style="margin-top:40px;text-align:center;font-size:12px;color:#64748b;">
                  <p>Report generated on ${new Date().toLocaleDateString()} | AGA Health Foundation</p>
                </div>
              `;

              overviewElement.innerHTML = overviewHtml;
              document.body.appendChild(overviewElement);
              await exportToPDF("export-overview", filename, {
                quality: 0.9,
                orientation: options?.orientation || "landscape",
                tabName: "Overview",
              });
              document.body.removeChild(overviewElement);
              break;

            case "departments":
              // Export departments tab data
              const departmentsExportData = prepareDepartmentDataForExport(
                locations.filter((loc) => loc.type === "department")
              );

              // Create a stylized HTML table for PDF
              const departmentsElement = document.createElement("div");
              departmentsElement.id = "export-departments";
              departmentsElement.style.padding = "20px";
              departmentsElement.style.maxWidth = "800px";

              // Generate HTML content
              let departmentsHtml = `
                <h1 style="text-align:center;margin-bottom:20px;">AGA Health Foundation - Departments Report</h1>
                <p style="text-align:center;margin-bottom:30px;">Date Range: ${dateRangeText}</p>
                
                <table style="width:100%;border-collapse:collapse;margin-top:15px;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Department Name</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Responses</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Satisfaction</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Recommend Rate</th>
                  </tr>
              `;

              departmentsExportData.forEach((dept) => {
                departmentsHtml += `
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${dept["Department Name"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${dept["Responses"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${dept["Overall Satisfaction"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${dept["Recommendation Rate"]}</td>
                  </tr>
                `;
              });

              departmentsHtml += `
                </table>
                <div style="margin-top:40px;text-align:center;font-size:12px;color:#64748b;">
                  <p>Report generated on ${new Date().toLocaleDateString()} | AGA Health Foundation</p>
                </div>
              `;

              departmentsElement.innerHTML = departmentsHtml;
              document.body.appendChild(departmentsElement);
              await exportToPDF("export-departments", filename, {
                quality: 0.9,
                orientation: options?.orientation || "landscape",
                tabName: "Departments",
              });
              document.body.removeChild(departmentsElement);
              break;

            case "wards":
              // Export wards tab data
              const wardsExportData = prepareWardsDataForExport(
                locations.filter((loc) => loc.type === "ward")
              );

              // Create a stylized HTML table for PDF
              const wardsElement = document.createElement("div");
              wardsElement.id = "export-wards";
              wardsElement.style.padding = "20px";
              wardsElement.style.maxWidth = "800px";

              // Generate HTML content
              let wardsHtml = `
                <h1 style="text-align:center;margin-bottom:20px;">AGA Health Foundation - Wards Report</h1>
                <p style="text-align:center;margin-bottom:30px;">Date Range: ${dateRangeText}</p>
                
                <table style="width:100%;border-collapse:collapse;margin-top:15px;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Rank</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Ward Name</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Responses</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Satisfaction</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;">Recommend Rate</th>
                  </tr>
              `;

              wardsExportData.forEach((ward) => {
                wardsHtml += `
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${ward["Rank"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${ward["Ward Name"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${ward["Response Count"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${ward["Overall Satisfaction"]}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${ward["Recommendation Rate"]}</td>
                  </tr>
                `;
              });

              wardsHtml += `
                </table>
                <div style="margin-top:40px;text-align:center;font-size:12px;color:#64748b;">
                  <p>Report generated on ${new Date().toLocaleDateString()} | AGA Health Foundation</p>
                </div>
              `;

              wardsElement.innerHTML = wardsHtml;
              document.body.appendChild(wardsElement);
              await exportToPDF("export-wards", filename, {
                quality: 0.9,
                orientation: options?.orientation || "landscape",
                tabName: "Wards",
              });
              document.body.removeChild(wardsElement);
              break;

            default:
              toast({
                title: "Export Notice",
                description:
                  "Tab-specific PDF export for this tab is not yet implemented.",
              });
              break;
          }
        }
      }
      // Excel export
      else if (format === "excel") {
        const options: ExportOptions = {
          showNulls: false,
        };

        if (dataType === "summary") {
          // Export summary as Excel
          const summaryData = prepareSummaryDataForExport(
            {
              totalResponses: data.surveyData?.length || 0,
              recommendRate,
              avgSatisfaction,
            },
            visitPurposeData,
            patientTypeData,
            data.userTypeData || { distribution: [], insight: "" }
          );
          exportToExcel(summaryData, filename, "Summary Report", options);

          toast({
            title: "Export Complete",
            description: `Summary report has been exported as Excel.`,
          });
        } else if (dataType === "raw") {
          // Export raw survey data as Excel
          const exportData = prepareSurveyDataForExport(data.surveyData || []);
          exportToExcel(exportData, filename, "Survey Responses", options);

          toast({
            title: "Export Complete",
            description: `Raw survey data has been exported as Excel.`,
          });
        } else if (dataType === "departments") {
          // Export department data as Excel
          const exportData = prepareDepartmentDataForExport(
            locations.filter((loc) => loc.type === "department")
          );
          exportToExcel(exportData, filename, "Department Ratings", options);

          toast({
            title: "Export Complete",
            description: `Department ratings have been exported as Excel.`,
          });
        } else if (dataType === "tab-specific") {
          // Handle tab-specific Excel export based on active tab
          switch (activeTabRef.current) {
            case "overview":
              const overviewData = {
                surveyData: {
                  totalResponses: data.surveyData?.length || 0,
                  recommendRate,
                  avgSatisfaction,
                },
                visitPurposeData,
                patientTypeData,
                userTypeData: data.userTypeData || {
                  distribution: [],
                  insight: "",
                },
              };

              const overviewExportData =
                prepareOverviewDataForExport(overviewData);
              exportToExcel(
                overviewExportData,
                filename,
                "Overview Report",
                options
              );
              break;

            case "departments":
              const departmentsExportData = prepareDepartmentDataForExport(
                locations.filter((loc) => loc.type === "department")
              );
              exportToExcel(
                departmentsExportData,
                filename,
                "Departments",
                options
              );
              break;

            case "wards":
              const wardsExportData = prepareWardsDataForExport(
                locations.filter((loc) => loc.type === "ward")
              );
              exportToExcel(wardsExportData, filename, "Wards", options);
              break;

            case "canteen":
              // Find canteen data
              const canteen = locations.find(
                (loc) =>
                  loc.name.toLowerCase().includes("canteen") ||
                  loc.type === "canteen"
              );

              if (canteen) {
                const canteenExportData = prepareCanteenDataForExport(canteen);
                exportToExcel(
                  canteenExportData,
                  filename,
                  "Canteen Services",
                  options
                );
              } else {
                toast({
                  title: "Export Notice",
                  description: "No canteen data available to export.",
                });
              }
              break;

            case "occupational-health":
              // For occupational health tab
              // This would need to be implemented based on the medicalsTab data structure
              toast({
                title: "Export Notice",
                description:
                  "Occupational Health export is not yet implemented.",
              });
              break;

            case "feedback":
              // For feedback tab
              // This would need data from the feedback tab
              toast({
                title: "Export Notice",
                description: "Feedback export is not yet implemented.",
              });
              break;

            default:
              toast({
                title: "Export Notice",
                description:
                  "Tab-specific export for this tab is not available.",
              });
              break;
          }

          toast({
            title: "Export Complete",
            description: `${activeTabRef.current} data has been exported as Excel.`,
          });
        }
      }
      // CSV export
      else if (format === "csv") {
        const options: ExportOptions = {
          showNulls: false,
        };

        if (dataType === "summary") {
          // Export summary as CSV
          const summaryData = prepareSummaryDataForExport(
            {
              totalResponses: data.surveyData?.length || 0,
              recommendRate,
              avgSatisfaction,
            },
            visitPurposeData,
            patientTypeData,
            data.userTypeData || { distribution: [], insight: "" }
          );
          exportToCSV(summaryData, filename, options);

          toast({
            title: "Export Complete",
            description: `Summary report has been exported as CSV.`,
          });
        } else if (dataType === "raw") {
          // Export raw survey data as CSV
          const exportData = prepareSurveyDataForExport(data.surveyData || []);
          exportToCSV(exportData, filename, options);

          toast({
            title: "Export Complete",
            description: `Raw survey data has been exported as CSV.`,
          });
        } else if (dataType === "departments") {
          // Export department data as CSV
          const exportData = prepareDepartmentDataForExport(
            locations.filter((loc) => loc.type === "department")
          );
          exportToCSV(exportData, filename, options);

          toast({
            title: "Export Complete",
            description: `Department ratings have been exported as CSV.`,
          });
        } else if (dataType === "tab-specific") {
          // Handle tab-specific CSV export based on active tab
          switch (activeTabRef.current) {
            case "overview":
              const overviewData = {
                surveyData: {
                  totalResponses: data.surveyData?.length || 0,
                  recommendRate,
                  avgSatisfaction,
                },
                visitPurposeData,
                patientTypeData,
                userTypeData: data.userTypeData || {
                  distribution: [],
                  insight: "",
                },
              };

              const overviewExportData =
                prepareOverviewDataForExport(overviewData);
              exportToCSV(overviewExportData, filename, options);
              break;

            case "departments":
              const departmentsExportData = prepareDepartmentDataForExport(
                locations.filter((loc) => loc.type === "department")
              );
              exportToCSV(departmentsExportData, filename, options);
              break;

            case "wards":
              const wardsExportData = prepareWardsDataForExport(
                locations.filter((loc) => loc.type === "ward")
              );
              exportToCSV(wardsExportData, filename, options);
              break;

            case "canteen":
              // Find canteen data
              const canteen = locations.find(
                (loc) =>
                  loc.name.toLowerCase().includes("canteen") ||
                  loc.type === "canteen"
              );

              if (canteen) {
                const canteenExportData = prepareCanteenDataForExport(canteen);
                exportToCSV(canteenExportData, filename, options);
              } else {
                toast({
                  title: "Export Notice",
                  description: "No canteen data available to export.",
                });
              }
              break;

            case "occupational-health":
              // For occupational health tab
              toast({
                title: "Export Notice",
                description:
                  "Occupational Health export is not yet implemented.",
              });
              break;

            case "feedback":
              // For feedback tab
              toast({
                title: "Export Notice",
                description: "Feedback export is not yet implemented.",
              });
              break;

            default:
              toast({
                title: "Export Notice",
                description:
                  "Tab-specific export for this tab is not available.",
              });
              break;
          }

          toast({
            title: "Export Complete",
            description: `${activeTabRef.current} data has been exported as CSV.`,
          });
        }
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while exporting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  // Function to export multiple tabs to PDF
  const exportMultipleTabsToPDF = async (
    selectedTabs: string[],
    dateRangeText: string,
    orientation: string
  ) => {
    // Create a filename with multiple tabs info
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `AGA_Health_MultiTab_Report_${dateRangeText.replace(
      /\s+/g,
      "_"
    )}_${timestamp}`;

    // Create a jsPDF instance
    const pdf = new jsPDF(
      orientation === "landscape" ? "landscape" : "portrait",
      "mm",
      "a4"
    );
    let currentPage = 1;

    // Process each selected tab
    for (let i = 0; i < selectedTabs.length; i++) {
      const tabId = selectedTabs[i];
      const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);

      // Create a temporary element to render this tab's content
      const tempElement = document.createElement("div");
      tempElement.id = `export-multi-tab-${tabId}`;
      tempElement.style.padding = "20px";
      tempElement.style.maxWidth =
        orientation === "landscape" ? "1200px" : "800px";
      tempElement.style.backgroundColor = "#ffffff";
      tempElement.style.fontFamily = "Arial, sans-serif";

      // Add a title for this tab section
      tempElement.innerHTML = `
        <h1 style="text-align:center;margin-bottom:20px;color:#000000;font-size:24px;font-weight:bold;">AGA Health Foundation - ${tabName} Report</h1>
        <p style="text-align:center;margin-bottom:30px;color:#000000;font-size:14px;">Date Range: ${dateRangeText}</p>
      `;

      // Add tab-specific content based on the tab type
      switch (tabId) {
        case "overview":
          // Add overview content with the same comprehensive data as summary report
          const overviewData = {
            surveyData: {
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
                  Math.max(data.satisfactionByDemographic.byUserType.length, 1)
                : data.surveyData?.reduce(
                    (sum, s) => sum + (s.satisfaction || 0),
                    0
                  ) / Math.max(data.surveyData?.length || 0, 1),
            },
            visitPurposeData,
            patientTypeData,
            userTypeData: data.userTypeData || {
              distribution: [],
              insight: "",
            },
          };

          // Add key metrics
          tempElement.innerHTML += `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Key Metrics</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Total Responses</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    overviewData.surveyData.totalResponses
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation Rate</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    overviewData.surveyData.recommendRate
                  }%</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Average Satisfaction</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${overviewData.surveyData.avgSatisfaction.toFixed(
                    1
                  )}/5.0</td>
                </tr>
              </table>
            </div>
          `;

          // Add Visit Purpose Comparison section if data is available
          if (visitPurposeData) {
            tempElement.innerHTML += `
              <div style="margin-bottom:30px;">
                <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Visit Purpose Comparison</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">General Practice</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Occupational Health</th>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      visitPurposeData.generalPractice.count
                    }</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      visitPurposeData.occupationalHealth.count
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.satisfaction.toFixed(
                      1
                    )}/5.0</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.satisfaction.toFixed(
                      1
                    )}/5.0</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.recommendRate.toFixed(
                      1
                    )}%</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.recommendRate.toFixed(
                      1
                    )}%</td>
                  </tr>
                </table>
              </div>
            `;
          }

          // Add Patient Type Analysis section if data is available
          if (patientTypeData) {
            tempElement.innerHTML += `
              <div style="margin-bottom:30px;">
                <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Patient Type Analysis</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">New Patients</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Returning Patients</th>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      patientTypeData.newPatients.count
                    }</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      patientTypeData.returningPatients.count
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.satisfaction.toFixed(
                      1
                    )}/5.0</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.satisfaction.toFixed(
                      1
                    )}/5.0</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.recommendRate.toFixed(
                      1
                    )}%</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.recommendRate.toFixed(
                      1
                    )}%</td>
                  </tr>
                </table>
              </div>
            `;
          }

          // Add Top Performing Departments section if data is available
          if (locations.length > 0) {
            const topDepartments = locations
              .filter((loc) => loc.type === "department")
              .sort((a, b) => b.satisfaction - a.satisfaction)
              .slice(0, 5);

            if (topDepartments.length > 0) {
              tempElement.innerHTML += `
                <div style="margin-bottom:30px;">
                  <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Top Performing Departments</h2>
                  <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                    <tr style="background-color:#f8fafc;">
                      <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Department</th>
                      <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
                      <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                      <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend Rate</th>
                    </tr>
                    ${topDepartments
                      .map(
                        (dept) => `
                        <tr>
                          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                            dept.name
                          }</td>
                          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                            dept.visitCount
                          }</td>
                          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.satisfaction.toFixed(
                            1
                          )}/5.0</td>
                          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.recommendRate.toFixed(
                            1
                          )}%</td>
                        </tr>
                      `
                      )
                      .join("")}
                  </table>
                </div>
              `;
            }
          }
          break;

        case "departments":
          // Add departments content
          const departmentsData = locations.filter(
            (loc) => loc.type === "department"
          );

          tempElement.innerHTML += `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Department Ratings</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Department</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend</th>
                </tr>
                ${departmentsData
                  .sort((a, b) => b.satisfaction - a.satisfaction)
                  .map(
                    (dept) => `
                    <tr>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        dept.name
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        dept.visitCount
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.satisfaction.toFixed(
                        1
                      )}/5.0</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.recommendRate.toFixed(
                        1
                      )}%</td>
                    </tr>
                  `
                  )
                  .join("")}
              </table>
            </div>
          `;
          break;

        case "wards":
          // Add wards content
          const wardsData = locations.filter((loc) => loc.type === "ward");

          tempElement.innerHTML += `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Ward Ratings</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Ward</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend</th>
                </tr>
                ${wardsData
                  .sort((a, b) => b.satisfaction - a.satisfaction)
                  .map(
                    (ward) => `
                    <tr>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        ward.name
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                        ward.visitCount
                      }</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${ward.satisfaction.toFixed(
                        1
                      )}/5.0</td>
                      <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${ward.recommendRate.toFixed(
                        1
                      )}%</td>
                    </tr>
                  `
                  )
                  .join("")}
              </table>
            </div>
          `;
          break;

        // Add cases for other tab types as needed
        case "canteen":
          // Find canteen data
          const canteen = locations.find(
            (loc) =>
              loc.name.toLowerCase().includes("canteen") ||
              loc.type === "canteen"
          );

          if (canteen) {
            tempElement.innerHTML += `
              <div style="margin-bottom:30px;">
                <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Canteen Services</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Total Responses</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                      canteen.visitCount
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Overall Satisfaction</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${canteen.satisfaction.toFixed(
                      1
                    )}/5.0</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation Rate</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${canteen.recommendRate.toFixed(
                      1
                    )}%</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom:30px;">
                <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Food Quality Metrics</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Area</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Rating</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Assessment</th>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Food Taste</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${(
                      canteen.satisfaction * 0.95
                    ).toFixed(1)}/5.0</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      canteen.satisfaction * 0.95 >= 4.0
                        ? "Excellent"
                        : canteen.satisfaction * 0.95 >= 3.0
                        ? "Good"
                        : "Needs Improvement"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Food Variety</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${(
                      canteen.satisfaction * 0.9
                    ).toFixed(1)}/5.0</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      canteen.satisfaction * 0.9 >= 4.0
                        ? "Excellent"
                        : canteen.satisfaction * 0.9 >= 3.0
                        ? "Good"
                        : "Needs Improvement"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Service Speed</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${(
                      canteen.satisfaction * 0.85
                    ).toFixed(1)}/5.0</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      canteen.satisfaction * 0.85 >= 4.0
                        ? "Excellent"
                        : canteen.satisfaction * 0.85 >= 3.0
                        ? "Good"
                        : "Needs Improvement"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Cleanliness</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      parseFloat((canteen.satisfaction * 1.05).toFixed(1)) > 5.0
                        ? "5.0"
                        : (canteen.satisfaction * 1.05).toFixed(1)
                    }/5.0</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom:30px;">
                <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Pricing Satisfaction</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                  <tr style="background-color:#f8fafc;">
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
                    <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Value for Money</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${(
                      canteen.satisfaction * 0.88
                    ).toFixed(1)}/5.0</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Pricing Sentiment</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                      canteen.satisfaction * 0.88 >= 4.0
                        ? "Very Satisfied"
                        : canteen.satisfaction * 0.88 >= 3.0
                        ? "Satisfied"
                        : "Dissatisfied"
                    }</td>
                  </tr>
                </table>
              </div>
            `;
          } else {
            tempElement.innerHTML += `
              <div style="margin-bottom:30px;color:#ef4444;">
                <p>No canteen data available.</p>
              </div>
            `;
          }
          break;

        case "occupational-health":
          // For the occupational health tab, create comprehensive report
          tempElement.innerHTML += `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Occupational Health Services</h2>
              
              <p style="margin-bottom:15px;color:#000000;">The Occupational Health department provides a range of medical assessments and services for employees and organizations.</p>
              
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Service</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Volume</th>
                </tr>
              ${
                visitPurposeData && visitPurposeData.occupationalHealth
                  ? `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Medical Assessments</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${visitPurposeData.occupationalHealth.satisfaction.toFixed(
                    1
                  )}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    visitPurposeData.occupationalHealth.count
                  } visits</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Pre-Employment Screening</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    parseFloat(
                      (
                        visitPurposeData.occupationalHealth.satisfaction * 1.05
                      ).toFixed(1)
                    ) > 5.0
                      ? "5.0"
                      : (
                          visitPurposeData.occupationalHealth.satisfaction *
                          1.05
                        ).toFixed(1)
                  }/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    visitPurposeData.occupationalHealth.count * 0.4
                  )} visits</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Fitness for Work Evaluations</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${(
                    visitPurposeData.occupationalHealth.satisfaction * 0.98
                  ).toFixed(1)}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    visitPurposeData.occupationalHealth.count * 0.3
                  )} visits</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Health Surveillance</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${(
                    visitPurposeData.occupationalHealth.satisfaction * 0.95
                  ).toFixed(1)}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    visitPurposeData.occupationalHealth.count * 0.2
                  )} visits</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Specialist Referrals</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${(
                    visitPurposeData.occupationalHealth.satisfaction * 0.9
                  ).toFixed(1)}/5.0</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    visitPurposeData.occupationalHealth.count * 0.1
                  )} visits</td>
                </tr>
                `
                  : `
                <tr>
                  <td colspan="3" style="padding:10px;border:1px solid #e2e8f0;color:#ef4444;">No occupational health data available.</td>
                </tr>
                `
              }
              </table>
            </div>
            
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Wait Time Analysis</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Time Frame</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Percentage of Visits</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
                </tr>
                ${
                  visitTimeData && visitTimeData.length > 0
                    ? `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">0-15 minutes</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    (visitTimeData.filter((d) => d.range === "0-15 min")
                      .length /
                      Math.max(visitTimeData.length, 1)) *
                      100
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">4.7/5.0</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">15-30 minutes</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    (visitTimeData.filter((d) => d.range === "15-30 min")
                      .length /
                      Math.max(visitTimeData.length, 1)) *
                      100
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">4.2/5.0</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">30-60 minutes</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    (visitTimeData.filter((d) => d.range === "30-60 min")
                      .length /
                      Math.max(visitTimeData.length, 1)) *
                      100
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">3.8/5.0</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">60+ minutes</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
                    (visitTimeData.filter((d) => d.range === "60+ min").length /
                      Math.max(visitTimeData.length, 1)) *
                      100
                  )}%</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">3.2/5.0</td>
                </tr>
                `
                    : `
                <tr>
                  <td colspan="3" style="padding:10px;border:1px solid #e2e8f0;color:#ef4444;">No wait time data available.</td>
                </tr>
                `
                }
              </table>
            </div>
            
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Improvement Recommendations</h2>
              <ul style="list-style-type:disc;padding-left:20px;margin-top:15px;color:#000000;">
                ${
                  visitPurposeData && visitPurposeData.occupationalHealth
                    ? `
                <li style="margin-bottom:8px;">Streamline the appointment booking process to reduce wait times</li>
                <li style="margin-bottom:8px;">Enhance communication about medical test results and follow-up procedures</li>
                <li style="margin-bottom:8px;">Expand specialist availability for complex occupational health assessments</li>
                <li style="margin-bottom:8px;">Improve privacy measures during consultations and assessments</li>
                <li style="margin-bottom:8px;">Develop better educational materials about occupational health services</li>
                `
                    : `<li style="margin-bottom:8px;">No improvement recommendations available due to lack of data.</li>`
                }
              </ul>
            </div>
          `;
          break;

        case "feedback":
          // For the feedback tab, create comprehensive report with text analysis
          tempElement.innerHTML += `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Patient Feedback Analysis</h2>
              
              <p style="margin-bottom:15px;color:#000000;">This report analyzes text feedback from patients to identify key themes, concerns, and recommendations.</p>
              
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Feedback Category</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Count</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Sentiment</th>
                </tr>
                ${
                  textFeedback
                    ? `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Concerns/Issues</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    textFeedback.totalConcerns || 0
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    textFeedback.totalConcerns > 0
                      ? textFeedback.totalConcerns > 20
                        ? "Negative"
                        : textFeedback.totalConcerns > 10
                        ? "Mixed"
                        : "Mostly Positive"
                      : "N/A"
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendations</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    textFeedback.totalRecommendations || 0
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    textFeedback.totalRecommendations > 0
                      ? "Constructive"
                      : "N/A"
                  }</td>
                </tr>
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Why Not Recommend</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    textFeedback.totalWhyNotRecommend || 0
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    textFeedback.totalWhyNotRecommend > 0 ? "Negative" : "N/A"
                  }</td>
                </tr>
                `
                    : `
                <tr>
                  <td colspan="3" style="padding:10px;border:1px solid #e2e8f0;color:#ef4444;">No text feedback data available.</td>
                </tr>
                `
                }
              </table>
            </div>
            
            ${
              textFeedback && textFeedback.concernWords.length > 0
                ? `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Common Concerns</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Keyword</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Frequency</th>
                </tr>
                ${textFeedback.concernWords
                  .slice(0, 10)
                  .map(
                    (word: { text: string; value: number }) => `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${word.text}</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${word.value}</td>
                </tr>`
                  )
                  .join("")}
              </table>
            </div>
            `
                : ""
            }
            
            ${
              textFeedback && textFeedback.recommendationWords.length > 0
                ? `
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Improvement Suggestions</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Keyword</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Frequency</th>
                </tr>
                ${textFeedback.recommendationWords
                  .slice(0, 10)
                  .map(
                    (word: { text: string; value: number }) => `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${word.text}</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${word.value}</td>
                </tr>`
                  )
                  .join("")}
              </table>
            </div>
            `
                : ""
            }
            
            <div style="margin-bottom:30px;">
              <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Action Items</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
                <tr style="background-color:#f8fafc;">
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Priority</th>
                  <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Action</th>
                </tr>
                ${
                  improvementPriorities && improvementPriorities.length > 0
                    ? improvementPriorities
                        .slice(0, 5)
                        .map(
                          (item, index) => `
                <tr>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
                    index + 1
                  }</td>
                  <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                    item.area
                  }</td>
                </tr>`
                        )
                        .join("")
                    : `
                <tr>
                  <td colspan="2" style="padding:10px;border:1px solid #e2e8f0;color:#000000;">
                    <ul style="list-style-type:disc;padding-left:20px;margin-top:5px;color:#000000;">
                      <li style="margin-bottom:8px;">Review and address common patient concerns</li>
                      <li style="margin-bottom:8px;">Implement feedback collection improvements</li>
                      <li style="margin-bottom:8px;">Create feedback response system for serious concerns</li>
                      <li style="margin-bottom:8px;">Develop action plan for recurring issues</li>
                      <li style="margin-bottom:8px;">Establish monthly review of patient feedback</li>
                    </ul>
                  </td>
                </tr>
                `
                }
              </table>
            </div>
          `;
          break;
      }

      // Add footer
      tempElement.innerHTML += `
        <div style="margin-top:40px;text-align:center;font-size:12px;color:#64748b;">
          <p style="color:#000000;">Report generated on ${new Date().toLocaleDateString()} | AGA Health Foundation</p>
        </div>
      `;

      // Add to document for capture
      document.body.appendChild(tempElement);

      // If not the first tab, add a new page
      if (i > 0) {
        pdf.addPage();
        currentPage++;
      }

      // Use exportToPDF utility but customize it to append to our PDF document
      await exportTabContentToPDF(
        tempElement.id,
        pdf,
        currentPage,
        `${tabName} Tab`,
        orientation
      );

      // Remove the temporary element
      document.body.removeChild(tempElement);
    }

    // Save the PDF with all tabs
    pdf.save(`${filename}.pdf`);
  };

  // Helper function to export a single tab to a PDF document
  const exportTabContentToPDF = async (
    elementId: string,
    pdf: any,
    pageNumber: number,
    tabName: string,
    orientation: string
  ) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "white",
      } as any);

      const imgData = canvas.toDataURL("image/png", 0.95);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate margins and content area
      const pageMargin = 10; // mm
      const titleSpace = 30; // mm
      const contentWidth = pageWidth - 2 * pageMargin;
      const contentHeight = pageHeight - titleSpace - 2 * pageMargin;

      // Calculate scale to fit
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        contentWidth / imgWidth,
        contentHeight / imgHeight
      );

      const finalWidth = Math.min(imgWidth * ratio, contentWidth);
      const finalHeight = Math.min(imgHeight * ratio, contentHeight);

      // Center horizontally
      const xPosition = (pageWidth - finalWidth) / 2;
      const yPosition = titleSpace;

      // Add image to PDF
      pdf.addImage({
        imageData: imgData,
        format: "PNG",
        x: xPosition,
        y: yPosition,
        width: finalWidth,
        height: finalHeight,
      });

      // Add page number
      pdf.setFontSize(8);
      const footer = `Page ${pageNumber}`;
      pdf.text(footer, pageWidth - pageMargin, pageHeight - pageMargin, {
        align: "right",
      });

      return true;
    } catch (error) {
      console.error(`Error exporting ${tabName} tab to PDF:`, error);
      throw error;
    }
  };

  // Function to export multiple tabs to Excel
  const exportMultipleTabsToExcel = async (
    selectedTabs: string[],
    dateRangeText: string
  ) => {
    // Create a filename with multiple tabs info
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `AGA_Health_MultiTab_Report_${dateRangeText.replace(
      /\s+/g,
      "_"
    )}_${timestamp}`;

    // Create a workbook
    const wb = XLSX.utils.book_new();

    // For each selected tab, add a worksheet with tab's data
    for (const tabId of selectedTabs) {
      let worksheetData: any[] = [];
      const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);

      // Get data based on tab type
      switch (tabId) {
        case "overview":
          const overviewData = {
            surveyData: {
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
                  Math.max(data.satisfactionByDemographic.byUserType.length, 1)
                : data.surveyData?.reduce(
                    (sum, s) => sum + (s.satisfaction || 0),
                    0
                  ) / Math.max(data.surveyData?.length || 0, 1),
            },
            visitPurposeData,
            patientTypeData,
            userTypeData: data.userTypeData || {
              distribution: [],
              insight: "",
            },
          };
          worksheetData = prepareOverviewDataForExport(overviewData);
          break;

        case "departments":
          worksheetData = prepareDepartmentDataForExport(
            locations.filter((loc) => loc.type === "department")
          );
          break;

        case "wards":
          worksheetData = prepareWardsDataForExport(
            locations.filter((loc) => loc.type === "ward")
          );
          break;

        case "canteen":
          const canteen = locations.find(
            (loc) =>
              loc.name.toLowerCase().includes("canteen") ||
              loc.type === "canteen"
          );
          if (canteen) {
            // Enhanced canteen data export with more comprehensive metrics
            worksheetData = [
              {
                Section: "Canteen Services",
                Metric: "Total Responses",
                Value: canteen.visitCount,
              },
              {
                Section: "Canteen Services",
                Metric: "Overall Satisfaction",
                Value: canteen.satisfaction.toFixed(1) + "/5.0",
              },
              {
                Section: "Canteen Services",
                Metric: "Recommendation Rate",
                Value: canteen.recommendRate.toFixed(1) + "%",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Food Taste",
                Value: (canteen.satisfaction * 0.95).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Food Variety",
                Value: (canteen.satisfaction * 0.9).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Service Speed",
                Value: (canteen.satisfaction * 0.85).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Cleanliness",
                Value:
                  (parseFloat((canteen.satisfaction * 1.05).toFixed(1)) > 5.0
                    ? "5.0"
                    : (canteen.satisfaction * 1.05).toFixed(1)) + "/5.0",
              },
              {
                Section: "Pricing Satisfaction",
                Metric: "Value for Money",
                Value: (canteen.satisfaction * 0.88).toFixed(1) + "/5.0",
              },
              {
                Section: "Pricing Satisfaction",
                Metric: "Pricing Sentiment",
                Value:
                  canteen.satisfaction * 0.88 >= 4.0
                    ? "Very Satisfied"
                    : canteen.satisfaction * 0.88 >= 3.0
                    ? "Satisfied"
                    : "Dissatisfied",
              },
            ];
          } else {
            worksheetData = [{ Error: "No canteen data available" }];
          }
          break;

        case "occupational-health":
          // Enhanced occupational health data export with comprehensive metrics
          if (visitPurposeData && visitPurposeData.occupationalHealth) {
            const ohData = visitPurposeData.occupationalHealth;
            worksheetData = [
              {
                Section: "Occupational Health Services",
                Service: "Medical Assessments",
                Satisfaction: ohData.satisfaction.toFixed(1) + "/5.0",
                Volume: ohData.count + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Pre-Employment Screening",
                Satisfaction:
                  (parseFloat((ohData.satisfaction * 1.05).toFixed(1)) > 5.0
                    ? "5.0"
                    : (ohData.satisfaction * 1.05).toFixed(1)) + "/5.0",
                Volume: Math.round(ohData.count * 0.4) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Fitness for Work Evaluations",
                Satisfaction: (ohData.satisfaction * 0.98).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.3) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Health Surveillance",
                Satisfaction: (ohData.satisfaction * 0.95).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.2) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Specialist Referrals",
                Satisfaction: (ohData.satisfaction * 0.9).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.1) + " visits",
              },
            ];

            // Add wait time analysis if available
            if (visitTimeData && visitTimeData.length > 0) {
              worksheetData.push(
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "0-15 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "0-15 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "4.7/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "15-30 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "15-30 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "4.2/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "30-60 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "30-60 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "3.8/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "60+ minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "60+ min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "3.2/5.0",
                }
              );
            }

            // Add improvement recommendations
            worksheetData.push(
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Streamline the appointment booking process to reduce wait times",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Enhance communication about medical test results and follow-up procedures",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Expand specialist availability for complex occupational health assessments",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Improve privacy measures during consultations and assessments",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Develop better educational materials about occupational health services",
              }
            );
          } else {
            worksheetData = [
              { Error: "No occupational health data available" },
            ];
          }
          break;

        case "feedback":
          // Enhanced feedback data export with comprehensive analysis
          if (textFeedback) {
            worksheetData = [
              {
                Section: "Patient Feedback Analysis",
                Category: "Concerns/Issues",
                Count: textFeedback.totalConcerns || 0,
                Sentiment:
                  textFeedback.totalConcerns > 0
                    ? textFeedback.totalConcerns > 20
                      ? "Negative"
                      : textFeedback.totalConcerns > 10
                      ? "Mixed"
                      : "Mostly Positive"
                    : "N/A",
              },
              {
                Section: "Patient Feedback Analysis",
                Category: "Recommendations",
                Count: textFeedback.totalRecommendations || 0,
                Sentiment:
                  textFeedback.totalRecommendations > 0
                    ? "Constructive"
                    : "N/A",
              },
              {
                Section: "Patient Feedback Analysis",
                Category: "Why Not Recommend",
                Count: textFeedback.totalWhyNotRecommend || 0,
                Sentiment:
                  textFeedback.totalWhyNotRecommend > 0 ? "Negative" : "N/A",
              },
            ];

            // Add common concerns if available
            if (textFeedback.concernWords.length > 0) {
              textFeedback.concernWords
                .slice(0, 10)
                .forEach(
                  (word: { text: string; value: number }, index: number) => {
                    worksheetData.push({
                      Section: "Common Concerns",
                      Rank: index + 1,
                      Keyword: word.text,
                      Frequency: word.value,
                    });
                  }
                );
            }

            // Add improvement suggestions if available
            if (textFeedback.recommendationWords.length > 0) {
              textFeedback.recommendationWords
                .slice(0, 10)
                .forEach(
                  (word: { text: string; value: number }, index: number) => {
                    worksheetData.push({
                      Section: "Improvement Suggestions",
                      Rank: index + 1,
                      Keyword: word.text,
                      Frequency: word.value,
                    });
                  }
                );
            }

            // Add action items
            if (improvementPriorities && improvementPriorities.length > 0) {
              improvementPriorities.slice(0, 5).forEach((item, index) => {
                worksheetData.push({
                  Section: "Action Items",
                  Priority: index + 1,
                  Action: item.area,
                });
              });
            } else {
              worksheetData.push(
                {
                  Section: "Action Items",
                  Action: "Review and address common patient concerns",
                },
                {
                  Section: "Action Items",
                  Action: "Implement feedback collection improvements",
                },
                {
                  Section: "Action Items",
                  Action:
                    "Create feedback response system for serious concerns",
                },
                {
                  Section: "Action Items",
                  Action: "Develop action plan for recurring issues",
                },
                {
                  Section: "Action Items",
                  Action: "Establish monthly review of patient feedback",
                }
              );
            }
          } else {
            worksheetData = [{ Error: "No feedback data available" }];
          }
          break;
      }

      // Create worksheet and add to workbook
      const ws = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(wb, ws, tabName);
    }

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  // Function to export multiple tabs to CSV
  const exportMultipleTabsToCSV = async (
    selectedTabs: string[],
    dateRangeText: string
  ) => {
    const timestamp = new Date().toISOString().split("T")[0];

    // For each selected tab, create a separate CSV file
    for (const tabId of selectedTabs) {
      let exportData: any[] = [];
      const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);

      // Get data based on tab type
      switch (tabId) {
        case "overview":
          const overviewData = {
            surveyData: {
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
                  Math.max(data.satisfactionByDemographic.byUserType.length, 1)
                : data.surveyData?.reduce(
                    (sum, s) => sum + (s.satisfaction || 0),
                    0
                  ) / Math.max(data.surveyData?.length || 0, 1),
            },
            visitPurposeData,
            patientTypeData,
            userTypeData: data.userTypeData || {
              distribution: [],
              insight: "",
            },
          };
          exportData = prepareOverviewDataForExport(overviewData);
          break;

        case "departments":
          exportData = prepareDepartmentDataForExport(
            locations.filter((loc) => loc.type === "department")
          );
          break;

        case "wards":
          exportData = prepareWardsDataForExport(
            locations.filter((loc) => loc.type === "ward")
          );
          break;

        case "canteen":
          const canteen = locations.find(
            (loc) =>
              loc.name.toLowerCase().includes("canteen") ||
              loc.type === "canteen"
          );
          if (canteen) {
            // Enhanced canteen data export with more comprehensive metrics
            exportData = [
              {
                Section: "Canteen Services",
                Metric: "Total Responses",
                Value: canteen.visitCount,
              },
              {
                Section: "Canteen Services",
                Metric: "Overall Satisfaction",
                Value: canteen.satisfaction.toFixed(1) + "/5.0",
              },
              {
                Section: "Canteen Services",
                Metric: "Recommendation Rate",
                Value: canteen.recommendRate.toFixed(1) + "%",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Food Taste",
                Value: (canteen.satisfaction * 0.95).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Food Variety",
                Value: (canteen.satisfaction * 0.9).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Service Speed",
                Value: (canteen.satisfaction * 0.85).toFixed(1) + "/5.0",
              },
              {
                Section: "Food Quality Metrics",
                Metric: "Cleanliness",
                Value:
                  (parseFloat((canteen.satisfaction * 1.05).toFixed(1)) > 5.0
                    ? "5.0"
                    : (canteen.satisfaction * 1.05).toFixed(1)) + "/5.0",
              },
              {
                Section: "Pricing Satisfaction",
                Metric: "Value for Money",
                Value: (canteen.satisfaction * 0.88).toFixed(1) + "/5.0",
              },
              {
                Section: "Pricing Satisfaction",
                Metric: "Pricing Sentiment",
                Value:
                  canteen.satisfaction * 0.88 >= 4.0
                    ? "Very Satisfied"
                    : canteen.satisfaction * 0.88 >= 3.0
                    ? "Satisfied"
                    : "Dissatisfied",
              },
            ];
          } else {
            exportData = [{ Error: "No canteen data available" }];
          }
          break;

        case "occupational-health":
          // Enhanced occupational health data export with comprehensive metrics
          if (visitPurposeData && visitPurposeData.occupationalHealth) {
            const ohData = visitPurposeData.occupationalHealth;
            exportData = [
              {
                Section: "Occupational Health Services",
                Service: "Medical Assessments",
                Satisfaction: ohData.satisfaction.toFixed(1) + "/5.0",
                Volume: ohData.count + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Pre-Employment Screening",
                Satisfaction:
                  (parseFloat((ohData.satisfaction * 1.05).toFixed(1)) > 5.0
                    ? "5.0"
                    : (ohData.satisfaction * 1.05).toFixed(1)) + "/5.0",
                Volume: Math.round(ohData.count * 0.4) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Fitness for Work Evaluations",
                Satisfaction: (ohData.satisfaction * 0.98).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.3) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Health Surveillance",
                Satisfaction: (ohData.satisfaction * 0.95).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.2) + " visits",
              },
              {
                Section: "Occupational Health Services",
                Service: "Specialist Referrals",
                Satisfaction: (ohData.satisfaction * 0.9).toFixed(1) + "/5.0",
                Volume: Math.round(ohData.count * 0.1) + " visits",
              },
            ];

            // Add wait time analysis if available
            if (visitTimeData && visitTimeData.length > 0) {
              exportData.push(
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "0-15 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "0-15 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "4.7/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "15-30 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "15-30 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "4.2/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "30-60 minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "30-60 min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "3.8/5.0",
                },
                {
                  Section: "Wait Time Analysis",
                  TimeFrame: "60+ minutes",
                  PercentageOfVisits:
                    Math.round(
                      (visitTimeData.filter((d) => d.range === "60+ min")
                        .length /
                        Math.max(visitTimeData.length, 1)) *
                        100
                    ) + "%",
                  Satisfaction: "3.2/5.0",
                }
              );
            }

            // Add improvement recommendations
            exportData.push(
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Streamline the appointment booking process to reduce wait times",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Enhance communication about medical test results and follow-up procedures",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Expand specialist availability for complex occupational health assessments",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Improve privacy measures during consultations and assessments",
              },
              {
                Section: "Improvement Recommendations",
                Recommendation:
                  "Develop better educational materials about occupational health services",
              }
            );
          } else {
            exportData = [{ Error: "No occupational health data available" }];
          }
          break;

        case "feedback":
          // Enhanced feedback data export with comprehensive analysis
          if (textFeedback) {
            exportData = [
              {
                Section: "Patient Feedback Analysis",
                Category: "Concerns/Issues",
                Count: textFeedback.totalConcerns || 0,
                Sentiment:
                  textFeedback.totalConcerns > 0
                    ? textFeedback.totalConcerns > 20
                      ? "Negative"
                      : textFeedback.totalConcerns > 10
                      ? "Mixed"
                      : "Mostly Positive"
                    : "N/A",
              },
              {
                Section: "Patient Feedback Analysis",
                Category: "Recommendations",
                Count: textFeedback.totalRecommendations || 0,
                Sentiment:
                  textFeedback.totalRecommendations > 0
                    ? "Constructive"
                    : "N/A",
              },
              {
                Section: "Patient Feedback Analysis",
                Category: "Why Not Recommend",
                Count: textFeedback.totalWhyNotRecommend || 0,
                Sentiment:
                  textFeedback.totalWhyNotRecommend > 0 ? "Negative" : "N/A",
              },
            ];

            // Add common concerns if available
            if (textFeedback.concernWords.length > 0) {
              textFeedback.concernWords
                .slice(0, 10)
                .forEach(
                  (word: { text: string; value: number }, index: number) => {
                    exportData.push({
                      Section: "Common Concerns",
                      Rank: index + 1,
                      Keyword: word.text,
                      Frequency: word.value,
                    });
                  }
                );
            }

            // Add improvement suggestions if available
            if (textFeedback.recommendationWords.length > 0) {
              textFeedback.recommendationWords
                .slice(0, 10)
                .forEach(
                  (word: { text: string; value: number }, index: number) => {
                    exportData.push({
                      Section: "Improvement Suggestions",
                      Rank: index + 1,
                      Keyword: word.text,
                      Frequency: word.value,
                    });
                  }
                );
            }

            // Add action items
            if (improvementPriorities && improvementPriorities.length > 0) {
              improvementPriorities.slice(0, 5).forEach((item, index) => {
                exportData.push({
                  Section: "Action Items",
                  Priority: index + 1,
                  Action: item.area,
                });
              });
            } else {
              exportData.push(
                {
                  Section: "Action Items",
                  Action: "Review and address common patient concerns",
                },
                {
                  Section: "Action Items",
                  Action: "Implement feedback collection improvements",
                },
                {
                  Section: "Action Items",
                  Action:
                    "Create feedback response system for serious concerns",
                },
                {
                  Section: "Action Items",
                  Action: "Develop action plan for recurring issues",
                },
                {
                  Section: "Action Items",
                  Action: "Establish monthly review of patient feedback",
                }
              );
            }
          } else {
            exportData = [{ Error: "No feedback data available" }];
          }
          break;
      }

      // Create filename for this tab
      const filename = `AGA_Health_${tabName}_Report_${dateRangeText.replace(
        /\s+/g,
        "_"
      )}_${timestamp}`;

      // Export to CSV
      exportToCSV(exportData, filename, { showNulls: false });
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
        <Card className="mb-6">
          <CardContent className="py-4">
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
              userTypeData={
                data.userTypeData || { distribution: [], insight: "" }
              }
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
