"use server";

import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Interfaces for Ward data
export interface Ward {
  id: string;
  name: string;
  type: string;
  visitCount: number;
  satisfaction: number;
  recommendRate: number;
  ratings: {
    reception: number;
    professionalism: number;
    understanding: number;
    "promptness-care": number;
    "promptness-feedback": number;
    overall: number;
    // Ward-specific ratings
    admission: number;
    "nurse-professionalism": number;
    "doctor-professionalism": number;
    "food-quality": number;
    discharge: number;
  };
  capacity?: number;
  occupancy?: number;
}

// Interface for ward concerns
export interface WardConcern {
  submissionId: string;
  locationName: string;
  concern: string; // Contains both concerns and recommendations
  submittedAt: string;
  userType: string;
}

// Interface for submission with ratings
interface SubmissionWithRatings {
  id: string;
  wouldRecommend: boolean;
  Rating: Array<{
    locationId: number;
    reception?: string;
    professionalism?: string;
    understanding?: string;
    promptnessCare?: string;
    promptnessFeedback?: string;
    overall?: string;
    // Ward-specific ratings
    admission?: string;
    nurseProfessionalism?: string;
    doctorProfessionalism?: string;
    foodQuality?: string;
    discharge?: string;
  }>;
}

// Interface for survey submission
export interface SurveySubmission {
  id: string;
  submittedAt: string;
  wouldRecommend?: boolean;
  Rating?: Array<{
    locationId: number;
    reception?: string;
    professionalism?: string;
    understanding?: string;
    promptnessCare?: string;
    promptnessFeedback?: string;
    overall?: string;
  }>;
}

// Convert text rating to numeric value
const ratingToValue = (rating: string): number => {
  switch (rating) {
    case "Excellent":
      return 5;
    case "Very Good":
      return 4;
    case "Good":
      return 3;
    case "Fair":
      return 2;
    case "Poor":
      return 1;
    default:
      return 0;
  }
};

/**
 * Fetches all wards with their satisfaction ratings
 * @param limit Optional limit on number of wards to return (for pagination)
 * @param offset Optional offset for pagination
 * @returns Object containing wards array and total count
 */
export async function fetchWards(
  limit: number = 5,
  offset: number = 0
): Promise<{ wards: Ward[]; total: number }> {
  const supabase = await createServerClient();

  try {
    console.time("fetchWards");

    // Get all locations that are wards - only select the fields we need
    // Comment out pagination to load all wards at once
    console.time("fetchWards:locations");
    const { data: locations, error: locationsError } = await supabase
      .from("Location")
      .select("id, name")
      .eq("locationType", "ward");
    // Comment out pagination
    //.range(offset, offset + limit - 1); // Apply range for pagination
    console.timeEnd("fetchWards:locations");

    if (locationsError) {
      console.error("Error fetching ward locations:", locationsError);
      console.timeEnd("fetchWards");
      return { wards: [], total: 0 };
    }

    if (!locations || locations.length === 0) {
      console.timeEnd("fetchWards");
      return { wards: [], total: 0 };
    }

    // Get count of total wards for pagination info
    const { count, error: countError } = await supabase
      .from("Location")
      .select("id", { count: "exact" })
      .eq("locationType", "ward");

    if (countError) {
      console.error("Error counting wards:", countError);
    }

    // Get ALL submissions for ALL wards in a SINGLE query
    console.time("fetchWards:submissions");
    const locationIds = locations.map((loc) => loc.id);

    const { data: allSubmissionLocations, error: submissionsError } =
      await supabase
        .from("SubmissionLocation")
        .select(
          `
        locationId,
        submission:submissionId (
          id,
          submittedAt,
          wouldRecommend,
          Rating (
            locationId,
            reception,
            professionalism,
            understanding,
            promptnessCare,
            promptnessFeedback,
            overall,
            admission,
            nurseProfessionalism,
            doctorProfessionalism,
            foodQuality,
            discharge
          )
        )
      `
        )
        .in("locationId", locationIds);
    console.timeEnd("fetchWards:submissions");

    if (submissionsError) {
      console.error(`Error fetching submissions:`, submissionsError);
      console.timeEnd("fetchWards");
      return { wards: [], total: count || 0 };
    }

    // Group submissions by locationId for faster processing
    console.time("fetchWards:process");

    console.time("fetchWards:process:grouping");
    const submissionsByLocation: Record<string, any[]> = {};
    locationIds.forEach((id) => {
      submissionsByLocation[id] = [];
    });

    allSubmissionLocations?.forEach((sl) => {
      if (submissionsByLocation[sl.locationId]) {
        submissionsByLocation[sl.locationId].push(sl);
      }
    });
    console.timeEnd("fetchWards:process:grouping");

    // Create result array to hold ward data
    const wardsData: Ward[] = [];

    // Process each location with its grouped submissions
    console.time("fetchWards:process:calculations");
    for (const location of locations) {
      const submissionLocations = submissionsByLocation[location.id] || [];

      // Count visits
      const visitCount = submissionLocations?.length || 0;

      // Count recommendations
      let recommendCount = 0;

      // Track ratings
      const ratings = {
        reception: { sum: 0, count: 0 },
        professionalism: { sum: 0, count: 0 },
        understanding: { sum: 0, count: 0 },
        "promptness-care": { sum: 0, count: 0 },
        "promptness-feedback": { sum: 0, count: 0 },
        overall: { sum: 0, count: 0 },
        // Ward-specific ratings
        admission: { sum: 0, count: 0 },
        "nurse-professionalism": { sum: 0, count: 0 },
        "doctor-professionalism": { sum: 0, count: 0 },
        "food-quality": { sum: 0, count: 0 },
        discharge: { sum: 0, count: 0 },
      };

      // Process submissions and ratings
      submissionLocations?.forEach((sl) => {
        // Count recommendations
        if (
          (sl.submission as unknown as SubmissionWithRatings)?.wouldRecommend
        ) {
          recommendCount++;
        }

        // Process ratings
        if (
          (sl.submission as unknown as SubmissionWithRatings)?.Rating &&
          Array.isArray(
            (sl.submission as unknown as SubmissionWithRatings).Rating
          )
        ) {
          (sl.submission as unknown as SubmissionWithRatings).Rating.forEach(
            (rating) => {
              // Only process ratings for this location
              if (rating.locationId === location.id) {
                // Process each rating category
                if (rating.reception) {
                  ratings.reception.sum += ratingToValue(rating.reception);
                  ratings.reception.count++;
                }

                if (rating.professionalism) {
                  ratings.professionalism.sum += ratingToValue(
                    rating.professionalism
                  );
                  ratings.professionalism.count++;
                }

                if (rating.understanding) {
                  ratings.understanding.sum += ratingToValue(
                    rating.understanding
                  );
                  ratings.understanding.count++;
                }

                if (rating.promptnessCare) {
                  ratings["promptness-care"].sum += ratingToValue(
                    rating.promptnessCare
                  );
                  ratings["promptness-care"].count++;
                }

                if (rating.promptnessFeedback) {
                  ratings["promptness-feedback"].sum += ratingToValue(
                    rating.promptnessFeedback
                  );
                  ratings["promptness-feedback"].count++;
                }

                if (rating.overall) {
                  ratings.overall.sum += ratingToValue(rating.overall);
                  ratings.overall.count++;
                }

                // Process ward-specific ratings
                if (rating.admission) {
                  ratings.admission.sum += ratingToValue(rating.admission);
                  ratings.admission.count++;
                }

                if (rating.nurseProfessionalism) {
                  ratings["nurse-professionalism"].sum += ratingToValue(
                    rating.nurseProfessionalism
                  );
                  ratings["nurse-professionalism"].count++;
                }

                if (rating.doctorProfessionalism) {
                  ratings["doctor-professionalism"].sum += ratingToValue(
                    rating.doctorProfessionalism
                  );
                  ratings["doctor-professionalism"].count++;
                }

                if (rating.foodQuality) {
                  ratings["food-quality"].sum += ratingToValue(
                    rating.foodQuality
                  );
                  ratings["food-quality"].count++;
                }

                if (rating.discharge) {
                  ratings.discharge.sum += ratingToValue(rating.discharge);
                  ratings.discharge.count++;
                }
              }
            }
          );
        }
      });

      // Calculate recommend rate
      const recommendRate =
        visitCount > 0 ? Math.round((recommendCount / visitCount) * 100) : 0;

      // Calculate average ratings
      console.time("fetchWards:process:averages");
      const avgRatings = {
        reception:
          ratings.reception.count > 0
            ? Number(
                (ratings.reception.sum / ratings.reception.count).toFixed(1)
              )
            : 0,
        professionalism:
          ratings.professionalism.count > 0
            ? Number(
                (
                  ratings.professionalism.sum / ratings.professionalism.count
                ).toFixed(1)
              )
            : 0,
        understanding:
          ratings.understanding.count > 0
            ? Number(
                (
                  ratings.understanding.sum / ratings.understanding.count
                ).toFixed(1)
              )
            : 0,
        "promptness-care":
          ratings["promptness-care"].count > 0
            ? Number(
                (
                  ratings["promptness-care"].sum /
                  ratings["promptness-care"].count
                ).toFixed(1)
              )
            : 0,
        "promptness-feedback":
          ratings["promptness-feedback"].count > 0
            ? Number(
                (
                  ratings["promptness-feedback"].sum /
                  ratings["promptness-feedback"].count
                ).toFixed(1)
              )
            : 0,
        overall:
          ratings.overall.count > 0
            ? Number((ratings.overall.sum / ratings.overall.count).toFixed(1))
            : 0,
        // Add ward-specific rating averages
        admission:
          ratings.admission.count > 0
            ? Number(
                (ratings.admission.sum / ratings.admission.count).toFixed(1)
              )
            : 0,
        "nurse-professionalism":
          ratings["nurse-professionalism"].count > 0
            ? Number(
                (
                  ratings["nurse-professionalism"].sum /
                  ratings["nurse-professionalism"].count
                ).toFixed(1)
              )
            : 0,
        "doctor-professionalism":
          ratings["doctor-professionalism"].count > 0
            ? Number(
                (
                  ratings["doctor-professionalism"].sum /
                  ratings["doctor-professionalism"].count
                ).toFixed(1)
              )
            : 0,
        "food-quality":
          ratings["food-quality"].count > 0
            ? Number(
                (
                  ratings["food-quality"].sum / ratings["food-quality"].count
                ).toFixed(1)
              )
            : 0,
        discharge:
          ratings.discharge.count > 0
            ? Number(
                (ratings.discharge.sum / ratings.discharge.count).toFixed(1)
              )
            : 0,
      };
      console.timeEnd("fetchWards:process:averages");

      // Calculate overall satisfaction as the average of all ratings
      const ratingValues = Object.values(avgRatings).filter((val) => val > 0);
      const overallSatisfaction =
        ratingValues.length > 0
          ? Number(
              (
                ratingValues.reduce((sum, val) => sum + val, 0) /
                ratingValues.length
              ).toFixed(1)
            )
          : 0;

      // Add mock capacity and occupancy for ward data
      const capacity = Math.floor(Math.random() * 30) + 10; // 10-40 beds
      const occupancy = Math.floor(Math.random() * (capacity - 3)) + 3; // 3 to capacity

      // Add ward to results
      wardsData.push({
        id: location.id,
        name: location.name,
        type: "ward",
        visitCount: visitCount,
        satisfaction: overallSatisfaction,
        recommendRate: recommendRate,
        ratings: avgRatings,
        capacity,
        occupancy,
      });
    }
    console.timeEnd("fetchWards:process:calculations");
    console.timeEnd("fetchWards:process");

    // If we have no real data, provide fallback data
    if (
      wardsData.length === 0 ||
      wardsData.every((ward) => ward.visitCount === 0)
    ) {
      console.timeEnd("fetchWards");
      const fallbackData = getFallbackWardData();
      return { wards: fallbackData, total: fallbackData.length };
    }

    // Return actual data without fallbacks
    console.timeEnd("fetchWards");
    return { wards: wardsData, total: count || 0 };
  } catch (error) {
    console.error("Error in fetchWards:", error);
    console.timeEnd("fetchWards:process:averages");
    console.timeEnd("fetchWards:process:calculations");
    console.timeEnd("fetchWards:process:grouping");
    console.timeEnd("fetchWards:process");
    console.timeEnd("fetchWards:submissions");
    console.timeEnd("fetchWards:locations");
    console.timeEnd("fetchWards");
    return { wards: [], total: 0 };
  }
}

/**
 * Fetches concerns specifically related to wards
 */
export async function fetchWardConcerns(): Promise<WardConcern[]> {
  const supabase = await createServerClient();

  try {
    console.time("fetchWardConcerns");

    // Get all ward locations first to use their IDs
    console.time("fetchWardConcerns:locations");
    const { data: wardLocations, error: locationsError } = await supabase
      .from("Location")
      .select("id")
      .eq("locationType", "ward");
    console.timeEnd("fetchWardConcerns:locations");

    if (locationsError) {
      console.error("Error fetching ward locations:", locationsError);
      console.timeEnd("fetchWardConcerns");
      return [];
    }

    // If no ward locations found, return empty array
    if (!wardLocations || wardLocations.length === 0) {
      console.timeEnd("fetchWardConcerns");
      return [];
    }

    // Extract the ward location IDs
    const wardLocationIds = wardLocations.map((loc) => loc.id);

    // Fetch concerns directly for these ward locations
    console.time("fetchWardConcerns:concerns");
    const { data, error } = await supabase
      .from("DepartmentConcern")
      .select(
        `
        id,
        concern,
        locationId,
        submissionId,
        Location:locationId (
          id,
          name
        ),
        Submission:submissionId (
          id,
          submittedAt,
          userType
        )
      `
      )
      .in("locationId", wardLocationIds)
      .order("id", { ascending: false })
      .limit(100); // Limit to 100 most recent concerns
    console.timeEnd("fetchWardConcerns:concerns");

    if (error) {
      console.error("Error fetching ward concerns:", error);
      console.timeEnd("fetchWardConcerns");
      return [];
    }

    // Map the concerns to the expected format
    console.time("fetchWardConcerns:mapping");
    const wardConcerns = data.map((concern) => {
      // Extract submission data with type assertions
      const submission = concern.Submission as any;
      const location = concern.Location as any;

      return {
        submissionId: concern.submissionId,
        submittedAt: submission?.submittedAt || new Date().toISOString(),
        locationName: location?.name || "Unknown Ward",
        concern: concern.concern,
        userType: submission?.userType || "Anonymous",
      };
    });
    console.timeEnd("fetchWardConcerns:mapping");

    // Just return the real concerns, no fallback data
    console.timeEnd("fetchWardConcerns");
    return wardConcerns;
  } catch (error) {
    console.error("Error in fetchWardConcerns:", error);
    console.timeEnd("fetchWardConcerns:mapping");
    console.timeEnd("fetchWardConcerns:concerns");
    console.timeEnd("fetchWardConcerns:locations");
    console.timeEnd("fetchWardConcerns");
    return [];
  }
}

/**
 * Fetches all survey submissions for trend analysis
 */
export async function fetchAllSurveyData(): Promise<SurveySubmission[]> {
  const supabase = await createServerClient();

  try {
    console.time("fetchAllSurveyData");

    // Get survey submissions with ratings, limited to the most recent ones
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id, 
        submittedAt,
        wouldRecommend,
        Rating (
          locationId,
          reception,
          professionalism,
          understanding,
          promptnessCare,
          promptnessFeedback,
          overall
        )
      `
      )
      .order("submittedAt", { ascending: false })
      .limit(250); // Limit to 250 most recent submissions

    if (error) {
      console.error("Error fetching survey data:", error);
      console.timeEnd("fetchAllSurveyData");
      return [];
    }

    console.timeEnd("fetchAllSurveyData");
    return data || [];
  } catch (error) {
    console.error("Error in fetchAllSurveyData:", error);
    console.timeEnd("fetchAllSurveyData");
    return [];
  }
}

/**
 * Fetches data for the entire ward tab
 * @param limit Optional limit on number of wards to return (for pagination)
 * @param offset Optional offset for pagination
 */
export async function fetchWardTabData(limit: number = 5, offset: number = 0) {
  try {
    console.time("fetchWardTabData:total");
    console.time("fetchWardTabData:init");

    // Prepare fetch promises for parallel execution
    console.time("fetchWardTabData:wards");
    console.log("Starting fetchWards...");
    // Comment out pagination for the test
    const wardsPromise = fetchWards(); // Remove pagination params

    console.time("fetchWardTabData:concerns");
    console.log("Starting fetchWardConcerns...");
    const concernsPromise = fetchWardConcerns();

    console.timeEnd("fetchWardTabData:init");

    // Wait for all promises to resolve with detailed timing for each
    console.time("fetchWardTabData:await");
    const [wardsData, concerns] = await Promise.all([
      wardsPromise.then((result) => {
        console.log(`fetchWards completed with ${result.wards.length} wards`);
        return result;
      }),
      concernsPromise.then((result) => {
        console.log(
          `fetchWardConcerns completed with ${result.length} concerns/recommendations`
        );
        return result;
      }),
    ]);
    console.timeEnd("fetchWardTabData:await");

    console.timeEnd("fetchWardTabData:wards");
    console.timeEnd("fetchWardTabData:concerns");

    console.time("fetchWardTabData:prepare-response");
    const result = {
      wards: wardsData.wards,
      concerns, // All feedback (concerns and recommendations) is in this array
      recommendations: [], // Empty array for backward compatibility
      pagination: {
        total: wardsData.total,
        limit,
        offset,
        hasMore: offset + wardsData.wards.length < wardsData.total,
      },
    };
    console.timeEnd("fetchWardTabData:prepare-response");

    console.timeEnd("fetchWardTabData:total");
    console.log(
      `fetchWardTabData completed with ${wardsData.wards.length} wards and ${concerns.length} feedback items`
    );
    return result;
  } catch (error) {
    console.error("Error fetching ward tab data:", error);
    console.timeEnd("fetchWardTabData:prepare-response");
    console.timeEnd("fetchWardTabData:await");
    console.timeEnd("fetchWardTabData:concerns");
    console.timeEnd("fetchWardTabData:wards");
    console.timeEnd("fetchWardTabData:init");
    console.timeEnd("fetchWardTabData:total");
    throw error;
  }
}

// Fallback data functions
function getFallbackWardData(): Ward[] {
  return [];
}
