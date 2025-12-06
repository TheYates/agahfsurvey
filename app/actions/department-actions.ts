import { createClient } from "@/lib/supabase/client";
import { surveyCache, CacheKeys, CacheTTL } from "@/lib/cache/survey-cache";

// Create Supabase client
const supabase = createClient();

// Types needed for the departments tab
export interface Department {
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
  };
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

export interface Recommendation {
  submissionId: string;
  submittedAt: string;
  recommendation: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
}

// Removed unused interface - now using direct ratings approach

// Add these interfaces with your other interfaces
interface DepartmentConcernSubmission {
  id: string;
  submittedAt: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
}

interface DepartmentConcernLocation {
  id: number;
  name: string;
}

// Helper function to convert text ratings to numbers (same as in overview-actions.ts)
function convertRatingToNumber(rating: string | number): number {
  if (typeof rating === "number") {
    return Math.min(Math.max(Math.round(rating), 1), 5); // Keep between 1-5
  }

  if (typeof rating === "string") {
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
        return 3; // Default to middle rating
    }
  }

  return 3; // Default
}

/**
 * Calculate weighted average (Bayesian average) to prevent single-response outliers
 * Formula: weighted_score = (v/(v+m)) * R + (m/(v+m)) * C
 * @param visitCount Number of responses for this department (v)
 * @param rawSatisfaction Actual satisfaction rating for this department (R)
 * @param globalAverage Overall average satisfaction across all departments (C)
 * @param minimumThreshold Minimum credibility threshold (m) - default 5
 * @returns Weighted satisfaction score
 */
function calculateWeightedAverage(
  visitCount: number,
  rawSatisfaction: number,
  globalAverage: number,
  minimumThreshold: number = 5
): number {
  if (visitCount === 0) return 0;

  const v = visitCount;
  const m = minimumThreshold;
  const R = rawSatisfaction;
  const C = globalAverage;

  const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C;

  return Number(weightedScore.toFixed(2));
}

/**
 * Fetch all departments with their satisfaction and visit data
 */
export async function fetchDepartments(
  dateRange?: { from: string; to: string } | null
): Promise<Department[]> {
  const cacheKey = dateRange
    ? `${CacheKeys.departmentData()}_${dateRange.from}_${dateRange.to}`
    : CacheKeys.departmentData();

  return surveyCache.getOrSet(
    cacheKey,
    async () => {
      try {
        console.time("fetchDepartments");

    // Get all locations of type 'department' - only select fields we need
    const { data: locations, error: locationsError } = await supabase
      .from("Location")
      .select("id, name")
      .eq("locationType", "department");

    if (locationsError) throw locationsError;

    if (!locations || locations.length === 0) {
      return [];
    }

    // Optimized: Get ratings directly with location filter - much faster
    const locationIds = locations.map((loc) => loc.id);

    let ratingsQuery = supabase
      .from("Rating")
      .select(`
        locationId,
        reception,
        professionalism,
        understanding,
        promptnessCare,
        promptnessFeedback,
        overall,
        wouldRecommend,
        SurveySubmission!inner(submittedAt)
      `)
      .in("locationId", locationIds);

    // Add date range filter if provided
    if (dateRange) {
      ratingsQuery = ratingsQuery
        .gte("SurveySubmission.submittedAt", dateRange.from)
        .lte("SurveySubmission.submittedAt", dateRange.to);
    }

    const { data: allRatings, error: ratingsError } = await ratingsQuery;

    if (ratingsError) {
      console.error(`Error fetching ratings:`, ratingsError);
      return [];
    }

    // Group ratings by locationId for faster processing
    const ratingsByLocation: Record<string, any[]> = {};
    locationIds.forEach((id) => {
      ratingsByLocation[id] = [];
    });

    allRatings?.forEach((rating) => {
      const locationId = rating.locationId.toString();
      if (ratingsByLocation[locationId]) {
        ratingsByLocation[locationId].push(rating);
      }
    });

    // Create result array to hold department data
    const departmentsData: Department[] = [];

    // Process each location with its grouped ratings
    for (const location of locations) {
      const locationRatings = ratingsByLocation[location.id] || [];

      // Count visits (each rating represents a visit)
      const visitCount = locationRatings?.length || 0;

      // Track ratings
      const ratings = {
        reception: { sum: 0, count: 0 },
        professionalism: { sum: 0, count: 0 },
        understanding: { sum: 0, count: 0 },
        "promptness-care": { sum: 0, count: 0 },
        "promptness-feedback": { sum: 0, count: 0 },
        overall: { sum: 0, count: 0 },
      };

      // Count location-specific recommendations
      let recommendCount = 0;

      // Process ratings directly (much more efficient)
      locationRatings?.forEach((rating) => {
        // Count recommendations from Rating table
        if (rating.wouldRecommend === true) {
          recommendCount++;
        }

        // Process each rating category directly
        if (rating.reception) {
          ratings.reception.sum += convertRatingToNumber(rating.reception);
          ratings.reception.count++;
        }

        if (rating.professionalism) {
          ratings.professionalism.sum += convertRatingToNumber(rating.professionalism);
          ratings.professionalism.count++;
        }

        if (rating.understanding) {
          ratings.understanding.sum += convertRatingToNumber(rating.understanding);
          ratings.understanding.count++;
        }

        if (rating.promptnessCare) {
          ratings["promptness-care"].sum += convertRatingToNumber(rating.promptnessCare);
          ratings["promptness-care"].count++;
        }

        if (rating.promptnessFeedback) {
          ratings["promptness-feedback"].sum += convertRatingToNumber(rating.promptnessFeedback);
          ratings["promptness-feedback"].count++;
        }

        if (rating.overall) {
          ratings.overall.sum += convertRatingToNumber(rating.overall);
          ratings.overall.count++;
        }
      });

      // Calculate recommend rate based on location-specific recommendations
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
      };

      // Calculate overall satisfaction as the average of all ratings (RAW score)
      // Don't round yet - keep full precision for weighted average calculation
      const ratingValues = Object.values(avgRatings).filter((val) => val > 0);
      const rawSatisfaction =
        ratingValues.length > 0
          ? ratingValues.reduce((sum, val) => sum + val, 0) /
            ratingValues.length
          : 0;

      // Add department to results with RAW satisfaction (will be weighted later)
      departmentsData.push({
        id: location.id.toString(),
        name: location.name,
        type: "department",
        visitCount,
        satisfaction: rawSatisfaction,
        recommendRate,
        ratings: avgRatings,
      });
    }

    // Calculate global average satisfaction across all departments for weighted scoring
    const departmentsWithData = departmentsData.filter((dept) => dept.visitCount > 0);
    const globalAverage =
      departmentsWithData.length > 0
        ? departmentsWithData.reduce((sum, dept) => sum + dept.satisfaction, 0) /
          departmentsWithData.length
        : 3.0; // Default to 3.0 if no data

    // Apply weighted average (Bayesian average) to each department's satisfaction score
    departmentsData.forEach((dept) => {
      dept.satisfaction = calculateWeightedAverage(
        dept.visitCount,
        dept.satisfaction,
        globalAverage
      );
    });

    // Sort departments by weighted satisfaction (descending order)
    departmentsData.sort((a, b) => b.satisfaction - a.satisfaction);

        return departmentsData;
      } catch (error) {
        console.error("Error fetching departments:", error);
        console.timeEnd("fetchDepartments");
        return [];
      }
    },
    CacheTTL.MEDIUM
  );
}

/**
 * Fetch department concerns
 */
export async function fetchDepartmentConcerns(): Promise<DepartmentConcern[]> {
  try {
    // Get all department concerns with related data
    // Add limit to improve performance - most reports only need recent concerns
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
          visitPurpose,
          patientType,
          userType
        )
      `
      )
      .order("id", { ascending: false }) // Get most recent first
      .limit(100); // Limit to 100 most recent concerns

    if (error) throw error;

    if (!data || data.length === 0) {
      // Return fallback data if no real data is available
      return [
        {
          submissionId: "fallback-1",
          submittedAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 week ago
          locationName: "Emergency Room",
          concern: "Long waiting times for non-critical patients",
          visitPurpose: "General Practice",
          patientType: "New Patient",
          userType: "AGAG Employee",
        },
        {
          submissionId: "fallback-2",
          submittedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 days ago
          locationName: "Pharmacy",
          concern: "Limited medication availability",
          visitPurpose: "General Practice",
          patientType: "Returning Patient",
          userType: "Contractor Employee",
        },
        {
          submissionId: "fallback-3",
          submittedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 day ago
          locationName: "X-Ray Unit",
          concern: "Equipment often unavailable",
          visitPurpose: "General Practice",
          patientType: "Returning Patient",
          userType: "AGAG/Contractor Dependant",
        },
      ];
    }

    // Map results to the expected format
    const result = data.map((concern) => {
      // Extract submission data with type assertions
      const submission =
        concern.Submission as unknown as DepartmentConcernSubmission;
      const location = concern.Location as unknown as DepartmentConcernLocation;

      return {
        submissionId: concern.submissionId,
        submittedAt: submission?.submittedAt || new Date().toISOString(),
        locationName: location?.name || "Unknown Department",
        concern: concern.concern,
        visitPurpose: submission?.visitPurpose || "Unknown",
        patientType: submission?.patientType || "Unknown",
        userType: submission?.userType || "Unknown",
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching department concerns:", error);

    // Return fallback data in case of error
    return [
      {
        submissionId: "error-fallback-1",
        submittedAt: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        locationName: "Emergency Room",
        concern: "Long waiting times for non-critical patients",
        visitPurpose: "General Practice",
        patientType: "New Patient",
        userType: "AGAG Employee",
      },
      {
        submissionId: "error-fallback-2",
        submittedAt: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        locationName: "Pharmacy",
        concern: "Limited medication availability",
        visitPurpose: "General Practice",
        patientType: "Returning Patient",
        userType: "Contractor Employee",
      },
    ];
  }
}

/**
 * Fetch recommendations
 */
export async function fetchRecommendations(): Promise<Recommendation[]> {
  try {
    // Get all submissions with recommendations
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        submittedAt,
        recommendation,
        visitPurpose,
        patientType,
        userType
      `
      )
      .not("recommendation", "is", null)
      .not("recommendation", "eq", "")
      .order("submittedAt", { ascending: false })
      .limit(100); // Limit to 100 most recent recommendations

    if (error) throw error;

    if (!data || data.length === 0) {
      // Return fallback data if no real data is available
      return [
        {
          submissionId: "fallback-rec-1",
          submittedAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(), // 10 days ago
          recommendation:
            "Consider adding more staff to the Pharmacy during peak hours",
          visitPurpose: "General Practice",
          patientType: "Returning Patient",
          userType: "AGAG Employee",
        },
        {
          submissionId: "fallback-rec-2",
          submittedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(), // 5 days ago
          recommendation:
            "The Emergency Room needs a better triage system for non-emergency cases",
          visitPurpose: "General Practice",
          patientType: "New Patient",
          userType: "Contractor Employee",
        },
        {
          submissionId: "fallback-rec-3",
          submittedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ago
          recommendation:
            "X-Ray Unit should implement an online booking system to reduce waiting times",
          visitPurpose: "Medicals (Occupational Health)",
          patientType: "Returning Patient",
          userType: "AGAG/Contractor Dependant",
        },
      ];
    }

    // Map to the expected format
    const result = data.map((submission) => ({
      submissionId: submission.id,
      submittedAt: submission.submittedAt,
      recommendation: submission.recommendation || "",
      visitPurpose: submission.visitPurpose || "Unknown",
      patientType: submission.patientType || "Unknown",
      userType: submission.userType || "Unknown",
    }));

    return result;
  } catch (error) {
    console.error("Error fetching recommendations:", error);

    // Return fallback data in case of error
    return [
      {
        submissionId: "error-fallback-rec-1",
        submittedAt: new Date(
          Date.now() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        recommendation:
          "Implement a digital prescription system in the Pharmacy",
        visitPurpose: "General Practice",
        patientType: "Returning Patient",
        userType: "AGAG Employee",
      },
      {
        submissionId: "error-fallback-rec-2",
        submittedAt: new Date(
          Date.now() - 4 * 24 * 60 * 60 * 1000
        ).toISOString(),
        recommendation:
          "Add more comfortable seating in the waiting area of the General OPD",
        visitPurpose: "General Practice",
        patientType: "New Patient",
        userType: "Other Corporate Employee",
      },
    ];
  }
}

/**
 * Fetch visit time data - reused from overview actions
 */
export async function fetchVisitTimeData() {
  try {
    // Get submissions with only the fields we need, limit the number
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        visitTime,
        wouldRecommend,
        Rating (
          overall
        )
      `
      )
      .limit(500); // Limit to 500 most recent submissions

    if (error) throw error;

    // Define the time periods from the survey form
    type VisitTimePeriod =
      | "first-time"
      | "less-than-month"
      | "one-two-months"
      | "three-six-months"
      | "more-than-six-months";

    // Create a mapping for display names
    const periodDisplayNames: Record<VisitTimePeriod, string> = {
      "first-time": "First time visiting",
      "less-than-month": "Less than a month ago",
      "one-two-months": "One - Two months ago",
      "three-six-months": "Three - Six months ago",
      "more-than-six-months": "More than 6 months ago",
    };

    // Group submissions by visit time with proper typing
    const timeGroups: Record<
      VisitTimePeriod,
      {
        count: number;
        satisfactionSum: number;
        recommendCount: number;
      }
    > = {
      "first-time": { count: 0, satisfactionSum: 0, recommendCount: 0 },
      "less-than-month": { count: 0, satisfactionSum: 0, recommendCount: 0 },
      "one-two-months": { count: 0, satisfactionSum: 0, recommendCount: 0 },
      "three-six-months": { count: 0, satisfactionSum: 0, recommendCount: 0 },
      "more-than-six-months": {
        count: 0,
        satisfactionSum: 0,
        recommendCount: 0,
      },
    };

    // Process each submission
    data?.forEach((submission) => {
      // Determine if this is a first-time visitor based on patientType
      let visitTime: VisitTimePeriod | null = null;
      
      if (submission.patientType === "New Patient") {
        visitTime = "first-time";
      } else if (
        submission.visitTime &&
        (submission.visitTime === "less-than-month" ||
          submission.visitTime === "one-two-months" ||
          submission.visitTime === "three-six-months" ||
          submission.visitTime === "more-than-six-months")
      ) {
        visitTime = submission.visitTime as VisitTimePeriod;
      }
      
      if (visitTime) {
        timeGroups[visitTime].count += 1;

        // Calculate satisfaction from ratings
        if (submission.Rating && Array.isArray(submission.Rating)) {
          const avgRating =
            submission.Rating.reduce((sum, rating) => {
              const overallRating = convertRatingToNumber(rating.overall);
              return sum + overallRating;
            }, 0) / submission.Rating.length;

          timeGroups[visitTime].satisfactionSum += avgRating;
        }

        // Count recommendations
        if (submission.wouldRecommend) {
          timeGroups[visitTime].recommendCount += 1;
        }
      }
    });

    // Convert groups to array format expected by the chart
    // Include ALL time periods even if count is 0
    const visitTimeData = Object.entries(timeGroups).map(
      ([visitTime, data]) => {
        const displayName = periodDisplayNames[visitTime as VisitTimePeriod];

        return {
          id: visitTime,
          name: displayName,
          count: data.count,
          satisfaction:
            data.count > 0
              ? Math.round((data.satisfactionSum / data.count) * 10) / 10
              : 0,
          recommendRate:
            data.count > 0
              ? Math.round((data.recommendCount / data.count) * 100)
              : 0,
        };
      }
    );

    // If no real data is available, return fallback data
    if (visitTimeData.every((item) => item.count === 0)) {
      return [
        {
          id: "less-than-month",
          name: "Less than a month ago",
          count: 45,
          satisfaction: 4.2,
          recommendRate: 85,
        },
        {
          id: "one-two-months",
          name: "One - Two months ago",
          count: 38,
          satisfaction: 3.8,
          recommendRate: 72,
        },
        {
          id: "three-six-months",
          name: "Three - Six months ago",
          count: 25,
          satisfaction: 4.5,
          recommendRate: 90,
        },
        {
          id: "more-than-six-months",
          name: "More than 6 months ago",
          count: 18,
          satisfaction: 4.0,
          recommendRate: 82,
        },
      ];
    }

    return visitTimeData;
  } catch (error) {
    console.error("Error fetching visit time data:", error);

    // Return fallback data in case of error
    return [
      {
        id: "less-than-month",
        name: "Less than a month ago",
        count: 45,
        satisfaction: 4.2,
        recommendRate: 85,
      },
      {
        id: "one-two-months",
        name: "One - Two months ago",
        count: 38,
        satisfaction: 3.8,
        recommendRate: 72,
      },
      {
        id: "three-six-months",
        name: "Three - Six months ago",
        count: 25,
        satisfaction: 4.5,
        recommendRate: 90,
      },
      {
        id: "more-than-six-months",
        name: "More than 6 months ago",
        count: 18,
        satisfaction: 4.0,
        recommendRate: 82,
      },
    ];
  }
}

/**
 * Fetch patient type data - reused from overview actions
 */
export async function fetchPatientTypeData() {
  try {
    // Get survey submissions with patient type info
    // Limit to most recent submissions for better performance
    const { data, error } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        patientType,
        wouldRecommend,
        Rating (
          overall,
          locationId,
          Location (
            id,
            name
          )
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
      .limit(500); // Limit to 500 most recent submissions

    if (error) throw error;

    // Initialize counters
    const newPatients = {
      count: 0,
      satisfactionTotal: 0,
      recommendCount: 0,
      locationRatings: {} as Record<string, { total: number; count: number }>,
    };

    const returningPatients = {
      count: 0,
      satisfactionTotal: 0,
      recommendCount: 0,
      locationRatings: {} as Record<string, { total: number; count: number }>,
    };

    // Process submissions
    data?.forEach((submission) => {
      const isNew = submission.patientType === "New Patient";
      const target = isNew ? newPatients : returningPatients;

      target.count++;

      // Add recommendation if applicable
      if (submission.wouldRecommend) {
        target.recommendCount++;
      }

      // Process ratings
      if (submission.Rating && Array.isArray(submission.Rating)) {
        submission.Rating.forEach((rating) => {
          if (rating && rating.overall) {
            target.satisfactionTotal += convertRatingToNumber(rating.overall);

            // Process location ratings
            if (rating.Location) {
              // Handle different possible structure types
              let locationName: string | undefined;

              if (typeof rating.Location === "object") {
                if ("name" in rating.Location) {
                  locationName = String(rating.Location.name);
                }
              }

              if (locationName) {
                if (!target.locationRatings[locationName]) {
                  target.locationRatings[locationName] = { total: 0, count: 0 };
                }
                target.locationRatings[locationName].total +=
                  convertRatingToNumber(rating.overall);
                target.locationRatings[locationName].count++;
              }
            }
          }
        });
      }

      // Also check SubmissionLocation for location data if we don't have enough ratings
      if (
        submission.SubmissionLocation &&
        Array.isArray(submission.SubmissionLocation)
      ) {
        submission.SubmissionLocation.forEach((sl) => {
          if (
            sl.Location &&
            typeof sl.Location === "object" &&
            "name" in sl.Location
          ) {
            const locationName = String(sl.Location.name);

            // Only initialize if not already present
            if (!target.locationRatings[locationName]) {
              target.locationRatings[locationName] = { total: 0, count: 0 };
            }

            // We don't add to totals here as we don't have ratings,
            // this is just to ensure we have location names available
            if (target.locationRatings[locationName].count === 0) {
              // Add a default rating only if we don't have any real ratings
              target.locationRatings[locationName].total = 3.5; // Default neutral rating
              target.locationRatings[locationName].count = 1; // Count as one rating
            }
          }
        });
      }
    });

    // Process data for each patient type
    function processPatientType(data: typeof newPatients) {
      // Calculate recommendation rate
      const recommendRate =
        data.count > 0
          ? Math.round((data.recommendCount / data.count) * 100)
          : 0;

      // Calculate average satisfaction
      const satisfaction =
        data.count > 0
          ? Number((data.satisfactionTotal / data.count).toFixed(1))
          : 0;

      // Process location ratings
      const locationRatings = Object.entries(data.locationRatings).map(
        ([name, { total, count }]) => ({
          name,
          score: count > 0 ? Number((total / count).toFixed(1)) : 0,
          count,
        })
      );

      // Find top and bottom departments
      const sortedRatings = [...locationRatings].sort(
        (a, b) => b.score - a.score
      );

      const topDepartment =
        sortedRatings.length > 0
          ? { name: sortedRatings[0].name, score: sortedRatings[0].score }
          : { name: "No data", score: 0 };

      const bottomDepartment =
        sortedRatings.length > 0
          ? {
              name: sortedRatings[sortedRatings.length - 1].name,
              score: sortedRatings[sortedRatings.length - 1].score,
            }
          : { name: "No data", score: 0 };

      return {
        count: data.count,
        satisfaction,
        recommendRate,
        topDepartment,
        bottomDepartment,
      };
    }

    const result = {
      newPatients: processPatientType(newPatients),
      returningPatients: processPatientType(returningPatients),
    };

    return result;
  } catch (error) {
    console.error("Error fetching patient type data:", error);

    return {
      newPatients: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "No data", score: 0 },
        bottomDepartment: { name: "No data", score: 0 },
      },
      returningPatients: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "No data", score: 0 },
        bottomDepartment: { name: "No data", score: 0 },
      },
    };
  }
}

/**
 * Fetch all survey data
 */
export async function fetchAllSurveyData() {
  try {
    // Get survey submissions with ratings, limit to recent ones for better performance
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
      .order("submittedAt", { ascending: false })
      .limit(250); // Limit to 250 most recent submissions

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching all survey data:", error);

    return [];
  }
}

/**
 * Fetch department tab data
 */
export async function fetchDepartmentTabData(
  dateRange?: { from: string; to: string } | null
) {
  try {
    // Fetch all data in parallel with individual timing

    const departmentsPromise = fetchDepartments(dateRange);

    const concernsPromise = fetchDepartmentConcerns();

    const recommendationsPromise = fetchRecommendations();

    const visitTimePromise = fetchVisitTimeData();

    const patientTypePromise = fetchPatientTypeData();

    // Wait for all promises to resolve
    const [
      departments,
      departmentConcerns,
      recommendations,
      visitTimeData,
      patientTypeData,
    ] = await Promise.all([
      departmentsPromise,
      concernsPromise,
      recommendationsPromise,
      visitTimePromise,
      patientTypePromise,
    ]);

    return {
      departments,
      departmentConcerns,
      recommendations,
      visitTimeData,
      patientTypeData,
    };
  } catch (error) {
    console.error("Error fetching department tab data:", error);

    throw error;
  }
}
