"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import IntroPage from "./survey/intro-page";
import LocationsPage from "./survey/locations-page";
import DepartmentRating from "./survey/department-rating";
import CanteenRating from "./survey/canteen-rating";
import WardRating from "./survey/ward-rating";
import OccupationalHealthRating from "./survey/occupational-health-rating";
import WhereElsePage from "./survey/where-else-page";
import FinalPage from "./survey/final-page";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  submitSurveyToSupabase,
  type SurveyFormData,
} from "@/lib/supabase/survey-submission";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define the survey data structure
interface SurveyData {
  visitTime: string;
  visitPurpose: string;
  locations: string[];
  departmentRatings: Record<string, Record<string, string>>;
  departmentConcerns: Record<string, string>;
  visitedOtherPlaces: boolean;
  otherLocations: string[];
  generalObservation: Record<string, string>;
  wouldRecommend: string;
  whyNotRecommend: string;
  recommendation: string;
  userType: string;
  patientType: string;
}

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  // Track which location we're currently rating
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [surveyData, setSurveyData] = useState<SurveyData>({
    visitTime: "",
    visitPurpose: "",
    locations: [],
    departmentRatings: {},
    departmentConcerns: {},
    visitedOtherPlaces: false,
    otherLocations: [],
    generalObservation: {},
    wouldRecommend: "",
    whyNotRecommend: "",
    recommendation: "",
    userType: "",
    patientType: "",
  });

  // Group locations by type
  const departmentLocations = [
    "Audiology Unit",
    "Dental Clinic",
    "Dressing Room",
    "Emergency Unit",
    "Eye Clinic",
    "Eric Asubonteng Clinic (Bruno Est.)",
    "Injection Room",
    "Laboratory",
    // "Occupational Health",
    "Out-Patient Department (OPD)",
    "Pharmacy",
    "Physiotherapy",
    "RCH",
    "Ultrasound Unit",
    "X-Ray Unit",
  ];

  const canteenLocations = ["Canteen Services"];

  const wardLocations = [
    "Female's Ward",
    "Intensive Care Unit (ICU)",
    "Kids Ward",
    "Lying-In Ward",
    "Male's Ward",
    "Maternity Ward",
    "Neonatal Intensive Care Unit (NICU)",
  ];

  // Define the required categories for each location type
  const departmentCategories = [
    "reception",
    "professionalism",
    "understanding",
    "promptness-care",
    "promptness-feedback",
    "overall",
  ];

  const canteenCategories = [
    "reception",
    "professionalism",
    "understanding",
    "promptness-care",
    "promptness-feedback",
    "food-quality",
    "overall",
  ];

  const wardCategories = [
    "admission",
    "nurse-professionalism",
    "doctor-professionalism",
    "food-quality",
    "understanding",
    "promptness-care",
    "promptness-feedback",
    "discharge",
    "overall",
  ];

  const occupationalHealthCategories = [
    "reception",
    "professionalism",
    "understanding",
    "promptness-care",
    "promptness-feedback",
    "overall",
  ];

  // Check if a location has been fully rated
  const isLocationFullyRated = (location: string) => {
    const ratings = surveyData.departmentRatings[location] || {};

    let requiredCategories: string[] = [];

    if (departmentLocations.includes(location)) {
      requiredCategories = departmentCategories;
    } else if (canteenLocations.includes(location)) {
      requiredCategories = canteenCategories;
    } else if (wardLocations.includes(location)) {
      requiredCategories = wardCategories;
    } else if (location === "Occupational Health Unit (Medicals)") {
      requiredCategories = occupationalHealthCategories;
    }

    // Check if at least one rating exists (not requiring all)
    const hasAnyRating = requiredCategories.some(
      (category) => ratings[category]
    );

    return hasAnyRating;
  };

  // Handle form data changes
  const updateSurveyData = (field: string, value: any) => {
    setSurveyData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      return newData;
    });
  };

  // Get all locations that need to be rated
  const getAllLocationsToRate = () => {
    const locationsToCheck =
      surveyData.visitPurpose === "Medicals (Occupational Health)" &&
      currentStep > 3
        ? surveyData.otherLocations
        : surveyData.locations;

    // Combine all location types
    return locationsToCheck;
  };

  // Handle next step
  const handleNext = () => {
    // If we're on the locations rating step (step 2 for General Practice)
    if (
      (surveyData.visitPurpose === "General Practice" && currentStep === 2) ||
      (surveyData.visitPurpose === "Medicals (Occupational Health)" &&
        currentStep > 3 &&
        surveyData.visitedOtherPlaces)
    ) {
      const allLocations = getAllLocationsToRate();

      // If we have more locations to rate, move to the next location
      if (currentLocationIndex < allLocations.length - 1) {
        setCurrentLocationIndex(currentLocationIndex + 1);
        return;
      }
      // Otherwise, move to the final step
    }

    // For all other steps, just increment the step
    setCurrentStep((prev) => prev + 1);
    // Reset location index when changing main steps
    setCurrentLocationIndex(0);
  };

  // Handle back step
  const handleBack = () => {
    // If we're on the locations rating step and not at the first location
    if (
      ((surveyData.visitPurpose === "General Practice" && currentStep === 2) ||
        (surveyData.visitPurpose === "Medicals (Occupational Health)" &&
          currentStep > 3 &&
          surveyData.visitedOtherPlaces)) &&
      currentLocationIndex > 0
    ) {
      setCurrentLocationIndex(currentLocationIndex - 1);
      return;
    }

    // Otherwise, go back to the previous main step
    setCurrentStep((prev) => prev - 1);

    // If we're going back to the locations rating step, set the index to the last location
    if (
      (surveyData.visitPurpose === "General Practice" && currentStep === 3) ||
      (surveyData.visitPurpose === "Medicals (Occupational Health)" &&
        ((currentStep === 4 && !surveyData.visitedOtherPlaces) ||
          (currentStep > 4 && surveyData.visitedOtherPlaces)))
    ) {
      const allLocations = getAllLocationsToRate();
      setCurrentLocationIndex(allLocations.length - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Convert the surveyData to match the expected format
      const formData: SurveyFormData = {
        ...surveyData,
        recommendation: surveyData.recommendation || null,
      };

      // Submit to Supabase
      const result = await submitSurveyToSupabase(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Thank You for Your Feedback!",
          description:
            "Your responses have been recorded and will help us improve our services.",
        });
      } else {
        toast({
          title: "Submission Failed",
          description:
            "There was a problem submitting your survey. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current location to rate based on the currentLocationIndex
  const getCurrentLocationToRate = () => {
    const allLocations = getAllLocationsToRate();

    if (currentLocationIndex < allLocations.length) {
      const location = allLocations[currentLocationIndex];

      if (departmentLocations.includes(location)) {
        return { type: "department", location };
      } else if (canteenLocations.includes(location)) {
        return { type: "canteen", location };
      } else if (wardLocations.includes(location)) {
        return { type: "ward", location };
      }
    }

    return null;
  };

  // Calculate total steps for progress bar
  const calculateTotalSteps = () => {
    let totalSteps = 2; // Intro + Locations/OH Rating

    if (surveyData.visitPurpose === "General Practice") {
      // Add steps for each location that needs rating
      totalSteps += surveyData.locations.length;
      // Add final page
      totalSteps += 1;
    } else if (surveyData.visitPurpose === "Medicals (Occupational Health)") {
      // Add step for "Did you visit other places?"
      totalSteps += 1;
      // If yes, add step for selecting other places
      if (surveyData.visitedOtherPlaces) {
        totalSteps += 1;
        // Add steps for each other location
        totalSteps += surveyData.otherLocations.length;
      }
      // Add final page
      totalSteps += 1;
    }

    return totalSteps;
  };

  // Calculate current progress
  const calculateProgress = () => {
    const totalSteps = calculateTotalSteps();
    let currentProgress = currentStep + 1;

    // Add the current location index for the rating steps
    if (
      (surveyData.visitPurpose === "General Practice" && currentStep === 2) ||
      (surveyData.visitPurpose === "Medicals (Occupational Health)" &&
        currentStep > 3 &&
        surveyData.visitedOtherPlaces)
    ) {
      currentProgress += currentLocationIndex;
    }

    return Math.min((currentProgress / totalSteps) * 100, 100);
  };

  // Determine which step to show
  const renderStep = () => {
    // For General Practice flow
    if (surveyData.visitPurpose === "General Practice") {
      if (currentStep === 0) {
        return (
          <IntroPage
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
          />
        );
      } else if (currentStep === 1) {
        return (
          <LocationsPage
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      } else if (currentStep === 2) {
        // Handle rating pages for each selected location
        const locationToRate = getCurrentLocationToRate();

        if (locationToRate) {
          if (locationToRate.type === "department") {
            return (
              <DepartmentRating
                location={locationToRate.location}
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          } else if (locationToRate.type === "canteen") {
            return (
              <CanteenRating
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          } else if (locationToRate.type === "ward") {
            return (
              <WardRating
                location={locationToRate.location}
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          }
        } else {
          // If no more locations to rate, move to final page
          return (
            <FinalPage
              surveyData={surveyData}
              updateSurveyData={updateSurveyData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          );
        }
      } else {
        // Final page
        return (
          <FinalPage
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      }
    }
    // For Medicals (Occupational Health) flow
    else if (surveyData.visitPurpose === "Medicals (Occupational Health)") {
      if (currentStep === 0) {
        return (
          <IntroPage
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
          />
        );
      } else if (currentStep === 1) {
        return (
          <OccupationalHealthRating
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      } else if (currentStep === 2) {
        // Ask if they visited other places
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Did you visit any other place?
            </h2>
            <RadioGroup
              key={currentStep}
              value={surveyData.visitedOtherPlaces ? "yes" : "no"}
              onValueChange={(value) => {
                updateSurveyData("visitedOtherPlaces", value === "yes");
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        );
      } else if (currentStep === 3 && surveyData.visitedOtherPlaces) {
        return (
          <WhereElsePage
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      } else if (
        currentStep === 4 &&
        surveyData.visitedOtherPlaces &&
        surveyData.otherLocations.length > 0
      ) {
        // If they visited other places, handle those ratings
        const locationToRate = getCurrentLocationToRate();

        if (locationToRate) {
          if (locationToRate.type === "department") {
            return (
              <DepartmentRating
                location={locationToRate.location}
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          } else if (locationToRate.type === "canteen") {
            return (
              <CanteenRating
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          } else if (locationToRate.type === "ward") {
            return (
              <WardRating
                location={locationToRate.location}
                surveyData={surveyData}
                updateSurveyData={updateSurveyData}
                onNext={handleNext}
                onBack={handleBack}
              />
            );
          }
        }
      }

      // Show final page
      return (
        <FinalPage
          surveyData={surveyData}
          updateSurveyData={updateSurveyData}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      );
    } else {
      // Default to intro page if no purpose selected
      return (
        <IntroPage
          surveyData={surveyData}
          updateSurveyData={updateSurveyData}
          onNext={handleNext}
        />
      );
    }
  };

  // Add this right before the return statement in the SurveyForm component
  const debugMode = false; // Set to true to see debug information

  return (
    <Card className="p-6 shadow-lg border-t-4 border-t-primary max-w-2xl mx-auto">
      {isSubmitted ? (
        <div className="py-12 text-center space-y-6">
          <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Thank You for Your Feedback!</h2>
          <p className="text-gray-600">
            Your responses have been recorded and will help us improve our
            services.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {surveyData.visitPurpose === "General Practice" &&
                currentStep === 2 ? (
                  <>
                    Location {currentLocationIndex + 1} of{" "}
                    {surveyData.locations.length}
                  </>
                ) : surveyData.visitPurpose ===
                    "Medicals (Occupational Health)" &&
                  currentStep === 4 &&
                  surveyData.visitedOtherPlaces ? (
                  <>
                    Location {currentLocationIndex + 1} of{" "}
                    {surveyData.otherLocations.length}
                  </>
                ) : (
                  <>
                    Step {currentStep + 1} of {calculateTotalSteps()}
                  </>
                )}
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {renderStep()}

          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  Submitting your feedback...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {debugMode && (
        <div className="mt-8 p-4  rounded-md text-xs">
          <h3 className="font-bold mb-2">Debug Information</h3>
          <div>Current Step: {currentStep}</div>
          <div>Current Location Index: {currentLocationIndex}</div>
          <div>Visit Purpose: {surveyData.visitPurpose}</div>
          <div>Locations: {surveyData.locations.join(", ")}</div>
          <div>Other Locations: {surveyData.otherLocations.join(", ")}</div>
          <div>
            Visited Other Places: {surveyData.visitedOtherPlaces ? "Yes" : "No"}
          </div>
          <div>
            Rated Departments:{" "}
            {Object.keys(surveyData.departmentRatings).join(", ")}
          </div>
          <div>Progress: {calculateProgress()}%</div>
          <button
            className="mt-2 px-2 py-1  rounded text-xs"
            onClick={() => surveyData}
          >
            Log Survey Data
          </button>
        </div>
      )}
    </Card>
  );
}
