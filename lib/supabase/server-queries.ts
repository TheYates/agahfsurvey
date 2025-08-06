import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  getSurveyStats,
  getSurveySubmissionsQuery,
  getDepartmentRatingsQuery,
  getLocationVisitsQuery,
  getServicePointFeedbackQuery,
  getServicePointsQuery,
  getWardRatingsQuery,
  getCanteenRatingsQuery,
  getOccupationalHealthRatingsQuery,
  getServicePoints,
  getSatisfactionByDemographic,
  getVisitTimeAnalysis,
  getTopImprovementAreas,
  getServicePointFeedbackStats,
  getServicePointFeedbackItems,
} from "./queries";

// Create a Supabase client for server-side operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Export server-side functions that use the service role client
export async function getServerSurveyStats() {
  return getSurveyStats(supabase);
}

export async function getServerSurveySubmissions() {
  return getSurveySubmissionsQuery(supabase);
}

export async function getServerDepartmentRatings() {
  return getDepartmentRatingsQuery(supabase);
}

export async function getServerLocationVisits() {
  return getLocationVisitsQuery(supabase);
}

export async function getServerServicePointFeedback() {
  return getServicePointFeedbackQuery(supabase);
}

export async function getServerServicePoints() {
  return getServicePointsQuery(supabase);
}

export async function getServerWardRatings() {
  return getWardRatingsQuery(supabase);
}

export async function getServerCanteenRatings() {
  return getCanteenRatingsQuery(supabase);
}

export async function getServerOccupationalHealthRatings() {
  return getOccupationalHealthRatingsQuery(supabase);
}

export async function getServerServicePointsList() {
  return getServicePoints(supabase);
}

export async function getServerSatisfactionByDemographic() {
  return getSatisfactionByDemographic(supabase);
}

export async function getServerVisitTimeAnalysis() {
  return getVisitTimeAnalysis(supabase);
}

export async function getServerTopImprovementAreas() {
  return getTopImprovementAreas(supabase);
}

export async function getServerServicePointFeedbackStats(timeRange = "all", servicePointId = "all") {
  return getServicePointFeedbackStats(supabase, timeRange, servicePointId);
}

export async function getServerServicePointFeedbackItems(timeRange = "all", servicePointId = "all", limit = 50) {
  return getServicePointFeedbackItems(supabase, timeRange, servicePointId, limit);
}

// Export the supabase client for other server-side operations
export { supabase as serverSupabase };
