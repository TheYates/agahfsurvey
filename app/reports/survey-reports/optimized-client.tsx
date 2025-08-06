"use client";

import { useState, useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Star,
  ThumbsUp,
  Building,
  BedDouble,
  MessageSquare,
  BarChart3,
} from "lucide-react";

// Chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface OptimizedSurveyData {
  overview: {
    totalResponses: number;
    recommendRate: number;
    avgSatisfaction: number;
    purposeDistribution: Array<{ name: string; value: number }>;
    satisfactionByDemographic: {
      byUserType: Array<{ userType: string; satisfaction: number; count: number }>;
      byPatientType: Array<{ patientType: string; satisfaction: number; count: number }>;
    };
    visitTimeAnalysis: Array<{ visitTime: string; count: number; satisfaction: number }>;
    improvementAreas: Array<{ area: string; satisfaction: number; impact: number }>;
  };
  wards: Array<{
    id: string;
    name: string;
    satisfaction: number;
    visitCount: number;
    recommendRate: number;
    avgRatings: {
      reception: number;
      professionalism: number;
      understanding: number;
      promptnessCare: number;
      overall: number;
    };
  }>;
  departments: Array<{
    id: string;
    name: string;
    satisfaction: number;
    visitCount: number;
    recommendRate: number;
    avgRatings: {
      reception: number;
      professionalism: number;
      understanding: number;
      promptnessCare: number;
      overall: number;
    };
  }>;
  concerns: Array<{
    locationId: string;
    locationName: string;
    concern: string;
    type: string;
  }>;
}

interface OptimizedSurveyReportsClientProps {
  initialData: OptimizedSurveyData;
}

export function OptimizedSurveyReportsClient({ initialData }: OptimizedSurveyReportsClientProps) {
  const [dateRange, setDateRange] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Memoized chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    const colors = ["#4caf50", "#22c5bf", "#e8e5c0", "#f6a050", "#e84e3c"];
    
    const purposeChartData = {
      labels: initialData.overview.purposeDistribution.map(item => item.name),
      datasets: [{
        data: initialData.overview.purposeDistribution.map(item => item.value),
        backgroundColor: colors,
        borderColor: colors.map(color => color + "80"),
        borderWidth: 1,
      }]
    };

    const wardSatisfactionData = {
      labels: initialData.wards.slice(0, 10).map(ward => ward.name),
      datasets: [{
        label: "Satisfaction Score",
        data: initialData.wards.slice(0, 10).map(ward => ward.satisfaction),
        backgroundColor: "#22c5bf",
        borderColor: "#1a9b96",
        borderWidth: 1,
      }]
    };

    const departmentSatisfactionData = {
      labels: initialData.departments.slice(0, 10).map(dept => dept.name),
      datasets: [{
        label: "Satisfaction Score",
        data: initialData.departments.slice(0, 10).map(dept => dept.satisfaction),
        backgroundColor: "#4caf50",
        borderColor: "#3d8b40",
        borderWidth: 1,
      }]
    };

    return {
      purposeChartData,
      wardSatisfactionData,
      departmentSatisfactionData
    };
  }, [initialData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force a page refresh to get fresh server-side data
    window.location.reload();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/reports" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Reports</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src="/agahflogo white.svg"
              alt="AGA Health Foundation Logo"
              width={40}
              height={40}
            />
            <span className="text-lg font-semibold">AGA Health Foundation</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Reports Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive analysis of patient satisfaction across all service points
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.overview.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              Survey submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.overview.avgSatisfaction.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.overview.recommendRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Would recommend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Points</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.wards.length + initialData.departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Active locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visit Purpose Distribution</CardTitle>
                <CardDescription>
                  Breakdown of visit purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {initialData.overview.purposeDistribution.length > 0 ? (
                    <Pie data={chartData.purposeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Time Analysis</CardTitle>
                <CardDescription>
                  Patient satisfaction by visit time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {initialData.overview.visitTimeAnalysis.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.visitTime}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{item.count} visits</span>
                        <span className="text-sm font-medium">{item.satisfaction.toFixed(1)}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wards" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ward Satisfaction Scores</CardTitle>
                <CardDescription>
                  Top performing wards by satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={chartData.wardSatisfactionData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ward Performance Table</CardTitle>
                <CardDescription>
                  Detailed ward statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ward Name</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Overall Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialData.wards.slice(0, 10).map((ward) => (
                      <TableRow key={ward.id}>
                        <TableCell className="font-medium">{ward.name}</TableCell>
                        <TableCell>{ward.visitCount}</TableCell>
                        <TableCell>{ward.satisfaction.toFixed(1)}/5</TableCell>
                        <TableCell>{ward.avgRatings.overall.toFixed(1)}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Satisfaction Scores</CardTitle>
                <CardDescription>
                  Top performing departments by satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={chartData.departmentSatisfactionData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance Table</CardTitle>
                <CardDescription>
                  Detailed department statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Overall Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialData.departments.slice(0, 10).map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.visitCount}</TableCell>
                        <TableCell>{dept.satisfaction.toFixed(1)}/5</TableCell>
                        <TableCell>{dept.avgRatings.overall.toFixed(1)}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction by User Type</CardTitle>
                <CardDescription>
                  How different user types rate their experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {initialData.overview.satisfactionByDemographic.byUserType.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.userType}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{item.count} responses</span>
                        <span className="text-sm font-medium">{item.satisfaction.toFixed(1)}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction by Patient Type</CardTitle>
                <CardDescription>
                  Patient type satisfaction breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {initialData.overview.satisfactionByDemographic.byPatientType.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.patientType}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{item.count} responses</span>
                        <span className="text-sm font-medium">{item.satisfaction.toFixed(1)}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Concerns & Feedback</CardTitle>
              <CardDescription>
                Latest feedback from patients across all service points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialData.concerns.slice(0, 20).map((concern, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{concern.locationName}</TableCell>
                      <TableCell className="max-w-md truncate">{concern.concern}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {concern.type}
                        </span>
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
  );
}
