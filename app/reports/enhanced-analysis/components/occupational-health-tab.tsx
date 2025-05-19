"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  Stethoscope,
  ArrowLeft,
  Star,
  AlertTriangle,
  Activity,
  UserCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  fetchDepartmentConcerns,
  fetchAllSurveyData,
  DepartmentConcern,
} from "@/app/actions/report-actions-enhanced";

interface OccupationalHealthData {
  id: string;
  name: string;
  visitCount: number;
  satisfaction: number;
  recommendRate: number;
  ratings: {
    reception: number;
    professionalism: number;
    understanding: number;
    "promptness-care": number;
    "promptness-feedback": number;
    overall: number;
  };
}

interface OccupationalHealthTabProps {
  isLoading: boolean;
  departments: any[];
}

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

export function OccupationalHealthTab({
  isLoading,
  departments,
}: OccupationalHealthTabProps) {
  const [ohData, setOhData] = useState<OccupationalHealthData | null>(null);
  const [ohConcerns, setOhConcerns] = useState<DepartmentConcern[]>([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [monthlyExamsData, setMonthlyExamsData] = useState<any[]>([]);

  // Find occupational health data from departments
  useEffect(() => {
    if (departments && departments.length > 0) {
      const occHealth = departments.find(
        (dept) =>
          dept.name === "Occupational Health Unit (Medicals)" ||
          dept.name === "Occupational Health Unit" ||
          dept.name.includes("Occupational Health")
      );

      if (occHealth) {
        setOhData({
          id: occHealth.id,
          name: occHealth.name,
          visitCount: occHealth.visitCount,
          satisfaction: occHealth.satisfaction,
          recommendRate: occHealth.recommendRate,
          ratings: occHealth.ratings,
        });

        // Create mock data for monthly exam distribution
        setMonthlyExamsData([
          { month: "Jan", count: 45, employeeExams: 35, contractorExams: 10 },
          { month: "Feb", count: 38, employeeExams: 25, contractorExams: 13 },
          { month: "Mar", count: 52, employeeExams: 30, contractorExams: 22 },
          { month: "Apr", count: 35, employeeExams: 20, contractorExams: 15 },
          { month: "May", count: 48, employeeExams: 32, contractorExams: 16 },
          { month: "Jun", count: 60, employeeExams: 40, contractorExams: 20 },
        ]);
      }
    }
  }, [departments]);

  // Fetch occupational health concerns
  useEffect(() => {
    const loadOhConcerns = async () => {
      setIsLoadingConcerns(true);
      try {
        console.log("OccupationalHealthTab: Fetching concerns...");
        const allConcerns = await fetchDepartmentConcerns();
        console.log(
          "OccupationalHealthTab: Fetched all concerns:",
          allConcerns
        );

        // Filter concerns that match occupational health
        const ohSpecificConcerns = allConcerns.filter(
          (concern) =>
            concern.locationName.toLowerCase().includes("occupational") ||
            concern.locationName.includes("Medicals") ||
            concern.locationName.includes("Medical")
        );

        console.log(
          "OccupationalHealthTab: Filtered OH concerns:",
          ohSpecificConcerns
        );
        setOhConcerns(ohSpecificConcerns);
      } catch (error) {
        console.error("Error fetching OH concerns:", error);
        setOhConcerns([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadOhConcerns();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">
          Loading occupational health data...
        </p>
      </div>
    );
  }

  if (!ohData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">
          No occupational health data available.
        </p>
      </div>
    );
  }

  // Rating categories specific to occupational health
  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of personnel" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label:
        "Promptness of feedback - communicating delays, explaining medication, procedure, changes etc.",
    },
    { id: "overall", label: "Overall impression" },
  ];

  // Get relevant occupational health concerns sorted by date
  const recentOhConcerns = ohConcerns
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent concerns

  // Prepare ratings data for chart
  const ratingsChartData = Object.entries(ohData.ratings).map(
    ([key, value]) => {
      const category = ratingCategories.find((cat) => cat.id === key) || {
        id: key,
        label: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      };

      return {
        category: category.label,
        rating: value,
      };
    }
  );

  // Generate exam type distribution data for pie chart
  const examTypeData = [
    { name: "Pre-Employment", value: 40 },
    { name: "Annual Checkup", value: 35 },
    { name: "Periodic", value: 15 },
    { name: "Specific", value: 10 },
  ];

  // The COLORS array for the pie chart
  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Stethoscope size={20} />
            {ohData.name}
          </CardTitle>
          <CardDescription>
            Occupational Health Unit performance overview based on{" "}
            {ohData.visitCount} survey responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {ohData.satisfaction.toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      ohData.satisfaction >= 4
                        ? "bg-green-100 text-green-800"
                        : ohData.satisfaction >= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {valueToRating(ohData.satisfaction)}
                  </Badge>
                </div>
                <Progress value={ohData.satisfaction * 20} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Professionalism Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {ohData.ratings.professionalism.toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      ohData.ratings.professionalism >= 4
                        ? "bg-green-100 text-green-800"
                        : ohData.ratings.professionalism >= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {valueToRating(ohData.ratings.professionalism)}
                  </Badge>
                </div>
                <Progress
                  value={ohData.ratings.professionalism * 20}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    Service Speed
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {ohData.ratings["promptness-care"].toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      ohData.ratings["promptness-care"] >= 4
                        ? "bg-green-100 text-green-800"
                        : ohData.ratings["promptness-care"] >= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {valueToRating(ohData.ratings["promptness-care"])}
                  </Badge>
                </div>
                <Progress
                  value={ohData.ratings["promptness-care"] * 20}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Would Recommend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ohData.recommendRate.toFixed(0)}%
                </div>
                <Progress value={ohData.recommendRate} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Ratings</CardTitle>
                <CardDescription>
                  Performance breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingCategories.map((category) => {
                    const rating =
                      ohData.ratings[
                        category.id as keyof typeof ohData.ratings
                      ] || 0;
                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                          <span className="text-sm font-medium">
                            {rating.toFixed(1)}/5.0
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({valueToRating(rating)})
                            </span>
                          </span>
                        </div>
                        <Progress value={rating * 20} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    Monthly Medical Exams
                  </div>
                </CardTitle>
                <CardDescription>
                  Distribution of medical exams over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyExamsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barGap={0}
                      barCategoryGap="15%"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="employeeExams"
                        name="Employee Exams"
                        stackId="a"
                        fill="#4caf50"
                      />
                      <Bar
                        dataKey="contractorExams"
                        name="Contractor Exams"
                        stackId="a"
                        fill="#ff9800"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <UserCheck size={18} />
                  Service Performance
                </div>
              </CardTitle>
              <CardDescription>
                Comparison of ratings across different service categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratingsChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === "number" ? value.toFixed(1) : value,
                        "Rating",
                      ]}
                    />
                    <Bar
                      dataKey="rating"
                      fill="#2196f3"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Occupational Health Feedback</CardTitle>
              <CardDescription>
                Latest feedback and concerns about the Occupational Health Unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingConcerns ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : recentOhConcerns.length > 0 ? (
                <div className="space-y-3">
                  {recentOhConcerns.map((concern, index) => (
                    <Card
                      key={`${concern.submissionId}-${index}`}
                      className="border-l-4 border-l-amber-500"
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">
                            {concern.locationName}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {new Date(concern.submittedAt).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-sm italic text-muted-foreground">
                          "{concern.concern}"
                        </p>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-muted-foreground">
                            User: {concern.userType}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No occupational health feedback reported.
                </p>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
