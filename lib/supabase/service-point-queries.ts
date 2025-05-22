import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  ServicePoint,
  ServicePointFeedback,
} from "@/app/actions/service-point-actions";

/**
 * Get all service points
 */
export async function getServicePoints() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("ServicePoints")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching service points:", error);
    return [];
  }

  return data as ServicePoint[];
}

/**
 * Get a single service point by ID
 */
export async function getServicePointById(id: number) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("ServicePoints")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }

  return data as ServicePoint;
}

/**
 * Create a new service point
 */
export async function createServicePoint(
  servicePoint: Omit<ServicePoint, "id" | "created_at" | "updated_at">
) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("ServicePoints")
    .insert(servicePoint)
    .select()
    .single();

  if (error) {
    console.error("Error creating service point:", error);
    throw new Error(error.message);
  }

  return data as ServicePoint;
}

/**
 * Update a service point
 */
export async function updateServicePoint(
  id: number,
  servicePoint: Partial<Omit<ServicePoint, "id" | "created_at" | "updated_at">>
) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("ServicePoints")
    .update({
      ...servicePoint,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating service point ${id}:`, error);
    throw new Error(error.message);
  }

  return data as ServicePoint;
}

/**
 * Delete a service point
 */
export async function deleteServicePoint(id: number) {
  const supabase = createServerClient();
  const { error } = await supabase.from("ServicePoints").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting service point ${id}:`, error);
    throw new Error(error.message);
  }

  return true;
}

/**
 * Get service point feedback
 */
export async function getServicePointFeedback(
  servicePointId: number,
  limit = 50
) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("ServicePointFeedback")
    .select("*")
    .eq("service_point_id", servicePointId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      `Error fetching feedback for service point ${servicePointId}:`,
      error
    );
    return [];
  }

  return data as ServicePointFeedback[];
}

/**
 * Get feedback stats for all or specific service points
 */
export async function getServicePointFeedbackStats(
  timeRange: string = "all",
  servicePointId: string | number = "all"
) {
  const supabase = createServerClient();

  let query = supabase.from("ServicePointFeedback").select(`
      id,
      rating,
      recommend,
      created_at,
      service_point_id,
      ServicePoints(id, name, location)
    `);

  // Filter by service point if specified
  if (servicePointId !== "all") {
    query = query.eq("service_point_id", servicePointId);
  }

  // Apply time range filter
  if (timeRange !== "all") {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    query = query.gte("created_at", startDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching service point feedback stats:", error);
    return null;
  }

  // Process the data to calculate stats
  const stats = processServicePointStats(data);
  return stats;
}

/**
 * Get individual feedback items
 */
export async function getServicePointFeedbackItems(
  timeRange: string = "all",
  servicePointId: string | number = "all",
  limit = 50
) {
  const supabase = createServerClient();

  let query = supabase.from("ServicePointFeedback").select(`
      *,
      ServicePoints(id, name, location)
    `);

  // Filter by service point if specified
  if (servicePointId !== "all") {
    query = query.eq("service_point_id", servicePointId);
  }

  // Apply time range filter
  if (timeRange !== "all") {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    query = query.gte("created_at", startDate.toISOString());
  }

  // Order by date and limit results
  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching service point feedback items:", error);
    return [];
  }

  return data;
}

// Helper function to process stats
function processServicePointStats(feedbackData: any[]) {
  const servicePointMap = new Map();
  let overallStats = {
    totalFeedback: 0,
    averageRating: 0,
    recommendRate: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  type RatingKey = 1 | 2 | 3 | 4 | 5;

  // Group feedback by service point
  feedbackData.forEach((item) => {
    const servicePointId = item.service_point_id;
    // Ensure rating is between 1-5
    const rating = Math.min(Math.max(1, item.rating), 5) as RatingKey;
    const recommend = item.recommend;

    // Update overall stats
    overallStats.totalFeedback++;
    overallStats.averageRating += rating;
    if (recommend) {
      overallStats.recommendRate++;
    }
    overallStats.ratingDistribution[rating]++;

    // Update service point specific stats
    if (!servicePointMap.has(servicePointId)) {
      servicePointMap.set(servicePointId, {
        id: servicePointId,
        name: item.ServicePoints?.name || "Unknown",
        location: item.ServicePoints?.location || "Unknown",
        totalFeedback: 0,
        totalRating: 0,
        recommendCount: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    const spStats = servicePointMap.get(servicePointId);
    spStats.totalFeedback++;
    spStats.totalRating += rating;
    spStats.ratingDistribution[rating]++;
    if (recommend) {
      spStats.recommendCount++;
    }
  });

  // Calculate final statistics
  if (overallStats.totalFeedback > 0) {
    overallStats.averageRating /= overallStats.totalFeedback;
    overallStats.recommendRate =
      (overallStats.recommendRate / overallStats.totalFeedback) * 100;
  }

  const servicePointStats = Array.from(servicePointMap.values()).map((sp) => ({
    id: sp.id,
    name: sp.name,
    location: sp.location,
    totalFeedback: sp.totalFeedback,
    averageRating: sp.totalFeedback > 0 ? sp.totalRating / sp.totalFeedback : 0,
    recommendRate:
      sp.totalFeedback > 0 ? (sp.recommendCount / sp.totalFeedback) * 100 : 0,
    ratingDistribution: sp.ratingDistribution,
  }));

  return {
    overall: overallStats,
    servicePoints: servicePointStats,
  };
}
