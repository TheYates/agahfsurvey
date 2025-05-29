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
  concern: string;
  submittedAt: string;
  userType: string;
}

// Interface for recommendations
export interface Recommendation {
  submissionId: string;
  recommendation: string;
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
 */
export async function fetchWards() {
  const supabase = createServerClient();

  try {
    // Get all locations that are wards
    const { data: locations, error: locationsError } = await supabase
      .from("Location")
      .select("*")
      .eq("locationType", "ward");

    if (locationsError) {
      console.error("Error fetching ward locations:", locationsError);
      return [];
    }

    if (!locations || locations.length === 0) {
      return [];
    }

    // Create result array to hold ward data
    const wardsData: Ward[] = [];

    // For each location, get its ratings and submission counts
    for (const location of locations) {
      // Get submissions for this location
      const { data: submissionLocations, error: submissionsError } =
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
          .eq("locationId", location.id);

      if (submissionsError) {
        console.error(
          `Error fetching submissions for location ${location.id}:`,
          submissionsError
        );
        continue;
      }

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

    // If we have no real data, provide fallback data
    if (
      wardsData.length === 0 ||
      wardsData.every((ward) => ward.visitCount === 0)
    ) {
      return getFallbackWardData();
    }

    // Return actual data without fallbacks
    return wardsData;
  } catch (error) {
    console.error("Error in fetchWards:", error);
    return getFallbackWardData();
  }
}

/**
 * Fetches concerns specifically related to wards
 */
export async function fetchWardConcerns(): Promise<WardConcern[]> {
  const supabase = createServerClient();

  try {
    // Get all ward concerns with related data - directly query DepartmentConcern table without filtering by ward IDs first
    const { data, error } = await supabase.from("DepartmentConcern").select(`
      id,
      concern,
      locationId,
      submissionId,
      Location:locationId (
        id,
        name,
        locationType
      ),
      Submission:submissionId (
        id,
        submittedAt,
        visitPurpose,
        patientType,
        userType
      )
    `);

    if (error) {
      console.error("Error fetching department concerns:", error);
      return [];
    }

    // Filter to only include concerns where Location.locationType is 'ward'
    const wardConcerns = data
      .filter((item) => {
        const location = item.Location as any;
        return location && location.locationType === "ward";
      })
      .map((concern) => {
        // Extract submission data with type assertions
        const submission = concern.Submission as any;
        const location = concern.Location as any;

        return {
          submissionId: concern.submissionId,
          submittedAt: submission?.submittedAt || new Date().toISOString(),
          locationName: location?.name || "Unknown Ward",
          concern: concern.concern,
          visitPurpose: submission?.visitPurpose || "Unknown",
          patientType: submission?.patientType || "Unknown",
          userType: submission?.userType || "Anonymous",
        };
      });

    // Just return the real concerns, no fallback data
    return wardConcerns;
  } catch (error) {
    console.error("Error in fetchWardConcerns:", error);
    return [];
  }
}

/**
 * Fetches recommendations that are related to wards
 */
export async function fetchWardRecommendations(): Promise<Recommendation[]> {
  const supabase = createServerClient();

  try {
    // First get all ward locations to match recommendations against
    const { data: wards, error: wardsError } = await supabase
      .from("Location")
      .select("id, name")
      .eq("locationType", "ward");

    if (wardsError) {
      console.error("Error fetching ward locations:", wardsError);
      return [];
    }

    if (!wards || wards.length === 0) {
      return [];
    }

    // Create a list of ward names for text matching
    const wardNames = wards.map((ward) => ward.name.toLowerCase());
    const wardIds = wards.map((ward) => ward.id);

    // Find all submissions linked to ward locations through SubmissionLocation
    const { data: wardSubmissions, error: locationsError } = await supabase
      .from("SubmissionLocation")
      .select(
        `
        submissionId
      `
      )
      .in("locationId", wardIds);

    if (locationsError) {
      console.error("Error fetching submissions for wards:", locationsError);
    }

    // Create a set of submission IDs that are linked to wards for faster lookup
    const wardSubmissionIds = new Set();
    if (wardSubmissions && wardSubmissions.length > 0) {
      wardSubmissions.forEach((sl) => wardSubmissionIds.add(sl.submissionId));
    }

    // Fetch all recommendations from survey submissions
    const { data: recommendations, error: recsError } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        submittedAt,
        recommendation,
        userType
      `
      )
      .not("recommendation", "is", null)
      .not("recommendation", "eq", "");

    if (recsError) {
      console.error("Error fetching recommendations:", recsError);
      return [];
    }

    // Filter recommendations to those that specifically:
    // 1. Mention a ward name in the recommendation text, OR
    // 2. Are from submissions explicitly linked to ward locations
    const wardRecommendations = recommendations
      .filter((rec) => {
        // Check if the recommendation text mentions a ward name
        const mentionsWard =
          rec.recommendation &&
          wardNames.some((name) =>
            rec.recommendation.toLowerCase().includes(name)
          );

        // Check if the submission is linked to a ward
        const isLinkedToWard = wardSubmissionIds.has(rec.id);

        // Only include recommendations that either mention a ward or are from ward submissions
        return mentionsWard || isLinkedToWard;
      })
      .map((rec) => ({
        submissionId: rec.id,
        recommendation: rec.recommendation,
        submittedAt: rec.submittedAt,
        userType: rec.userType || "Anonymous",
      }));

    return wardRecommendations;
  } catch (error) {
    console.error("Error in fetchWardRecommendations:", error);
    return [];
  }
}

/**
 * Fetches data for the entire ward tab
 */
export async function fetchWardTabData() {
  const wards = await fetchWards();
  const concerns = await fetchWardConcerns();
  const recommendations = await fetchWardRecommendations();

  return {
    wards,
    concerns,
    recommendations,
  };
}

/**
 * Fetches all survey submissions for trend analysis
 */
export async function fetchAllSurveyData(): Promise<SurveySubmission[]> {
  const supabase = createServerClient();

  try {
    // Get all survey submissions with ratings
    const { data, error } = await supabase.from("SurveySubmission").select(`
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
      `);

    if (error) {
      console.error("Error fetching survey data:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchAllSurveyData:", error);
    return [];
  }
}

// Fallback data functions
function getFallbackWardData(): Ward[] {
  return [
    {
      id: "ward-1",
      name: "Medical Ward",
      type: "ward",
      visitCount: 42,
      satisfaction: 4.2,
      recommendRate: 88,
      ratings: {
        reception: 4.1,
        professionalism: 4.3,
        understanding: 4.0,
        "promptness-care": 3.9,
        "promptness-feedback": 3.8,
        overall: 4.2,
        admission: 4.1,
        "nurse-professionalism": 4.3,
        "doctor-professionalism": 4.0,
        "food-quality": 3.9,
        discharge: 4.2,
      },
      capacity: 30,
      occupancy: 24,
    },
    {
      id: "ward-2",
      name: "Surgical Ward",
      type: "ward",
      visitCount: 38,
      satisfaction: 4.5,
      recommendRate: 92,
      ratings: {
        reception: 4.3,
        professionalism: 4.7,
        understanding: 4.4,
        "promptness-care": 4.6,
        "promptness-feedback": 4.2,
        overall: 4.5,
        admission: 4.3,
        "nurse-professionalism": 4.7,
        "doctor-professionalism": 4.4,
        "food-quality": 4.6,
        discharge: 4.5,
      },
      capacity: 25,
      occupancy: 22,
    },
    {
      id: "ward-3",
      name: "Pediatric Ward",
      type: "ward",
      visitCount: 29,
      satisfaction: 4.7,
      recommendRate: 95,
      ratings: {
        reception: 4.6,
        professionalism: 4.8,
        understanding: 4.7,
        "promptness-care": 4.5,
        "promptness-feedback": 4.4,
        overall: 4.7,
        admission: 4.6,
        "nurse-professionalism": 4.8,
        "doctor-professionalism": 4.7,
        "food-quality": 4.5,
        discharge: 4.7,
      },
      capacity: 20,
      occupancy: 15,
    },
    {
      id: "ward-4",
      name: "Maternity Ward",
      type: "ward",
      visitCount: 31,
      satisfaction: 4.4,
      recommendRate: 90,
      ratings: {
        reception: 4.3,
        professionalism: 4.5,
        understanding: 4.4,
        "promptness-care": 4.2,
        "promptness-feedback": 4.1,
        overall: 4.4,
        admission: 4.3,
        "nurse-professionalism": 4.5,
        "doctor-professionalism": 4.4,
        "food-quality": 4.2,
        discharge: 4.4,
      },
      capacity: 18,
      occupancy: 14,
    },
    {
      id: "ward-5",
      name: "Intensive Care Unit",
      type: "ward",
      visitCount: 18,
      satisfaction: 4.6,
      recommendRate: 91,
      ratings: {
        reception: 4.4,
        professionalism: 4.8,
        understanding: 4.5,
        "promptness-care": 4.7,
        "promptness-feedback": 4.3,
        overall: 4.6,
        admission: 4.4,
        "nurse-professionalism": 4.8,
        "doctor-professionalism": 4.5,
        "food-quality": 4.7,
        discharge: 4.6,
      },
      capacity: 12,
      occupancy: 10,
    },
  ];
}
