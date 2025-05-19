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
  Users,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  fetchDepartmentConcerns,
  fetchAllSurveyData,
  DepartmentConcern,
  fetchOccupationalHealthData,
} from "@/app/actions/report-actions-enhanced";

// Add interface for user type distribution
interface UserTypeData {
  name: string;
  value: number;
}

// Add interface for location rating data
interface LocationRating {
  name: string;
  rating: number;
}

// Update OccupationalHealthData interface to include userTypeDistribution
interface OccupationalHealthData {
  name: string;
  satisfaction: number;
  visitCount: number;
  ratings: {
    reception: number;
    professionalism: number;
    understanding: number;
    "promptness-care": number;
    "promptness-feedback": number;
    overall: number;
    [key: string]: number;
  };
  userTypeDistribution?: UserTypeData[];
  topRatedLocations?: LocationRating[];
  lowestRatedLocations?: LocationRating[];
  userTypeInsight?: string;
}

interface OccupationalHealthTabProps {
  isLoading: boolean;
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
}: OccupationalHealthTabProps) {
  const [ohData, setOhData] = useState<OccupationalHealthData | null>(null);
  const [ohConcerns, setOhConcerns] = useState<DepartmentConcern[]>([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);

  // Fetch occupational health data directly from the dedicated endpoint
  useEffect(() => {
    const loadOccupationalHealthData = async () => {
      setIsLoadingConcerns(true);
      try {
        console.log("OccupationalHealthTab: Fetching specific OH data...");
        const { ohData: fetchedData, ohConcerns: fetchedConcerns } =
          await fetchOccupationalHealthData();

        // Also fetch all survey data to get user type distribution
        const allSurveyData = await fetchAllSurveyData();

        console.log("OccupationalHealthTab: Received OH data:", fetchedData);
        console.log(
          "OccupationalHealthTab: Received OH concerns:",
          fetchedConcerns
        );

        // If fetchedData exists, enhance it with real user type distribution
        if (fetchedData) {
          const typedData = fetchedData as OccupationalHealthData;

          // Calculate real user type distribution from survey data
          // Filter for occupational health visits only
          const ohVisits = allSurveyData.filter(
            (survey) => survey.visitPurpose === "Medicals (Occupational Health)"
          );

          console.log(
            "OccupationalHealthTab: Found OH visits:",
            ohVisits.length
          );

          // Count user types from these visits
          const userTypeCounts: Record<string, number> = {};

          ohVisits.forEach((visit) => {
            if (visit.userType) {
              userTypeCounts[visit.userType] =
                (userTypeCounts[visit.userType] || 0) + 1;
            }
          });

          // Format data for visualization
          const userTypeDistribution: UserTypeData[] = Object.entries(
            userTypeCounts
          )
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by count, descending

          // Ensure we have at least some data - use empty categories if no data found
          typedData.userTypeDistribution =
            userTypeDistribution.length > 0
              ? userTypeDistribution
              : [
                  { name: "AGAG Employee", value: 0 },
                  { name: "AGAG/Contractor Dependant", value: 0 },
                  { name: "Other Corporate Employee", value: 0 },
                  { name: "Contractor Employee", value: 0 },
                ];

          // Generate insight based on the real data
          if (userTypeDistribution.length > 0) {
            const topUserType = userTypeDistribution[0];
            const totalVisits = userTypeDistribution.reduce(
              (sum, item) => sum + item.value,
              0
            );
            const topPercentage = (
              (topUserType.value / totalVisits) *
              100
            ).toFixed(1);

            typedData.userTypeInsight = `${topUserType.name} represents the largest group utilizing occupational health services at ${topPercentage}% of visits. This helps prioritize resources for this key demographic.`;
          }

          setOhData(typedData);
        } else {
          setOhData(null);
        }
        setOhConcerns(fetchedConcerns);
      } catch (error) {
        console.error("Error fetching occupational health data:", error);
        setOhData(null);
        setOhConcerns([]);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    loadOccupationalHealthData();
  }, []);

  if (isLoading || isLoadingConcerns) {
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

  // Default user types data if none is provided
  const defaultUserTypes = [
    { name: "AGAG Employee", value: 0 },
    { name: "AGAG/Contractor Dependant", value: 0 },
    { name: "Other Corporate Employee", value: 0 },
    { name: "Contractor Employee", value: 0 },
  ];

  // Use the data from state or fall back to defaults
  const userTypeData = ohData.userTypeDistribution || defaultUserTypes;

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
                  Total Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    Array.from(new Set(ohConcerns.map((c) => c.submissionId)))
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {ohConcerns.length} total concerns from occupational health
                  visits
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
                  const ratings = Object.entries(ohData.ratings);
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
                        <Star className="h-4 w-4 text-amber-500 ml-1" />
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
                  const ratings = Object.entries(ohData.ratings);
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
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
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
                    <UserCheck size={18} />
                    Service Performance Analysis
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
          </div>

          {/* Location Ratings Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <div className="flex items-center gap-2">
                  <Activity size={18} />
                  Locations Performance Analysis
                </div>
              </CardTitle>
              <CardDescription>
                Top and lowest-rated locations visited during occupational
                health processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-base mb-3 flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-2" />
                    Top Rated Locations
                  </h3>
                  {ohData.topRatedLocations &&
                  ohData.topRatedLocations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ohData.topRatedLocations.map((location, index) => (
                          <TableRow key={`top-${index}`}>
                            <TableCell>{location.name}</TableCell>
                            <TableCell className="text-right">
                              <span className="font-medium">
                                {location.rating.toFixed(1)}
                              </span>
                              <span className="text-xs ml-1 text-muted-foreground">
                                ({valueToRating(location.rating)})
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No rating data available
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-base mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    Needs Improvement
                  </h3>
                  {ohData.lowestRatedLocations &&
                  ohData.lowestRatedLocations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ohData.lowestRatedLocations.map((location, index) => (
                          <TableRow key={`low-${index}`}>
                            <TableCell>{location.name}</TableCell>
                            <TableCell className="text-right">
                              <span className="font-medium">
                                {location.rating.toFixed(1)}
                              </span>
                              <span className="text-xs ml-1 text-muted-foreground">
                                ({valueToRating(location.rating)})
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No rating data available
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  User Type Analysis
                </div>
              </CardTitle>
              <CardDescription>
                Distribution of user types utilizing occupational health
                services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-base mb-3 flex items-center justify-between">
                    <span>User Type Distribution</span>
                  </h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          fill="#8884d8"
                          label={({
                            name,
                            percent,
                          }: {
                            name: string;
                            percent: number;
                          }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userTypeData.map(
                            (entry: UserTypeData, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ["#2196f3", "#4caf50", "#ff9800", "#f44336"][
                                    index % 4
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} users`, "Count"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-base mb-3">
                    User Type Breakdown
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Type</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTypeData.map((item: UserTypeData, index: number) => {
                        const total = userTypeData.reduce(
                          (sum: number, entry: UserTypeData) =>
                            sum + entry.value,
                          0
                        );
                        const percentage = total
                          ? ((item.value / total) * 100).toFixed(1)
                          : "0.0";

                        return (
                          <TableRow key={`user-type-${index}`}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">
                              {item.value}
                            </TableCell>
                            <TableCell className="text-right">
                              {percentage}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="mt-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      {ohData.userTypeInsight ||
                        "Understanding the distribution of user types helps in tailoring occupational health services to specific workforce needs."}
                    </p>
                  </div>
                </div>
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
