"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  User,
  Download,
  FileText,
  FileJson,
  FileOutput,
  FileSpreadsheet,
  ArrowLeft,
  RefreshCw,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import SubmissionDetailModal from "./components/submission-detail-modal";
import DeleteSubmissionDialog from "@/components/submissions/delete-submission-dialog";
import {
  exportToCSV,
  exportToJSON,
  exportToHTML,
  exportToExcel,
} from "./utils/export-utils";
import { getSurveyData } from "@/app/actions/page-actions";
import Image from "next/image";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface Submission {
  id: string;
  submittedAt: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  visitTime: string;
  locations: string[];
  wouldRecommend: boolean;
  hasConcerns: boolean;
  overallSatisfaction: string;
  departmentRatings?: Record<string, Record<string, string>>;
  departmentConcerns?: Record<string, string>;
  generalObservation?: Record<string, string>;
  recommendation?: string;
  whyNotRecommend?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRecommendation, setFilterRecommendation] = useState("all");
  const [filterConcerns, setFilterConcerns] = useState("all");
  const [filterVisitPurpose, setFilterVisitPurpose] = useState("all");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const surveyData = await getSurveyData();

        // Transform the data to match the expected format
        const transformedData: Submission[] = surveyData.map((survey) => ({
          id: String(survey.id),
          submittedAt: survey.created_at,
          visitPurpose: survey.visit_purpose || "Not specified",
          patientType: survey.patient_type || "Not specified",
          userType: survey.user_type || "Not specified",
          visitTime: survey.visit_time || "not-specified",
          locations: survey.locations_visited || [],
          wouldRecommend: survey.wouldRecommend || false,
          // Infer if there are concerns from the data
          hasConcerns: false, // We'll need to update this once we have real concerns data
          // Convert numeric rating to text for display
          overallSatisfaction: convertRatingToSatisfaction(
            survey.overall_rating
          ),
          // These fields might require additional API calls to get detailed data
          departmentRatings: {},
          departmentConcerns: {},
          generalObservation: {
            overall: convertRatingToSatisfaction(survey.overall_rating),
          },
          recommendation: survey.recommendation_rating?.toString(),
          whyNotRecommend: survey.wouldRecommend ? "" : "Not provided",
        }));

        setSubmissions(transformedData);
        setFilteredSubmissions(transformedData);
      } catch (error) {
        console.error("Error fetching survey data:", error);
        // Fallback to mock data if API fails
        setSubmissions([]);
        setFilteredSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to convert numeric rating to satisfaction text
  const convertRatingToSatisfaction = (rating: number): string => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Very Good";
    if (rating >= 2.5) return "Good";
    if (rating >= 1.5) return "Fair";
    return "Poor";
  };

  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.visitPurpose
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.userType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.locations.some((loc) =>
            loc.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Recommendation filter
    if (filterRecommendation !== "all") {
      filtered = filtered.filter((submission) =>
        filterRecommendation === "yes"
          ? submission.wouldRecommend
          : !submission.wouldRecommend
      );
    }

    // Concerns filter
    if (filterConcerns !== "all") {
      filtered = filtered.filter((submission) =>
        filterConcerns === "yes"
          ? submission.hasConcerns
          : !submission.hasConcerns
      );
    }

    // Visit purpose filter
    if (filterVisitPurpose !== "all") {
      filtered = filtered.filter(
        (submission) => submission.visitPurpose === filterVisitPurpose
      );
    }

    setFilteredSubmissions(filtered);
  }, [
    submissions,
    searchTerm,
    filterRecommendation,
    filterConcerns,
    filterVisitPurpose,
  ]);

  const handleRowClick = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (submissionId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setDeleteSubmissionId(submissionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    // Refresh the data after successful deletion
    window.location.reload();
  };

  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions([...selectedSubmissions, submissionId]);
    } else {
      setSelectedSubmissions(
        selectedSubmissions.filter((id) => id !== submissionId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map((s) => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const getSelectedSubmissionsData = () => {
    return submissions.filter((s) => selectedSubmissions.includes(s.id));
  };

  const handleExport = async (
    exportFormat: "excel" | "csv" | "json" | "html"
  ) => {
    if (selectedSubmissions.length === 0) {
      alert("Please select at least one submission to export.");
      return;
    }

    setIsExporting(true);
    try {
      const dataToExport = getSelectedSubmissionsData();
      const filename = `submissions_export_${format(
        new Date(),
        "yyyy-MM-dd_HH-mm-ss"
      )}`;

      switch (exportFormat) {
        case "excel":
          exportToExcel(dataToExport, filename);
          break;
        case "csv":
          exportToCSV(dataToExport, filename);
          break;
        case "json":
          exportToJSON(dataToExport, filename);
          break;
        case "html":
          exportToHTML(dataToExport, filename);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getSatisfactionColor = (satisfaction: string) => {
    switch (satisfaction) {
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "Very Good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Fair":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Add a function to truncate/format ID
  const formatId = (id: string): string => {
    // If it's a UUID or long ID, truncate to first 8 characters
    if (id.length > 12) {
      return id.substring(0, 8) + "...";
    }
    return id;
  };

  // Calculate pagination values
  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredSubmissions.slice(startIndex, endIndex);

  // Functions for pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-64" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Filters skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full md:w-48" />
                <Skeleton className="h-10 w-full md:w-48" />
                <Skeleton className="h-10 w-full md:w-48" />
              </div>
            </CardContent>
          </Card>

          {/* Table skeleton */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {/* Table header skeleton */}
                <div className="border-b">
                  <div className="flex py-3">
                    <Skeleton className="h-4 w-4 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                    <Skeleton className="h-4 w-32 mx-4" />
                  </div>
                </div>

                {/* Table rows skeleton */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="border-b">
                      <div className="flex py-4">
                        <Skeleton className="h-4 w-4 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                        <Skeleton className="h-5 w-32 mx-4" />
                      </div>
                    </div>
                  ))}

                {/* Pagination skeleton */}
                <div className="flex items-center justify-between py-4">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo white.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
                onError={(e) => {
                  console.error("Error loading logo image");
                  e.currentTarget.src = "/placeholder-logo.svg";
                }}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Survey Submissions
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and manage individual survey responses
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back to Reports</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Export Controls */}
        {selectedSubmissions.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">
                    Export {selectedSubmissions.length} selected submissions
                  </span>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button disabled={isExporting} className="gap-2">
                        <Download className="h-4 w-4" />
                        {isExporting ? "Exporting..." : "Export"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("excel")}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export as Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("csv")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("json")}>
                        <FileJson className="h-4 w-4 mr-2" />
                        Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("html")}>
                        <FileOutput className="h-4 w-4 mr-2" />
                        Export as HTML
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSubmissions([])}
                    disabled={isExporting}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, purpose, user type, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={filterRecommendation}
                onValueChange={setFilterRecommendation}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recommendations</SelectItem>
                  <SelectItem value="yes">Would Recommend</SelectItem>
                  <SelectItem value="no">Would Not Recommend</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterConcerns} onValueChange={setFilterConcerns}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Concerns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="yes">Has Concerns</SelectItem>
                  <SelectItem value="no">No Concerns</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterVisitPurpose}
                onValueChange={setFilterVisitPurpose}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Visit Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  <SelectItem value="General Practice">
                    General Practice
                  </SelectItem>
                  <SelectItem value="Medicals (Occupational Health)">
                    Medicals (Occupational Health)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">
              Submissions{" "}
              <Badge variant="outline" className="ml-2 font-normal">
                {filteredSubmissions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          filteredSubmissions.length > 0 &&
                          filteredSubmissions.every((s) =>
                            selectedSubmissions.includes(s.id)
                          )
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-40">ID</TableHead>
                    <TableHead className="w-40">Date</TableHead>
                    <TableHead className="w-40">Visit Purpose</TableHead>
                    <TableHead className="w-48">User Type</TableHead>
                    <TableHead className="w-32">Locations</TableHead>
                    <TableHead className="w-28">Recommend</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(submission.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedSubmissions.includes(submission.id)}
                          onCheckedChange={(checked) =>
                            handleSelectSubmission(
                              submission.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        <span className="text-xs text-muted-foreground block truncate max-w-32">
                          {submission.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            {format(
                              new Date(submission.submittedAt),
                              "MMM dd, yyyy"
                            )}
                            <span className="text-xs text-muted-foreground block">
                              {format(
                                new Date(submission.submittedAt),
                                "h:mm a"
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap px-2 py-1 font-normal"
                        >
                          {submission.visitPurpose}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{submission.userType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {submission.locations.length} locations
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            submission.wouldRecommend
                              ? "default"
                              : "destructive"
                          }
                          className="whitespace-nowrap"
                        >
                          {submission.wouldRecommend ? "Yes" : "No"}
                        </Badge>
                      </TableCell>

                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRowClick(submission.id)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteClick(submission.id, e)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSubmissions.length > 0 && (
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalItems}</span>{" "}
                    submissions
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={pageSize.toString()} />
                        </SelectTrigger>
                        <p className="text-xs font-medium">per page</p>
                        <SelectContent side="top">
                          {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPreviousPage();
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(3, totalPages) }).map(
                          (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToPage(pageNumber);
                                  }}
                                  isActive={currentPage === pageNumber}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        )}
                        {totalPages > 3 && (
                          <>
                            {currentPage > 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            {currentPage > 3 &&
                              currentPage <= totalPages - 2 && (
                                <PaginationItem>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      goToPage(currentPage);
                                    }}
                                    isActive={true}
                                  >
                                    {currentPage}
                                  </PaginationLink>
                                </PaginationItem>
                              )}
                            {currentPage <= totalPages - 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            {totalPages > 3 && (
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToPage(totalPages);
                                  }}
                                  isActive={currentPage === totalPages}
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            )}
                          </>
                        )}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToNextPage();
                            }}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No submissions found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submission Detail Modal */}
        <SubmissionDetailModal
          submissionId={selectedSubmissionId || ""}
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedSubmissionId(null);
          }}
        />

        {/* Delete Submission Dialog */}
        <DeleteSubmissionDialog
          submissionId={deleteSubmissionId}
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeleteSubmissionId(null);
          }}
          onDeleted={handleDeleteSuccess}
        />
      </div>
    </main>
  );
}
