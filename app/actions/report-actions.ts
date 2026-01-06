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

// Get recommendation rate
export async function getRecommendationRate(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select("wouldRecommend")
      .not("wouldRecommend", "is", null);

    if (error) {
      console.error("Error fetching recommendation rate:", error);
      return 0;
    }

    if (!data || data.length === 0) return 0;

    const recommendCount = data.filter((item) => item.wouldRecommend).length;
    return (recommendCount / data.length) * 100;
  } catch (error) {
    console.error("Error in getRecommendationRate:", error);
    return 0;
  }
}

// Get average satisfaction
export async function getAverageSatisfaction(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("Rating")
      .select("overall")
      .not("overall", "is", null);

    if (error) {
      console.error("Error fetching average satisfaction:", error);
      return "N/A";
    }

    if (!data || data.length === 0) return "N/A";

    // Convert ratings to numbers
    const ratings = data.map((item) => {
      const rating = item.overall?.toLowerCase();
      switch (rating) {
        case "excellent": return 5;
        case "very good": return 4;
        case "good": return 3;
        case "fair": return 2;
        case "poor": return 1;
        default: return 3;
      }
    });

    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    // Convert back to text
    if (average >= 4.5) return "Excellent";
    if (average >= 3.5) return "Very Good";
    if (average >= 2.5) return "Good";
    if (average >= 1.5) return "Fair";
    return "Poor";
  } catch (error) {
    console.error("Error in getAverageSatisfaction:", error);
    return "N/A";
  }
}

// Get satisfaction by location
export async function getSatisfactionByLocation(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("Rating")
      .select("locationId, overall, Location!inner(name)");

    if (error) {
      console.error("Error fetching satisfaction by location:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Group by location
    const locationRatings: Record<string, { total: number; count: number; name: string }> = {};

    data.forEach((rating) => {
      if (!rating.overall || !rating.Location) return;

      const locationId = rating.locationId.toString();
      if (!locationRatings[locationId]) {
        locationRatings[locationId] = {
          total: 0,
          count: 0,
          name: (rating.Location as any)?.name || 'Unknown',
        };
      }

      // Convert rating to number
      const ratingValue = convertRatingToNumber(rating.overall);
      locationRatings[locationId].total += ratingValue;
      locationRatings[locationId].count += 1;
    });

    return Object.entries(locationRatings).map(([locationId, data]) => ({
      locationId: parseInt(locationId),
      name: data.name,
      satisfaction: data.count > 0 ? data.total / data.count : 0,
      count: data.count,
    }));
  } catch (error) {
    console.error("Error in getSatisfactionByLocation:", error);
    return [];
  }
}

// Helper function to convert rating text to number
function convertRatingToNumber(rating: string): number {
  const ratingLower = rating?.toLowerCase();
  switch (ratingLower) {
    case "excellent": return 5;
    case "very good": return 4;
    case "good": return 3;
    case "fair": return 2;
    case "poor": return 1;
    default: return 3;
  }
}

// Get Net Promoter Score (NPS)
export async function getNPS(): Promise<{
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
}> {
  try {
    const { data, error } = await supabase
      .from("Rating")
      .select("npsRating")
      .not("npsRating", "is", null);

    if (error) {
      console.error("Error fetching NPS data:", error);
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    if (!data || data.length === 0) {
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    // Categorize responses based on NPS methodology
    let promoters = 0;
    let passives = 0;
    let detractors = 0;

    data.forEach((item) => {
      const rating = item.npsRating;
      if (rating >= 9) {
        promoters++;
      } else if (rating >= 7) {
        passives++;
      } else {
        detractors++;
      }
    });

    const total = data.length;
    const promoterPercentage = (promoters / total) * 100;
    const detractorPercentage = (detractors / total) * 100;
    const npsScore = promoterPercentage - detractorPercentage;
    // Convert from -100 to +100 range to 0% to 100% range
    const npsPercentage = (npsScore + 100) / 2;

    return {
      score: Math.round(npsPercentage),
      promoters,
      passives,
      detractors,
      total,
    };
  } catch (error) {
    console.error("Error in getNPS:", error);
    return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
  }
}

// Get Net Promoter Score (NPS) for specific location
export async function getNPSByLocation(locationId: number | string): Promise<{
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
}> {
  try {
    const { data, error } = await supabase
      .from("Rating")
      .select("npsRating")
      .eq("locationId", locationId)
      .not("npsRating", "is", null);

    if (error) {
      console.error("Error fetching NPS data for location:", error);
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    if (!data || data.length === 0) {
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    // Categorize responses based on NPS methodology
    let promoters = 0;
    let passives = 0;
    let detractors = 0;

    data.forEach((item) => {
      const rating = item.npsRating;
      if (rating >= 9) {
        promoters++;
      } else if (rating >= 7) {
        passives++;
      } else {
        detractors++;
      }
    });

    const total = data.length;
    const promoterPercentage = (promoters / total) * 100;
    const detractorPercentage = (detractors / total) * 100;
    const npsScore = promoterPercentage - detractorPercentage;
    // Convert from -100 to +100 range to 0% to 100% range
    const npsPercentage = (npsScore + 100) / 2;

    return {
      score: Math.round(npsPercentage),
      promoters,
      passives,
      detractors,
      total,
    };
  } catch (error) {
    console.error("Error in getNPSByLocation:", error);
    return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
  }
}

// Get Net Promoter Score (NPS) for multiple locations by type
export async function getNPSByLocationType(locationType: string): Promise<{
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
}> {
  try {
    const { data, error } = await supabase
      .from("Rating")
      .select(`
        npsRating,
        Location!inner(locationType)
      `)
      .eq("Location.locationType", locationType)
      .not("npsRating", "is", null);

    if (error) {
      console.error("Error fetching NPS data for location type:", error);
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    if (!data || data.length === 0) {
      return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
    }

    // Categorize responses based on NPS methodology
    let promoters = 0;
    let passives = 0;
    let detractors = 0;

    data.forEach((item) => {
      const rating = item.npsRating;
      if (rating >= 9) {
        promoters++;
      } else if (rating >= 7) {
        passives++;
      } else {
        detractors++;
      }
    });

    const total = data.length;
    const promoterPercentage = (promoters / total) * 100;
    const detractorPercentage = (detractors / total) * 100;
    const npsScore = promoterPercentage - detractorPercentage;
    // Convert from -100 to +100 range to 0% to 100% range
    const npsPercentage = (npsScore + 100) / 2;

    return {
      score: Math.round(npsPercentage),
      promoters,
      passives,
      detractors,
      total,
    };
  } catch (error) {
    console.error("Error in getNPSByLocationType:", error);
    return { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
  }
}
