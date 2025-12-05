import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the SurveyData type that was previously imported from report-actions-enhanced
export interface SurveyData {
  id: string | number;
  created_at: string;
  visit_purpose?: string;
  overall_rating: number;
  recommendation_rating: number;
  locations_visited?: string[];
  wouldRecommend?: boolean;
  patient_type?: string;
  user_type?: string;
  visit_time?: string;
  department?: string;
  primary_location?: string;
}

// Define the DetailedSubmission type for the submission detail page
export interface DetailedSubmission {
  id: string | number;
  submittedAt: string;
  visitPurpose: string;
  visitTime: string;
  patientType: string;
  userType: string;
  wouldRecommend: boolean;
  overallSatisfaction: number;
  locations: {
    id: string | number;
    name: string;
    type: string;
  }[];
  ratings: {
    locationName: string;
    category?: string;
    score?: number;
    reception?: string;
    professionalism?: string;
    understanding?: string;
    promptnessCare?: string;
    promptnessFeedback?: string;
    overall?: string | number;
    comment?: string;
  }[];
  concerns: {
    locationName: string;
    concern: string;
  }[];
  feedback: {
    comment?: string;
    concern?: string;
    suggestion?: string;
    recommendation?: string;
    recommendation_reason?: string;
  };
  generalObservation: {
    cleanliness?: string;
    facilities?: string;
    security?: string;
    overall?: string;
  };
  whyNotRecommend?: string;
  recommendation?: string;
}

// Function to fetch all survey data
export async function getSurveyData(): Promise<SurveyData[]> {
  const { data, error } = await supabase
    .from("SurveySubmission")
    .select(
      `
      id,
      submittedAt,
      visitPurpose,
      wouldRecommend,
      recommendation,
      patientType,
      userType,
      visitTime,
      whyNotRecommend,
      SubmissionLocation (
        locationId,
        Location (
          id, name, locationType
        )
      ),
      Rating (
        overall,
        locationId
      ),
      GeneralObservation (
        cleanliness,
        facilities,
        security,
        overall,
        submissionId
      )
    `
    )
    .order("submittedAt", { ascending: false });

  if (error || !data) {
    console.error("Error fetching survey data:", error);
    return [];
  }

  const result = data.map((item) => {
    // Calculate overall rating
    let overallRating = 0;
    if (Array.isArray(item.Rating) && item.Rating.length > 0) {
      const ratings = item.Rating.map((r) =>
        typeof r.overall === "number"
          ? r.overall
          : typeof r.overall === "string"
          ? convertTextRatingToNumber(r.overall)
          : 0
      );

      overallRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    }

    // Get primary location
    let primaryLocation = "Unknown";
    let department = "Unknown";

    if (
      Array.isArray(item.SubmissionLocation) &&
      item.SubmissionLocation.length > 0
    ) {
      // Just use the first location since isPrimary is not available
      const primary = item.SubmissionLocation[0];

      if (primary && primary.Location) {
        // Handle both object and array cases
        const location = Array.isArray(primary.Location)
          ? primary.Location[0]
          : primary.Location;
        primaryLocation = location?.name || "Unknown";
        department = location?.locationType || "Unknown";
      }
    }

    // Get all visited locations
    const locationsVisited = Array.isArray(item.SubmissionLocation)
      ? item.SubmissionLocation.map((sl) => {
          if (sl && sl.Location) {
            const location = Array.isArray(sl.Location)
              ? sl.Location[0]
              : sl.Location;
            return location?.name || "Unknown";
          }
          return "Unknown";
        })
      : ["No location data"];

    return {
      id: item.id,
      created_at: item.submittedAt,
      visit_purpose: item.visitPurpose,
      overall_rating: parseFloat(overallRating.toFixed(1)),
      recommendation_rating: item.recommendation || 0,
      locations_visited: locationsVisited,
      wouldRecommend: item.wouldRecommend || false,
      patient_type: item.patientType,
      user_type: item.userType,
      visit_time: item.visitTime,
      department: department,
      primary_location: primaryLocation,
    };
  });

  return result;
}

// Helper function to convert text ratings to numbers
function convertTextRatingToNumber(rating: string): number {
  switch (rating.toLowerCase()) {
    case "excellent":
      return 5;
    case "very good":
      return 4;
    case "good":
      return 3;
    case "fair":
      return 2;
    case "poor":
      return 1;
    default:
      // Try to parse as number if possible
      const num = parseFloat(rating);
      return isNaN(num) ? 3 : num;
  }
}

// Get a specific survey by ID
export async function getSurveyById(id: string): Promise<SurveyData | null> {
  const { data, error } = await supabase
    .from("SurveySubmission")
    .select(
      `
      id,
      submittedAt,
      visitPurpose,
      wouldRecommend,
      recommendation,
      patientType,
      userType,
      visitTime,
      whyNotRecommend,
      SubmissionLocation (
        locationId,
        Location (
          id, name, locationType
        )
      ),
      Rating (
        overall,
        locationId
      ),
      GeneralObservation (
        cleanliness,
        facilities,
        security,
        overall,
        submissionId
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(`Error fetching survey with ID ${id}:`, error);
    return null;
  }

  // Calculate overall rating
  let overallRating = 0;
  if (Array.isArray(data.Rating) && data.Rating.length > 0) {
    const ratings = data.Rating.map((r) =>
      typeof r.overall === "number"
        ? r.overall
        : typeof r.overall === "string"
        ? convertTextRatingToNumber(r.overall)
        : 0
    );

    overallRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  }

  // Get primary location
  let primaryLocation = "Unknown";
  let department = "Unknown";

  if (
    Array.isArray(data.SubmissionLocation) &&
    data.SubmissionLocation.length > 0
  ) {
    // Just use the first location since isPrimary is not available
    const primary = data.SubmissionLocation[0];

    if (primary && primary.Location) {
      // Handle both object and array cases
      const location = Array.isArray(primary.Location)
        ? primary.Location[0]
        : primary.Location;
      primaryLocation = location?.name || "Unknown";
      department = location?.locationType || "Unknown";
    }
  }

  // Get all visited locations
  const locationsVisited = Array.isArray(data.SubmissionLocation)
    ? data.SubmissionLocation.map((sl) => {
        if (sl && sl.Location) {
          const location = Array.isArray(sl.Location)
            ? sl.Location[0]
            : sl.Location;
          return location?.name || "Unknown";
        }
        return "Unknown";
      })
    : ["No location data"];

  return {
    id: data.id,
    created_at: data.submittedAt,
    visit_purpose: data.visitPurpose,
    overall_rating: parseFloat(overallRating.toFixed(1)),
    recommendation_rating: data.recommendation || 0,
    locations_visited: locationsVisited,
    wouldRecommend: data.wouldRecommend || false,
    patient_type: data.patientType,
    user_type: data.userType,
    visit_time: data.visitTime,
    department: department,
    primary_location: primaryLocation,
  };
}

// Get detailed submission by ID (for the submission detail page)
export async function getSubmissionById(
  id: string
): Promise<DetailedSubmission | null> {
  const { data, error } = await supabase
    .from("SurveySubmission")
    .select(
      `
      id,
      submittedAt,
      visitPurpose,
      wouldRecommend,
      recommendation,
      patientType,
      userType,
      visitTime,
      whyNotRecommend,
      SubmissionLocation (
        locationId,
        Location (
          id, name, locationType
        )
      ),
      Rating (
        overall,
        locationId,
        reception,
        professionalism,
        understanding,
        promptnessCare,
        promptnessFeedback,
        foodQuality,
        admission,
        nurseProfessionalism,
        doctorProfessionalism,
        discharge,
        wouldRecommend
      ),
      GeneralObservation (
        cleanliness,
        facilities,
        security,
        overall,
        submissionId
      ),
      DepartmentConcern (
        concern,
        locationId
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(`Error fetching submission with ID ${id}:`, error);
    return null;
  }

  // Process locations
  const locations = Array.isArray(data.SubmissionLocation)
    ? data.SubmissionLocation.map((sl) => {
        if (sl && sl.Location) {
          const location = Array.isArray(sl.Location)
            ? sl.Location[0]
            : sl.Location;
          return {
            id: location?.id || "unknown",
            name: location?.name || "Unknown Location",
            type: location?.locationType || "Unknown Type",
          };
        }
        return {
          id: "unknown",
          name: "Unknown Location",
          type: "Unknown Type",
        };
      })
    : [];

  // Process ratings with location names
  const ratings = [];

  // Get all ratings from the database
  let allRatings = Array.isArray(data.Rating) ? data.Rating : [];

  // Map each location to its ratings
  if (locations.length > 0 && allRatings.length > 0) {
    // For each location, find corresponding rating or create a default one
    locations.forEach((location) => {
      // Find rating for this location
      const locationRating = allRatings.find(
        (r) => r.locationId === location.id
      );

      if (locationRating) {
        // If rating exists, use actual values from database
        ratings.push({
          locationName: location.name,
          reception: locationRating.reception || "",
          professionalism: locationRating.professionalism || "",
          understanding: locationRating.understanding || "",
          promptnessCare: locationRating.promptnessCare || "",
          promptnessFeedback: locationRating.promptnessFeedback || "",
          overall: locationRating.overall || "",
          // Add ward-specific fields if they exist
          admission: locationRating.admission || "",
          nurseProfessionalism: locationRating.nurseProfessionalism || "",
          doctorProfessionalism: locationRating.doctorProfessionalism || "",
          discharge: locationRating.discharge || "",
          // Add canteen-specific fields
          foodQuality: locationRating.foodQuality || "",
          // Add location-specific recommendation
          wouldRecommend: locationRating.wouldRecommend !== null && locationRating.wouldRecommend !== undefined
            ? (locationRating.wouldRecommend ? "Yes" : "No")
            : "",
          comment: "",
        });
      } else {
        // No rating found for this location, create empty one
        ratings.push({
          locationName: location.name,
          reception: "",
          professionalism: "",
          understanding: "",
          promptnessCare: "",
          promptnessFeedback: "",
          overall: "",
          wouldRecommend: "",
          comment: "",
        });
      }
    });
  } else if (allRatings.length > 0) {
    // If we have ratings but no matching locations, create entries for each rating
    allRatings.forEach((rating) => {
      // Find location name based on locationId
      let locationName = "Unknown Location";

      // Try to find location with this ID
      const location = locations.find((loc) => loc.id === rating.locationId);
      if (location) {
        locationName = location.name;
      } else {
        // If location not in SubmissionLocation, fetch it directly
        // (would need to be implemented as a separate async call)
        // For now, just use ID as name
        locationName = `Location ID: ${rating.locationId}`;
      }

      ratings.push({
        locationName: locationName,
        reception: rating.reception || "",
        professionalism: rating.professionalism || "",
        understanding: rating.understanding || "",
        promptnessCare: rating.promptnessCare || "",
        promptnessFeedback: rating.promptnessFeedback || "",
        overall: rating.overall || "",
        // Add ward-specific fields if they exist
        admission: rating.admission || "",
        nurseProfessionalism: rating.nurseProfessionalism || "",
        doctorProfessionalism: rating.doctorProfessionalism || "",
        discharge: rating.discharge || "",
        // Add canteen-specific fields
        foodQuality: rating.foodQuality || "",
        // Add location-specific recommendation
        wouldRecommend: rating.wouldRecommend !== null && rating.wouldRecommend !== undefined
          ? (rating.wouldRecommend ? "Yes" : "No")
          : "",
        comment: "",
      });
    });
  } else {
    // Add a default rating if no locations or ratings exist
    ratings.push({
      locationName: "General",
      reception: "",
      professionalism: "",
      understanding: "",
      promptnessCare: "",
      promptnessFeedback: "",
      overall: "",
      wouldRecommend: "",
      comment: "",
    });
  }

  // Process concerns
  const concerns: { locationName: string; concern: string }[] = [];

  if (
    Array.isArray(data.DepartmentConcern) &&
    data.DepartmentConcern.length > 0
  ) {
    data.DepartmentConcern.forEach((concern: any) => {
      // Find location name based on locationId
      let locationName = "General";
      if (concern.locationId) {
        const location = locations.find((loc) => loc.id === concern.locationId);
        if (location) {
          locationName = location.name;
        }
      }

      concerns.push({
        locationName,
        concern: concern.concern || "",
      });
    });
  }

  // Calculate overall satisfaction
  let overallSatisfaction = 0;

  if (Array.isArray(data.Rating) && data.Rating.length > 0) {
    const ratingScores = data.Rating.map((r) => {
      return typeof r.overall === "number"
        ? r.overall
        : typeof r.overall === "string"
        ? convertTextRatingToNumber(r.overall)
        : 0;
    });

    overallSatisfaction =
      ratingScores.reduce((sum, score) => sum + score, 0) / ratingScores.length;
  }

  // Process general observations
  const generalObs = {
    cleanliness: "",
    facilities: "",
    security: "",
    overall: "",
  };

  if (
    Array.isArray(data.GeneralObservation) &&
    data.GeneralObservation.length > 0
  ) {
    // Find observation matching this submission
    const matchingObs = data.GeneralObservation.find(
      (obs) => obs && obs.submissionId === data.id
    );

    if (matchingObs) {
      generalObs.cleanliness = matchingObs.cleanliness || "";
      generalObs.facilities = matchingObs.facilities || "";
      generalObs.security = matchingObs.security || "";
      generalObs.overall = matchingObs.overall || "";
    } else {
      // If no exact match found, just use the first record (as a fallback)
      const obs = data.GeneralObservation[0];
      if (obs) {
        generalObs.cleanliness = obs.cleanliness || "";
        generalObs.facilities = obs.facilities || "";
        generalObs.security = obs.security || "";
        generalObs.overall = obs.overall || "";
      }
    }
  } else {
  }

  // Additional fallback - try fetching ALL general observations to find a match
  if (
    !generalObs.cleanliness &&
    !generalObs.facilities &&
    !generalObs.security &&
    !generalObs.overall
  ) {
    try {
      const { data: allObs, error: allObsError } = await supabase
        .from("GeneralObservation")
        .select("*");

      if (allObs && allObs.length > 0 && !allObsError) {
        // Try different ID formats (case insensitive, with/without dashes)
        const normalizedId = data.id.toLowerCase().replace(/-/g, "");

        const matchingRecord = allObs.find((obs) => {
          if (!obs.submissionId) return false;
          const normalizedObsId = obs.submissionId
            .toLowerCase()
            .replace(/-/g, "");
          return normalizedObsId === normalizedId;
        });

        if (matchingRecord) {
          generalObs.cleanliness = matchingRecord.cleanliness || "";
          generalObs.facilities = matchingRecord.facilities || "";
          generalObs.security = matchingRecord.security || "";
          generalObs.overall = matchingRecord.overall || "";
        }
      }
    } catch (err) {
      console.error("Error fetching all GeneralObservations:", err);
    }
  }

  // Structure the result
  const result: DetailedSubmission = {
    id: data.id,
    submittedAt: data.submittedAt,
    visitPurpose: data.visitPurpose || "Not specified",
    visitTime: data.visitTime || "Not specified",
    patientType: data.patientType || "Not specified",
    userType: data.userType || "Not specified",
    wouldRecommend: data.wouldRecommend || false,
    overallSatisfaction: parseFloat(overallSatisfaction.toFixed(1)),
    locations,
    ratings,
    concerns,
    feedback: {
      comment: undefined,
      concern: undefined,
      suggestion: undefined,
      recommendation: data.recommendation
        ? data.recommendation.toString()
        : undefined,
      recommendation_reason: data.whyNotRecommend || undefined,
    },
    generalObservation: generalObs,
    whyNotRecommend: data.whyNotRecommend || undefined,
    recommendation: data.recommendation || undefined,
  };

  return result;
}

// Helper function to convert numeric rating to text
function convertNumericToTextRating(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 2.5) return "Good";
  if (rating >= 1.5) return "Fair";
  return "Poor";
}
