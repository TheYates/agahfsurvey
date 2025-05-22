"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Image from "next/image";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  FileText,
  Calendar,
  User,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Home,
  Download,
  RefreshCw,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  getSurveyData,
  SurveyData,
} from "@/app/actions/report-actions-enhanced";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Update the SurveyData interface to include the new properties
interface ExtendedSurveyData extends SurveyData {
  patient_type?: string;
  user_type?: string;
}

export default function SubmissionsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [allSubmissions, setAllSubmissions] = useState<ExtendedSurveyData[]>(
    []
  );
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    ExtendedSurveyData[]
  >([]);
  const [displayedSubmissions, setDisplayedSubmissions] = useState<
    ExtendedSurveyData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [recommendFilter, setRecommendFilter] = useState("all");

  // Sorting state
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
        const surveyData = await getSurveyData();
        setAllSubmissions(surveyData);
        setFilteredSubmissions(surveyData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Apply filters
  useEffect(() => {
    let result = [...allSubmissions];

    // Apply search term (search in ID and visit purpose)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (submission) =>
          (typeof submission.id === "string" &&
            submission.id.toLowerCase().includes(searchLower)) ||
          (submission.visit_purpose &&
            submission.visit_purpose.toLowerCase().includes(searchLower))
      );
    }

    // Apply purpose filter
    if (purposeFilter !== "all") {
      result = result.filter(
        (submission) => submission.visit_purpose === purposeFilter
      );
    }

    // Apply rating filter
    if (ratingFilter !== "all") {
      const [min, max] = ratingFilter.split("-").map(Number);
      if (max) {
        result = result.filter(
          (submission) =>
            submission.overall_rating >= min && submission.overall_rating <= max
        );
      } else {
        result = result.filter(
          (submission) => submission.overall_rating >= min
        );
      }
    }

    // Apply recommend filter
    if (recommendFilter !== "all") {
      const isRecommended = recommendFilter === "yes";
      result = result.filter((submission) =>
        isRecommended
          ? submission.recommendation_rating >= 7
          : submission.recommendation_rating < 7
      );
    }

    setFilteredSubmissions(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    allSubmissions,
    searchTerm,
    purposeFilter,
    ratingFilter,
    recommendFilter,
    itemsPerPage,
  ]);

  // Apply sorting and pagination
  useEffect(() => {
    let sorted = [...filteredSubmissions];

    // Apply sorting
    sorted.sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSubmissions = sorted.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setDisplayedSubmissions(paginatedSubmissions);
  }, [
    filteredSubmissions,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
  ]);

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

  // Get unique visit purposes for filtering
  const visitPurposes = Array.from(
    new Set(
      allSubmissions.map((s) => s.visit_purpose).filter(Boolean) as string[]
    )
  );

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is more than 3
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i < 2 || i > totalPages - 1) continue;

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (!isAuthenticated && isAuthChecked) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo svg.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Survey Submissions
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and analyze individual survey responses with detailed
              feedback
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span className="hidden md:inline">Reports</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => router.refresh()}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Submissions
            </CardTitle>
            <CardDescription>
              Click on a row to view detailed submission information
            </CardDescription>
          </CardHeader>

          {/* Filters */}
          <CardContent>
            <div className="flex flex-wrap justify-end gap-2 mb-6">
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger className="w-[250px]">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Visit Purpose" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {visitPurposes.map((purpose: string) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[250px]">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Rating" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4-5">Excellent/Very Good (4-5)</SelectItem>
                  <SelectItem value="3-3.99">Good (3-3.99)</SelectItem>
                  <SelectItem value="0-2.99">Fair/Poor (0-2.99)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={recommendFilter}
                onValueChange={setRecommendFilter}
              >
                <SelectTrigger className="w-[250px]">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Recommendation" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recommendations</SelectItem>
                  <SelectItem value="yes">Would Recommend</SelectItem>
                  <SelectItem value="no">Would Not Recommend</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(parseInt(value))}
              >
                <SelectTrigger className="w-[250px]">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Items per page" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No submissions found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("id")}
                        >
                          <div className="flex items-center gap-1">
                            ID
                            {sortField === "id" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "id" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("created_at")}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            {sortField === "created_at" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "created_at" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("visit_purpose")}
                        >
                          <div className="flex items-center gap-1">
                            Visit Purpose
                            {sortField === "visit_purpose" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "visit_purpose" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("patient_type")}
                        >
                          <div className="flex items-center gap-1">
                            Patient Type
                            {sortField === "patient_type" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "patient_type" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("overall_rating")}
                        >
                          <div className="flex items-center gap-1">
                            Rating
                            {sortField === "overall_rating" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "overall_rating" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => toggleSort("recommendation_rating")}
                        >
                          <div className="flex items-center gap-1">
                            Recommend
                            {sortField === "recommendation_rating" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="h-3.5 w-3.5" />
                              ) : (
                                <SortDesc className="h-3.5 w-3.5" />
                              ))}
                            {sortField !== "recommendation_rating" && (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedSubmissions.map((submission) => (
                        <Link
                          key={submission.id}
                          href={`/reports/submissions/${submission.id}`}
                          legacyBehavior
                        >
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {typeof submission.id === "string"
                                ? submission.id.substring(0, 8)
                                : submission.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {formatDate(submission.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {submission.visit_purpose || "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                {submission.patient_type ||
                                  submission.user_type ||
                                  "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  submission.overall_rating >= 4
                                    ? "bg-green-100 text-green-800"
                                    : submission.overall_rating >= 3
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {submission.overall_rating.toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  submission.recommendation_rating >= 7
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {submission.recommendation_rating >= 7
                                  ? "Yes"
                                  : "No"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </Link>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredSubmissions.length
                    )}{" "}
                    of {filteredSubmissions.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={`${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {generatePaginationItems()}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={`${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
