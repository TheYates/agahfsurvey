import { useState } from "react";
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
import { ArrowLeft, Clock, RefreshCcw, Building } from "lucide-react";
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
} from "recharts";

import {
  DepartmentConcern,
  Recommendation,
} from "@/app/actions/department-actions";

// Define Department interface for better type safety
interface Department {
  id: string;
  name: string;
  type: string;
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

interface DepartmentDetailsProps {
  selectedDepartment: Department;
  departmentRanking: number;
  departmentsOnly: Department[];
  departmentConcerns: DepartmentConcern[];
  departmentRecommendations: Recommendation[];
  ratingCategories: { id: string; label: string }[];
  satisfactionTrend: any[];
  onBackClick: () => void;
  valueToRating: (value: number) => string;
}

export function DepartmentDetails({
  selectedDepartment,
  departmentRanking,
  departmentsOnly,
  departmentConcerns,
  departmentRecommendations,
  ratingCategories,
  satisfactionTrend,
  onBackClick,
  valueToRating,
}: DepartmentDetailsProps) {
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);

  // Create ranking suffix
  const getRankingSuffix = (ranking: number) => {
    if (ranking === 1) return "st";
    if (ranking === 2) return "nd";
    if (ranking === 3) return "rd";
    return "th";
  };

  // Get department concerns for the selected department
  const departmentConcernsForSelected = departmentConcerns.filter(
    (concern) => concern.locationName === selectedDepartment.name
  );

  const departmentFeedbackForSelected = [
    ...departmentConcernsForSelected.map((concern) => ({
      id: `concern-${concern.submissionId}`,
      type: "concern",
      submissionId: concern.submissionId,
      submittedAt: concern.submittedAt,
      locationName: concern.locationName,
      text: concern.concern,
      userType: concern.userType,
    })),
    ...departmentRecommendations
      .filter((rec) =>
        rec.recommendation
          .toLowerCase()
          .includes(selectedDepartment.name.toLowerCase())
      )
      .map((rec) => ({
        id: `rec-${rec.submissionId}`,
        type: "recommendation",
        submissionId: rec.submissionId,
        submittedAt: rec.submittedAt,
        locationName: selectedDepartment.name,
        text: rec.recommendation,
        userType: rec.userType,
      })),
  ].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  // Calculate metrics from real data
  // Get average visit time and returning rate (both would be from props in a real implementation)
  const avgVisitTime = 15 + Math.round(selectedDepartment.satisfaction * 2);
  const returningRate = Math.round(selectedDepartment.recommendRate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onBackClick}
        >
          <ArrowLeft size={16} />
          <span>Back to All Departments</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building size={20} />
            {selectedDepartment.name}
          </CardTitle>
          <CardDescription>
            Department performance overview based on{" "}
            {selectedDepartment.visitCount} survey responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <RefreshCcw size={16} />
                    Responses
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedDepartment.visitCount}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total survey responses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {selectedDepartment.satisfaction.toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      selectedDepartment.satisfaction >= 4
                        ? "bg-green-100 text-green-800"
                        : selectedDepartment.satisfaction >= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {valueToRating(selectedDepartment.satisfaction)}
                  </Badge>
                </div>
                <Progress
                  value={selectedDepartment.satisfaction * 20}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Department Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {departmentRanking}
                    <span className="text-sm">
                      {getRankingSuffix(departmentRanking)}
                    </span>
                  </div>
                  <span className="text-xs ml-2 text-muted-foreground">
                    of {departmentsOnly.length} departments
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on overall satisfaction rating
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    Response Share
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (selectedDepartment.visitCount /
                      departmentsOnly.reduce(
                        (sum, dept) => sum + dept.visitCount,
                        0
                      )) *
                      100
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share of total survey responses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Ratings</CardTitle>
              <CardDescription>
                Performance breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(selectedDepartment.ratings).map(
                  ([key, value]) => {
                    // Find matching category label
                    const category = ratingCategories.find(
                      (cat) => cat.id === key
                    ) || {
                      id: key,
                      label: key
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                    };

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                          <span className="text-sm font-medium">
                            {value.toFixed(1)}/5.0
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({valueToRating(value)})
                            </span>
                          </span>
                        </div>
                        <Progress value={value * 20} className="h-2" />
                      </div>
                    );
                  }
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Ratings by Category
                </h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(selectedDepartment.ratings).map(
                        ([key, value]) => {
                          // Find matching category label
                          const category = ratingCategories.find(
                            (cat) => cat.id === key
                          ) || {
                            id: key,
                            label: key
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase()),
                          };
                          return {
                            category: category.label,
                            rating: value,
                          };
                        }
                      )}
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
                        formatter={(value: any) => [
                          typeof value === "number" ? value.toFixed(1) : value,
                          "Rating",
                        ]}
                      />
                      <Bar
                        dataKey="rating"
                        fill="#7c3aed"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Satisfaction Trend (Last 6 Months)
                </h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={satisfactionTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip
                        formatter={(value: any) => [
                          typeof value === "number" ? value.toFixed(1) : value,
                          "Satisfaction",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Recent Department Feedback</h3>
            {isLoadingConcerns ? (
              <LoadingSpinner />
            ) : departmentFeedbackForSelected.length > 0 ? (
              departmentFeedbackForSelected.map((feedback, index) => (
                <div
                  key={`${feedback.type}-${feedback.submissionId}-${index}`}
                  className={`border p-3 rounded-md ${
                    feedback.type === "recommendation"
                      ? "border-l-4 border-l-blue-500"
                      : "border-l-4 border-l-amber-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <Badge
                      variant={
                        feedback.type === "recommendation"
                          ? "outline"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {feedback.type === "recommendation"
                        ? "Recommendation"
                        : "Concern"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.submittedAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                  <p className="italic text-sm text-muted-foreground">
                    "{feedback.text}"
                  </p>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-muted-foreground">
                      User: {feedback.userType}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="border p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  No specific feedback reported for this department.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
