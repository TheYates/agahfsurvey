"use server";

import { createServerClient } from "@/lib/supabase/server";

// Optimized interfaces
interface OptimizedWard {
  id: string;
  name: string;
  satisfaction: number;
  visitCount: number;
  recommendRate: number;
  avgRatings: {
    reception: number;
    professionalism: number;
    understanding: number;
    promptnessCare: number;
    overall: number;
  };
}

interface OptimizedDepartment {
  id: string;
  name: string;
  satisfaction: number;
  visitCount: number;
  recommendRate: number;
  avgRatings: {
    reception: number;
    professionalism: number;
    understanding: number;
    promptnessCare: number;
    overall: number;
  };
}

interface OptimizedOverview {
  totalResponses: number;
  recommendRate: number;
  avgSatisfaction: number;
  purposeDistribution: Array<{ name: string; value: number }>;
  satisfactionByDemographic: {
    byUserType: Array<{ userType: string; satisfaction: number; count: number }>;
    byPatientType: Array<{ patientType: string; satisfaction: number; count: number }>;
  };
  visitTimeAnalysis: Array<{ visitTime: string; count: number; satisfaction: number }>;
  improvementAreas: Array<{ area: string; satisfaction: number; impact: number }>;
}

// Cache for storing computed results
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Optimized function to fetch all survey data in a single efficient query
 */
export async function fetchOptimizedSurveyData(): Promise<{
  overview: OptimizedOverview;
  wards: OptimizedWard[];
  departments: OptimizedDepartment[];
  concerns: Array<{ locationId: string; locationName: string; concern: string; type: string }>;
}> {
  const cacheKey = "optimized_survey_data";
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log("Returning cached survey data");
    return cached;
  }

  const supabase = await createServerClient();
  
  try {
    console.time("fetchOptimizedSurveyData");

    // Single optimized query to get all necessary data
    const [
      locationsResult,
      submissionsResult,
      ratingsResult,
      concernsResult
    ] = await Promise.all([
      // Get all locations (wards and departments)
      supabase
        .from("Location")
        .select("id, name, locationType")
        .in("locationType", ["ward", "department"]),

      // Get all submissions with minimal data
      supabase
        .from("SurveySubmission")
        .select(`
          id,
          submittedAt,
          wouldRecommend,
          visitPurpose,
          patientType,
          userType,
          visitTime
        `),

      // Get all ratings with location info
      supabase
        .from("Rating")
        .select(`
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
        `),

      // Get concerns/feedback
      supabase
        .from("DepartmentConcern")
        .select(`
          id,
          locationId,
          concern,
          Location!inner(name)
        `)
    ]);

    if (locationsResult.error) throw locationsResult.error;
    if (submissionsResult.error) throw submissionsResult.error;
    if (ratingsResult.error) throw ratingsResult.error;
    if (concernsResult.error) throw concernsResult.error;

    const locations = locationsResult.data || [];
    const submissions = submissionsResult.data || [];
    const ratings = ratingsResult.data || [];
    const concerns = concernsResult.data || [];

    console.time("processOptimizedData");

    // Create lookup maps for efficient processing
    const locationMap = new Map(locations.map(loc => [loc.id, loc]));
    const ratingsByLocation = new Map<string, any[]>();
    
    // Group ratings by location
    ratings.forEach(rating => {
      const locationId = rating.locationId.toString();
      if (!ratingsByLocation.has(locationId)) {
        ratingsByLocation.set(locationId, []);
      }
      ratingsByLocation.get(locationId)!.push(rating);
    });

    // Process wards
    const wards: OptimizedWard[] = locations
      .filter(loc => loc.locationType === "ward")
      .map(location => {
        const locationRatings = ratingsByLocation.get(location.id.toString()) || [];
        const visitCount = locationRatings.length;
        
        if (visitCount === 0) {
          return {
            id: location.id.toString(),
            name: location.name,
            satisfaction: 0,
            visitCount: 0,
            recommendRate: 0,
            avgRatings: {
              reception: 0,
              professionalism: 0,
              understanding: 0,
              promptnessCare: 0,
              overall: 0,
            }
          };
        }

        // Calculate averages efficiently
        const totals = locationRatings.reduce((acc, rating) => {
          acc.reception += convertRatingToNumber(rating.reception);
          acc.professionalism += convertRatingToNumber(rating.professionalism);
          acc.understanding += convertRatingToNumber(rating.understanding);
          acc.promptnessCare += convertRatingToNumber(rating.promptnessCare);
          acc.overall += convertRatingToNumber(rating.overall);
          return acc;
        }, { reception: 0, professionalism: 0, understanding: 0, promptnessCare: 0, overall: 0 });

        const avgRatings = {
          reception: totals.reception / visitCount,
          professionalism: totals.professionalism / visitCount,
          understanding: totals.understanding / visitCount,
          promptnessCare: totals.promptnessCare / visitCount,
          overall: totals.overall / visitCount,
        };

        return {
          id: location.id.toString(),
          name: location.name,
          satisfaction: avgRatings.overall,
          visitCount,
          recommendRate: 0, // Will be calculated from submissions if needed
          avgRatings
        };
      });

    // Process departments (similar logic)
    const departments: OptimizedDepartment[] = locations
      .filter(loc => loc.locationType === "department")
      .map(location => {
        const locationRatings = ratingsByLocation.get(location.id.toString()) || [];
        const visitCount = locationRatings.length;
        
        if (visitCount === 0) {
          return {
            id: location.id.toString(),
            name: location.name,
            satisfaction: 0,
            visitCount: 0,
            recommendRate: 0,
            avgRatings: {
              reception: 0,
              professionalism: 0,
              understanding: 0,
              promptnessCare: 0,
              overall: 0,
            }
          };
        }

        const totals = locationRatings.reduce((acc, rating) => {
          acc.reception += convertRatingToNumber(rating.reception);
          acc.professionalism += convertRatingToNumber(rating.professionalism);
          acc.understanding += convertRatingToNumber(rating.understanding);
          acc.promptnessCare += convertRatingToNumber(rating.promptnessCare);
          acc.overall += convertRatingToNumber(rating.overall);
          return acc;
        }, { reception: 0, professionalism: 0, understanding: 0, promptnessCare: 0, overall: 0 });

        const avgRatings = {
          reception: totals.reception / visitCount,
          professionalism: totals.professionalism / visitCount,
          understanding: totals.understanding / visitCount,
          promptnessCare: totals.promptnessCare / visitCount,
          overall: totals.overall / visitCount,
        };

        return {
          id: location.id.toString(),
          name: location.name,
          satisfaction: avgRatings.overall,
          visitCount,
          recommendRate: 0,
          avgRatings
        };
      });

    // Process overview data
    const totalResponses = submissions.length;
    const recommendCount = submissions.filter(s => s.wouldRecommend).length;
    const recommendRate = totalResponses > 0 ? (recommendCount / totalResponses) * 100 : 0;
    
    // Calculate average satisfaction from all ratings
    const allRatings = ratings.map(r => convertRatingToNumber(r.overall));
    const avgSatisfaction = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;

    // Process purpose distribution
    const purposeCounts = submissions.reduce((acc, sub) => {
      const purpose = sub.visitPurpose || "Unknown";
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const purposeDistribution = Object.entries(purposeCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Process demographic satisfaction
    const userTypeCounts = submissions.reduce((acc, sub) => {
      const userType = sub.userType || "Unknown";
      if (!acc[userType]) {
        acc[userType] = { count: 0, satisfactionSum: 0 };
      }
      acc[userType].count++;
      // Find corresponding rating for satisfaction
      const rating = ratings.find(r => r.locationId); // Simplified for now
      if (rating) {
        acc[userType].satisfactionSum += convertRatingToNumber(rating.overall);
      }
      return acc;
    }, {} as Record<string, { count: number; satisfactionSum: number }>);

    const byUserType = Object.entries(userTypeCounts).map(([userType, data]) => ({
      userType,
      satisfaction: data.count > 0 ? data.satisfactionSum / data.count : 0,
      count: data.count
    }));

    // Similar processing for patient types
    const patientTypeCounts = submissions.reduce((acc, sub) => {
      const patientType = sub.patientType || "Unknown";
      if (!acc[patientType]) {
        acc[patientType] = { count: 0, satisfactionSum: 0 };
      }
      acc[patientType].count++;
      return acc;
    }, {} as Record<string, { count: number; satisfactionSum: number }>);

    const byPatientType = Object.entries(patientTypeCounts).map(([patientType, data]) => ({
      patientType,
      satisfaction: data.count > 0 ? data.satisfactionSum / data.count : 0,
      count: data.count
    }));

    // Process visit time analysis
    const visitTimeCounts = submissions.reduce((acc, sub) => {
      const visitTime = sub.visitTime || "Unknown";
      if (!acc[visitTime]) {
        acc[visitTime] = { count: 0, satisfactionSum: 0 };
      }
      acc[visitTime].count++;
      return acc;
    }, {} as Record<string, { count: number; satisfactionSum: number }>);

    const visitTimeAnalysis = Object.entries(visitTimeCounts).map(([visitTime, data]) => ({
      visitTime,
      count: data.count,
      satisfaction: data.count > 0 ? data.satisfactionSum / data.count : 0
    }));

    // Process concerns
    const processedConcerns = concerns.map(concern => ({
      locationId: concern.locationId.toString(),
      locationName: (concern.Location as any)?.name || "Unknown",
      concern: concern.concern,
      type: "concern"
    }));

    const overview: OptimizedOverview = {
      totalResponses,
      recommendRate,
      avgSatisfaction,
      purposeDistribution,
      satisfactionByDemographic: {
        byUserType,
        byPatientType
      },
      visitTimeAnalysis,
      improvementAreas: [] // Can be calculated based on low satisfaction areas
    };

    console.timeEnd("processOptimizedData");
    console.timeEnd("fetchOptimizedSurveyData");

    const result = {
      overview,
      wards,
      departments,
      concerns: processedConcerns
    };

    setCachedData(cacheKey, result);
    return result;

  } catch (error) {
    console.error("Error in fetchOptimizedSurveyData:", error);
    throw error;
  }
}

// Helper function to convert rating text to number
function convertRatingToNumber(rating: string | null): number {
  if (!rating) return 3;
  const ratingLower = rating.toLowerCase();
  switch (ratingLower) {
    case "excellent": return 5;
    case "very good": return 4;
    case "good": return 3;
    case "fair": return 2;
    case "poor": return 1;
    default: return 3;
  }
}
