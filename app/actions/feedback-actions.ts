"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for feedback analysis
export interface Recommendation {
  submissionId: string;
  submittedAt: string;
  recommendation: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
}

export interface NotRecommendReason {
  submissionId: string;
  submittedAt: string;
  reason: string;
  visitPurpose: string;
  patientType: string;
  locations: string[];
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
 * Fetch recommendations from survey submissions
 */
export async function fetchRecommendations(): Promise<Recommendation[]> {
  try {
    // Get submissions with recommendations
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
      .order("submittedAt", { ascending: false });

    if (error) throw error;

    // Map the data to the expected format
    const recommendations = (data || []).map((submission) => ({
      submissionId: submission.id,
      submittedAt: submission.submittedAt,
      recommendation: submission.recommendation || "",
      visitPurpose: submission.visitPurpose || "",
      patientType: submission.patientType || "",
      userType: submission.userType || "",
    }));

    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

/**
 * Fetch reasons why patients would not recommend the hospital
 */
export async function fetchNotRecommendReasons(): Promise<
  NotRecommendReason[]
> {
  try {
    // Get submissions where patient would not recommend and provided a reason
    const { data: submissions, error: submissionsError } = await supabase
      .from("SurveySubmission")
      .select(
        `
        id,
        submittedAt,
        whyNotRecommend,
        visitPurpose,
        patientType,
        userType,
        SubmissionLocation (
          locationId,
          Location (
            id,
            name
          )
        )
      `
      )
      .eq("wouldRecommend", false)
      .not("whyNotRecommend", "is", null)
      .order("submittedAt", { ascending: false });

    if (submissionsError) throw submissionsError;

    // Map the data to the expected format
    const reasons = (submissions || []).map((submission) => {
      // Extract locations from submission
      const locations = submission.SubmissionLocation
        ? submission.SubmissionLocation.filter(
            (sl: any) => sl.Location && sl.Location.name
          ).map((sl: any) => sl.Location.name)
        : [];

      return {
        submissionId: submission.id,
        submittedAt: submission.submittedAt,
        reason: submission.whyNotRecommend || "",
        visitPurpose: submission.visitPurpose || "",
        patientType: submission.patientType || "",
        locations,
      };
    });

    return reasons;
  } catch (error) {
    console.error("Error fetching not recommend reasons:", error);
    return [];
  }
}

/**
 * Fetch department concerns from survey submissions
 */
export async function fetchDepartmentConcerns(): Promise<DepartmentConcern[]> {
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

    // Combine the data
    const concerns = concernsData.map((concern) => {
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

    return concerns;
  } catch (error) {
    console.error("Error fetching department concerns:", error);
    return [];
  }
}

/**
 * Get counts of different feedback types
 */
export async function getFeedbackCounts(): Promise<{
  concernsCount: number;
  recommendationsCount: number;
  notRecommendCount: number;
}> {
  try {
    // Get counts for each feedback type
    const [concernsCount, recommendationsCount, notRecommendCount] =
      await Promise.all([
        supabase
          .from("DepartmentConcern")
          .select("*", { count: "exact", head: true })
          .then((res) => res.count || 0),
        supabase
          .from("SurveySubmission")
          .select("*", { count: "exact", head: true })
          .not("recommendation", "is", null)
          .then((res) => res.count || 0),
        supabase
          .from("SurveySubmission")
          .select("*", { count: "exact", head: true })
          .eq("wouldRecommend", false)
          .not("whyNotRecommend", "is", null)
          .then((res) => res.count || 0),
      ]);

    return {
      concernsCount,
      recommendationsCount,
      notRecommendCount,
    };
  } catch (error) {
    console.error("Error fetching feedback counts:", error);
    return {
      concernsCount: 0,
      recommendationsCount: 0,
      notRecommendCount: 0,
    };
  }
}

/**
 * Get unique locations from all feedback
 */
export async function getAllFeedbackLocations(): Promise<string[]> {
  try {
    // Get locations from department concerns
    const { data: concernLocations, error: concernsError } =
      await supabase.from("DepartmentConcern").select(`
        locationId,
        Location:locationId (
          name
        )
      `);

    if (concernsError) throw concernsError;

    // Get locations from submissions where patient would not recommend
    const { data: submissionLocations, error: submissionsError } =
      await supabase
        .from("SubmissionLocation")
        .select(
          `
        locationId,
        Location:locationId (
          name
        ),
        submission:submissionId (
          wouldRecommend,
          whyNotRecommend
        )
      `
        )
        .not("submission.whyNotRecommend", "is", null)
        .eq("submission.wouldRecommend", false);

    if (submissionsError) throw submissionsError;

    // Extract location names
    const locationNames = new Set<string>();

    // Add concern locations
    concernLocations?.forEach((item: any) => {
      if (
        item.Location &&
        typeof item.Location === "object" &&
        "name" in item.Location
      ) {
        locationNames.add(item.Location.name as string);
      }
    });

    // Add submission locations
    submissionLocations?.forEach((item: any) => {
      if (
        item.Location &&
        typeof item.Location === "object" &&
        "name" in item.Location
      ) {
        locationNames.add(item.Location.name as string);
      }
    });

    return Array.from(locationNames).sort();
  } catch (error) {
    console.error("Error fetching feedback locations:", error);
    return [];
  }
}

/**
 * Filter feedback based on search criteria
 */
export async function searchFeedback(
  searchQuery: string,
  locationFilter: string,
  feedbackType: "concerns" | "recommendations" | "not-recommend" | "all"
): Promise<{
  concerns: DepartmentConcern[];
  recommendations: Recommendation[];
  notRecommendReasons: NotRecommendReason[];
}> {
  try {
    const [concerns, recommendations, notRecommendReasons] = await Promise.all([
      feedbackType === "concerns" || feedbackType === "all"
        ? fetchDepartmentConcerns()
        : Promise.resolve([]),
      feedbackType === "recommendations" || feedbackType === "all"
        ? fetchRecommendations()
        : Promise.resolve([]),
      feedbackType === "not-recommend" || feedbackType === "all"
        ? fetchNotRecommendReasons()
        : Promise.resolve([]),
    ]);

    // Filter concerns based on search criteria
    const filteredConcerns =
      feedbackType === "concerns" || feedbackType === "all"
        ? concerns.filter(
            (concern) =>
              (locationFilter === "all" ||
                concern.locationName === locationFilter) &&
              (!searchQuery.trim() ||
                concern.concern
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                concern.locationName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                concern.userType
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()))
          )
        : [];

    // Filter recommendations based on search criteria
    const filteredRecommendations =
      feedbackType === "recommendations" || feedbackType === "all"
        ? recommendations.filter(
            (rec) =>
              !searchQuery.trim() ||
              rec.recommendation
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              rec.userType?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    // Filter notRecommendReasons based on search criteria
    const filteredReasons =
      feedbackType === "not-recommend" || feedbackType === "all"
        ? notRecommendReasons.filter(
            (reason) =>
              (locationFilter === "all" ||
                reason.locations?.includes(locationFilter)) &&
              (!searchQuery.trim() ||
                reason.reason
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                reason.locations?.some((loc) =>
                  loc.toLowerCase().includes(searchQuery.toLowerCase())
                ))
          )
        : [];

    return {
      concerns: filteredConcerns,
      recommendations: filteredRecommendations,
      notRecommendReasons: filteredReasons,
    };
  } catch (error) {
    console.error("Error searching feedback:", error);
    return {
      concerns: [],
      recommendations: [],
      notRecommendReasons: [],
    };
  }
}
