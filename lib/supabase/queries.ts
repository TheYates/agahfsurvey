import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Create a Supabase client for server-side operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

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
export async function getSurveySubmissionsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("SurveySubmission")
    .select("*")
    .order("createdAt", { ascending: false });
}

// Locations queries
export async function getLocationsQuery(supabase: SupabaseClient<Database>) {
  return await supabase
    .from("Location")
    .select("*")
    .order("name", { ascending: true });
}

// Department concerns queries
export async function getDepartmentConcernsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("DepartmentConcern")
    .select("*")
    .order("createdAt", { ascending: false });
}

// Ratings queries
export async function getRatingsQuery(supabase: SupabaseClient<Database>) {
  return await supabase
    .from("Rating")
    .select("*")
    .order("createdAt", { ascending: false });
}

// General observations queries
export async function getGeneralObservationsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("GeneralObservation")
    .select("*")
    .order("createdAt", { ascending: false });
}

// Submission location queries
export async function getSubmissionLocationsQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("SubmissionLocation")
    .select("*")
    .order("createdAt", { ascending: false });
}

// Get survey by ID with all related data
export async function getSurveyByIdQuery(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const surveyPromise = supabase
    .from("SurveySubmission")
    .select("*")
    .eq("id", id)
    .single();
  const locationsPromise = supabase
    .from("SubmissionLocation")
    .select("*, Location(*)")
    .eq("submissionId", id);
  const ratingsPromise = supabase
    .from("Rating")
    .select("*, Location(*)")
    .eq("submissionId", id);
  const concernsPromise = supabase
    .from("DepartmentConcern")
    .select("*, Location(*)")
    .eq("submissionId", id);
  const generalObservationsPromise = supabase
    .from("GeneralObservation")
    .select("*")
    .eq("submissionId", id)
    .single();

  const [survey, locations, ratings, concerns, generalObservations] =
    await Promise.all([
      surveyPromise,
      locationsPromise,
      ratingsPromise,
      concernsPromise,
      generalObservationsPromise,
    ]);

  return {
    survey,
    locations,
    ratings,
    concerns,
    generalObservations,
  };
}

// Create new survey with all related data
export async function createSurveyQuery(
  supabase: SupabaseClient<Database>,
  data: {
    survey: Database["public"]["Tables"]["SurveySubmission"]["Insert"];
    locations: Array<{
      locationId: number;
      isPrimary: boolean;
    }>;
    ratings: Array<{
      locationId: number;
      reception?: string | null;
      professionalism?: string | null;
      understanding?: string | null;
      promptnessCare?: string | null;
      promptnessFeedback?: string | null;
      overall?: string | null;
      admission?: string | null;
      nurseProfessionalism?: string | null;
      doctorProfessionalism?: string | null;
      discharge?: string | null;
      foodQuality?: string | null;
    }>;
    concerns: Array<{
      locationId: number;
      concern: string;
    }>;
    generalObservation: {
      cleanliness?: string | null;
      facilities?: string | null;
      security?: string | null;
      overall?: string | null;
    };
  }
) {
  // Begin a transaction
  const { data: survey, error: surveyError } = await supabase
    .from("SurveySubmission")
    .insert([data.survey])
    .select()
    .single();

  if (surveyError) throw surveyError;

  // Add locations
  const locationsToInsert = data.locations.map((location) => ({
    submissionId: survey.id,
    locationId: location.locationId,
    isPrimary: location.isPrimary,
  }));

  const { error: locationsError } = await supabase
    .from("SubmissionLocation")
    .insert(locationsToInsert);

  if (locationsError) throw locationsError;

  // Add ratings
  const ratingsToInsert = data.ratings.map((rating) => ({
    submissionId: survey.id,
    locationId: rating.locationId,
    reception: rating.reception,
    professionalism: rating.professionalism,
    understanding: rating.understanding,
    promptnessCare: rating.promptnessCare,
    promptnessFeedback: rating.promptnessFeedback,
    overall: rating.overall,
    admission: rating.admission,
    nurseProfessionalism: rating.nurseProfessionalism,
    doctorProfessionalism: rating.doctorProfessionalism,
    discharge: rating.discharge,
    foodQuality: rating.foodQuality,
  }));

  if (ratingsToInsert.length > 0) {
    const { error: ratingsError } = await supabase
      .from("Rating")
      .insert(ratingsToInsert);
    if (ratingsError) throw ratingsError;
  }

  // Add concerns
  const concernsToInsert = data.concerns.map((concern) => ({
    submissionId: survey.id,
    locationId: concern.locationId,
    concern: concern.concern,
  }));

  if (concernsToInsert.length > 0) {
    const { error: concernsError } = await supabase
      .from("DepartmentConcern")
      .insert(concernsToInsert);
    if (concernsError) throw concernsError;
  }

  // Add general observation
  if (data.generalObservation) {
    const { error: observationError } = await supabase
      .from("GeneralObservation")
      .insert([
        {
          submissionId: survey.id,
          cleanliness: data.generalObservation.cleanliness,
          facilities: data.generalObservation.facilities,
          security: data.generalObservation.security,
          overall: data.generalObservation.overall,
        },
      ]);
    if (observationError) throw observationError;
  }

  return { survey };
}

// Recent surveys query
export async function getRecentSurveysQuery(
  supabase: SupabaseClient<Database>
) {
  return await supabase
    .from("SurveySubmission")
    .select("id, submittedAt, patientType, userType, visitPurpose")
    .order("submittedAt", { ascending: false })
    .limit(5);
}

// Get recommendation rate query
export async function getRecommendationRateQuery(
  supabase: SupabaseClient<Database>
) {
  const { data, error } = await supabase
    .from("SurveySubmission")
    .select("wouldRecommend")
    .not("wouldRecommend", "is", null);

  if (error) throw error;

  if (!data || data.length === 0) return 0;

  const recommendCount = data.filter((item) => item.wouldRecommend).length;
  return (recommendCount / data.length) * 100;
}

// Get satisfaction by location query
export async function getSatisfactionByLocationQuery(
  supabase: SupabaseClient<Database>
) {
  const { data: ratings, error: ratingsError } = await supabase
    .from("Rating")
    .select("locationId, overall, Location(name)");

  if (ratingsError) throw ratingsError;

  const locationRatings: Record<
    string,
    { total: number; count: number; name: string }
  > = {};

  ratings?.forEach((rating) => {
    if (!rating.overall || !rating.Location) return;

    const locationId = rating.locationId.toString();
    if (!locationRatings[locationId]) {
      locationRatings[locationId] = {
        total: 0,
        count: 0,
        name: rating.Location.name,
      };
    }

    // Convert rating to number (assuming ratings are like "Excellent" = 5, "Good" = 4, etc.)
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
}

// Helper function to convert string ratings to numbers
function convertRatingToNumber(rating: string): number {
  const ratingMap: Record<string, number> = {
    Excellent: 5,
    "Very Good": 4,
    Good: 3,
    Fair: 2,
    Poor: 1,
  };

  return ratingMap[rating] || 0;
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
  getSurveySubmissionsQuery as getSurveyData,
  getDepartmentRatingsQueryUpdated as getDepartmentRatingsQuery,
  getWardRatingsQuery as getWardRatings,
  getCanteenRatingsQuery as getCanteenRatings,
  getOccupationalHealthRatingsQuery as getOccupationalHealthRatings,
  getServicePointFeedbackQueryUpdated as getServicePointFeedbackQuery,
  getServicePointsQueryUpdated as getServicePointsQuery,
  getLocationVisitsQueryUpdated as getLocationVisitsQuery,
};
