"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  MessageSquare,
  Download,
  FileText,
  FileJson,
  Printer,
  FileImage,
  MapPin,
} from "lucide-react";
import {
  exportToCSV,
  exportToJSON,
  printSubmission,
  exportSubmissionToPDF,
} from "../utils/export-utils";
import { getSubmissionById } from "@/app/actions/page-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Import survey components
import IntroPage from "@/components/survey/intro-page";
import LocationsPage from "@/components/survey/locations-page";
import DepartmentRating from "@/components/survey/department-rating";
import WardRating from "@/components/survey/ward-rating";
import CanteenRating from "@/components/survey/canteen-rating";
import OccupationalHealthRating from "@/components/survey/occupational-health-rating";
import FinalPage from "@/components/survey/final-page";

// Add helper function to convert numeric rating to text at the component level
function convertRatingToText(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 2.5) return "Good";
  if (rating >= 1.5) return "Fair";
  return "Poor";
}

// Add this CSS to hide buttons in the survey components
const hideButtonsStyle = `
  /* Target the navigation buttons at the bottom of each survey component */
  .pointer-events-none > div > .flex.justify-between.pt-4,
  .pointer-events-none > div > .pt-4.flex.justify-end,
  .pointer-events-none > div > .flex.justify-end.pt-4 {
    display: none;
  }
`;

// Simple component to display only selected locations
function LocationsList({
  locations,
  title,
}: {
  locations: string[];
  title?: string;
}) {
  // Group locations by type
  const clinicsAndDepartments = [
    "Audiology Unit",
    "Dental Clinic",
    "Dressing Room",
    "Emergency Unit",
    "Eye Clinic",
    "Eric Asubonteng Clinic (Bruno Est.)",
    "Injection Room",
    "Laboratory",
    "Out-Patient Department (OPD)",
    "Pharmacy",
    "Physiotherapy",
    "RCH",
    "Ultrasound Unit",
    "X-Ray Unit",
  ];

  const wards = [
    "Female's Ward",
    "Intensive Care Unit (ICU)",
    "Kids Ward",
    "Lying-In Ward",
    "Male's Ward",
    "Maternity Ward",
    "Neonatal Intensive Care Unit (NICU)",
  ];

  const otherServices = [
    "Canteen Services",
    "Occupational Health",
    "Occupational Health Unit (Medicals)",
  ];

  const selectedClinics = locations.filter((loc) =>
    clinicsAndDepartments.includes(loc)
  );
  const selectedWards = locations.filter((loc) => wards.includes(loc));
  const selectedOthers = locations.filter((loc) => otherServices.includes(loc));

  // If no locations to show, return null
  if (
    selectedClinics.length === 0 &&
    selectedWards.length === 0 &&
    selectedOthers.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold">
            {title || "Where did you visit?"}{" "}
            <span className="text-red-500">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            {selectedClinics.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Clinics & Departments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClinics.map((loc) => (
                    <div
                      key={loc}
                      className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-md"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedWards.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Wards
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWards.map((loc) => (
                    <div
                      key={loc}
                      className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-md"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedOthers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Other Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOthers.map((loc) => (
                    <div
                      key={loc}
                      className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-md"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component to display General Observations
function GeneralObservationSection({
  submission,
}: {
  submission: SubmissionData;
}) {
  const categories = [
    { id: "cleanliness", label: "Cleanliness/serenity" },
    { id: "facilities", label: "Facilities" },
    { id: "security", label: "Security" },
    { id: "overall", label: "Overall impression" },
  ];

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold">
            General Observation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-sm py-2 w-1/3"></th>
                    {ratingOptions.map((option) => (
                      <th
                        key={option}
                        className="text-center font-medium text-sm py-2"
                      >
                        {option}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="py-3 text-sm">
                        {category.label} <span className="text-red-500">*</span>
                      </td>
                      {ratingOptions.map((option) => (
                        <td key={option} className="text-center py-3">
                          <div className="flex justify-center">
                            <div
                              className={`h-5 w-5 rounded-full border ${
                                submission.generalObservation[category.id] ===
                                option
                                  ? "bg-green-500 border-green-500"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {submission.generalObservation[category.id] ===
                                option && (
                                <div className="h-full w-full rounded-full flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-white"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component to display user information section only from FinalPage
function UserInformationSection({
  submission,
}: {
  submission: SubmissionData;
}) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold">
            Some Information About You
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                I am a/an: <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "AGAG Employee",
                  "AGAG/Contractor Dependant",
                  "Community",
                  "Contractor Employee",
                  "Other Corporate Employee",
                ].map((userType) => (
                  <div
                    key={userType}
                    className={`flex items-center space-x-2 p-3 rounded-md ${
                      submission.userType === userType
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border ${
                        submission.userType === userType
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {submission.userType === userType && (
                        <div className="h-full w-full rounded-full flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                        </div>
                      )}
                    </div>
                    <Label className="w-full">{userType}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Patient Type:</Label>
              <div className="bg-muted/30 p-4 rounded-md border border-primary/30">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-primary border-primary flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                  </div>
                  <Label className="font-semibold text-base">
                    {submission.patientType}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-6">
                  Automatically determined based on visit history
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component to display recommendation information
function RecommendationSection({ submission }: { submission: SubmissionData }) {
  // Handle both boolean values and string values like "Yes"/"No"
  const isRecommended =
    typeof submission.wouldRecommend === "boolean"
      ? submission.wouldRecommend
      : submission.wouldRecommend === "Yes";

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold">
            Conclusion/Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Would You Recommend The Hospital To Others?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      isRecommended
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isRecommended && (
                      <div className="h-full w-full rounded-full flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                      </div>
                    )}
                  </div>
                  <Label>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      !isRecommended
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {!isRecommended && (
                      <div className="h-full w-full rounded-full flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                      </div>
                    )}
                  </div>
                  <Label>No</Label>
                </div>
              </div>
            </div>

            {!isRecommended && submission.whyNotRecommend && (
              <div className="space-y-2 bg-muted/30 p-4 rounded-md">
                <Label className="text-base font-medium">
                  If No, Please Tell Us Why:
                </Label>
                <div className="p-3 border rounded-md bg-background">
                  {submission.whyNotRecommend}
                </div>
              </div>
            )}

            {submission.recommendation && (
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  If You Have Any Recommendation To Help Us Improve The Services
                  We Offer, Please Tell Us About It:
                </Label>
                <div className="p-3 border rounded-md bg-background">
                  {submission.recommendation}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SubmissionData {
  id: string;
  submittedAt: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  visitTime: string;
  locations: string[];
  departmentRatings: Record<string, Record<string, string>>;
  departmentConcerns: Record<string, string>;
  generalObservation: Record<string, string>;
  wouldRecommend: boolean | string;
  whyNotRecommend: string;
  recommendation: string;
  hasConcerns: boolean;
  overallSatisfaction: string;
}

interface SubmissionDetailModalProps {
  submissionId: string;
  open: boolean;
  onClose: () => void;
}

export default function SubmissionDetailModal({
  submissionId,
  open,
  onClose,
}: SubmissionDetailModalProps) {
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && submissionId) {
      const fetchSubmissionData = async () => {
        try {
          setLoading(true);
          const detailedSubmission = await getSubmissionById(submissionId);

          if (!detailedSubmission) {
            console.error("No submission data found for ID:", submissionId);
            setLoading(false);
            return;
          }

          // Transform API data to match component's expected format
          const transformedData: SubmissionData = {
            id: String(detailedSubmission.id),
            submittedAt: detailedSubmission.submittedAt,
            visitPurpose: detailedSubmission.visitPurpose || "Not specified",
            patientType: detailedSubmission.patientType || "Not specified",
            userType: detailedSubmission.userType || "Not specified",
            visitTime: detailedSubmission.visitTime || "not-specified",
            locations: detailedSubmission.locations.map((loc) => loc.name),
            wouldRecommend: detailedSubmission.wouldRecommend,
            hasConcerns: detailedSubmission.concerns.length > 0,
            overallSatisfaction: convertRatingToText(
              detailedSubmission.overallSatisfaction
            ),

            // Create a simplified departmentRatings object
            departmentRatings: {},

            // Transform concerns into departmentConcerns format
            departmentConcerns: detailedSubmission.concerns.reduce(
              (acc, concern) => {
                if (concern.locationName && concern.concern) {
                  acc[concern.locationName] = concern.concern;
                }
                return acc;
              },
              {} as Record<string, string>
            ),

            // Map general observations
            generalObservation: {
              cleanliness:
                detailedSubmission.generalObservation.cleanliness || "",
              facilities:
                detailedSubmission.generalObservation.facilities || "",
              security: detailedSubmission.generalObservation.security || "",
              overall: detailedSubmission.generalObservation.overall || "",
            },

            whyNotRecommend: detailedSubmission.whyNotRecommend || "",
            recommendation: detailedSubmission.recommendation?.toString() || "",
          };

          // Process ratings separately to avoid TypeScript errors
          const departmentRatings: Record<string, Record<string, string>> = {};

          detailedSubmission.ratings.forEach((rating) => {
            // Debug: log the raw rating data
            console.log(
              "[Modal Debug] Raw rating data:",
              JSON.stringify(rating, null, 2)
            );

            if (rating.locationName) {
              const ratingObj: Record<string, string> = {};

              // Add basic rating fields
              if (rating.reception) ratingObj.reception = rating.reception;
              if (rating.professionalism)
                ratingObj.professionalism = rating.professionalism;
              if (rating.understanding)
                ratingObj.understanding = rating.understanding;
              if (rating.promptnessCare)
                ratingObj["promptness-care"] = rating.promptnessCare;
              if (rating.promptnessFeedback)
                ratingObj["promptness-feedback"] = rating.promptnessFeedback;
              if (rating.overall) ratingObj.overall = rating.overall.toString();

              // Safely add specialized fields if they exist in the API response
              // These are added using type assertion to avoid TypeScript errors
              const ratingAny = rating as any;

              if (ratingAny.admission)
                ratingObj.admission = ratingAny.admission;
              if (ratingAny.nurseProfessionalism)
                ratingObj["nurse-professionalism"] =
                  ratingAny.nurseProfessionalism;
              if (ratingAny.doctorProfessionalism)
                ratingObj["doctor-professionalism"] =
                  ratingAny.doctorProfessionalism;
              if (ratingAny.foodQuality)
                ratingObj["food-quality"] = ratingAny.foodQuality;
              if (ratingAny.discharge)
                ratingObj.discharge = ratingAny.discharge;
              // Add location-specific recommendation
              if (
                ratingAny.wouldRecommend !== undefined &&
                ratingAny.wouldRecommend !== ""
              )
                ratingObj.wouldRecommend = ratingAny.wouldRecommend;
              // Add NPS rating
              if (
                ratingAny.npsRating !== undefined &&
                ratingAny.npsRating !== null
              )
                ratingObj.npsRating = ratingAny.npsRating;
              // Add NPS feedback
              if (
                ratingAny.npsFeedback !== undefined &&
                ratingAny.npsFeedback !== ""
              )
                ratingObj.npsFeedback = ratingAny.npsFeedback;

              // Debug: log what we're setting
              console.log(
                `[Modal Debug] Setting departmentRatings["${rating.locationName}"] with npsRating=${ratingObj.npsRating}, npsFeedback=${ratingObj.npsFeedback}`
              );

              departmentRatings[rating.locationName] = ratingObj;
            }
          });

          console.log(
            "[Modal Debug] Final departmentRatings:",
            JSON.stringify(departmentRatings, null, 2)
          );
          transformedData.departmentRatings = departmentRatings;

          setSubmission(transformedData);
        } catch (error) {
          console.error("Error fetching submission details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSubmissionData();
    }
  }, [submissionId, open]);

  const handleExport = async (
    exportFormat: "csv" | "json" | "print" | "pdf"
  ) => {
    if (!submission) return;

    setIsExporting(true);
    try {
      const filename = `submission_${submission.id}_${format(
        new Date(),
        "yyyy-MM-dd_HH-mm-ss"
      )}`;

      // Convert wouldRecommend to boolean before exporting
      const submissionWithBooleanRecommend = {
        ...submission,
        wouldRecommend:
          typeof submission.wouldRecommend === "boolean"
            ? submission.wouldRecommend
            : submission.wouldRecommend === "Yes",
      };

      switch (exportFormat) {
        case "csv":
          exportToCSV([submissionWithBooleanRecommend], filename);
          break;
        case "json":
          exportToJSON([submissionWithBooleanRecommend], filename);
          break;
        case "print":
          if (contentRef.current) {
            printSubmission(contentRef as React.RefObject<HTMLDivElement>);
          }
          break;
        case "pdf":
          if (contentRef.current) {
            await exportSubmissionToPDF(contentRef.current, filename);
          }
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Dummy functions for survey components (they won't be used since components are read-only)
  const dummyUpdate = () => {};
  const dummyNext = () => {};
  const dummyBack = () => {};
  const dummySubmit = () => {};

  // Helper function to determine location type
  const getLocationType = (location: string) => {
    const wards = [
      "Female's Ward",
      "Intensive Care Unit (ICU)",
      "Kids Ward",
      "Lying-In Ward",
      "Male's Ward",
      "Maternity Ward",
      "Neonatal Intensive Care Unit (NICU)",
    ];
    const departments = [
      "Audiology Unit",
      "Dental Clinic",
      "Dressing Room",
      "Emergency Unit",
      "Eye Clinic",
      "Eric Asubonteng Clinic (Bruno Est.)",
      "Injection Room",
      "Laboratory",
      "Out-Patient Department (OPD)",
      "Pharmacy",
      "Physiotherapy",
      "RCH",
      "Ultrasound Unit",
      "X-Ray Unit",
    ];

    if (wards.includes(location)) return "ward";
    if (departments.includes(location)) return "department";
    if (location === "Canteen Services") return "canteen";
    if (
      location === "Occupational Health" ||
      location === "Occupational Health Unit (Medicals)" ||
      location.toLowerCase().includes("occupational health")
    )
      return "occupational";
    return "department";
  };

  if (loading || !submission) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Loading Submission</DialogTitle>
            <DialogDescription>
              Please wait while we retrieve the submission details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading submission details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Get unique locations by type
  const departments = submission.locations.filter(
    (loc) => getLocationType(loc) === "department"
  );
  const wards = submission.locations.filter(
    (loc) => getLocationType(loc) === "ward"
  );
  const hasCanteen = submission.locations.includes("Canteen Services");
  const hasOccupational = submission.locations.some(
    (loc) =>
      loc === "Occupational Health" ||
      loc === "Occupational Health Unit (Medicals)" ||
      loc.toLowerCase().includes("occupational health")
  );

  // Check if visit purpose is Medical Surveillance (Occupational Health)
  const isMedicalSurveillance =
    submission.visitPurpose?.toLowerCase().includes("occupational health") ||
    submission.visitPurpose?.toLowerCase().includes("medicals");

  // Get other locations (excluding Occupational Health if it's the main purpose)
  const otherLocations = isMedicalSurveillance
    ? submission.locations.filter(
        (loc) =>
          loc !== "Occupational Health" &&
          loc !== "Occupational Health Unit (Medicals)" &&
          !loc.toLowerCase().includes("occupational health")
      )
    : submission.locations;

  // Check if canteen is in the other locations for Medical Surveillance case
  const hasCanteenInOtherLocations = isMedicalSurveillance
    ? otherLocations.includes("Canteen Services")
    : hasCanteen;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              <div>
                <DialogTitle>Submission Details</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {/* {submission.id} */}
                </DialogDescription>
                <p className="text-sm text-muted-foreground">
                  Submitted on{" "}
                  {format(new Date(submission.submittedAt), "PPP 'at' p")}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-3 w-3" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("print")}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print (Browser PDF)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Export as Visual PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          {/* Add style tag to hide buttons */}
          <style>{hideButtonsStyle}</style>
          <div
            ref={contentRef}
            className="space-y-8 pr-4"
            style={{
              minHeight: "fit-content",
              padding: "20px",
            }}
          >
            {/* Intro Page - Read Only */}
            <div className="pointer-events-none">
              <IntroPage
                surveyData={submission}
                updateSurveyData={dummyUpdate}
                onNext={dummyNext}
              />
            </div>

            <Separator className="my-8" />

            {/* Conditional rendering based on visit purpose */}
            {isMedicalSurveillance ? (
              <>
                {/* If Medical Surveillance, show Occupational Health first */}
                {hasOccupational && (
                  <div>
                    <div className="pointer-events-none">
                      <OccupationalHealthRating
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                )}

                {/* Then show "Where Else Did You Visit" if there are other locations */}
                {otherLocations.length > 0 && (
                  <>
                    <LocationsList
                      locations={otherLocations}
                      title="Where Else Did You Visit?"
                    />
                    <Separator className="my-8" />
                  </>
                )}

                {/* Department Ratings for other locations */}
                {departments.map((department, index) => (
                  <div key={department}>
                    <div className="pointer-events-none">
                      <DepartmentRating
                        location={department}
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                ))}

                {/* Ward Ratings for other locations */}
                {wards.map((ward) => (
                  <div key={ward}>
                    <div className="pointer-events-none">
                      <WardRating
                        location={ward}
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                ))}

                {/* Canteen Rating for other locations */}
                {hasCanteenInOtherLocations && (
                  <div>
                    <div className="pointer-events-none">
                      <CanteenRating
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* If General Practice, show "Where did you visit" with all locations */}
                <LocationsList locations={submission.locations} />
                <Separator className="my-8" />

                {/* Department Ratings */}
                {departments.map((department, index) => (
                  <div key={department}>
                    <div className="pointer-events-none">
                      <DepartmentRating
                        location={department}
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                ))}

                {/* Ward Ratings */}
                {wards.map((ward) => (
                  <div key={ward}>
                    <div className="pointer-events-none">
                      <WardRating
                        location={ward}
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                ))}

                {/* Canteen Rating */}
                {hasCanteen && (
                  <div>
                    <div className="pointer-events-none">
                      <CanteenRating
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                )}

                {/* Occupational Health Rating (if not main purpose but visited) */}
                {hasOccupational && (
                  <div>
                    <div className="pointer-events-none">
                      <OccupationalHealthRating
                        surveyData={submission}
                        updateSurveyData={dummyUpdate}
                        onNext={dummyNext}
                        onBack={dummyBack}
                      />
                    </div>
                    <Separator className="my-8" />
                  </div>
                )}
              </>
            )}

            {/* Custom General Observation Section */}
            <GeneralObservationSection submission={submission} />

            <Separator className="my-8" />

            {/* Custom Recommendation Section */}
            <RecommendationSection submission={submission} />

            <Separator className="my-8" />

            {/* Custom User Information Section */}
            <UserInformationSection submission={submission} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
