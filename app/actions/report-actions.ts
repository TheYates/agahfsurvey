import {
  SurveyData,
  LocationVisit,
  DepartmentRating,
  SatisfactionDistribution,
} from "../types/survey-types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LocationResponse {
  name: string;
}

interface SubmissionLocationResponse {
  locationId: string;
  Location: LocationResponse;
}

interface RatingResponse {
  overall: number;
}

interface SurveySubmissionResponse {
  id: string | number;
  submittedAt: string;
  visitPurpose: string;
  wouldRecommend: boolean;
  recommendation: number;
  patientType: string;
  userType: string;
  visitTime: string;
  SubmissionLocation: SubmissionLocationResponse[];
  Rating: RatingResponse[];
}

interface RatingWithLocationResponse {
  id: string | number;
  locationId: string | number;
  overall: number;
  Location: LocationResponse;
}

// Fetch all survey data
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
          name
        )
      ),
      Rating (overall)
    `
    )
    .order("submittedAt", { ascending: false });

  if (error || !data) {
    console.error("Error fetching survey data:", error);
    return [];
  }

  // Debug the raw data count

  const result = data.map((item) => ({
    id: item.id,
    created_at: item.submittedAt,
    visit_purpose: item.visitPurpose,
    recommendation_rating: item.recommendation || 0,
    overall_rating:
      Array.isArray(item.Rating) && item.Rating.length > 0
        ? item.Rating[0].overall || 0
        : 0,
    locations_visited:
      Array.isArray(item.SubmissionLocation) &&
      item.SubmissionLocation.length > 0
        ? item.SubmissionLocation.map((sl) => {
            if (sl && sl.Location) {
              // Check if Location is an array and get the first element if so
              const location = Array.isArray(sl.Location)
                ? sl.Location[0]
                : sl.Location;
              return location?.name || "Unknown";
            }
            return "Unknown";
          })
        : ["No location data"],
    wouldRecommend: item.wouldRecommend || false,
    patientType: item.patientType,
    userType: item.userType,
    visitTime: item.visitTime,
  }));

  return result;
}

// Fetch location visit data
export async function getLocationVisits(): Promise<LocationVisit[]> {
  const { data, error } = await supabase.from("SubmissionLocation").select(`
      locationId,
      Location!inner (name)
    `);

  if (error || !data) {
    console.error("Error fetching location visits:", error);
    return [];
  }

  // Count occurrences of each location
  const locationCounts: Record<string, { name: string; count: number }> = {};

  data.forEach((item) => {
    const locationId = String(item.locationId || "");

    // Safe access to nested properties
    let locationName = "Unknown";
    if (item && item.Location) {
      // Check if Location is an array and get the first element if so
      const location = Array.isArray(item.Location)
        ? item.Location[0]
        : item.Location;
      locationName = String(location?.name || "Unknown");
    }

    if (!locationCounts[locationId]) {
      locationCounts[locationId] = { name: locationName, count: 0 };
    }

    locationCounts[locationId].count++;
  });

  return Object.values(locationCounts).map((loc) => ({
    location: loc.name,
    visit_count: loc.count,
  }));
}

// Fetch the department ratings
export async function getDepartmentRatings(): Promise<DepartmentRating[]> {
  try {
    // Join Locations with Ratings to get department ratings
    const { data, error } = await supabase.from("Rating").select(`
        id, 
        overall,
        locationId,
        Location(id, name)
      `);

    if (error) {
      console.error("Error fetching department ratings:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by location
    const locationSatisfaction: Record<
      string,
      {
        locationName: string;
        ratings: { rating: string; count: number }[];
      }
    > = {};

    data.forEach((rating) => {
      // Skip ratings without location data
      if (!rating.Location || !rating.locationId) return;

      // Get location name - safely extract name with type checking
      let locationName = "Unknown Location";
      try {
        if (rating.Location) {
          // Handle both object and array cases
          const locObj = Array.isArray(rating.Location)
            ? rating.Location[0]
            : rating.Location;

          locationName =
            locObj && typeof locObj === "object" && "name" in locObj
              ? String(locObj.name)
              : "Unknown Location";
        }
      } catch (e) {
        console.error("Error extracting location name:", e);
      }

      // Create location entry if it doesn't exist
      if (!locationSatisfaction[rating.locationId]) {
        locationSatisfaction[rating.locationId] = {
          locationName: locationName || "Unknown Location",
          ratings: [],
        };
      }

      // Convert rating to standard format
      let ratingValue = 3; // Default

      // Handle text ratings
      if (typeof rating.overall === "string") {
        switch (rating.overall.toLowerCase()) {
          case "excellent":
            ratingValue = 5;
            break;
          case "very good":
            ratingValue = 4;
            break;
          case "good":
            ratingValue = 3;
            break;
          case "fair":
            ratingValue = 2;
            break;
          case "poor":
            ratingValue = 1;
            break;
          default:
            ratingValue = 3;
        }
      }
      // Handle numeric ratings
      else if (typeof rating.overall === "number") {
        ratingValue = Math.round(rating.overall);
      }

      // Ensure rating is within valid range
      if (ratingValue < 1 || ratingValue > 5) {
        ratingValue = 3;
      }

      // Find if this rating already exists
      const ratingKey = String(ratingValue);
      const existingRating = locationSatisfaction[
        rating.locationId
      ].ratings.find((r) => r.rating === ratingKey);

      if (existingRating) {
        existingRating.count++;
      } else {
        locationSatisfaction[rating.locationId].ratings.push({
          rating: ratingKey,
          count: 1,
        });
      }
    });

    // Convert to departmentRatings format
    const departmentRatings: DepartmentRating[] = [];

    Object.values(locationSatisfaction).forEach((location) => {
      location.ratings.forEach((ratingInfo) => {
        departmentRatings.push({
          locationName: location.locationName,
          category: "overall",
          rating: ratingInfo.rating,
          count: ratingInfo.count,
        });
      });
    });

    return departmentRatings;
  } catch (e) {
    console.error("Exception in department ratings:", e);
    return [];
  }
}

// Fetch overall satisfaction distribution
export async function fetchOverallSatisfactionDistribution(): Promise<
  SatisfactionDistribution[]
> {
  try {
    // Use a simple direct query to get ratings
    const { data, error } = await supabase.from("Rating").select("overall");

    if (error) {
      console.error("Error fetching satisfaction distribution:", error);
      return [];
    }

    if (!data || data.length === 0) {
      // No data available, return empty array
      return [];
    }

    // Count ratings by level (1-5)
    // Initialize with 0 values to ensure we have data for all ratings
    const ratingCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

    data.forEach((item) => {
      if (!item.overall) return;

      let ratingValue = 3; // Default to middle rating

      // Handle text ratings
      if (typeof item.overall === "string") {
        switch (item.overall.toLowerCase()) {
          case "excellent":
            ratingValue = 5;
            break;
          case "very good":
            ratingValue = 4;
            break;
          case "good":
            ratingValue = 3;
            break;
          case "fair":
            ratingValue = 2;
            break;
          case "poor":
            ratingValue = 1;
            break;
          default:
            ratingValue = 3; // Default to middle rating
        }
      }
      // Handle numeric ratings
      else if (typeof item.overall === "number") {
        ratingValue = Math.round(item.overall);
      }

      // Ensure rating is within range
      if (ratingValue >= 1 && ratingValue <= 5) {
        const ratingKey = String(ratingValue) as "1" | "2" | "3" | "4" | "5";
        ratingCounts[ratingKey]++;
      }
    });

    // Create dataset with all 5 rating levels, even if some have 0 counts
    return [
      { name: "5", value: ratingCounts["5"] }, // Excellent
      { name: "4", value: ratingCounts["4"] }, // Very Good
      { name: "3", value: ratingCounts["3"] }, // Good
      { name: "2", value: ratingCounts["2"] }, // Fair
      { name: "1", value: ratingCounts["1"] }, // Poor
    ];
  } catch (e) {
    console.error("Exception in satisfaction distribution:", e);
    return [];
  }
}

// Fix the count function to use the correct Supabase API
export async function getTotalSubmissionCount(): Promise<number> {
  const { data, error, count } = await supabase
    .from("SurveySubmission")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching total submission count:", error);
    return 0;
  }

  return count || 0;
}
