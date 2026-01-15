"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { addDays, subMonths, subYears, format } from "date-fns";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";

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
import { getNPS, getNPSByLocationType, getOutpatientRecommendationRate, getInpatientRecommendationRate } from "@/app/actions/report-actions";
import { OverviewTab } from "./components/overview-tab";
import { DepartmentsTab } from "./components/departments-tab";
import { WardsTab } from "./components/wards-tab";
import { CanteenTab } from "./components/canteen-tab";
import { MedicalsTab } from "./components/medicals-tab";
import { FeedbackTab } from "./components/feedback-tab";
import { fetchDepartmentTabData } from "@/app/actions/department-actions";
import { Department } from "@/app/actions/department-actions";
import { Ward } from "@/app/actions/ward-actions";
import { fetchWardTabData } from "@/app/actions/ward-actions";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("all");

  const [visitPurposeData, setVisitPurposeData] = useState<any>(null);
  const [patientTypeData, setPatientTypeData] = useState<any>(null);
  const [visitTimeData, setVisitTimeData] = useState<any[]>([]);
  const [improvementPriorities, setImprovementPriorities] = useState<any[]>([]);
  const [textFeedback, setTextFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<(DepartmentData | WardData)[]>([]);
  const [npsData, setNpsData] = useState<any>(null);
  const [departmentNpsData, setDepartmentNpsData] = useState<any>(null);
  const [wardNpsData, setWardNpsData] = useState<any>(null);
  const [canteenNpsData, setCanteenNpsData] = useState<any>(null);
  const [medicalsNpsData, setMedicalsNpsData] = useState<any>(null);
  const [outpatientRecommendationRate, setOutpatientRecommendationRate] = useState(0);
  const [inpatientRecommendationRate, setInpatientRecommendationRate] = useState(0);
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
  // Track which tabs have been loaded to avoid unnecessary data fetching
  const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({
    overview: false,
    departments: false,
    wards: false,
    canteen: false,
    medicals: false,
    feedback: false,
  });

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
  const [departmentNpsFeedback, setDepartmentNpsFeedback] = useState<any[]>([]);

  // Add state for wards
  const [wards, setWards] = useState<Ward[]>([]);
  const [wardNpsFeedback, setWardNpsFeedback] = useState<any[]>([]);

  // Add state for ward pagination
  const [wardPagination, setWardPagination] = useState<{
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }>({
    total: 0,
    limit: 5,
    offset: 0,
    hasMore: false,
  });

  // Update the fetchData function to implement better caching and parallel loading
  const fetchData = async (selectedDateRange: DateRange | undefined) => {
    try {
      setIsLoading(true);


      // Calculate date range filter from DateRange object
      let dateRangeFilter = null;
      if (selectedDateRange?.from) {
        // Set start date to beginning of day (00:00:00.000)
        const fromDate = new Date(selectedDateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        // Set end date to end of day (23:59:59.999)
        const toDate = selectedDateRange.to ? new Date(selectedDateRange.to) : new Date(selectedDateRange.from);
        toDate.setHours(23, 59, 59, 999);

        dateRangeFilter = {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        };
      }

      // Define cache key - we'll skip cache for now to ensure fresh data
      const CACHE_KEY = dateRangeFilter
        ? `surveyReportsData_${dateRangeFilter.from}_${dateRangeFilter.to}`
        : "surveyReportsData_all";

      // Skip cache check - always fetch fresh data to ensure filters work correctly
      // TODO: Re-enable cache with proper invalidation strategy

      // Fetch all data in parallel

      // Start all fetches in parallel
      const overviewPromise = fetchOverviewTabData(dateRangeFilter);
      const departmentPromise = fetchDepartmentTabData(dateRangeFilter);
      const wardPromise = fetchWardTabData(5, 0, dateRangeFilter);
      const npsPromise = getNPS(dateRangeFilter);
      const departmentNpsPromise = getNPSByLocationType("department", dateRangeFilter);
      const wardNpsPromise = getNPSByLocationType("ward", dateRangeFilter);
      const canteenNpsPromise = getNPSByLocationType("canteen", dateRangeFilter);
      const medicalsNpsPromise = getNPSByLocationType("occupational_health", dateRangeFilter);
      const outpatientRecommendationRatePromise = getOutpatientRecommendationRate(dateRangeFilter);
      const inpatientRecommendationRatePromise = getInpatientRecommendationRate(dateRangeFilter);

      // Wait for all promises to resolve
      const [
        fetchedOverviewData,
        departmentData,
        wardData,
        npsResult,
        deptNps,
        wardNps,
        canteenNps,
        medicalsNps,
        outpatientRecRate,
        inpatientRecRate
      ] = await Promise.all([
        overviewPromise,
        departmentPromise,
        wardPromise,
        npsPromise,
        departmentNpsPromise,
        wardNpsPromise,
        canteenNpsPromise,
        medicalsNpsPromise,
        outpatientRecommendationRatePromise,
        inpatientRecommendationRatePromise
      ]);

      // Store the fetched data in the overviewData state
      setOverviewData(fetchedOverviewData);
      setNpsData(npsResult);
      setDepartmentNpsData(deptNps);
      setWardNpsData(wardNps);
      setCanteenNpsData(canteenNps);
      setMedicalsNpsData(medicalsNps);
      setOutpatientRecommendationRate(outpatientRecRate);
      setInpatientRecommendationRate(inpatientRecRate);

      // For backward compatibility, create a surveyData array with safe access
      const surveyData =
        fetchedOverviewData && fetchedOverviewData.surveyData
          ? {
            totalResponses:
              fetchedOverviewData.surveyData.totalResponses || 0,
            recommendRate: fetchedOverviewData.surveyData.recommendRate || 0,
            avgSatisfaction:
              fetchedOverviewData.surveyData.avgSatisfaction || 0,
            mostCommonPurpose:
              fetchedOverviewData.surveyData.mostCommonPurpose || "",
            purposeDistribution:
              fetchedOverviewData.surveyData.purposeDistribution || [],
          }
          : {
            totalResponses: 0,
            recommendRate: 0,
            avgSatisfaction: 0,
            mostCommonPurpose: "",
            purposeDistribution: [],
          };

      // Set data state with the overview data
      const enhancedData = {
        surveyData: [surveyData],
        recommendations: [surveyData],
        notRecommendReasons: [surveyData],
        departmentConcerns: [surveyData],
        visitTimeAnalysis: fetchedOverviewData.visitTimeAnalysis,
        satisfactionByDemographic:
          fetchedOverviewData.satisfactionByDemographic,
        improvementAreas: fetchedOverviewData.improvementAreas,
        userTypeData: fetchedOverviewData.userTypeData,
      };

      setData(enhancedData);
      setDepartments(departmentData.departments);
      setDepartmentNpsFeedback(departmentData.npsFeedback || []);
      setWards(wardData.wards);
      setWardNpsFeedback(wardData.npsFeedback || []);

      // Update ward pagination state
      const wardPaginationData = {
        total: wardData.pagination?.total || 0,
        limit: wardData.pagination?.limit || 5,
        offset: wardData.pagination?.offset || 0,
        hasMore: wardData.pagination?.hasMore || false,
      };

      setWardPagination(wardPaginationData);

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
      setPatientTypeData(fetchedOverviewData.patientTypeData || null);
      setVisitTimeData(fetchedOverviewData.visitTimeData || []);

      // Cache the data for future use
      if (typeof window !== "undefined") {
        try {
          const cachePayload = {
            data: {
              overviewData: fetchedOverviewData,
              enhancedData,
              departments: departmentData.departments,
              wards: wardData.wards,
              wardPagination: wardPaginationData,
              locations: combinedLocations,
              visitPurposeData: fetchedOverviewData.visitPurposeData || null,
              patientTypeData: fetchedOverviewData.patientTypeData || null,
              visitTimeData: fetchedOverviewData.visitTimeData || [],
            },
            timestamp: Date.now(),
          };

          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        } catch (error) {
          console.error("Error caching data:", error);
        }
      }

      // Mark core tabs as loaded
      setLoadedTabs({
        ...loadedTabs,
        overview: true,
        departments: true,
        wards: true,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  // Add debug logging for visitTimeData
  useEffect(() => { }, [visitTimeData]);

  // Track the active tab
  const handleTabChange = (value: string) => {
    const startTime = performance.now();

    // Update the active tab ref
    activeTabRef.current = value;

    // Check if this is one of the specialized tabs that should share loading
    const relatedTabs = ["canteen", "medicals", "feedback"];

    if (relatedTabs.includes(value)) {
      // If any of the related tabs is already loaded, mark all as loaded
      const anyRelatedTabLoaded = relatedTabs.some((tab) => loadedTabs[tab]);

      if (anyRelatedTabLoaded) {
      } else {
        // Mark all related tabs as loaded to trigger their data fetching
        const updatedLoadedTabs = { ...loadedTabs };
        relatedTabs.forEach((tab) => {
          updatedLoadedTabs[tab] = true;
        });
        setLoadedTabs(updatedLoadedTabs);
      }
    } else {
      // For other tabs, just mark this one as loaded if it's not already
      if (!loadedTabs[value]) {
        setLoadedTabs({
          ...loadedTabs,
          [value]: true,
        });
      }
    }

    const endTime = performance.now();
  };

  // Function to render tab content with loading state only on first load
  const renderTabContent = (
    tabId: string,
    content: React.ReactNode,
    loadingContent: React.ReactNode
  ) => {
    // Special handling for related tabs (canteen, medicals, feedback)
    const relatedTabs = ["canteen", "medicals", "feedback"];

    if (relatedTabs.includes(tabId)) {
      // Check if any of the related tabs have been loaded
      const anyRelatedTabLoaded = relatedTabs.some((tab) => loadedTabs[tab]);

      // If none are loaded and we're loading, show loading content
      if (!anyRelatedTabLoaded && isLoading) {
        return loadingContent;
      }

      // Otherwise show the actual content
      return content;
    }

    // For other tabs, show loading content only on first load
    if (!loadedTabs[tabId] && isLoading) {
      return loadingContent;
    }

    return content;
  };

  // Function to load more wards
  const loadMoreWards = async () => {
    try {
      // Calculate the new offset
      const newOffset = wardPagination.offset + wardPagination.limit;

      // Calculate date range filter from DateRange object
      let dateRangeFilter = null;
      if (dateRange?.from) {
        // Set start date to beginning of day (00:00:00.000)
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        // Set end date to end of day (23:59:59.999)
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
        toDate.setHours(23, 59, 59, 999);

        dateRangeFilter = {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        };
      }

      // Fetch the next batch of wards
      const wardData = await fetchWardTabData(wardPagination.limit, newOffset, dateRangeFilter);

      // Combine the new wards with existing ones
      setWards((prevWards) => [...prevWards, ...wardData.wards]);

      // Update pagination state
      setWardPagination({
        total: wardData.pagination?.total || 0,
        limit: wardData.pagination?.limit || 5,
        offset: newOffset,
        hasMore: wardData.pagination?.hasMore || false,
      });
    } catch (error) {
      console.error("Error loading more wards:", error);
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
                className="h-auto"
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
              onClick={() => fetchData(dateRange)}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card className="mb-3">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Date Range:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activePreset === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActivePreset(null);
                      setDateRange(undefined);
                      fetchData(undefined);
                    }}
                  >
                    All Time
                  </Button>
                  <Button
                    variant={activePreset === "last-month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActivePreset("last-month");
                      const range = {
                        from: subMonths(new Date(), 1),
                        to: new Date(),
                      };
                      setDateRange(range);
                      fetchData(range);
                    }}
                  >
                    Last Month
                  </Button>
                  <Button
                    variant={activePreset === "last-3-months" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActivePreset("last-3-months");
                      const range = {
                        from: subMonths(new Date(), 3),
                        to: new Date(),
                      };
                      setDateRange(range);
                      fetchData(range);
                    }}
                  >
                    Last 3 Months
                  </Button>
                  <Button
                    variant={activePreset === "last-year" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActivePreset("last-year");
                      const range = {
                        from: subYears(new Date(), 1),
                        to: new Date(),
                      };
                      setDateRange(range);
                      fetchData(range);
                    }}
                  >
                    Last Year
                  </Button>
                </div>
              </div>

              <DateRangePicker
                value={dateRange}
                onChange={(range) => {
                  setActivePreset("custom");
                  setDateRange(range);
                  fetchData(range);
                }}
              />
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
            <TabsTrigger value="medicals">
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
          <TabsContent value="overview">
            {renderTabContent(
              "overview",
              <OverviewTab
                surveyData={{
                  totalResponses: overviewData.surveyData.totalResponses || 0,
                  recommendRate: overviewData.surveyData.recommendRate || 0,
                  avgSatisfaction: overviewData.surveyData.avgSatisfaction || 0,
                  purposeDistribution:
                    overviewData.surveyData.purposeDistribution || [],
                  generalObservationStats: overviewData.surveyData
                    .generalObservationStats || {
                    cleanliness: 0,
                    facilities: 0,
                    security: 0,
                    overall: 0,
                  },
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
                npsData={npsData}
                locations={locations}
                outpatientRecommendationRate={outpatientRecommendationRate}
                inpatientRecommendationRate={inpatientRecommendationRate}
              />,
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i}>
                            <CardHeader className="pb-2">
                              <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-9 w-16 mb-1" />
                              <Skeleton className="h-3 w-32" />
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-64 w-full" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-64 w-full" />
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Add Departments Tab Content */}
          <TabsContent value="departments">
            {renderTabContent(
              "departments",
              <DepartmentsTab
                isLoading={isLoading}
                departments={departments}
                npsData={departmentNpsData}
                npsFeedback={departmentNpsFeedback}
              />,
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="relative overflow-hidden">
                        <CardHeader className="pb-2">
                          <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Skeleton className="h-9 w-16" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <div className="flex justify-between mt-4">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-80 w-full" />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Add Wards Tab Content */}
          <TabsContent value="wards">
            {renderTabContent(
              "wards",
              <WardsTab
                isLoading={false}
                wards={wards}
                pagination={wardPagination}
                onLoadMore={loadMoreWards}
                npsData={wardNpsData}
                npsFeedback={wardNpsFeedback}
              />,
              <WardsTab isLoading={true} wards={[]} npsData={null} />
            )}
          </TabsContent>

          {/* Add Canteen Tab Content */}
          <TabsContent value="canteen">
            {renderTabContent(
              "canteen",
              <CanteenTab
                isLoading={isLoading}
                departments={departments}
                dateRange={dateRange ? {
                  from: (() => {
                    const fromDate = new Date(dateRange.from!);
                    fromDate.setHours(0, 0, 0, 0);
                    return fromDate.toISOString();
                  })(),
                  to: (() => {
                    const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from!);
                    toDate.setHours(23, 59, 59, 999);
                    return toDate.toISOString();
                  })()
                } : null}
                npsData={canteenNpsData}
              />,
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-36" />
                          <Skeleton className="h-4 w-48 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array(6)
                              .fill(0)
                              .map((_, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                  <Skeleton className="h-2 w-full" />
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-64 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-80 w-full" />
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Add Medicals Tab Content */}
          <TabsContent value="medicals">
            {renderTabContent(
              "medicals",
              <MedicalsTab
                isLoading={isLoading}
                dateRange={dateRange ? {
                  from: (() => {
                    const fromDate = new Date(dateRange.from!);
                    fromDate.setHours(0, 0, 0, 0);
                    return fromDate.toISOString();
                  })(),
                  to: (() => {
                    const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from!);
                    toDate.setHours(23, 59, 59, 999);
                    return toDate.toISOString();
                  })()
                } : null}
                npsData={medicalsNpsData}
              />,
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-36" />
                          <Skeleton className="h-4 w-48 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array(6)
                              .fill(0)
                              .map((_, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                  <Skeleton className="h-2 w-full" />
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-64 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-80 w-full" />
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-56" />
                        <Skeleton className="h-4 w-72 mt-1" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-64 w-full" />
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Add Feedback Tab Content */}
          <TabsContent value="feedback">
            {renderTabContent(
              "feedback",
              <FeedbackTab
                isLoading={isLoading}
                surveyData={data.surveyData}
                dateRange={dateRange ? {
                  from: (() => {
                    const fromDate = new Date(dateRange.from!);
                    fromDate.setHours(0, 0, 0, 0);
                    return fromDate.toISOString();
                  })(),
                  to: (() => {
                    const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from!);
                    toDate.setHours(23, 59, 59, 999);
                    return toDate.toISOString();
                  })()
                } : null}
              />,
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <Skeleton className="h-6 w-36" />
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-56 mt-1" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Card key={i}>
                                <CardHeader className="py-3">
                                  <div className="flex justify-between">
                                    <Skeleton className="h-5 w-36" />
                                    <Skeleton className="h-4 w-24" />
                                  </div>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-5/6 mb-2" />
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
