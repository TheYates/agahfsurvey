"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { submitSurvey } from "@/app/actions/survey-actions";

// Define location type from the database
interface Location {
  id: number;
  name: string;
  locationType: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  wouldRecommend: boolean;
  whyNotRecommend: string;
  recommendation: string;
  userType: string;
  patientType: string;
}

interface SurveyFormProps {
  locations: Location[];
}

export default function SurveyForm({ locations = [] }: SurveyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // Track which location we're currently rating
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    visitTime: "",
    visitPurpose: "",
    locations: [],
    departmentRatings: {},
    departmentConcerns: {},
    visitedOtherPlaces: false,
    otherLocations: [],
    generalObservation: {
      cleanliness: "",
      facilities: "",
      security: "",
      overall: "",
    },
    wouldRecommend: true,
    whyNotRecommend: "",
    recommendation: "",
    userType: "",
    patientType: "",
  });

  // Group locations by type from the database
  const departmentLocations = locations
    .filter((loc) => loc.locationType === "department")
    .map((loc) => loc.name);

  const canteenLocations = locations
    .filter((loc) => loc.locationType === "canteen")
    .map((loc) => loc.name);

  const wardLocations = locations
    .filter((loc) => loc.locationType === "ward")
    .map((loc) => loc.name);

  const occupationalHealthLocations = locations
    .filter((loc) => loc.locationType === "occupational_health")
    .map((loc) => loc.name);

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
      // Prepare the locations array
      let allLocations = [
        ...surveyData.locations,
        ...(surveyData.visitedOtherPlaces ? surveyData.otherLocations : []),
      ];

      // Ensure Occupational Health is included for Medicals visits
      if (surveyData.visitPurpose === "Medicals (Occupational Health)") {
        // Add the OH location if it's not already in the array
        const ohLocation = "Occupational Health Unit (Medicals)";
        if (!allLocations.includes(ohLocation)) {
          allLocations.push(ohLocation);
        }
      }

      // Call the server action to submit the survey
      const result = await submitSurvey({
        visitTime: surveyData.visitTime,
        visitPurpose: surveyData.visitPurpose,
        locations: allLocations,
        visitedOtherPlaces: surveyData.visitedOtherPlaces,
        departmentRatings: surveyData.departmentRatings,
        departmentConcerns: surveyData.departmentConcerns,
        generalObservation: surveyData.generalObservation,
        wouldRecommend: surveyData.wouldRecommend,
        whyNotRecommend: surveyData.whyNotRecommend,
        recommendation: surveyData.recommendation,
        userType: surveyData.userType,
        patientType: surveyData.patientType,
      });

      if (result.success) {
        toast.success("Thank you for completing the survey!");

        // Redirect to thank you page
        router.push("/thank-you");
      } else {
        toast.error("Failed to submit survey. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
            departmentLocations={departmentLocations}
            wardLocations={wardLocations}
            canteenLocations={canteenLocations}
            occupationalHealthLocations={occupationalHealthLocations}
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
            departmentLocations={departmentLocations}
            wardLocations={wardLocations}
            canteenLocations={canteenLocations}
            occupationalHealthLocations={occupationalHealthLocations}
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
    <Card className="p-6 shadow-lg border-t-4 border-t-primary">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-primary">
              AGA Health Foundation Survey
            </h1>
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
          {/* <Progress value={calculateProgress()} className="h-2" /> */}
        </div>

        {renderStep()}
      </div>
      {debugMode && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
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
            className="mt-2 px-2 py-1 bg-gray-200 rounded text-xs"
            onClick={() => surveyData}
          >
            Log Survey Data
          </button>
        </div>
      )}
    </Card>
  );
}
