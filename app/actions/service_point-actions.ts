import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types for service points
export interface ServicePoint {
  id: number;
  name: string;
  location_type: string;
  custom_question: string;
  show_comments: boolean;
  comments_title?: string;
  comments_placeholder?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicePointFeedback {
  id: number;
  service_point_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ServicePointSummary {
  id: number;
  name: string;
  location_type: string;
  average_rating: number;
  total_feedback: number;
  feedback_this_week: number;
  active: boolean;
}

export interface ServicePointRatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

// Get all service points
export async function getServicePoints(): Promise<ServicePoint[]> {
  const { data, error } = await supabase
    .from("service_points")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching service points:", error);
    return [];
  }

  return data || [];
}

// Get a single service point by ID
export async function getServicePointById(
  id: number
): Promise<ServicePoint | null> {
  const { data, error } = await supabase
    .from("service_points")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }

  return data;
}

// Create a new service point
export async function createServicePoint(
  servicePoint: Omit<ServicePoint, "id" | "created_at" | "updated_at">
): Promise<ServicePoint | null> {
  const { data, error } = await supabase
    .from("service_points")
    .insert([
      {
        ...servicePoint,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating service point:", error);
    return null;
  }

  return data;
}

// Update a service point
export async function updateServicePoint(
  id: number,
  servicePoint: Partial<ServicePoint>
): Promise<ServicePoint | null> {
  const { data, error } = await supabase
    .from("service_points")
    .update({
      ...servicePoint,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating service point ${id}:`, error);
    return null;
  }

  return data;
}

// Delete a service point
export async function deleteServicePoint(id: number): Promise<boolean> {
  const { error } = await supabase.from("service_points").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting service point ${id}:`, error);
    return false;
  }

  return true;
}

// Submit feedback for a service point
export async function submitServicePointFeedback(
  servicePointId: number,
  rating: number,
  comment: string | null = null
): Promise<ServicePointFeedback | null> {
  const { data, error } = await supabase
    .from("service_point_feedback")
    .insert([
      {
        service_point_id: servicePointId,
        rating,
        comment,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error submitting feedback:", error);
    return null;
  }

  return data;
}

// Get feedback for a specific service point
export async function getServicePointFeedback(
  servicePointId: number
): Promise<ServicePointFeedback[]> {
  const { data, error } = await supabase
    .from("service_point_feedback")
    .select("*")
    .eq("service_point_id", servicePointId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      `Error fetching feedback for service point ${servicePointId}:`,
      error
    );
    return [];
  }

  return data || [];
}

// Get summary data for all service points (for dashboard)
export async function getServicePointsSummary(): Promise<
  ServicePointSummary[]
> {
  // Get all service points
  const { data: servicePoints, error: servicePointsError } = await supabase
    .from("service_points")
    .select("*");

  if (servicePointsError || !servicePoints) {
    console.error(
      "Error fetching service points for summary:",
      servicePointsError
    );
    return [];
  }

  // Get all feedback counts and averages
  const { data: feedbackStats, error: feedbackError } = await supabase
    .from("service_point_feedback")
    .select("service_point_id, rating");

  if (feedbackError) {
    console.error("Error fetching feedback stats:", feedbackError);
    return [];
  }

  // Calculate one week ago for recent feedback
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoStr = oneWeekAgo.toISOString();

  // Get recent feedback counts
  const { data: recentFeedback, error: recentError } = await supabase
    .from("service_point_feedback")
    .select("service_point_id, created_at")
    .gte("created_at", oneWeekAgoStr);

  if (recentError) {
    console.error("Error fetching recent feedback:", recentError);
    return [];
  }

  // Create summary for each service point
  return servicePoints.map((sp) => {
    // Get all feedback for this service point
    const pointFeedback =
      feedbackStats?.filter((fb) => fb.service_point_id === sp.id) || [];

    // Calculate average rating
    const ratings = pointFeedback.map((fb) => fb.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    // Count recent feedback
    const recentCount =
      recentFeedback?.filter((fb) => fb.service_point_id === sp.id).length || 0;

    return {
      id: sp.id,
      name: sp.name,
      location_type: sp.location_type,
      average_rating: parseFloat(avgRating.toFixed(2)),
      total_feedback: pointFeedback.length,
      feedback_this_week: recentCount,
      active: sp.active,
    };
  });
}

// Get rating distribution for a specific service point
export async function getServicePointRatingDistribution(
  servicePointId: number
): Promise<ServicePointRatingDistribution[]> {
  const { data, error } = await supabase
    .from("service_point_feedback")
    .select("rating")
    .eq("service_point_id", servicePointId);

  if (error) {
    console.error(
      `Error fetching rating distribution for service point ${servicePointId}:`,
      error
    );
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Initialize counters for each rating (1-5)
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Count occurrences of each rating
  data.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingCounts[item.rating as keyof typeof ratingCounts]++;
    }
  });

  // Calculate total
  const total = data.length;

  // Convert to array with percentages
  return Object.entries(ratingCounts).map(([rating, count]) => ({
    rating: parseInt(rating),
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

// Get feedback trends over time for a service point
export async function getServicePointFeedbackTrends(
  servicePointId: number,
  days = 30
): Promise<{ date: string; average_rating: number; count: number }[]> {
  // Calculate the start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();

  // Get feedback for the specified period
  const { data, error } = await supabase
    .from("service_point_feedback")
    .select("rating, created_at")
    .eq("service_point_id", servicePointId)
    .gte("created_at", startDateStr)
    .order("created_at");

  if (error) {
    console.error(
      `Error fetching feedback trends for service point ${servicePointId}:`,
      error
    );
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group feedback by date
  const feedbackByDate: Record<string, { ratings: number[]; count: number }> =
    {};

  data.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];

    if (!feedbackByDate[date]) {
      feedbackByDate[date] = { ratings: [], count: 0 };
    }

    feedbackByDate[date].ratings.push(item.rating);
    feedbackByDate[date].count++;
  });

  // Calculate average ratings for each date
  return Object.entries(feedbackByDate).map(([date, { ratings, count }]) => {
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = ratings.length > 0 ? sum / ratings.length : 0;

    return {
      date,
      average_rating: parseFloat(average.toFixed(2)),
      count,
    };
  });
}
