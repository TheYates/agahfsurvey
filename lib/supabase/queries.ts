import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Create a Supabase client for server-side operations
// Add fallback values for development to prevent errors
const supabaseUrl =
  process.env.SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type SurveyStats = {
  totalSubmissions: number;
  recommendationRate: number;
  averageSatisfaction: number;
  submissionsByPurpose: {
    generalPractice: number;
    occupationalHealth: number;
  };
  submissionsByPatientType: {
    newPatient: number;
    returningPatient: number;
  };
  submissionsByUserType: Record<string, number>;
  topLocations: Array<{ name: string; count: number }>;
  satisfactionDistribution: Record<string, number>;
  monthlySubmissions: Array<{ month: string; count: number }>;
};

export type LocationVisits = {
  name: string;
  count: number;
  satisfaction: number;
};

export type DepartmentRating = {
  locationId: number;
  locationName: string;
  category: string;
  rating: string;
  count: number;
};

export type TextFeedback = {
  submissionId: string;
  submittedAt: string;
  locationName: string;
  concern: string;
  visitPurpose: string;
  patientType: string;
};

export type Recommendation = {
  submissionId: string;
  submittedAt: string;
  recommendation: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
};

export type NotRecommendReason = {
  submissionId: string;
  submittedAt: string;
  reason: string;
  visitPurpose: string;
  patientType: string;
  locations: string[];
};

export type DepartmentConcern = {
  submissionId: string;
  submittedAt: string;
  locationName: string;
  concern: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
};

export type MonthlyTrend = {
  month: string;
  satisfaction: number;
  recommendRate: number;
  submissions: number;
};

export type DemographicSatisfaction = {
  byUserType: Array<{
    userType: string;
    satisfaction: number;
    recommendRate: number;
    count: number;
  }>;
  byPatientType: Array<{
    patientType: string;
    satisfaction: number;
    recommendRate: number;
    count: number;
  }>;
};

export type VisitTimeAnalysis = Array<{
  visitTime: string;
  count: number;
  satisfaction: number;
  recommendRate: number;
}>;

export type ImprovementArea = {
  locationId: number;
  locationName: string;
  satisfaction: number;
  visitCount: number;
  impactScore: number;
  isQuickWin: boolean;
  isCritical: boolean;
};

export type ServicePointFeedbackStats = {
  totalFeedback: number;
  averageRating: number;
  responseRate: number;
  ratingDistribution: Array<{ name: string; value: number }>;
  servicePointPerformance: Array<{ name: string; rating: number }>;
  ratingTrends: Array<{ date: string; rating: number }>;
  servicePointComparison: Array<{
    name: string;
    excellent: number;
    good: number;
    neutral: number;
    poor: number;
    terrible: number;
  }>;
};

export type ServicePointFeedbackItem = {
  id: number;
  servicePointId: number;
  servicePointName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

// Survey data queries
export async function getSurveyDataQuery(supabase: SupabaseClient<Database>) {
  return await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false });
}

// Department ratings queries
export async function getDepartmentRatingsQueryUpdated(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("department_ratings")
    .select("*")
    .order("id", { ascending: false });
}

// Ward ratings queries
export async function getWardRatingsQuery(supabase: SupabaseClient<Database>) {
  return await supabase
    .from("ward_ratings")
    .select("*")
    .order("id", { ascending: false });
}

// Canteen ratings queries
export async function getCanteenRatingsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("canteen_ratings")
    .select("*")
    .order("id", { ascending: false });
}

// Occupational health ratings queries
export async function getOccupationalHealthRatingsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("occupational_health_ratings")
    .select("*")
    .order("id", { ascending: false });
}

// Department concerns queries
export async function getDepartmentConcernsQueryUpdated(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("department_concerns")
    .select("*")
    .order("created_at", { ascending: false });
}

// Service point feedback queries
export async function getServicePointFeedbackQueryUpdated(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("service_point_feedback")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getServicePointFeedbackByIdQuery(
  supabase: SupabaseClient<Database>,
  id: string
) {
  return await supabase
    .from("service_point_feedback")
    .select("*")
    .eq("service_point_id", id)
    .order("created_at", { ascending: false });
}

export async function getServicePointsQueryUpdated(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("service_points")
    .select("*")
    .order("name", { ascending: true });
}

export async function createServicePointQuery(
  supabase: SupabaseClient<Database>,
  data: { id: string; name: string; location: string; department: string }
) {
  return await supabase.from("service_points").insert([data]).select();
}

export async function submitServicePointFeedbackQuery(
  supabase: SupabaseClient<Database>,
  data: { service_point_id: string; rating: number; comment?: string }
) {
  return await supabase.from("service_point_feedback").insert([data]).select();
}

// Location visits query
export async function getLocationVisitsQueryUpdated(
  supabase: SupabaseClient<Database>
) {
  // This is a complex query that aggregates data from multiple tables
  // For simplicity, we'll use a SQL query
  return await supabase.rpc("get_location_visits");
}

// Overall satisfaction trend query
export async function getOverallSatisfactionTrendQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_satisfaction_trend");
}

// Patient type distribution query
export async function getPatientTypeDistributionQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_patient_type_distribution");
}

// Recommendation scores query
export async function getRecommendationScoresQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_recommendation_scores");
}

// Department performance query
export async function getDepartmentPerformanceQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_department_performance");
}

// Ward performance query
export async function getWardPerformanceQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_ward_performance");
}

// Comment sentiment query
export async function getCommentSentimentQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase.rpc("get_comment_sentiment");
}

// Top concerns query
export async function getTopConcernsQuery(supabase: SupabaseClient<Database>) {
  return await supabase.rpc("get_top_concerns");
}

// Recent surveys query
export async function getRecentSurveysQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("surveys")
    .select(
      "id, created_at, patient_type, overall_rating, recommendation_rating"
    )
    .order("created_at", { ascending: false })
    .limit(5);
}

// Get overall survey statistics
export async function getSurveyStats(): Promise<SurveyStats> {
  // Get total submissions
  const { count: totalSubmissions } = await supabase
    .from("survey_submissions")
    .select("*", { count: "exact", head: true });

  // Get recommendation rate
  const { data: recommendations } = await supabase
    .from("survey_submissions")
    .select("would_recommend");

  const recommendCount =
    recommendations?.filter((r) => r.would_recommend).length || 0;
  const recommendationRate = recommendations?.length
    ? (recommendCount / recommendations.length) * 100
    : 0;

  // Get submissions by purpose
  const { data: purposeData } = await supabase
    .from("survey_submissions")
    .select("visit_purpose");

  const generalPractice =
    purposeData?.filter((s) => s.visit_purpose === "General Practice").length ||
    0;
  const occupationalHealth =
    purposeData?.filter(
      (s) => s.visit_purpose === "Medicals (Occupational Health)"
    ).length || 0;

  // Get submissions by patient type
  const { data: patientTypeData } = await supabase
    .from("survey_submissions")
    .select("patient_type");

  const newPatient =
    patientTypeData?.filter((s) => s.patient_type === "New Patient").length ||
    0;
  const returningPatient =
    patientTypeData?.filter((s) => s.patient_type === "Returning Patient")
      .length || 0;

  // Get submissions by user type
  const { data: userTypeData } = await supabase
    .from("survey_submissions")
    .select("user_type");

  const userTypeCounts: Record<string, number> = {};
  userTypeData?.forEach((s) => {
    userTypeCounts[s.user_type] = (userTypeCounts[s.user_type] || 0) + 1;
  });

  // Get top locations
  const { data: locationData } = await supabase.from("submission_locations")
    .select(`
      location_id,
      locations (
        name
      )
    `);

  const locationCounts: Record<string, number> = {};
  locationData?.forEach((sl) => {
    const locationName = sl.locations?.name;
    if (locationName) {
      locationCounts[locationName] = (locationCounts[locationName] || 0) + 1;
    }
  });

  const topLocations = Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Get satisfaction distribution
  const { data: observationData } = await supabase
    .from("general_observations")
    .select("rating")
    .eq("category", "overall");

  const satisfactionDistribution: Record<string, number> = {
    Excellent: 0,
    "Very Good": 0,
    Good: 0,
    Fair: 0,
    Poor: 0,
  };

  observationData?.forEach((o) => {
    satisfactionDistribution[o.rating] =
      (satisfactionDistribution[o.rating] || 0) + 1;
  });

  // Calculate average satisfaction
  let totalScore = 0;
  let count = 0;
  observationData?.forEach((o) => {
    let score = 0;
    if (o.rating === "Excellent") score = 5;
    else if (o.rating === "Very Good") score = 4;
    else if (o.rating === "Good") score = 3;
    else if (o.rating === "Fair") score = 2;
    else if (o.rating === "Poor") score = 1;

    totalScore += score;
    count++;
  });

  const averageSatisfaction = count > 0 ? totalScore / count : 0;

  // Get monthly submissions
  const { data: submissionDates } = await supabase
    .from("survey_submissions")
    .select("submitted_at")
    .order("submitted_at", { ascending: false });

  // Group by month
  const monthlyData: Record<string, number> = {};
  submissionDates?.forEach((s) => {
    const date = new Date(s.submitted_at);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });

  // Convert to array and sort by date
  const monthlySubmissions = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalSubmissions: totalSubmissions || 0,
    recommendationRate,
    averageSatisfaction,
    submissionsByPurpose: {
      generalPractice,
      occupationalHealth,
    },
    submissionsByPatientType: {
      newPatient,
      returningPatient,
    },
    submissionsByUserType: userTypeCounts,
    topLocations,
    satisfactionDistribution,
    monthlySubmissions,
  };
}

// Get location visits with satisfaction ratings
export async function getLocationVisits(): Promise<LocationVisits[]> {
  // Get all locations with their visit counts
  const { data: locationData } = await supabase.from("submission_locations")
    .select(`
      location_id,
      locations (
        id,
        name
      )
    `);

  // Count visits per location
  const locationCounts: Record<number, { name: string; count: number }> = {};
  locationData?.forEach((sl) => {
    if (sl.locations) {
      const locationId = sl.locations.id;
      const locationName = sl.locations.name;

      if (!locationCounts[locationId]) {
        locationCounts[locationId] = { name: locationName, count: 0 };
      }

      locationCounts[locationId].count++;
    }
  });

  // Get satisfaction ratings for each location
  const { data: ratingData } = await supabase
    .from("department_ratings")
    .select(
      `
      location_id,
      category,
      rating
    `
    )
    .eq("category", "overall");

  // Calculate average satisfaction for each location
  const locationSatisfaction: Record<number, { total: number; count: number }> =
    {};
  ratingData?.forEach((r) => {
    if (!locationSatisfaction[r.location_id]) {
      locationSatisfaction[r.location_id] = { total: 0, count: 0 };
    }

    let score = 0;
    if (r.rating === "Excellent") score = 5;
    else if (r.rating === "Very Good") score = 4;
    else if (r.rating === "Good") score = 3;
    else if (r.rating === "Fair") score = 2;
    else if (r.rating === "Poor") score = 1;

    locationSatisfaction[r.location_id].total += score;
    locationSatisfaction[r.location_id].count++;
  });

  // Combine data
  return Object.entries(locationCounts)
    .map(([locationId, { name, count }]) => {
      const id = Number.parseInt(locationId);
      const satisfactionData = locationSatisfaction[id] || {
        total: 0,
        count: 0,
      };
      const satisfaction =
        satisfactionData.count > 0
          ? satisfactionData.total / satisfactionData.count
          : 0;

      return {
        name,
        count,
        satisfaction,
      };
    })
    .sort((a, b) => b.count - a.count);
}

// Get department ratings
export async function getDepartmentRatings(): Promise<DepartmentRating[]> {
  const { data } = await supabase.from("department_ratings").select(`
      location_id,
      locations (
        name
      ),
      category,
      rating
    `);

  // Group and count ratings
  const ratingCounts: Record<
    string,
    Record<string, Record<string, number>>
  > = {};

  data?.forEach((r) => {
    const locationName = r.locations?.name || "Unknown";
    const category = r.category;
    const rating = r.rating;

    if (!ratingCounts[locationName]) {
      ratingCounts[locationName] = {};
    }

    if (!ratingCounts[locationName][category]) {
      ratingCounts[locationName][category] = {};
    }

    ratingCounts[locationName][category][rating] =
      (ratingCounts[locationName][category][rating] || 0) + 1;
  });

  // Convert to array format
  const result: DepartmentRating[] = [];

  Object.entries(ratingCounts).forEach(([locationName, categories]) => {
    Object.entries(categories).forEach(([category, ratings]) => {
      Object.entries(ratings).forEach(([rating, count]) => {
        result.push({
          locationId:
            data?.find((r) => r.locations?.name === locationName)
              ?.location_id || 0,
          locationName,
          category,
          rating,
          count,
        });
      });
    });
  });

  return result;
}

// Get text feedback (department concerns)
export async function getTextFeedback(): Promise<TextFeedback[]> {
  const { data } = await supabase
    .from("department_concerns")
    .select(
      `
      submission_id,
      survey_submissions (
        submitted_at,
        visit_purpose,
        patient_type
      ),
      location_id,
      locations (
        name
      ),
      concern
    `
    )
    .order("submission_id", { ascending: false })
    .limit(50);

  return (
    data?.map((d) => ({
      submissionId: d.submission_id,
      submittedAt: d.survey_submissions?.submitted_at || "",
      locationName: d.locations?.name || "Unknown",
      concern: d.concern,
      visitPurpose: d.survey_submissions?.visit_purpose || "Unknown",
      patientType: d.survey_submissions?.patient_type || "Unknown",
    })) || []
  );
}

// Get recommendations
export async function getRecommendations(): Promise<Recommendation[]> {
  const { data } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      submitted_at,
      recommendation,
      visit_purpose,
      patient_type,
      user_type
    `
    )
    .not("recommendation", "is", null)
    .not("recommendation", "eq", "")
    .order("submitted_at", { ascending: false })
    .limit(50);

  return (
    data?.map((d) => ({
      submissionId: d.id,
      submittedAt: d.submitted_at,
      recommendation: d.recommendation || "",
      visitPurpose: d.visit_purpose,
      patientType: d.patient_type,
      userType: d.user_type,
    })) || []
  );
}

// Get reasons for not recommending
export async function getNotRecommendReasons(): Promise<NotRecommendReason[]> {
  const { data } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      submitted_at,
      why_not_recommend,
      visit_purpose,
      patient_type,
      submission_locations (
        locations (
          name
        )
      )
    `
    )
    .eq("would_recommend", false)
    .not("why_not_recommend", "is", null)
    .not("why_not_recommend", "eq", "")
    .order("submitted_at", { ascending: false });

  return (
    data?.map((d) => ({
      submissionId: d.id,
      submittedAt: d.submitted_at,
      reason: d.why_not_recommend || "",
      visitPurpose: d.visit_purpose,
      patientType: d.patient_type,
      locations:
        d.submission_locations?.map((sl) => sl.locations?.name || "Unknown") ||
        [],
    })) || []
  );
}

// Get department concerns (more detailed than text feedback)
export async function getDepartmentConcerns(): Promise<DepartmentConcern[]> {
  const { data } = await supabase
    .from("department_concerns")
    .select(
      `
      submission_id,
      survey_submissions (
        submitted_at,
        visit_purpose,
        patient_type,
        user_type
      ),
      location_id,
      locations (
        name
      ),
      concern
    `
    )
    .order("submission_id", { ascending: false })
    .limit(100);

  return (
    data?.map((d) => ({
      submissionId: d.submission_id,
      submittedAt: d.survey_submissions?.submitted_at || "",
      locationName: d.locations?.name || "Unknown",
      concern: d.concern,
      visitPurpose: d.survey_submissions?.visit_purpose || "Unknown",
      patientType: d.survey_submissions?.patient_type || "Unknown",
      userType: d.survey_submissions?.user_type || "Unknown",
    })) || []
  );
}

// Get monthly trends for satisfaction and recommendation rates
export async function getMonthlyTrends(): Promise<
  Record<string, MonthlyTrend>
> {
  // Get all submissions with their dates
  const { data: submissions } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      submitted_at,
      would_recommend
    `
    )
    .order("submitted_at", { ascending: true });

  // Get all overall satisfaction ratings
  const { data: satisfactionData } = await supabase
    .from("general_observations")
    .select(
      `
      submission_id,
      rating,
      survey_submissions (
        submitted_at
      )
    `
    )
    .eq("category", "overall");

  // Group by month
  const monthlyData: Record<
    string,
    {
      submissions: number;
      recommendations: number;
      satisfactionTotal: number;
      satisfactionCount: number;
    }
  > = {};

  // Process submissions for recommendation rates
  submissions?.forEach((s) => {
    const date = new Date(s.submitted_at);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        submissions: 0,
        recommendations: 0,
        satisfactionTotal: 0,
        satisfactionCount: 0,
      };
    }

    monthlyData[monthYear].submissions++;
    if (s.would_recommend) {
      monthlyData[monthYear].recommendations++;
    }
  });

  // Process satisfaction ratings
  satisfactionData?.forEach((s) => {
    if (s.survey_submissions?.submitted_at) {
      const date = new Date(s.survey_submissions.submitted_at);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          submissions: 0,
          recommendations: 0,
          satisfactionTotal: 0,
          satisfactionCount: 0,
        };
      }

      let score = 0;
      if (s.rating === "Excellent") score = 5;
      else if (s.rating === "Very Good") score = 4;
      else if (s.rating === "Good") score = 3;
      else if (s.rating === "Fair") score = 2;
      else if (s.rating === "Poor") score = 1;

      monthlyData[monthYear].satisfactionTotal += score;
      monthlyData[monthYear].satisfactionCount++;
    }
  });

  // Calculate averages and rates
  const result: Record<string, MonthlyTrend> = {};

  Object.entries(monthlyData).forEach(([month, data]) => {
    const satisfaction =
      data.satisfactionCount > 0
        ? data.satisfactionTotal / data.satisfactionCount
        : 0;
    const recommendRate =
      data.submissions > 0
        ? (data.recommendations / data.submissions) * 100
        : 0;

    result[month] = {
      month,
      satisfaction,
      recommendRate,
      submissions: data.submissions,
    };
  });

  return result;
}

// Get satisfaction by demographic (user type, patient type)
export async function getSatisfactionByDemographic(): Promise<DemographicSatisfaction> {
  // Get user types with satisfaction and recommendation data
  const { data: userTypeData } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      user_type,
      would_recommend
    `
    )
    .order("user_type");

  // Get patient types with satisfaction and recommendation data
  const { data: patientTypeData } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      patient_type,
      would_recommend
    `
    )
    .order("patient_type");

  // Get satisfaction ratings
  const { data: satisfactionData } = await supabase
    .from("general_observations")
    .select(
      `
      submission_id,
      rating,
      survey_submissions (
        user_type,
        patient_type
      )
    `
    )
    .eq("category", "overall");

  // Process user type data
  const userTypeStats: Record<
    string,
    {
      count: number;
      recommendations: number;
      satisfactionTotal: number;
      satisfactionCount: number;
    }
  > = {};

  userTypeData?.forEach((u) => {
    if (!userTypeStats[u.user_type]) {
      userTypeStats[u.user_type] = {
        count: 0,
        recommendations: 0,
        satisfactionTotal: 0,
        satisfactionCount: 0,
      };
    }

    userTypeStats[u.user_type].count++;
    if (u.would_recommend) {
      userTypeStats[u.user_type].recommendations++;
    }
  });

  // Process patient type data
  const patientTypeStats: Record<
    string,
    {
      count: number;
      recommendations: number;
      satisfactionTotal: number;
      satisfactionCount: number;
    }
  > = {};

  patientTypeData?.forEach((p) => {
    if (!patientTypeStats[p.patient_type]) {
      patientTypeStats[p.patient_type] = {
        count: 0,
        recommendations: 0,
        satisfactionTotal: 0,
        satisfactionCount: 0,
      };
    }

    patientTypeStats[p.patient_type].count++;
    if (p.would_recommend) {
      patientTypeStats[p.patient_type].recommendations++;
    }
  });

  // Process satisfaction data
  satisfactionData?.forEach((s) => {
    if (s.survey_submissions) {
      const userType = s.survey_submissions.user_type;
      const patientType = s.survey_submissions.patient_type;

      let score = 0;
      if (s.rating === "Excellent") score = 5;
      else if (s.rating === "Very Good") score = 4;
      else if (s.rating === "Good") score = 3;
      else if (s.rating === "Fair") score = 2;
      else if (s.rating === "Poor") score = 1;

      if (userType && userTypeStats[userType]) {
        userTypeStats[userType].satisfactionTotal += score;
        userTypeStats[userType].satisfactionCount++;
      }

      if (patientType && patientTypeStats[patientType]) {
        patientTypeStats[patientType].satisfactionTotal += score;
        patientTypeStats[patientType].satisfactionCount++;
      }
    }
  });

  // Calculate final results
  const byUserType = Object.entries(userTypeStats).map(([userType, stats]) => ({
    userType,
    satisfaction:
      stats.satisfactionCount > 0
        ? stats.satisfactionTotal / stats.satisfactionCount
        : 0,
    recommendRate:
      stats.count > 0 ? (stats.recommendations / stats.count) * 100 : 0,
    count: stats.count,
  }));

  const byPatientType = Object.entries(patientTypeStats).map(
    ([patientType, stats]) => ({
      patientType,
      satisfaction:
        stats.satisfactionCount > 0
          ? stats.satisfactionTotal / stats.satisfactionCount
          : 0,
      recommendRate:
        stats.count > 0 ? (stats.recommendations / stats.count) * 100 : 0,
      count: stats.count,
    })
  );

  return {
    byUserType,
    byPatientType,
  };
}

// Get visit time analysis
export async function getVisitTimeAnalysis(): Promise<VisitTimeAnalysis> {
  // Get all submissions with visit time
  const { data: submissions } = await supabase
    .from("survey_submissions")
    .select(
      `
      id,
      visit_time,
      would_recommend
    `
    )
    .order("visit_time");

  // Get satisfaction ratings
  const { data: satisfactionData } = await supabase
    .from("general_observations")
    .select(
      `
      submission_id,
      rating,
      survey_submissions (
        visit_time
      )
    `
    )
    .eq("category", "overall");

  // Process visit time data
  const visitTimeStats: Record<
    string,
    {
      count: number;
      recommendations: number;
      satisfactionTotal: number;
      satisfactionCount: number;
    }
  > = {};

  submissions?.forEach((s) => {
    if (!visitTimeStats[s.visit_time]) {
      visitTimeStats[s.visit_time] = {
        count: 0,
        recommendations: 0,
        satisfactionTotal: 0,
        satisfactionCount: 0,
      };
    }

    visitTimeStats[s.visit_time].count++;
    if (s.would_recommend) {
      visitTimeStats[s.visit_time].recommendations++;
    }
  });

  // Process satisfaction data
  satisfactionData?.forEach((s) => {
    if (s.survey_submissions?.visit_time) {
      const visitTime = s.survey_submissions.visit_time;

      if (visitTimeStats[visitTime]) {
        let score = 0;
        if (s.rating === "Excellent") score = 5;
        else if (s.rating === "Very Good") score = 4;
        else if (s.rating === "Good") score = 3;
        else if (s.rating === "Fair") score = 2;
        else if (s.rating === "Poor") score = 1;

        visitTimeStats[visitTime].satisfactionTotal += score;
        visitTimeStats[visitTime].satisfactionCount++;
      }
    }
  });

  // Calculate final results
  return Object.entries(visitTimeStats).map(([visitTime, stats]) => ({
    visitTime,
    count: stats.count,
    satisfaction:
      stats.satisfactionCount > 0
        ? stats.satisfactionTotal / stats.satisfactionCount
        : 0,
    recommendRate:
      stats.count > 0 ? (stats.recommendations / stats.count) * 100 : 0,
  }));
}

// Get top improvement areas
export async function getTopImprovementAreas(): Promise<ImprovementArea[]> {
  // Get location visits
  const locationVisits = await getLocationVisits();

  // Filter to locations with at least 10 visits
  const frequentLocations = locationVisits.filter((loc) => loc.count >= 10);

  // Calculate impact score (lower satisfaction + higher visit count = higher priority)
  const improvementAreas = frequentLocations.map((loc) => {
    const satisfaction = loc.satisfaction;
    const visitCount = loc.count;
    const impactScore = (5 - satisfaction) * Math.log(visitCount + 1); // Log scale to prevent very high-traffic areas from dominating

    // Determine if this is a quick win (satisfaction < 4 but > 3)
    const isQuickWin = satisfaction < 4 && satisfaction > 3;

    // Determine if this is critical (satisfaction <= 3)
    const isCritical = satisfaction <= 3;

    return {
      locationId: 0, // We don't have this in the locationVisits data
      locationName: loc.name,
      satisfaction,
      visitCount,
      impactScore,
      isQuickWin,
      isCritical,
    };
  });

  // Sort by impact score (highest first)
  return improvementAreas
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);
}

// SERVICE POINT FEEDBACK QUERIES

// Get service point feedback statistics
export async function getServicePointFeedbackStats(
  timeRange = "all",
  servicePointId = "all"
): Promise<ServicePointFeedbackStats> {
  // Build the query with filters
  let query = supabase.from("service_point_feedback").select(`
    id,
    service_point_id,
    rating,
    created_at,
    service_points (
      name
    )
  `);

  // Apply time range filter
  if (timeRange !== "all") {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }

    query = query.gte("created_at", startDate.toISOString());
  }

  // Apply service point filter
  if (servicePointId !== "all") {
    query = query.eq("service_point_id", servicePointId);
  }

  // Execute the query
  const { data: feedbackData } = await query;

  // Calculate total feedback
  const totalFeedback = feedbackData?.length || 0;

  // Calculate average rating
  let totalRating = 0;
  feedbackData?.forEach((item) => {
    totalRating += item.rating;
  });
  const averageRating =
    totalFeedback > 0 ? Number((totalRating / totalFeedback).toFixed(1)) : 0;

  // Calculate rating distribution
  const ratingDistribution = [
    {
      name: "1 Star",
      value: feedbackData?.filter((item) => item.rating === 1).length || 0,
    },
    {
      name: "2 Stars",
      value: feedbackData?.filter((item) => item.rating === 2).length || 0,
    },
    {
      name: "3 Stars",
      value: feedbackData?.filter((item) => item.rating === 3).length || 0,
    },
    {
      name: "4 Stars",
      value: feedbackData?.filter((item) => item.rating === 4).length || 0,
    },
    {
      name: "5 Stars",
      value: feedbackData?.filter((item) => item.rating === 5).length || 0,
    },
  ];

  // Calculate service point performance
  const servicePointPerformance: Record<
    string,
    { total: number; count: number }
  > = {};
  feedbackData?.forEach((item) => {
    const name = item.service_points?.name || "Unknown";
    if (!servicePointPerformance[name]) {
      servicePointPerformance[name] = { total: 0, count: 0 };
    }
    servicePointPerformance[name].total += item.rating;
    servicePointPerformance[name].count++;
  });

  const servicePointPerformanceArray = Object.entries(
    servicePointPerformance
  ).map(([name, { total, count }]) => ({
    name,
    rating: count > 0 ? Number((total / count).toFixed(1)) : 0,
  }));

  // Calculate rating trends (by day for the last 7 days)
  const last7Days: Record<string, { total: number; count: number }> = {};
  const today = new Date();

  // Initialize the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    last7Days[dateString] = { total: 0, count: 0 };
  }

  // Fill in the data
  feedbackData?.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];
    if (last7Days[date]) {
      last7Days[date].total += item.rating;
      last7Days[date].count++;
    }
  });

  const ratingTrends = Object.entries(last7Days).map(
    ([date, { total, count }]) => ({
      date,
      rating: count > 0 ? Number((total / count).toFixed(1)) : 0,
    })
  );

  // Calculate service point comparison
  const servicePointComparison: Record<
    string,
    {
      excellent: number;
      good: number;
      neutral: number;
      poor: number;
      terrible: number;
    }
  > = {};

  feedbackData?.forEach((item) => {
    const name = item.service_points?.name || "Unknown";
    if (!servicePointComparison[name]) {
      servicePointComparison[name] = {
        excellent: 0,
        good: 0,
        neutral: 0,
        poor: 0,
        terrible: 0,
      };
    }

    switch (item.rating) {
      case 5:
        servicePointComparison[name].excellent++;
        break;
      case 4:
        servicePointComparison[name].good++;
        break;
      case 3:
        servicePointComparison[name].neutral++;
        break;
      case 2:
        servicePointComparison[name].poor++;
        break;
      case 1:
        servicePointComparison[name].terrible++;
        break;
    }
  });

  const servicePointComparisonArray = Object.entries(
    servicePointComparison
  ).map(([name, { excellent, good, neutral, poor, terrible }]) => ({
    name,
    excellent,
    good,
    neutral,
    poor,
    terrible,
  }));

  // Estimate response rate (this would be more accurate with actual visitor counts)
  // For now, we'll use a placeholder value
  const responseRate = 32; // Placeholder percentage

  return {
    totalFeedback,
    averageRating,
    responseRate,
    ratingDistribution,
    servicePointPerformance: servicePointPerformanceArray,
    ratingTrends,
    servicePointComparison: servicePointComparisonArray,
  };
}

// Get service point feedback items
export async function getServicePointFeedbackItems(
  timeRange = "all",
  servicePointId = "all",
  limit = 50
): Promise<ServicePointFeedbackItem[]> {
  // Build the query with filters
  let query = supabase.from("service_point_feedback").select(`
    id,
    service_point_id,
    rating,
    comment,
    created_at,
    service_points (
      id,
      name
    )
  `);

  // Apply time range filter
  if (timeRange !== "all") {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }

    query = query.gte("created_at", startDate.toISOString());
  }

  // Apply service point filter
  if (servicePointId !== "all") {
    query = query.eq("service_point_id", servicePointId);
  }

  // Apply limit and order
  const { data } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  return (
    data?.map((item) => ({
      id: item.id,
      servicePointId: item.service_point_id,
      servicePointName: item.service_points?.name || "Unknown",
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
    })) || []
  );
}

// Get all service points
export async function getServicePoints(): Promise<
  { id: number; name: string; location_type?: string }[]
> {
  const { data } = await supabase
    .from("service_points")
    .select("id, name, location_type")
    .order("name");

  return data || [];
}

// Replace existing functions with updated versions, and rename the updated functions
export {
  getSurveyDataQuery as getSurveyData,
  getDepartmentRatingsQueryUpdated as getDepartmentRatingsQuery,
  getWardRatingsQuery as getWardRatings,
  getCanteenRatingsQuery as getCanteenRatings,
  getOccupationalHealthRatingsQuery as getOccupationalHealthRatings,
  getDepartmentConcernsQueryUpdated as getDepartmentConcernsQuery,
  getServicePointFeedbackQueryUpdated as getServicePointFeedbackQuery,
  getServicePointsQueryUpdated as getServicePointsQuery,
  getLocationVisitsQueryUpdated as getLocationVisitsQuery,
};
