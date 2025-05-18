"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import {
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  Calendar,
  TrendingUp,
  Map,
  MessageSquare,
  Users,
  BarChart3,
  ThumbsUp,
} from "lucide-react"
import mockDataService from "@/lib/mock-data"

// Colors for charts
const COLORS = ["#2a8d46", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ff9800", "#f44336"]

// Process monthly trend data
const processMonthlyTrends = () => {
  const monthlyData = mockDataService.getMonthlyTrends()

  // Convert to array and sort by date
  const sortedMonths = Object.entries(monthlyData)
    .map(([key, data]) => {
      const [year, month] = key.split("-").map(Number)
      const date = new Date(year, month - 1)
      const monthName = date.toLocaleString("default", { month: "short" })

      return {
        month: monthName,
        excellent: data.excellent,
        veryGood: data.veryGood,
        good: data.good,
        fair: data.fair,
        poor: data.poor,
        recommendRate: data.recommendRate,
      }
    })
    .sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.indexOf(a.month) - months.indexOf(b.month)
    })
    .slice(-6) // Last 6 months

  return sortedMonths
}

// Process department comparison data
const processDepartmentData = () => {
  const departmentAverages = mockDataService.getDepartmentSatisfactionAverages()

  // Convert to array and sort by average
  const departmentData = Object.entries(departmentAverages)
    .filter(([_, avg]) => avg > 0) // Filter out departments with no data
    .sort((a, b) => b[1] - a[1]) // Sort by highest average
    .slice(0, 5) // Top 5 departments
    .map(([department, overall]) => {
      // Generate mock data for other categories
      return {
        department,
        reception: Math.min(5, overall + (Math.random() * 0.4 - 0.2)),
        professionalism: Math.min(5, overall + (Math.random() * 0.4 - 0.2)),
        understanding: Math.min(5, overall + (Math.random() * 0.4 - 0.2)),
        promptness: Math.min(5, overall + (Math.random() * 0.4 - 0.2)),
        feedback: Math.min(5, overall + (Math.random() * 0.4 - 0.2)),
        overall,
      }
    })

  return departmentData
}

export default function AdvancedAnalysisPage() {
  const [dateRange, setDateRange] = useState("6-months")
  const [department, setDepartment] = useState("all")
  const [trendData, setTrendData] = useState<any[]>([])
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [nps, setNps] = useState(0)
  const [satisfactionIndex, setSatisfactionIndex] = useState(0)
  const [recommendationRate, setRecommendationRate] = useState(0)

  useEffect(() => {
    // Process trend data
    setTrendData(processMonthlyTrends())

    // Process department data
    setDepartmentData(processDepartmentData())

    // Set KPIs
    setNps(Math.floor(Math.random() * 20) + 30) // Random NPS between 30-50
    setSatisfactionIndex(3.5 + Math.random() * 1.0) // Random satisfaction index between 3.5-4.5
    setRecommendationRate(mockDataService.getRecommendationRate())
  }, [])

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.svg" alt="AGA Health Foundation Logo" width={50} height={50} />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Advanced Analysis</h1>
            </div>
            <p className="text-muted-foreground">In-depth analysis of patient satisfaction survey data</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back to Reports</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Analysis Controls</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-months">Last 3 months</SelectItem>
                  <SelectItem value="6-months">Last 6 months</SelectItem>
                  <SelectItem value="1-year">Last year</SelectItem>
                  <SelectItem value="all-time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="opd">OPD</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="canteen">Canteen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <TrendingUp size={16} />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-1">
              <Map size={16} />
              <span>Departments</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="demographics" className="flex items-center gap-1">
              <Users size={16} />
              <span>Demographics</span>
            </TabsTrigger>
            <TabsTrigger value="kpi" className="flex items-center gap-1">
              <BarChart3 size={16} />
              <span>KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="correlation" className="flex items-center gap-1">
              <ThumbsUp size={16} />
              <span>Correlation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Trends Over Time</CardTitle>
                  <CardDescription>Monthly trend of satisfaction ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="excellent"
                          stroke="#2a8d46"
                          activeDot={{ r: 8 }}
                          name="Excellent"
                        />
                        <Line type="monotone" dataKey="veryGood" stroke="#4caf50" name="Very Good" />
                        <Line type="monotone" dataKey="good" stroke="#8bc34a" name="Good" />
                        <Line type="monotone" dataKey="fair" stroke="#cddc39" name="Fair" />
                        <Line type="monotone" dataKey="poor" stroke="#ffeb3b" name="Poor" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visit Purpose Trends</CardTitle>
                    <CardDescription>Monthly distribution of visit purposes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={trendData.map((month) => ({
                            month: month.month,
                            general: Math.floor(Math.random() * 20) + 50, // Random between 50-70
                            medicals: Math.floor(Math.random() * 20) + 20, // Random between 20-40
                          }))}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="general" stackId="a" fill="#2a8d46" name="General Practice" />
                          <Bar dataKey="medicals" stackId="a" fill="#4caf50" name="Medicals (Occupational Health)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendation Rate Trend</CardTitle>
                    <CardDescription>Monthly trend of recommendation rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendData.map((month) => ({
                            month: month.month,
                            rate: month.recommendRate,
                          }))}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[75, 95]} />
                          <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Recommendation Rate"]} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#2a8d46"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                            name="Recommendation Rate"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="departments">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance Comparison</CardTitle>
                  <CardDescription>Average ratings across all categories by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={departmentData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="department" />
                        <PolarRadiusAxis domain={[0, 5]} />
                        <Radar name="Reception" dataKey="reception" stroke="#2a8d46" fill="#2a8d46" fillOpacity={0.6} />
                        <Radar
                          name="Professionalism"
                          dataKey="professionalism"
                          stroke="#4caf50"
                          fill="#4caf50"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Understanding"
                          dataKey="understanding"
                          stroke="#8bc34a"
                          fill="#8bc34a"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Promptness"
                          dataKey="promptness"
                          stroke="#cddc39"
                          fill="#cddc39"
                          fillOpacity={0.6}
                        />
                        <Radar name="Feedback" dataKey="feedback" stroke="#ffeb3b" fill="#ffeb3b" fillOpacity={0.6} />
                        <Tooltip formatter={(value) => [value.toFixed(1), "Rating (out of 5)"]} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Overall Satisfaction</CardTitle>
                    <CardDescription>Average overall satisfaction by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={departmentData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="department" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip formatter={(value) => [value.toFixed(1), "Rating (out of 5)"]} />
                          <Legend />
                          <Bar dataKey="overall" fill="#2a8d46" name="Overall Satisfaction" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Visit Frequency</CardTitle>
                    <CardDescription>Number of visits per department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={departmentData.map((dept) => ({
                              name: dept.department,
                              value: Math.floor(Math.random() * 30) + 10, // Random between 10-40
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {departmentData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Analysis of text feedback sentiment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { category: "Positive", value: 65 },
                            { category: "Neutral", value: 25 },
                            { category: "Negative", value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="category"
                        >
                          <Cell fill="#2a8d46" />
                          <Cell fill="#cddc39" />
                          <Cell fill="#f44336" />
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
                  <CardTitle>Common Feedback Themes</CardTitle>
                  <CardDescription>Frequency of common themes in feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { theme: "Staff Friendliness", count: 45 },
                          { theme: "Wait Times", count: 38 },
                          { theme: "Cleanliness", count: 32 },
                          { theme: "Communication", count: 28 },
                          { theme: "Treatment Quality", count: 25 },
                          { theme: "Facilities", count: 20 },
                          { theme: "Food Quality", count: 15 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="theme" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#2a8d46" name="Mention Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sentiment by Department</CardTitle>
                <CardDescription>Distribution of sentiment across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData.map((dept) => ({
                        department: dept.department,
                        positive: Math.floor(50 + Math.random() * 30), // 50-80
                        neutral: Math.floor(10 + Math.random() * 20), // 10-30
                        negative: Math.floor(5 + Math.random() * 15), // 5-20
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positive" stackId="a" fill="#2a8d46" name="Positive" />
                      <Bar dataKey="neutral" stackId="a" fill="#cddc39" name="Neutral" />
                      <Bar dataKey="negative" stackId="a" fill="#f44336" name="Negative" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Type Distribution</CardTitle>
                  <CardDescription>Distribution of survey respondents by user type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "AGAG Employee", value: 35 },
                            { name: "AGAG/Contractor Dependant", value: 25 },
                            { name: "Other Corporate Employee", value: 20 },
                            { name: "Contractor Employee", value: 20 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <CardTitle>Patient Type Distribution</CardTitle>
                  <CardDescription>Distribution of new vs. returning patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "New Patient", value: 40 },
                            { name: "Returning Patient", value: 60 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Satisfaction by User Type</CardTitle>
                <CardDescription>Average satisfaction ratings by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          userType: "AGAG Employee",
                          overall: 4.4,
                        },
                        {
                          userType: "AGAG/Contractor Dependant",
                          overall: 4.2,
                        },
                        {
                          userType: "Other Corporate Employee",
                          overall: 4.1,
                        },
                        {
                          userType: "Contractor Employee",
                          overall: 4.0,
                        },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="userType" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip formatter={(value) => [value.toFixed(1), "Rating (out of 5)"]} />
                      <Legend />
                      <Bar dataKey="overall" fill="#2a8d46" name="Overall Satisfaction" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpi">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Promoter Score (NPS)</CardTitle>
                  <CardDescription>Based on recommendation rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{nps}</div>
                  <p className="text-xs text-muted-foreground">+5 from last quarter</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(nps / 50) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Patient Satisfaction Index</CardTitle>
                  <CardDescription>Weighted average of all ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{satisfactionIndex.toFixed(1)}/5.0</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last quarter</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(satisfactionIndex / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recommendation Rate</CardTitle>
                  <CardDescription>Percentage who would recommend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recommendationRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">+3% from last quarter</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${recommendationRate}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>KPI Trends</CardTitle>
                  <CardDescription>Key performance indicators over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData.map((month) => ({
                          month: month.month,
                          nps: Math.floor(Math.random() * 5) + 35 + trendData.indexOf(month) * 1.5, // Increasing trend
                          satisfaction: 4.0 + Math.random() * 0.1 + trendData.indexOf(month) * 0.05, // Slight increase
                          recommendation: month.recommendRate,
                        }))}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "satisfaction") return [value.toFixed(1), "Satisfaction Index"]
                            if (name === "recommendation") return [value.toFixed(1) + "%", "Recommendation Rate"]
                            return [value, name]
                          }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="nps"
                          stroke="#2a8d46"
                          activeDot={{ r: 8 }}
                          name="NPS"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="satisfaction"
                          stroke="#4caf50"
                          name="Satisfaction Index"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="recommendation"
                          stroke="#8bc34a"
                          name="Recommendation Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department KPI Comparison</CardTitle>
                  <CardDescription>Key metrics by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData.map((dept) => ({
                          department: dept.department,
                          satisfaction: dept.overall,
                          recommendation: 70 + Math.floor(Math.random() * 20) + dept.overall * 2,
                        }))}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "satisfaction") return [value.toFixed(1), "Satisfaction (out of 5)"]
                            if (name === "recommendation") return [value.toFixed(1) + "%", "Recommendation Rate"]
                            return [value, name]
                          }}
                        />
                        <Legend />
                        <Bar dataKey="satisfaction" fill="#2a8d46" name="Satisfaction (out of 5)" />
                        <Bar dataKey="recommendation" fill="#4caf50" name="Recommendation Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlation">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Analysis</CardTitle>
                  <CardDescription>Relationship between professionalism and overall satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Professionalism Rating"
                          domain={[3.5, 5]}
                          label={{ value: "Professionalism Rating", position: "bottom" }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Overall Satisfaction"
                          domain={[3.5, 5]}
                          label={{ value: "Overall Satisfaction", angle: -90, position: "left" }}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 400]} name="Visit Count" />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          formatter={(value, name, props) => {
                            if (name === "Professionalism Rating" || name === "Overall Satisfaction") {
                              return [value.toFixed(1), name]
                            }
                            return [value, name]
                          }}
                        />
                        <Legend />
                        <Scatter
                          name="Departments"
                          data={departmentData.map((dept) => ({
                            x: dept.professionalism,
                            y: dept.overall,
                            z: Math.floor(Math.random() * 20) + 10,
                            name: dept.department,
                          }))}
                          fill="#2a8d46"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Satisfaction vs. Recommendation</CardTitle>
                    <CardDescription>Correlation between satisfaction and recommendation rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis
                            type="number"
                            dataKey="satisfaction"
                            name="Satisfaction Rating"
                            domain={[3.5, 5]}
                            label={{ value: "Satisfaction Rating", position: "bottom" }}
                          />
                          <YAxis
                            type="number"
                            dataKey="recommendation"
                            name="Recommendation Rate"
                            domain={[70, 100]}
                            label={{ value: "Recommendation Rate (%)", angle: -90, position: "left" }}
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            formatter={(value, name) => {
                              if (name === "Satisfaction Rating") return [value.toFixed(1), name]
                              if (name === "Recommendation Rate") return [value.toFixed(1) + "%", name]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Scatter
                            name="Departments"
                            data={departmentData.map((dept) => ({
                              department: dept.department,
                              satisfaction: dept.overall,
                              recommendation: 70 + Math.floor(Math.random() * 20) + dept.overall * 2,
                            }))}
                            fill="#2a8d46"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wait Time Impact</CardTitle>
                    <CardDescription>Correlation between wait time and satisfaction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis
                            type="number"
                            dataKey="waitTime"
                            name="Average Wait Time (min)"
                            domain={[0, 60]}
                            label={{ value: "Average Wait Time (min)", position: "bottom" }}
                          />
                          <YAxis
                            type="number"
                            dataKey="satisfaction"
                            name="Satisfaction Rating"
                            domain={[3, 5]}
                            label={{ value: "Satisfaction Rating", angle: -90, position: "left" }}
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            formatter={(value, name) => {
                              if (name === "Satisfaction Rating") return [value.toFixed(1), name]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Scatter
                            name="Departments"
                            data={departmentData.map((dept) => ({
                              department: dept.department,
                              waitTime: 60 - Math.floor(dept.overall * 10), // Inverse relationship
                              satisfaction: dept.overall,
                            }))}
                            fill="#2a8d46"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
