"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Add interface for user type distribution
export interface UserTypeData {
  name: string;
  value: number;
}

// Add interface for location rating data
export interface LocationRating {
  name: string;
  rating: number;
}

// Update OccupationalHealthData interface to include userTypeDistribution
export interface OccupationalHealthData {
  name: string;
  satisfaction: number;
  visitCount: number;
  ratings: {
    reception: number;
    professionalism: number;
    understanding: number;
    "promptness-care": number;
    "promptness-feedback": number;
    overall: number;
    [key: string]: number;
  };
  userTypeDistribution?: UserTypeData[];
  topRatedLocations?: LocationRating[];
  lowestRatedLocations?: LocationRating[];
  userTypeInsight?: string;
}

export interface DepartmentConcern {
  submissionId: string;
  submittedAt: string;
  locationName: string;
  concern: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
}

/**
 * Fetch all survey data from the database
 * Can be filtered by location and date range
 */
export async function fetchAllSurveyData(): Promise<any[]> {
  try {
    // Query all submissions without filtering
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        submittedAt,
        recommendation,
        wouldRecommend,
        visitPurpose,
        patientType,
        userType,
        Rating (
          reception,
          professionalism, 
          understanding,
          promptnessCare,
          promptnessFeedback,
          overall
        )
      `
      )
      .order("submittedAt", { ascending: false });

    if (error) throw error;

    // Map the data to return
    const mappedData = (data || []).map((s) => ({
      submissionId: s.id,
      submittedAt: s.submittedAt,
      recommendation: s.recommendation || "",
      visitPurpose: s.visitPurpose,
      patientType: s.patientType,
      userType: s.userType,
      wouldRecommend: s.wouldRecommend,
      satisfaction:
        s.Rating && s.Rating.length > 0 ? parseRating(s.Rating[0].overall) : 0,
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    return [];
  }
}

/**
 * Parse rating value from various formats
 */
function parseRating(value: any): number {
  if (typeof value === "number") {
    return Math.min(5, Math.max(1, value)); // Ensure between 1-5
  }

  if (typeof value === "string") {
    // Try to parse numeric string
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return Math.min(5, Math.max(1, numValue));
    }

    // Handle text ratings
    switch (value.toLowerCase()) {
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
        return 3;
    }
  }

  return 3; // Default to middle rating
}

/**
 * Fetch department concerns related to occupational health
 */
export async function fetchOccupationalHealthConcerns(): Promise<
  DepartmentConcern[]
> {
  try {
    // First, we need to get the concerns with their IDs
    const { data: concernsData, error: concernsError } = await supabase
      .from("DepartmentConcern")
      .select(
        `
        id,
        submissionId,
        locationId,
        createdAt,
        concern
      `
      )
      .order("createdAt", { ascending: false });

    if (concernsError) throw concernsError;
    if (!concernsData || concernsData.length === 0) return [];

    // Then get the submission data
    const submissionIds = [...new Set(concernsData.map((c) => c.submissionId))];
    const { data: submissionsData, error: submissionsError } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        userType,
        visitPurpose,
        patientType
      `
      )
      .in("id", submissionIds);

    if (submissionsError) throw submissionsError;

    // Get location data
    const locationIds = [
      ...new Set(concernsData.map((c) => c.locationId).filter(Boolean)),
    ];
    const { data: locationsData, error: locationsError } =
      locationIds.length > 0
        ? await supabase
            .from("Location")
            .select(
              `
              id,
              name
            `
            )
            .in("id", locationIds)
        : { data: [], error: null };

    if (locationsError) throw locationsError;

    // Create lookup maps
    const submissionMap = new Map(submissionsData?.map((s) => [s.id, s]) || []);
    const locationMap = new Map(locationsData?.map((l) => [l.id, l]) || []);

    // Combine the data and filter for OH only
    const allConcerns = concernsData.map((concern) => {
      const submission = submissionMap.get(concern.submissionId);
      const location = locationMap.get(concern.locationId);

      return {
        submissionId: concern.submissionId || "",
        submittedAt: concern.createdAt || new Date().toISOString(),
        locationName: location?.name || "Unknown Location",
        concern: concern.concern || "",
        userType: submission?.userType || "Unknown",
        visitPurpose: submission?.visitPurpose || "Unknown",
        patientType: submission?.patientType || "Unknown",
      };
    });

    // Filter concerns related to occupational health
    return allConcerns.filter(
      (concern) =>
        concern.visitPurpose === "Medicals (Occupational Health)" ||
        concern.locationName.toLowerCase().includes("occupational") ||
        concern.locationName.toLowerCase().includes("medical") ||
        concern.concern.toLowerCase().includes("occupational health") ||
        concern.concern.toLowerCase().includes("medical check")
    );
  } catch (error) {
    console.error("Error fetching occupational health concerns:", error);
    return [];
  }
}

/**
 * Fetch occupational health data including ratings, top/lowest locations,
 * and user type distribution
 */
export async function fetchOccupationalHealthData(): Promise<{
  ohData: OccupationalHealthData | null;
  ohConcerns: DepartmentConcern[];
}> {
  try {
    // Get all submissions with occupational health visit purpose
    const { data: ohSubmissions, error: ohError } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        submittedAt,
        userType,
        visitPurpose,
        patientType,
        wouldRecommend,
        Rating (
          locationId,
          reception,
          professionalism,
          understanding,
          promptnessCare,
          promptnessFeedback,
          overall
        ),
        SubmissionLocation (
          locationId,
          Location (
            id,
            name
          )
        )
      `
      )
      .eq("visitPurpose", "Medicals (Occupational Health)");

    if (ohError) throw ohError;

    // Get OH concerns
    const ohConcerns = await fetchOccupationalHealthConcerns();

    // If no data found, return null with empty concerns
    if (!ohSubmissions || ohSubmissions.length === 0) {
      return { ohData: null, ohConcerns };
    }

    // Calculate visit count
    const visitCount = ohSubmissions.length;

    // Track ratings by location
    const locationRatings: Record<string, { sum: number; count: number }> = {};

    // Calculate satisfaction from ratings
    let totalSatisfaction = 0;
    let totalRecommend = 0;
    let ratingCount = 0;

    // Initialize ratings object
    const aggregatedRatings: Record<string, number> = {
      reception: 0,
      professionalism: 0,
      understanding: 0,
      "promptness-care": 0,
      "promptness-feedback": 0,
      overall: 0,
    };

    const ratingCounts: Record<string, number> = {
      reception: 0,
      professionalism: 0,
      understanding: 0,
      "promptness-care": 0,
      "promptness-feedback": 0,
      overall: 0,
    };

    // Process each submission's ratings
    for (const submission of ohSubmissions) {
      // Calculate overall satisfaction
      if (submission.Rating && submission.Rating.length > 0) {
        // Average the overall ratings for this submission
        const submissionOverallRating =
          submission.Rating.reduce((sum, rating) => {
            // Convert string ratings to numbers (1-5 scale)
            const numericRating = parseRating(rating.overall);
            return sum + numericRating;
          }, 0) / submission.Rating.length;

        totalSatisfaction += submissionOverallRating;
        ratingCount++;

        // Track ratings by location
        if (
          submission.SubmissionLocation &&
          Array.isArray(submission.SubmissionLocation) &&
          submission.SubmissionLocation.length > 0
        ) {
          submission.SubmissionLocation.forEach((submissionLocation: any) => {
            if (
              submissionLocation.Location &&
              typeof submissionLocation.Location === "object" &&
              "name" in submissionLocation.Location
            ) {
              const locationName = submissionLocation.Location.name as string;

              // Initialize location in tracking if not exists
              if (!locationRatings[locationName]) {
                locationRatings[locationName] = { sum: 0, count: 0 };
              }

              // Add this submission's rating to the location
              locationRatings[locationName].sum += submissionOverallRating;
              locationRatings[locationName].count++;
            }
          });
        }
      }

      // Count recommendation
      if (submission.wouldRecommend) {
        totalRecommend++;
      }

      // Process detailed ratings
      if (submission.Rating) {
        for (const rating of submission.Rating) {
          const processRating = (field: string, value: any) => {
            if (!value) return; // Skip if null

            const numericValue = parseRating(value);

            if (numericValue > 0) {
              aggregatedRatings[field] =
                (aggregatedRatings[field] || 0) + numericValue;
              ratingCounts[field] = (ratingCounts[field] || 0) + 1;
            }
          };

          // Process each rating field
          processRating("reception", rating.reception);
          processRating("professionalism", rating.professionalism);
          processRating("understanding", rating.understanding);
          processRating("promptness-care", rating.promptnessCare);
          processRating("promptness-feedback", rating.promptnessFeedback);
          processRating("overall", rating.overall);
        }
      }
    }

    // Calculate averages for each rating category
    const finalRatings = {
      reception:
        ratingCounts.reception > 0
          ? aggregatedRatings.reception / ratingCounts.reception
          : 0,
      professionalism:
        ratingCounts.professionalism > 0
          ? aggregatedRatings.professionalism / ratingCounts.professionalism
          : 0,
      understanding:
        ratingCounts.understanding > 0
          ? aggregatedRatings.understanding / ratingCounts.understanding
          : 0,
      "promptness-care":
        ratingCounts["promptness-care"] > 0
          ? aggregatedRatings["promptness-care"] /
            ratingCounts["promptness-care"]
          : 0,
      "promptness-feedback":
        ratingCounts["promptness-feedback"] > 0
          ? aggregatedRatings["promptness-feedback"] /
            ratingCounts["promptness-feedback"]
          : 0,
      overall:
        ratingCounts.overall > 0
          ? aggregatedRatings.overall / ratingCounts.overall
          : 0,
    };

    // Calculate overall metrics
    const avgSatisfaction =
      ratingCount > 0 ? totalSatisfaction / ratingCount : 0;
    const recommendRate =
      visitCount > 0 ? (totalRecommend / visitCount) * 100 : 0;

    // Calculate average ratings per location and prepare top/lowest lists
    const locationAverages = Object.entries(locationRatings)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        rating: Number((data.sum / data.count).toFixed(1)),
      }))
      .filter((loc) => !loc.name.toLowerCase().includes("occupational health")); // Exclude the main OH unit itself

    // Sort by rating (descending for top, ascending for lowest)
    const topRatedLocations = [...locationAverages]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3); // Get top 3

    const lowestRatedLocations = [...locationAverages]
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3); // Get bottom 3

    // Calculate user type distribution
    const userTypeCounts: Record<string, number> = {};

    // Define default user types to ensure they all appear
    const defaultUserTypes = [
      "AGAG Employee",
      "AGAG/Contractor Dependant",
      "Other Corporate Employee",
      "Contractor Employee",
    ];

    // Initialize all default user types with 0
    defaultUserTypes.forEach((type) => {
      userTypeCounts[type] = 0;
    });

    // Count actual submissions by user type
    ohSubmissions.forEach((submission) => {
      if (submission.userType) {
        userTypeCounts[submission.userType] =
          (userTypeCounts[submission.userType] || 0) + 1;
      }
    });

    const userTypeDistribution = Object.entries(userTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Generate insight for user type distribution
    let userTypeInsight = "";
    if (userTypeDistribution.length > 0) {
      const topUserType = userTypeDistribution[0];
      const totalUsers = userTypeDistribution.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const topPercentage = ((topUserType.value / totalUsers) * 100).toFixed(1);

      userTypeInsight = `${topUserType.name} represents the largest group utilizing occupational health services at ${topPercentage}% of visits. This helps prioritize resources for this key demographic.`;
    }

    // Create occupational health data object
    const ohData: OccupationalHealthData = {
      name: "Occupational Health Unit (Medicals)",
      visitCount,
      satisfaction: avgSatisfaction,
      ratings: finalRatings,
      topRatedLocations,
      lowestRatedLocations,
      userTypeDistribution,
      userTypeInsight,
    };

    return {
      ohData,
      ohConcerns,
    };
  } catch (error) {
    console.error("Error fetching occupational health data:", error);
    return {
      ohData: null,
      ohConcerns: [],
    };
  }
}

/**
 * Get the count of submissions related to Occupational Health
 */
export async function getOccupationalHealthSubmissionCount(): Promise<number> {
  try {
    // Count submissions for Occupational Health
    const { count, error } = await supabase
      .from("SurveySubmission")
      .select("*", { count: "exact", head: true })
      .eq("visitPurpose", "Medicals (Occupational Health)");

    if (error) {
      console.error("Error counting OH submissions:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getOccupationalHealthSubmissionCount:", error);
    return 0;
  }
}
