"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicePoint } from "@/app/actions/service-point-actions";
import { Pie } from "react-chartjs-2";

// Colors for charts
const COLORS = [
  "#4caf50", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

interface ServicePointStats {
  id: number;
  name: string;
  averageRating: number;
  totalFeedback: number;
  recommendRate: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface AnalyticsTabProps {
  servicePoints: ServicePoint[];
  servicePointStats: ServicePointStats[];
  selectedServicePoint: number | null;
  setSelectedServicePoint: (id: number | null) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  isLoading: boolean;
  isLoadingFeedback: boolean;
  recentFeedback: any[];
  getServicePointStats: (id: number) => any;
  getRatingDistribution: (id: number) => number[];
  loadData: () => void;
}

export default function AnalyticsTab({
  servicePoints,
  servicePointStats,
  selectedServicePoint,
  setSelectedServicePoint,
  dateRange,
  setDateRange,
  isLoading,
  isLoadingFeedback,
  recentFeedback,
  getServicePointStats,
  getRatingDistribution,
  loadData,
}: AnalyticsTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Service Point Analytics</h2>
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
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

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-primary mb-4" />
            <div className="text-xl font-medium">Loading analytics...</div>
          </div>
        </div>
      ) : servicePoints.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No service points found
            </p>
            <Button>Create Service Points</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {servicePoints.map((servicePoint) => {
            const stats = getServicePointStats(servicePoint.id);
            return (
              <Card
                key={servicePoint.id}
                className={`cursor-pointer transition-all ${
                  selectedServicePoint === servicePoint.id
                    ? "ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
                onClick={() =>
                  setSelectedServicePoint(
                    selectedServicePoint === servicePoint.id
                      ? null
                      : servicePoint.id
                  )
                }
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{servicePoint.name}</span>
                    <span className="text-lg font-normal text-muted-foreground">
                      {stats.averageRating
                        ? stats.averageRating.toFixed(1)
                        : "N/A"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">
                        {stats.totalFeedback || 0}
                      </div>
                      <div className="text-muted-foreground">Responses</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {stats.recommendRate
                          ? stats.recommendRate.toFixed(0)
                          : 0}
                        %
                      </div>
                      <div className="text-muted-foreground">Recommend</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {!stats.averageRating
                          ? "No ratings"
                          : stats.averageRating >= 4.5
                          ? "Excellent"
                          : stats.averageRating >= 3.5
                          ? "Very Good"
                          : stats.averageRating >= 2.5
                          ? "Good"
                          : stats.averageRating >= 1.5
                          ? "Fair"
                          : "Poor"}
                      </div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedServicePoint && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {servicePoints.find((sp) => sp.id === selectedServicePoint)?.name}{" "}
            Detailed Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Distribution of satisfaction ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Pie
                    data={{
                      labels: [
                        "Poor (1)",
                        "Fair (2)",
                        "Good (3)",
                        "Very Good (4)",
                        "Excellent (5)",
                      ],
                      datasets: [
                        {
                          label: "Rating Distribution",
                          data: getRatingDistribution(selectedServicePoint),
                          backgroundColor: [
                            COLORS[4], // Poor = red
                            COLORS[3], // Fair = orange
                            COLORS[2], // Good = beige
                            COLORS[1], // Very Good = light teal
                            COLORS[0], // Excellent = dark teal
                          ],
                          borderColor: [
                            COLORS[4],
                            COLORS[3],
                            COLORS[2],
                            COLORS[1],
                            COLORS[0],
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
                <CardDescription>Overview of feedback received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col justify-center">
                  {getServicePointStats(selectedServicePoint).totalFeedback ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-3xl font-bold">
                          {getServicePointStats(
                            selectedServicePoint
                          ).averageRating.toFixed(1)}
                        </div>
                        <div className="text-muted-foreground">
                          Average Rating
                        </div>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-3xl font-bold">
                          {getServicePointStats(
                            selectedServicePoint
                          ).recommendRate.toFixed(0)}
                          %
                        </div>
                        <div className="text-muted-foreground">Recommend</div>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-3xl font-bold">
                          {
                            getServicePointStats(selectedServicePoint)
                              .totalFeedback
                          }
                        </div>
                        <div className="text-muted-foreground">
                          Total Feedback
                        </div>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-xl font-bold">
                          {!getServicePointStats(selectedServicePoint)
                            .averageRating
                            ? "N/A"
                            : getServicePointStats(selectedServicePoint)
                                .averageRating >= 4.5
                            ? "Excellent"
                            : getServicePointStats(selectedServicePoint)
                                .averageRating >= 3.5
                            ? "Very Good"
                            : getServicePointStats(selectedServicePoint)
                                .averageRating >= 2.5
                            ? "Good"
                            : getServicePointStats(selectedServicePoint)
                                .averageRating >= 1.5
                            ? "Fair"
                            : "Poor"}
                        </div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No feedback data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Last 5 feedback submissions for this service point
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFeedback ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              ) : recentFeedback.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Recommend</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentFeedback.map((feedback: any) => (
                      <TableRow key={feedback.id}>
                        <TableCell>
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{feedback.rating}/5</TableCell>
                        <TableCell>
                          {feedback.recommend ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {feedback.comment || (
                            <span className="text-muted-foreground italic">
                              No comment
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No feedback received yet
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setSelectedServicePoint(null)}
            >
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
