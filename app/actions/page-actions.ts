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
      SubmissionLocation (
        locationId,
        isPrimary,
        Location (
          id, name, type
        )
      ),
      Rating (
        overall,
        location,
        Location (id, name)
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
      const primary =
        item.SubmissionLocation.find((sl) => sl.isPrimary) ||
        item.SubmissionLocation[0];

      if (primary && primary.Location) {
        // Handle both object and array cases
        const location = Array.isArray(primary.Location)
          ? primary.Location[0]
          : primary.Location;
        primaryLocation = location?.name || "Unknown";
        department = location?.type || "Unknown";
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
      SubmissionLocation (
        locationId,
        isPrimary,
        Location (
          id, name, type
        )
      ),
      Rating (
        overall,
        location,
        Location (id, name)
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
    const primary =
      data.SubmissionLocation.find((sl) => sl.isPrimary) ||
      data.SubmissionLocation[0];

    if (primary && primary.Location) {
      // Handle both object and array cases
      const location = Array.isArray(primary.Location)
        ? primary.Location[0]
        : primary.Location;
      primaryLocation = location?.name || "Unknown";
      department = location?.type || "Unknown";
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
      comments,
      concerns,
      suggestions,
      recommendation_reason,
      SubmissionLocation (
        locationId,
        Location (
          id, name, type
        )
      ),
      Rating (
        category,
        overall,
        comment
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
            type: location?.type || "Unknown Type",
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

  // Add a rating for each location
  if (
    locations.length > 0 &&
    Array.isArray(data.Rating) &&
    data.Rating.length > 0
  ) {
    // For each location, create a rating entry
    locations.forEach((location) => {
      const locationRating = {
        locationName: location.name,
        reception: "Good",
        professionalism: "Good",
        understanding: "Good",
        promptnessCare: "Good",
        promptnessFeedback: "Good",
        overall: "Good",
        comment: "",
      };

      // Try to find specific ratings for this location
      const rating = data.Rating[0]; // Just use the first rating as an example
      if (rating) {
        if (typeof rating.overall === "string") {
          locationRating.overall = rating.overall;
        } else if (typeof rating.overall === "number") {
          // Convert number to string rating
          locationRating.overall = convertNumericToTextRating(rating.overall);
        }

        if (rating.comment) {
          locationRating.comment = rating.comment;
        }
      }

      ratings.push(locationRating);
    });
  } else {
    // Add a default rating if no locations or ratings exist
    ratings.push({
      locationName: "General",
      reception: "Good",
      professionalism: "Good",
      understanding: "Good",
      promptnessCare: "Good",
      promptnessFeedback: "Good",
      overall: "Good",
      comment: "",
    });
  }

  // Process concerns
  const concerns: { locationName: string; concern: string }[] = [];

  if (typeof data.concerns === "string" && data.concerns.trim()) {
    // If concerns is a simple string, add it as a general concern
    concerns.push({
      locationName: "General",
      concern: data.concerns,
    });
  } else if (Array.isArray(data.concerns)) {
    // If concerns is an array, convert each item
    data.concerns.forEach((concern: any) => {
      concerns.push({
        locationName:
          typeof concern === "object" && concern.locationName
            ? concern.locationName
            : "General",
        concern:
          typeof concern === "object" && concern.text
            ? concern.text
            : concern.toString(),
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
      comment: data.comments || undefined,
      concern:
        data.concerns && typeof data.concerns === "string"
          ? data.concerns
          : undefined,
      suggestion: data.suggestions || undefined,
      recommendation: data.recommendation
        ? data.recommendation.toString()
        : undefined,
      recommendation_reason: data.recommendation_reason || undefined,
    },
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
