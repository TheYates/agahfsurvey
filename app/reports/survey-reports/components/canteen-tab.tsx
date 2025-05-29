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
  Coffee,
  Utensils,
  AlertTriangle,
  StarIcon,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  fetchCanteenData,
  fetchCanteenConcerns,
  getCanteenSubmissionCount,
  CanteenData,
  DepartmentConcern,
} from "@/app/actions/canteen-actions";

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

// Color palette for charts and highlights
const COLORS = [
  "#0a6a74", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement
);

interface CanteenTabProps {
  isLoading: boolean;
  departments: any[];
}

export function CanteenTab({ isLoading, departments }: CanteenTabProps) {
  const [canteenData, setCanteenData] = useState<CanteenData | null>(null);
  const [canteenConcerns, setCanteenConcerns] = useState<DepartmentConcern[]>(
    []
  );
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [foodTypeData, setFoodTypeData] = useState<any[]>([]);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  // Fetch canteen data
  useEffect(() => {
    const getCanteenData = async () => {
      try {
        const data = await fetchCanteenData(departments);
        if (data) {
          setCanteenData(data);
        }

        // Get actual count of canteen submissions
        const count = await getCanteenSubmissionCount();
        setSubmissionCount(count);
      } catch (error) {
        console.error("Error fetching canteen data:", error);
      }
    };

    if (!isLoading && departments && departments.length > 0) {
      getCanteenData();
    }
  }, [departments, isLoading]);

  // Fetch canteen concerns
  useEffect(() => {
    const loadCanteenConcerns = async () => {
      setIsLoadingConcerns(true);
      try {
        const concerns = await fetchCanteenConcerns();
        setCanteenConcerns(concerns);
      } catch (error) {
        console.error("Error fetching canteen concerns:", error);
        setCanteenConcerns([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadCanteenConcerns();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading canteen data...</p>
      </div>
    );
  }

  if (!canteenData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">No canteen data available.</p>
      </div>
    );
  }

  // Rating categories specific to canteen
  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of staff" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label: "Promptness of feedback - communicating delays, changes etc.",
    },
    { id: "food-quality", label: "Food quality and timely serving of food" },
    { id: "overall", label: "Overall impression" },
  ];

  // Get relevant canteen concerns sorted by date
  const recentCanteenConcerns = canteenConcerns
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent concerns

  // Prepare ratings data for chart
  const ratingsChartData = Object.entries(canteenData.ratings).map(
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Utensils size={20} />
            {canteenData.name}
          </CardTitle>
          <CardDescription>
            Canteen Services performance overview based on {submissionCount}{" "}
            survey responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionCount}</div>
                <p className="text-xs text-muted-foreground">
                  with {canteenConcerns.length} providing feedback
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Performing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Find top rated category
                  const ratings = Object.entries(canteenData.ratings);
                  const topRated = ratings.reduce(
                    (max, curr) => (curr[1] > max[1] ? curr : max),
                    ratings[0]
                  );

                  // Get label for the category
                  const category = ratingCategories.find(
                    (cat) => cat.id === topRated[0]
                  ) || {
                    id: topRated[0],
                    label: topRated[0]
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                  };

                  return (
                    <>
                      <div className="text-lg font-bold flex items-center">
                        {category.label}
                        <Star className="h-4 w-4 text-[#f6a050] ml-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {topRated[1].toFixed(1)}/5.0
                        </span>
                        <span className="text-xs ml-2 text-muted-foreground">
                          ({valueToRating(topRated[1])})
                        </span>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Find lowest rated category
                  const ratings = Object.entries(canteenData.ratings);
                  const lowestRated = ratings.reduce(
                    (min, curr) => (curr[1] < min[1] ? curr : min),
                    ratings[0]
                  );

                  // Get label for the category
                  const category = ratingCategories.find(
                    (cat) => cat.id === lowestRated[0]
                  ) || {
                    id: lowestRated[0],
                    label: lowestRated[0]
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                  };

                  return (
                    <>
                      <div className="text-lg font-bold flex items-center">
                        {category.label}
                        <AlertTriangle className="h-4 w-4 text-[#e84e3c] ml-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {lowestRated[1].toFixed(1)}/5.0
                        </span>
                        <span className="text-xs ml-2 text-muted-foreground">
                          ({valueToRating(lowestRated[1])})
                        </span>
                      </div>
                    </>
                  );
                })()}
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
                    {canteenData.satisfaction.toFixed(1)}
                  </div>
                  <Badge
                    className={cn(
                      canteenData.satisfaction >= 4
                        ? "bg-[#22c5bf]/20 text-[#22c5bf] border-[#22c5bf]"
                        : canteenData.satisfaction >= 3
                        ? "bg-[#f6a050]/20 text-[#f6a050] border-[#f6a050]"
                        : "bg-[#e84e3c]/20 text-[#e84e3c] border-[#e84e3c]"
                    )}
                  >
                    {valueToRating(canteenData.satisfaction)}
                  </Badge>
                </div>
                <Progress
                  value={canteenData.satisfaction * 20}
                  className={
                    canteenData.satisfaction >= 4
                      ? "h-2 bg-[#22c5bf]/30"
                      : canteenData.satisfaction >= 3
                      ? "h-2 bg-[#f6a050]/30"
                      : "h-2 bg-[#e84e3c]/30"
                  }
                />
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
                      canteenData.ratings[
                        category.id as keyof typeof canteenData.ratings
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
                    <Coffee size={18} />
                    Service & Quality Analysis
                  </div>
                </CardTitle>
                <CardDescription>
                  Comparison of ratings across different service categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: ratingsChartData.map((item) => item.category),
                      datasets: [
                        {
                          label: "Rating",
                          data: ratingsChartData.map((item) => item.rating),
                          backgroundColor: COLORS[0],
                          borderColor: COLORS[0],
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const value = context.parsed.y;
                              return `Rating: ${value.toFixed(1)}/5`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Canteen Feedback</CardTitle>
              <CardDescription>
                Latest feedback and concerns about the Canteen Services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingConcerns ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : recentCanteenConcerns.length > 0 ? (
                <div className="space-y-3">
                  {recentCanteenConcerns.map((concern, index) => (
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
                  No canteen feedback reported.
                </p>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
