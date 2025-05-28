"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
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
import {
  ChevronLeft,
  User,
  Clock,
  Building,
  AlertTriangle,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clipboard,
} from "lucide-react";
import {
  getSubmissionById,
  DetailedSubmission,
} from "@/app/actions/report-actions-enhanced";
import { Separator } from "@/components/ui/separator";

export default function SubmissionDetailPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.id as string;

  const [submission, setSubmission] = useState<DetailedSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthChecked) {
      if (!isAuthenticated) {
        router.push("/");
      }
    }
  }, [isAuthenticated, router, isAuthChecked]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (!submissionId) return;

        const data = await getSubmissionById(submissionId);
        setSubmission(data);
      } catch (error) {
        console.error("Error fetching submission:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && submissionId) {
      fetchData();
    }
  }, [isAuthenticated, submissionId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated && isAuthChecked) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/reports/submissions">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Survey Response Details
              </h1>
            </div>
            <p className="text-muted-foreground">
              Detailed view of submitted survey
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !submission ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Submission Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The requested submission could not be found or you don't have
                permission to view it.
              </p>
              <Link href="/reports/submissions">
                <Button>Return to Submissions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6 shadow-lg border-t-4 border-t-primary">
            <div className="space-y-8">
              {/* Overview */}
              <div>
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                    <Clipboard className="h-5 w-5" />
                    Survey Response Overview
                  </CardTitle>
                  <CardDescription>
                    Submitted on {formatDate(submission.submittedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Visit Time
                        </span>
                        <span className="font-medium">
                          {submission.visitTime.replace(/-/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          Visit Purpose
                        </span>
                        <span className="font-medium">
                          {submission.visitPurpose}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          Patient Type
                        </span>
                        <span className="font-medium">
                          {submission.patientType}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          User Type
                        </span>
                        <span className="font-medium">
                          {submission.userType}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>

              <Separator />

              {/* Visited Locations */}
              <div>
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-primary">
                    Visited Locations
                  </CardTitle>
                  <CardDescription>
                    Departments and wards visited during the visit
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {submission.locations.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No locations recorded for this submission
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {submission.locations.map((location) => (
                        <div
                          key={location.id}
                          className="p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

              <Separator />

              {/* Ratings for each location */}
              {submission.ratings.length > 0 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl font-bold text-primary">
                      Location Ratings
                    </CardTitle>
                    <CardDescription>
                      Detailed ratings for each visited location
                    </CardDescription>
                  </CardHeader>

                  {submission.ratings
                    .reduce((acc, rating) => {
                      const existing = acc.find(
                        (r) => r.locationName === rating.locationName
                      );
                      if (!existing) {
                        acc.push(rating);
                      }
                      return acc;
                    }, [] as typeof submission.ratings)
                    .map((locationRating, idx) => {
                      // Filter all ratings for this location
                      const allRatingsForLocation = submission.ratings.filter(
                        (r) => r.locationName === locationRating.locationName
                      );

                      // Get concerns for this location
                      const concernForLocation = submission.concerns.find(
                        (c) => c.locationName === locationRating.locationName
                      );

                      const hasRatings =
                        locationRating.reception ||
                        locationRating.professionalism ||
                        locationRating.understanding ||
                        locationRating.promptnessCare ||
                        locationRating.promptnessFeedback ||
                        locationRating.overall;

                      if (!hasRatings) return null;

                      return (
                        <div key={idx} className="mb-8">
                          <h3 className="text-lg font-semibold mb-4 text-primary">
                            {locationRating.locationName}
                          </h3>

                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-1/3"></TableHead>
                                  <TableHead className="text-center">
                                    Excellent
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Very Good
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Good
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Fair
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Poor
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {locationRating.reception && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Reception/Customer service
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.reception ===
                                        "Excellent" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.reception ===
                                        "Very Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.reception === "Good" &&
                                        "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.reception === "Fair" &&
                                        "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.reception === "Poor" &&
                                        "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {locationRating.professionalism && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Professionalism of staff
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.professionalism ===
                                        "Excellent" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.professionalism ===
                                        "Very Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.professionalism ===
                                        "Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.professionalism ===
                                        "Fair" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.professionalism ===
                                        "Poor" && "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {locationRating.understanding && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Understanding of needs
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.understanding ===
                                        "Excellent" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.understanding ===
                                        "Very Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.understanding ===
                                        "Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.understanding ===
                                        "Fair" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.understanding ===
                                        "Poor" && "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {locationRating.promptnessCare && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Promptness of care
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessCare ===
                                        "Excellent" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessCare ===
                                        "Very Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessCare ===
                                        "Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessCare ===
                                        "Fair" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessCare ===
                                        "Poor" && "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {locationRating.promptnessFeedback && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Promptness of feedback
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessFeedback ===
                                        "Excellent" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessFeedback ===
                                        "Very Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessFeedback ===
                                        "Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessFeedback ===
                                        "Fair" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.promptnessFeedback ===
                                        "Poor" && "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {locationRating.overall && (
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Overall impression
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.overall === "Excellent" &&
                                        "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.overall === "Very Good" &&
                                        "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.overall === "Good" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.overall === "Fair" && "✓"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {locationRating.overall === "Poor" && "✓"}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          {concernForLocation && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">
                                Concerns or Recommendations:
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-muted/20 rounded-md">
                                {concernForLocation.concern}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              <Separator />

              {/* General Observations */}
              {Object.values(submission.generalObservation).some(
                (val) => val !== null
              ) && (
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl font-bold text-primary">
                      General Observations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3"></TableHead>
                            <TableHead className="text-center">
                              Excellent
                            </TableHead>
                            <TableHead className="text-center">
                              Very Good
                            </TableHead>
                            <TableHead className="text-center">Good</TableHead>
                            <TableHead className="text-center">Fair</TableHead>
                            <TableHead className="text-center">Poor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submission.generalObservation.cleanliness && (
                            <TableRow>
                              <TableCell className="font-medium">
                                Cleanliness/serenity
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.cleanliness ===
                                  "Excellent" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.cleanliness ===
                                  "Very Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.cleanliness ===
                                  "Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.cleanliness ===
                                  "Fair" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.cleanliness ===
                                  "Poor" && "✓"}
                              </TableCell>
                            </TableRow>
                          )}
                          {submission.generalObservation.facilities && (
                            <TableRow>
                              <TableCell className="font-medium">
                                Facilities
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.facilities ===
                                  "Excellent" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.facilities ===
                                  "Very Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.facilities ===
                                  "Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.facilities ===
                                  "Fair" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.facilities ===
                                  "Poor" && "✓"}
                              </TableCell>
                            </TableRow>
                          )}
                          {submission.generalObservation.security && (
                            <TableRow>
                              <TableCell className="font-medium">
                                Security
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.security ===
                                  "Excellent" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.security ===
                                  "Very Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.security ===
                                  "Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.security ===
                                  "Fair" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.security ===
                                  "Poor" && "✓"}
                              </TableCell>
                            </TableRow>
                          )}
                          {submission.generalObservation.overall && (
                            <TableRow>
                              <TableCell className="font-medium">
                                Overall impression
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.overall ===
                                  "Excellent" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.overall ===
                                  "Very Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.overall ===
                                  "Good" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.overall ===
                                  "Fair" && "✓"}
                              </TableCell>
                              <TableCell className="text-center">
                                {submission.generalObservation.overall ===
                                  "Poor" && "✓"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </div>
              )}

              <Separator />

              {/* Recommendations and Feedback */}
              <div>
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-primary">
                    Conclusion / Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground font-medium">
                        Would Recommend:
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        {submission.wouldRecommend ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Yes</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>No</span>
                          </>
                        )}
                      </span>
                    </div>

                    {!submission.wouldRecommend &&
                      submission.whyNotRecommend && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Reason for Not Recommending:
                          </h4>
                          <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-red-50 rounded-md">
                            {submission.whyNotRecommend}
                          </p>
                        </div>
                      )}

                    {submission.recommendation && (
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Recommendation:
                        </h4>
                        <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-muted/20 rounded-md">
                          {submission.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
