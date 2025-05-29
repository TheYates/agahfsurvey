"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertTriangle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  fetchRecommendations,
  fetchNotRecommendReasons,
  fetchDepartmentConcerns,
  type Recommendation,
  type NotRecommendReason,
  type DepartmentConcern,
} from "@/app/actions/feedback-actions";

interface FeedbackTabProps {
  isLoading: boolean;
  surveyData: any[];
}

export function FeedbackTab({ isLoading, surveyData }: FeedbackTabProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notRecommendReasons, setNotRecommendReasons] = useState<
    NotRecommendReason[]
  >([]);
  const [concerns, setConcerns] = useState<DepartmentConcern[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("concerns");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter states
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Reset to first page when changing filters or tabs
    setCurrentPage(1);
  }, [locationFilter, searchQuery, activeTab]);

  useEffect(() => {
    const loadFeedbackData = async () => {
      setIsLoadingData(true);
      try {
        const [fetchedRecommendations, fetchedReasons, fetchedConcerns] =
          await Promise.all([
            fetchRecommendations(),
            fetchNotRecommendReasons(),
            fetchDepartmentConcerns(),
          ]);

        setRecommendations(fetchedRecommendations);
        setNotRecommendReasons(fetchedReasons);
        setConcerns(fetchedConcerns);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFeedbackData();
  }, []);

  // Get unique locations from all feedback types
  const allLocations = Array.from(
    new Set([...concerns.map((c) => c.locationName)])
  ).sort();

  // Filter concerns based on selected filters
  const filteredConcerns = concerns
    .filter(
      (concern) =>
        locationFilter === "all" || concern.locationName === locationFilter
    )
    .filter(
      (concern) =>
        !searchQuery.trim() ||
        concern.concern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concern.locationName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        concern.userType?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

  // Filter recommendations based on selected filters
  const filteredRecommendations = recommendations
    .filter(
      (rec) =>
        !searchQuery.trim() ||
        rec.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.userType?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

  // Filter notRecommendReasons based on selected filters
  const filteredReasons = notRecommendReasons
    .filter(
      (reason) =>
        !searchQuery.trim() ||
        reason.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reason.locations?.some((loc) =>
          loc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

  // Get paginated data for the current tab
  const paginatedData = () => {
    let data: any[] = [];
    let totalItems = 0;

    switch (activeTab) {
      case "concerns":
        data = filteredConcerns;
        totalItems = filteredConcerns.length;
        break;
      case "recommendations":
        data = filteredRecommendations;
        totalItems = filteredRecommendations.length;
        break;
      case "why-not":
        data = filteredReasons;
        totalItems = filteredReasons.length;
        break;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return {
      items: data.slice(startIndex, endIndex),
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      currentPage,
    };
  };

  const { items, totalItems, totalPages } = paginatedData();

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading feedback data...</p>
      </div>
    );
  }

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1); // Reset to first page when changing limit
            }}
          >
            <SelectTrigger className="w-24">
              <div className="flex items-center">
                <ListFilter className="h-4 w-4 mr-1" />
                <span>{itemsPerPage}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare size={20} />
            Patient Feedback Analysis
          </CardTitle>
          <CardDescription>
            Analyze patient recommendations, concerns, and issues raised across
            departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Department Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                  <div>
                    <div className="text-2xl font-bold">{concerns.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Specific department issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {recommendations.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Positive suggestions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Non-Recommendation Reasons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {notRecommendReasons.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Critical issues reported
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback tabs and content */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    Raw Feedback Responses
                  </CardTitle>
                  <CardDescription>
                    Actual text responses from patients
                  </CardDescription>
                </div>

                {/* Make search fully responsive */}
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search all feedback..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="concerns"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="concerns">
                    Department Concerns
                  </TabsTrigger>
                  <TabsTrigger value="recommendations">
                    Service Recommendations
                  </TabsTrigger>
                  <TabsTrigger value="why-not">Why Not Recommend</TabsTrigger>
                </TabsList>

                {/* Department Concerns Tab */}
                <TabsContent value="concerns">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Department Concerns/Recommendations
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {filteredConcerns.length} items found
                      </div>
                    </div>

                    {/* Add location filter here */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">
                          Filter by Location
                        </label>
                      </div>
                      <Select
                        value={locationFilter}
                        onValueChange={setLocationFilter}
                      >
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {allLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {items.length > 0 && activeTab === "concerns" ? (
                      <div className="space-y-4">
                        {items.map(
                          (concern: DepartmentConcern, index: number) => (
                            <Card
                              key={`concern-${concern.submissionId}-${index}`}
                              className="border-l-4 border-l-amber-500"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <Badge className="bg-amber-100 text-amber-800">
                                      Concern
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {concern.locationName}
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      concern.submittedAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm italic mb-2">
                                  "{concern.concern}"
                                </p>
                                {concern.userType && (
                                  <div className="flex gap-2 mt-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {concern.userType}
                                    </Badge>
                                    {concern.visitPurpose && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {concern.visitPurpose}
                                      </Badge>
                                    )}
                                    {concern.patientType && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {concern.patientType}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="mt-2 text-muted-foreground">
                          No department concerns found matching your filters
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Service Recommendations
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {filteredRecommendations.length} items found
                      </div>
                    </div>

                    {items.length > 0 && activeTab === "recommendations" ? (
                      <div className="space-y-4">
                        {items.map(
                          (recommendation: Recommendation, index: number) => (
                            <Card
                              key={`recommendation-${recommendation.submissionId}-${index}`}
                              className="border-l-4 border-l-green-500"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-green-600" />
                                    <Badge className="bg-green-100 text-green-800">
                                      Suggestion
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      recommendation.submittedAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm italic mb-2">
                                  "{recommendation.recommendation}"
                                </p>
                                {recommendation.userType && (
                                  <div className="flex gap-2 mt-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {recommendation.userType}
                                    </Badge>
                                    {recommendation.visitPurpose && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {recommendation.visitPurpose}
                                      </Badge>
                                    )}
                                    {recommendation.patientType && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {recommendation.patientType}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="mt-2 text-muted-foreground">
                          No recommendations found matching your filters
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Why Not Recommend Tab */}
                <TabsContent value="why-not">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Why Patients Would Not Recommend
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {filteredReasons.length} items found
                      </div>
                    </div>

                    {items.length > 0 && activeTab === "why-not" ? (
                      <div className="space-y-4">
                        {items.map(
                          (reason: NotRecommendReason, index: number) => (
                            <Card
                              key={`reason-${reason.submissionId}-${index}`}
                              className="border-l-4 border-l-red-500"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <ThumbsDown className="h-4 w-4 text-red-600" />
                                    <Badge className="bg-red-100 text-red-800">
                                      Would Not Recommend
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      reason.submittedAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm italic mb-2">
                                  "{reason.reason}"
                                </p>
                                <div className="flex gap-2 mt-2">
                                  {reason.locations &&
                                    reason.locations.length > 0 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Visited: {reason.locations.join(", ")}
                                      </Badge>
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ThumbsDown className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="mt-2 text-muted-foreground">
                          No non-recommendation reasons found matching your
                          filters
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>{renderPagination()}</CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
