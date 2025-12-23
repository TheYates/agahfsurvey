"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { surveyCache } from "@/lib/cache/survey-cache";

// Create a Supabase client for server actions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type SurveyFormData = {
  visitTime:
    | "less-than-month"
    | "one-two-months"
    | "three-six-months"
    | "more-than-six-months";
  visitPurpose: "General Practice" | "Medicals (Occupational Health)";
  primaryLocation: number;
  otherLocations?: number[];
  visitedOtherPlaces: boolean;
  departmentRatings: {
    locationId: number;
    ratings: {
      category: string;
      rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor";
    }[];
    concerns?: string;
  }[];
  generalObservations: {
    category: string;
    rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor";
  }[];
  wouldRecommend: boolean;
  whyNotRecommend?: string;
  recommendation?: string;
  userType:
    | "AGAG Employee"
    | "AGAG/Contractor Dependant"
    | "Other Corporate Employee"
    | "Contractor Employee";
  patientType: "New Patient" | "Returning Patient";
};

export async function submitSurvey(data: SurveyFormData) {
  try {
    // 1. Insert the main survey submission
    const { data: submission, error: submissionError } = await supabase
      .from("survey_submissions")
      .insert({
        visit_time: data.visitTime,
        visit_purpose: data.visitPurpose,
        visited_other_places: data.visitedOtherPlaces,
        would_recommend: data.wouldRecommend,
        why_not_recommend: data.whyNotRecommend || null,
        recommendation: data.recommendation || null,
        user_type: data.userType,
        patient_type: data.patientType,
      })
      .select("id")
      .single();

    if (submissionError) throw submissionError;

    const submissionId = submission.id;

    // 2. Insert primary location
    await supabase.from("submission_locations").insert({
      submission_id: submissionId,
      location_id: data.primaryLocation,
      is_primary: true,
    });

    // 3. Insert other locations if any
    if (data.otherLocations && data.otherLocations.length > 0) {
      const otherLocationsData = data.otherLocations.map((locationId) => ({
        submission_id: submissionId,
        location_id: locationId,
        is_primary: false,
      }));

      await supabase.from("submission_locations").insert(otherLocationsData);
    }

    // 4. Insert department ratings
    for (const dept of data.departmentRatings) {
      // Insert ratings
      const ratingsData = dept.ratings.map((rating) => ({
        submission_id: submissionId,
        location_id: dept.locationId,
        category: rating.category,
        rating: rating.rating,
      }));

      await supabase.from("department_ratings").insert(ratingsData);

      // Insert concerns if any
      if (dept.concerns && dept.concerns.trim()) {
        await supabase.from("department_concerns").insert({
          submission_id: submissionId,
          location_id: dept.locationId,
          concern: dept.concerns,
        });
      }
    }

    // 5. Insert general observations
    const observationsData = data.generalObservations.map((obs) => ({
      submission_id: submissionId,
      category: obs.category,
      rating: obs.rating,
    }));

    await supabase.from("general_observations").insert(observationsData);

    // Clear cache and revalidate the reports page to reflect new data
    surveyCache.clear();
    revalidatePath("/reports", "layout");
    revalidatePath("/submit");

    return { success: true, submissionId };
  } catch (error) {
    console.error("Error submitting survey:", error);
    return { success: false, error: "Failed to submit survey" };
  }
}

// Function to fetch all locations for the survey form
export async function getLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data;
}
