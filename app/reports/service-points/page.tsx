"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"
import { fetchServicePointFeedbackStats, fetchServicePoints } from "@/app/actions/service-point-actions"

const COLORS = ["#e53e3e", "#ed8936", "#ecc94b", "#48bb78", "#38a169"]

export default function ServicePointReportsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [timeRange, setTimeRange] = useState("week")
  const [servicePoint, setServicePoint] = useState("all")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [servicePoints, setServicePoints] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    setIsAuthChecked(true)
  }, [])

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/")
    } else if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, router, isAuthChecked, timeRange, servicePoint])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch service points
      const points = await fetchServicePoints()
      setServicePoints(points)

      // Fetch feedback stats
      const feedbackStats = await fetchServicePointFeedbackStats(timeRange, servicePoint)
      setStats(feedbackStats)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  if (!isAuthenticated && isAuthChecked) {
    return null
  }

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Service Point Feedback</h1>
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Service Point Feedback</h1>
            <p className="text-muted-foreground">Analytics and insights from quick feedback responses</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={servicePoint} onValueChange={setServicePoint}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select service point" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Points</SelectItem>
                {servicePoints.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id.toString()}>
                    {sp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <CardDescription>Overall satisfaction score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating || 0} / 5</div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${star <= (stats?.averageRating || 0) ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <CardDescription>Number of responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFeedback || 0}</div>
              <p className="text-xs text-muted-foreground">
                {timeRange === "day"
                  ? "Today"
                  : timeRange === "week"
                    ? "This week"
                    : timeRange === "month"
                      ? "This month"
                      : timeRange === "year"
                        ? "This year"
                        : "All time"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <CardDescription>Percentage of visitors who provided feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
              <p className="text-xs text-muted-foreground">Estimated from total visitors</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Distribution of feedback ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.ratingDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(stats?.ratingDistribution || []).map((entry: any, index: number) => (
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
                  <CardTitle>Service Point Performance</CardTitle>
                  <CardDescription>Average rating by service point</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats?.servicePointPerformance || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rating" fill="#38a169" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Rating Trends Over Time</CardTitle>
                <CardDescription>Average rating by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.ratingTrends || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rating" stroke="#38a169" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Service Point Comparison</CardTitle>
                <CardDescription>Compare ratings across different service points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats?.servicePointComparison || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="excellent" stackId="a" fill="#38a169" name="5 - Excellent" />
                      <Bar dataKey="good" stackId="a" fill="#48bb78" name="4 - Good" />
                      <Bar dataKey="neutral" stackId="a" fill="#ecc94b" name="3 - Neutral" />
                      <Bar dataKey="poor" stackId="a" fill="#ed8936" name="2 - Poor" />
                      <Bar dataKey="terrible" stackId="a" fill="#e53e3e" name="1 - Terrible" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
