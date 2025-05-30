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

  // Add state for wards
  const [wards, setWards] = useState<Ward[]>([]);

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
  const fetchData = async (dateRangeOption: string) => {
    try {
      setIsLoading(true);
      console.time("Total data loading time");

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

      // Check for cached data first
      const CACHE_KEY = `surveyReportsData_${dateRangeOption}`;
      const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

      let cachedData = null;
      if (typeof window !== "undefined") {
        try {
          const cached = sessionStorage.getItem(CACHE_KEY);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
              console.log("Using cached survey reports data");

              // Set all the data from cache
              setOverviewData(data.overviewData);
              setData(data.enhancedData);
              setDepartments(data.departments);
              setWards(data.wards);
              setWardPagination(data.wardPagination);
              setLocations(data.locations);
              setVisitPurposeData(data.visitPurposeData);
              setPatientTypeData(data.patientTypeData);
              setVisitTimeData(data.visitTimeData);

              // Mark all tabs as loaded since we have the data
              setLoadedTabs({
                overview: true,
                departments: true,
                wards: true,
                canteen: false, // These will be loaded on demand
                medicals: false,
                feedback: false,
              });

              setIsLoading(false);
              console.timeEnd("Total data loading time");
              return;
            }
          }
        } catch (error) {
          console.error("Error reading cache:", error);
        }
      }

      // Fetch all data in parallel
      console.log("Fetching fresh data...");

      // Start all fetches in parallel
      const overviewPromise = fetchOverviewTabData();
      const departmentPromise = fetchDepartmentTabData();
      const wardPromise = fetchWardTabData(5, 0);

      // Wait for all promises to resolve
      const [fetchedOverviewData, departmentData, wardData] = await Promise.all(
        [overviewPromise, departmentPromise, wardPromise]
      );

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
      setWards(wardData.wards);

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
          const dataToCache = {
            overviewData: fetchedOverviewData,
            enhancedData,
            departments: departmentData.departments,
            wards: wardData.wards,
            wardPagination: wardPaginationData,
            locations: combinedLocations,
            visitPurposeData: fetchedOverviewData.visitPurposeData || null,
            patientTypeData: fetchedOverviewData.patientTypeData || null,
            visitTimeData: fetchedOverviewData.visitTimeData || [],
            timestamp: Date.now(),
          };

          sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
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
      console.timeEnd("Total data loading time");
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
  useEffect(() => {}, [visitTimeData]);

  // Track the active tab
  const handleTabChange = (value: string) => {
    console.log(`Tab change started: ${activeTabRef.current} -> ${value}`);
    const startTime = performance.now();

    // Update the active tab ref
    activeTabRef.current = value;

    // Check if this is one of the specialized tabs that should share loading
    const relatedTabs = ["canteen", "medicals", "feedback"];

    if (relatedTabs.includes(value)) {
      // If any of the related tabs is already loaded, mark all as loaded
      const anyRelatedTabLoaded = relatedTabs.some((tab) => loadedTabs[tab]);

      if (anyRelatedTabLoaded) {
        console.log(`Using already loaded data for ${value} tab`);
      } else {
        console.log(
          `Triggering shared loading for all tabs: ${relatedTabs.join(", ")}`
        );

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
    console.log(`Tab change to ${value} completed in ${endTime - startTime}ms`);
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

      // Fetch the next batch of wards
      const wardData = await fetchWardTabData(wardPagination.limit, newOffset);

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
                locations={locations}
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
              />,
              <WardsTab isLoading={true} wards={[]} />
            )}
          </TabsContent>

          {/* Add Canteen Tab Content */}
          <TabsContent value="canteen">
            {renderTabContent(
              "canteen",
              <CanteenTab isLoading={isLoading} departments={departments} />,
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
              <MedicalsTab isLoading={isLoading} />,
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
