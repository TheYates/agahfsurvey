"use client";

import { useState, useEffect } from "react";
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
// Charts temporarily disabled - imports kept for future use
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
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
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Star,
  ThumbsUp,
} from "lucide-react";

// Colors for charts
const COLORS = [
  "#4caf50", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

interface ReportsData {
  submissions: any[];
  totalResponses: number;
  locationVisits: any[];
  departmentRatings: any[];
  satisfactionData: { name: string; value: number }[];
  recommendationRate: number;
  averageSatisfaction: string;
  satisfactionByLocation: any[];
  weeklyResponses: number;
  locationData: { name: string; count: number }[];
}

interface ReportsClientProps {
  initialData: ReportsData;
}

export function ReportsClient({ initialData }: ReportsClientProps) {
  const [dateRange, setDateRange] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState(initialData);

  // Function to refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Force a page refresh to get fresh server-side data
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Chart configurations
  const satisfactionChartData = {
    labels: data.satisfactionData.map((item) => item.name),
    datasets: [
      {
        data: data.satisfactionData.map((item) => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color + "80"),
        borderWidth: 1,
      },
    ],
  };

  const locationChartData = {
    labels: data.locationData.map((item) => item.name),
    datasets: [
      {
        label: "Visits",
        data: data.locationData.map((item) => item.count),
        backgroundColor: "#22c5bf",
        borderColor: "#1a9b96",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/agahflogo white.svg"
                alt="AGA Health Foundation Logo"
                width={40}
                height={40}
              />
              <span className="text-lg font-semibold">AGA Health Foundation</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Reports</h1>
          <p className="text-gray-600">
            Comprehensive analysis of patient satisfaction data
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={refreshData}
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
            <div className="text-2xl font-bold">{data.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              {data.weeklyResponses} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageSatisfaction}</div>
            <p className="text-xs text-muted-foreground">
              Overall rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recommendationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Would recommend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.locationData.length}</div>
            <p className="text-xs text-muted-foreground">
              Survey locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Distribution</CardTitle>
                <CardDescription>
                  Overall satisfaction ratings breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chart temporarily disabled - TODO: Convert to Recharts */}
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Chart visualization coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Visits</CardTitle>
                <CardDescription>
                  Most visited survey locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chart temporarily disabled - TODO: Convert to Recharts */}
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Chart visualization coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Latest 5 survey submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient Type</TableHead>
                    <TableHead>Visit Purpose</TableHead>
                    <TableHead>Overall Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.submissions.map((survey, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(survey.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>{survey.patient_type || "N/A"}</TableCell>
                      <TableCell>{survey.visit_purpose || "N/A"}</TableCell>
                      <TableCell>{survey.overall_rating || "N/A"}</TableCell>
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
