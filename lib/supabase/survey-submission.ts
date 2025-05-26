import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { createSurveyQuery } from "./queries";
import type { Database } from "./database.types";

// Create a Supabase client with the anon key for client-side submissions
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type SurveyFormData = {
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
  recommendation: string | null;
  userType: string;
  patientType: string;
};

type LocationMap = Record<string, number>;

/**
 * Converts a form rating category name to the database column name
 */
function mapRatingCategory(category: string): string {
  const mappings: Record<string, string> = {
    reception: "reception",
    professionalism: "professionalism",
    understanding: "understanding",
    "promptness-care": "promptnessCare",
    "promptness-feedback": "promptnessFeedback",
    overall: "overall",
    "food-quality": "foodQuality",
    admission: "admission",
    "nurse-professionalism": "nurseProfessionalism",
    "doctor-professionalism": "doctorProfessionalism",
    discharge: "discharge",
  };

  return mappings[category] || category;
}

/**
 * Submits survey data to Supabase
 */
export async function submitSurveyToSupabase(formData: SurveyFormData) {
  try {
    // Get all locations (from both standard and other locations)
    let allLocationNames = [
      ...formData.locations,
      ...(formData.visitedOtherPlaces ? formData.otherLocations : []),
    ];

    // Special case: If the visit purpose is for Medicals (Occupational Health)
    // ensure the Occupational Health Unit is included in locations
    const isOccupationalHealthVisit =
      formData.visitPurpose === "Medicals (Occupational Health)";

    if (isOccupationalHealthVisit) {
      // Fetch the occupational health location
      const { data: occupationalHealthLocation } = await supabase
        .from("Location")
        .select("*")
        .eq("locationType", "occupational_health")
        .single();

      if (
        occupationalHealthLocation &&
        !allLocationNames.includes(occupationalHealthLocation.name)
      ) {
        console.log(
          "Adding occupational health location automatically:",
          occupationalHealthLocation.name
        );
        allLocationNames.push(occupationalHealthLocation.name);

        // Also add to primary locations if not already there
        if (!formData.locations.includes(occupationalHealthLocation.name)) {
          formData.locations.push(occupationalHealthLocation.name);
        }
      }
    }

    // 1. Ensure all locations exist in the database
    const locationMap = await ensureLocationsExist(allLocationNames);

    // 2. Create survey submission
    const submissionId = uuidv4();
    const now = new Date().toISOString();

    // Convert "Yes"/"No" to boolean for wouldRecommend
    const wouldRecommend =
      formData.wouldRecommend === "Yes"
        ? true
        : formData.wouldRecommend === "No"
        ? false
        : null;

    const surveyData = {
      survey: {
        id: submissionId,
        visitTime: formData.visitTime,
        visitPurpose: formData.visitPurpose,
        visitedOtherPlaces: formData.visitedOtherPlaces,
        wouldRecommend,
        whyNotRecommend:
          formData.wouldRecommend === "No" ? formData.whyNotRecommend : null,
        recommendation: formData.recommendation || null,
        userType: formData.userType,
        patientType: formData.patientType,
        submittedAt: now,
        updatedAt: now,
      },
      // Transform locations to the format expected by createSurveyQuery
      locations: allLocationNames.map((name) => ({
        locationId: locationMap[name],
        isPrimary: formData.locations.includes(name), // Primary if from main locations
      })),
      // Transform ratings data
      ratings: Object.entries(formData.departmentRatings).map(
        ([locationName, ratings]) => {
          // Convert rating categories to the proper database columns
          const transformedRatings: Record<string, string> = {};
          Object.entries(ratings).forEach(([category, value]) => {
            transformedRatings[mapRatingCategory(category)] = value;
          });

          // Log for debugging
          console.log(
            `Processing ratings for location: ${locationName}, ID: ${locationMap[locationName]}`
          );

          return {
            locationId: locationMap[locationName],
            ...transformedRatings,
          };
        }
      ),
      // Transform concerns data
      concerns: Object.entries(formData.departmentConcerns)
        .filter(([_, concern]) => concern.trim() !== "")
        .map(([locationName, concern]) => ({
          locationId: locationMap[locationName],
          concern,
        })),
      // Format general observations
      generalObservation: {
        cleanliness: formData.generalObservation.cleanliness || null,
        facilities: formData.generalObservation.facilities || null,
        security: formData.generalObservation.security || null,
        overall: formData.generalObservation.overall || null,
      },
    };

    // Submit the data using our createSurveyQuery function
    const result = await createSurveyQuery(supabase, surveyData);

    console.log("Survey submitted successfully:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error submitting survey:", error);
    return { success: false, error };
  }
}

/**
 * Ensures all locations exist in the database and returns a mapping of names to IDs
 */
async function ensureLocationsExist(
  locationNames: string[]
): Promise<LocationMap> {
  try {
    // First, fetch all existing locations
    const { data: existingLocations } = await supabase
      .from("Location")
      .select("id, name")
      .in("name", locationNames);

    // Create a map of name to ID for locations that exist
    const locationMap: LocationMap = {};
    existingLocations?.forEach((loc) => {
      locationMap[loc.name] = loc.id;
    });

    // Find locations that don't exist yet
    const missingLocations = locationNames.filter(
      (name) => !existingLocations?.some((loc) => loc.name === name)
    );

    // Insert missing locations if any
    if (missingLocations.length > 0) {
      const now = new Date().toISOString();
      const locationsToInsert = missingLocations.map((name) => ({
        name,
        locationType: "Department", // Default location type
        createdAt: now,
        updatedAt: now,
      }));

      const { data: newLocations, error } = await supabase
        .from("Location")
        .insert(locationsToInsert)
        .select("id, name");

      if (error) {
        throw new Error(`Failed to insert locations: ${error.message}`);
      }

      // Add new locations to the map
      newLocations?.forEach((loc) => {
        locationMap[loc.name] = loc.id;
      });
    }

    return locationMap;
  } catch (error) {
    console.error("Error ensuring locations exist:", error);
    throw error;
  }
}
