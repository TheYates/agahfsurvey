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
  BedDouble,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  fetchDepartmentConcerns,
  fetchAllSurveyData,
  fetchDepartments,
  fetchRecommendations,
  DepartmentConcern,
  Recommendation,
} from "@/app/actions/report-actions-enhanced";

interface Ward {
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
  capacity?: number;
  occupancy?: number;
}

interface WardsTabProps {
  isLoading: boolean;
  wards: Ward[];
}

// Convert numeric value to rating text
const valueToRating = (value: number): string => {
  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Very Good";
  if (value >= 2.5) return "Good";
  if (value >= 1.5) return "Fair";
  return "Poor";
};

export function WardsTab({ isLoading, wards }: WardsTabProps) {
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [wardConcerns, setWardConcerns] = useState<DepartmentConcern[]>([]);
  const [wardRecommendations, setWardRecommendations] = useState<
    Recommendation[]
  >([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);
  const [departmentAverages, setDepartmentAverages] = useState<
    Record<string, number>
  >({});
  const [satisfactionTrend, setSatisfactionTrend] = useState<any[]>([]);

  // Fetch ward concerns and recommendations
  useEffect(() => {
    const loadWardFeedback = async () => {
      setIsLoadingConcerns(true);
      try {
        console.log("WardsTab: Fetching ward concerns...");
        const allConcerns = await fetchDepartmentConcerns();
        console.log("WardsTab: Fetched all concerns:", allConcerns);

        // Filter concerns that match ward names
        const wardNames = wards.map((ward) => ward.name);
        const wardSpecificConcerns = allConcerns.filter((concern) =>
          wardNames.some((name) => concern.locationName.includes(name))
        );

        console.log("WardsTab: Filtered ward concerns:", wardSpecificConcerns);
        setWardConcerns(wardSpecificConcerns);

        // Also fetch recommendations that might mention wards
        console.log("WardsTab: Fetching recommendations...");
        const allRecommendations = await fetchRecommendations();
        console.log(
          "WardsTab: Fetched all recommendations:",
          allRecommendations
        );

        // Filter recommendations that might mention ward names
        const wardRecommendations = allRecommendations.filter((rec) =>
          wardNames.some((name) =>
            rec.recommendation.toLowerCase().includes(name.toLowerCase())
          )
        );

        console.log(
          "WardsTab: Filtered ward recommendations:",
          wardRecommendations
        );
        setWardRecommendations(wardRecommendations);
      } catch (error) {
        console.error("Error fetching ward feedback:", error);
        setWardConcerns([]);
        setWardRecommendations([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    if (wards.length > 0) {
      loadWardFeedback();
    }
  }, [wards]);

  // Fetch department averages for comparison in radar chart
  useEffect(() => {
    const fetchDepartmentAverages = async () => {
      try {
        console.log("WardsTab: Fetching department data for averages...");
        const departments = await fetchDepartments();
        console.log("WardsTab: Fetched departments for averages:", departments);

        if (departments.length > 0) {
          // Calculate weighted averages for each rating category
          const totalVisits = departments.reduce(
            (sum, dept) => sum + dept.visitCount,
            0
          );

          const avgRatings = {
            reception:
              departments.reduce(
                (sum, dept) => sum + dept.ratings.reception * dept.visitCount,
                0
              ) / totalVisits,
            professionalism:
              departments.reduce(
                (sum, dept) =>
                  sum + dept.ratings.professionalism * dept.visitCount,
                0
              ) / totalVisits,
            understanding:
              departments.reduce(
                (sum, dept) =>
                  sum + dept.ratings.understanding * dept.visitCount,
                0
              ) / totalVisits,
            "promptness-care":
              departments.reduce(
                (sum, dept) =>
                  sum + dept.ratings["promptness-care"] * dept.visitCount,
                0
              ) / totalVisits,
            "promptness-feedback":
              departments.reduce(
                (sum, dept) =>
                  sum + dept.ratings["promptness-feedback"] * dept.visitCount,
                0
              ) / totalVisits,
            overall:
              departments.reduce(
                (sum, dept) => sum + dept.satisfaction * dept.visitCount,
                0
              ) / totalVisits,
          };

          console.log("WardsTab: Calculated department averages:", avgRatings);
          setDepartmentAverages(avgRatings);
        }
      } catch (error) {
        console.error("Error fetching department averages:", error);
        setDepartmentAverages({});
      }
    };

    fetchDepartmentAverages();
  }, []);

  // Generate satisfaction trend based on available survey data
  useEffect(() => {
    const generateSatisfactionTrend = async () => {
      try {
        console.log("WardsTab: Fetching survey data for trends...");
        const surveyData = await fetchAllSurveyData();
        console.log("WardsTab: Received survey data:", surveyData);

        // Generate mock monthly trend data
        // In a real app, this would use filtered survey data by ward
        const trend = [
          { month: "Jan", satisfaction: 3.9 },
          { month: "Feb", satisfaction: 4.0 },
          { month: "Mar", satisfaction: 3.8 },
          { month: "Apr", satisfaction: 4.1 },
          { month: "May", satisfaction: 4.2 },
          { month: "Jun", satisfaction: selectedWard?.satisfaction || 4.0 },
        ];

        setSatisfactionTrend(trend);
      } catch (error) {
        console.error("Error generating satisfaction trend:", error);
        setSatisfactionTrend([]);
      }
    };

    if (selectedWard) {
      generateSatisfactionTrend();
    }
  }, [selectedWard]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading ward data...</p>
      </div>
    );
  }

  // Filter to only include wards (not departments)
  const wardsOnly = wards.filter((ward) => ward.type === "ward");

  if (wardsOnly.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">No ward data available.</p>
      </div>
    );
  }

  // Get total responses
  const totalResponses = wardsOnly.reduce(
    (sum, ward) => sum + ward.visitCount,
    0
  );

  // Get average satisfaction across all wards
  const avgSatisfaction =
    wardsOnly.reduce(
      (sum, ward) => sum + ward.satisfaction * ward.visitCount,
      0
    ) / Math.max(totalResponses, 1);

  // Get top performing ward
  const topWard = [...wardsOnly].sort(
    (a, b) => b.satisfaction - a.satisfaction
  )[0];

  // Get ward needing most attention
  const needsAttentionWard = [...wardsOnly].sort(
    (a, b) => a.satisfaction - b.satisfaction
  )[0];

  // Rating categories for ward ratings
  const ratingCategories = [
    { id: "reception", label: "Reception/Front desk" },
    { id: "professionalism", label: "Professionalism of staff" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label: "Promptness of feedback",
    },
    { id: "overall", label: "Overall impression" },
  ];

  // Calculate average rating for each category across all wards
  const avgRatings = ratingCategories.reduce((acc, category) => {
    const sum = wardsOnly.reduce((total, ward) => {
      const rating = ward.ratings[category.id as keyof typeof ward.ratings];
      return total + rating * ward.visitCount;
    }, 0);
    acc[category.id] = sum / Math.max(totalResponses, 1);
    return acc;
  }, {} as Record<string, number>);

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  // Get relevant ward concerns and recommendations sorted by date
  const combinedFeedback = [
    ...wardConcerns.map((concern) => ({
      id: `concern-${concern.submissionId}`,
      type: "concern",
      submissionId: concern.submissionId,
      submittedAt: concern.submittedAt,
      locationName: concern.locationName,
      text: concern.concern,
      userType: concern.userType,
    })),
    ...wardRecommendations
      .filter((rec) =>
        wardsOnly.some((ward) =>
          rec.recommendation.toLowerCase().includes(ward.name.toLowerCase())
        )
      )
      .map((rec) => ({
        id: `rec-${rec.submissionId}`,
        type: "recommendation",
        submissionId: rec.submissionId,
        submittedAt: rec.submittedAt,
        locationName:
          wardsOnly.find((ward) =>
            rec.recommendation.toLowerCase().includes(ward.name.toLowerCase())
          )?.name || "Ward",
        text: rec.recommendation,
        userType: rec.userType,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3); // Get the 3 most recent items

  if (selectedWard) {
    // Show individual ward details
    // Get ward ranking
    const wardRanking =
      wardsOnly
        .sort((a, b) => b.satisfaction - a.satisfaction)
        .findIndex((ward) => ward.id === selectedWard.id) + 1;

    // Create ranking suffix
    const getRankingSuffix = (ranking: number) => {
      if (ranking === 1) return "st";
      if (ranking === 2) return "nd";
      if (ranking === 3) return "rd";
      return "th";
    };

    // Calculate metrics based on real data
    const patientSatisfaction = Math.round(selectedWard.recommendRate); // Use real data

    // Get ward-specific concerns and recommendations
    const wardSpecificFeedback = [
      ...wardConcerns
        .filter((concern) => concern.locationName === selectedWard.name)
        .map((concern) => ({
          id: `concern-${concern.submissionId}`,
          type: "concern",
          submissionId: concern.submissionId,
          submittedAt: concern.submittedAt,
          locationName: concern.locationName,
          text: concern.concern,
          userType: concern.userType,
        })),
      ...wardRecommendations
        .filter((rec) =>
          rec.recommendation
            .toLowerCase()
            .includes(selectedWard.name.toLowerCase())
        )
        .map((rec) => ({
          id: `rec-${rec.submissionId}`,
          type: "recommendation",
          submissionId: rec.submissionId,
          submittedAt: rec.submittedAt,
          locationName: selectedWard.name,
          text: rec.recommendation,
          userType: rec.userType,
        })),
    ].sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Prepare data for radar chart comparing ward to department average
    const radarData = [
      {
        category: "Reception",
        ward: selectedWard.ratings.reception,
        average: departmentAverages.reception || 0,
      },
      {
        category: "Professionalism",
        ward: selectedWard.ratings.professionalism,
        average: departmentAverages.professionalism || 0,
      },
      {
        category: "Understanding",
        ward: selectedWard.ratings.understanding,
        average: departmentAverages.understanding || 0,
      },
      {
        category: "Promptness (Care)",
        ward: selectedWard.ratings["promptness-care"],
        average: departmentAverages["promptness-care"] || 0,
      },
      {
        category: "Promptness (Feedback)",
        ward: selectedWard.ratings["promptness-feedback"],
        average: departmentAverages["promptness-feedback"] || 0,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSelectedWard(null)}
          >
            <ArrowLeft size={16} />
            <span>Back to All Wards</span>
          </Button>
          <Badge variant="outline" className="text-sm py-1 px-3">
            {selectedWard.visitCount} responses
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BedDouble size={20} />
              {selectedWard.name}
            </CardTitle>
            <CardDescription>
              Ward performance overview based on {selectedWard.visitCount}{" "}
              survey responses
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
                      {selectedWard.satisfaction.toFixed(1)}
                    </div>
                    <Badge
                      className={cn(
                        selectedWard.satisfaction >= 4
                          ? "bg-green-100 text-green-800"
                          : selectedWard.satisfaction >= 3
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {valueToRating(selectedWard.satisfaction)}
                    </Badge>
                  </div>
                  <Progress
                    value={selectedWard.satisfaction * 20}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ward Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">
                      {wardRanking}
                      <span className="text-sm">
                        {getRankingSuffix(wardRanking)}
                      </span>
                    </div>
                    <span className="text-xs ml-2 text-muted-foreground">
                      of {wardsOnly.length} wards
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
                    Response Share
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (selectedWard.visitCount / totalResponses) * 100
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share of total ward responses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Patient Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patientSatisfaction}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Would recommend to friends/family
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
                  {Object.entries(selectedWard.ratings).map(([key, value]) => {
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
                  })}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Rating Comparison
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(selectedWard.ratings).map(
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
                          formatter={(value) => [
                            typeof value === "number"
                              ? value.toFixed(1)
                              : value,
                            "Rating",
                          ]}
                        />
                        <Bar
                          dataKey="rating"
                          fill="#4caf50"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Comparison to Average
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis domain={[0, 5]} />
                        <Radar
                          name={selectedWard.name}
                          dataKey="ward"
                          stroke="#2196f3"
                          fill="#2196f3"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Facility Average"
                          dataKey="average"
                          stroke="#ff9800"
                          fill="#ff9800"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Comments & Feedback</h3>
              {wardSpecificFeedback.length > 0 ? (
                wardSpecificFeedback.map((feedback, index) => (
                  <div
                    key={`${feedback.id}-${index}`}
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
                    No specific feedback reported for this ward.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ward overview and list
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              From {wardsOnly.length} wards
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
            <div className="text-lg font-bold flex items-center">
              {topWard.name}
              <Star className="h-4 w-4 text-amber-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {topWard.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({topWard.visitCount} responses)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold flex items-center">
              {needsAttentionWard.name}
              <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                {needsAttentionWard.satisfaction.toFixed(1)}/5.0
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                ({needsAttentionWard.visitCount} responses)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {avgSatisfaction.toFixed(1)}
              </div>
              <Badge
                className={cn(
                  "ml-2",
                  avgSatisfaction >= 4
                    ? "bg-green-100 text-green-800"
                    : avgSatisfaction >= 3
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {valueToRating(avgSatisfaction)}
              </Badge>
            </div>
            <Progress value={avgSatisfaction * 20} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Ratings by Category</CardTitle>
          <CardDescription>
            Overall performance for each rating category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratingCategories.map((category) => {
              const rating = avgRatings[category.id] || 0;
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
          <CardTitle>Ward Ratings</CardTitle>
          <CardDescription>
            Click on a ward to view detailed performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Response Count</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Recommend Rate</TableHead>
                <TableHead>Top Rating</TableHead>
                <TableHead>Lowest Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wardsOnly
                .sort((a, b) => b.satisfaction - a.satisfaction)
                .map((ward, index) => {
                  // Find highest and lowest rated categories
                  const ratings = Object.entries(ward.ratings);
                  const topRated = ratings.reduce(
                    (max, curr) => (curr[1] > max[1] ? curr : max),
                    ratings[0]
                  );
                  const lowestRated = ratings.reduce(
                    (min, curr) => (curr[1] < min[1] ? curr : min),
                    ratings[0]
                  );

                  // Get label for category
                  const getLabel = (id: string) => {
                    const category = ratingCategories.find(
                      (cat) => cat.id === id
                    );
                    return category
                      ? category.label
                      : id
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                  };

                  // Create ranking suffix
                  const getRankingSuffix = (ranking: number) => {
                    if (ranking === 1) return "st";
                    if (ranking === 2) return "nd";
                    if (ranking === 3) return "rd";
                    return "th";
                  };

                  const rank = index + 1;
                  const rankDisplay = `${rank}${getRankingSuffix(rank)}`;

                  return (
                    <TableRow
                      key={ward.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedWard(ward)}
                    >
                      <TableCell className="font-bold text-center">
                        {rankDisplay}
                      </TableCell>
                      <TableCell className="font-medium">{ward.name}</TableCell>
                      <TableCell>{ward.visitCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {ward.satisfaction.toFixed(1)}
                          </span>
                          <Progress
                            value={ward.satisfaction * 20}
                            className="h-2 w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{ward.recommendRate.toFixed(0)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getLabel(topRated[0])}
                          <span className="text-xs ml-1">
                            ({topRated[1].toFixed(1)})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getLabel(lowestRated[0])}
                          <span className="text-xs ml-1">
                            ({lowestRated[1].toFixed(1)})
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Ward Feedback</CardTitle>
          <CardDescription>
            Latest concerns and recommendations from wards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConcerns ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : combinedFeedback.length > 0 ? (
            <div className="space-y-3">
              {combinedFeedback.map((feedback, index) => (
                <Card
                  key={`${feedback.id}-${index}`}
                  className={`${
                    feedback.type === "recommendation"
                      ? "border-l-4 border-l-blue-500"
                      : "border-l-4 border-l-amber-500"
                  }`}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">
                          {feedback.locationName}
                        </CardTitle>
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
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(feedback.submittedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-sm italic text-muted-foreground">
                      "{feedback.text}"
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        User: {feedback.userType}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No ward feedback reported.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
