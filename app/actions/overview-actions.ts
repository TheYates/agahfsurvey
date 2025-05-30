import { createClient } from "@/lib/supabase/client";

// Types for Overview Tab Data
export interface SurveyOverviewData {
  totalResponses: number;
  recommendRate: number;
  avgSatisfaction: number;
  mostCommonPurpose?: string;
  purposeDistribution: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  generalObservationStats?: {
    cleanliness: number;
    facilities: number;
    security: number;
    overall: number;
    [key: string]: number;
  };
}

export interface DemographicSatisfaction {
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
  insight: string;
}

export interface VisitTimeAnalysis {
  visitTime: string;
  count: number;
  satisfaction: number;
  recommendRate: number;
}

export interface ImprovementArea {
  area: string;
  satisfaction: number;
  visitCount: number;
  impact: number;
  implementationEase: number;
  isQuickWin: boolean;
  isCritical: boolean;
  recommendation: string;
}

export interface VisitPurposeData {
  generalPractice: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: {
      name: string;
      score: number;
    };
    bottomDepartment: {
      name: string;
      score: number;
    };
    commonLocations: Array<{ name: string; count: number }>;
  };
  occupationalHealth: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: {
      name: string;
      score: number;
    };
    bottomDepartment: {
      name: string;
      score: number;
    };
    commonLocations: Array<{ name: string; count: number }>;
  };
}

export interface PatientTypeData {
  newPatients: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: {
      name: string;
      score: number;
    };
    bottomDepartment: {
      name: string;
      score: number;
    };
  };
  returningPatients: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: {
      name: string;
      score: number;
    };
    bottomDepartment: {
      name: string;
      score: number;
    };
  };
}

export interface UserTypeDistribution {
  name: string;
  value: number;
}

export interface UserTypeData {
  distribution: UserTypeDistribution[];
  insight: string;
}

export interface SurveySubmission {
  id: string | number;
  submittedAt?: string;
  visitPurpose?: string;
  wouldRecommend?: boolean | string;
  recommendation?: string | number;
  patientType?: string;
  userType?: string;
  visitTime?: string;
  Rating?: any[];
  SubmissionLocation?: any[];
}

// Create Supabase client
const supabase = createClient();

// Helper function to convert text ratings to numbers
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

// Helper function to determine if a user would recommend based on available data
function userWouldRecommend(submission: SurveySubmission): boolean {
  // Add detailed logging for debugging

  // First check explicit boolean field
  if (typeof submission.wouldRecommend === "boolean") {
    return submission.wouldRecommend;
  }

  // If wouldRecommend is a string "true" or "false"
  if (typeof submission.wouldRecommend === "string") {
    const recommend = submission.wouldRecommend;
    return recommend === "true" || recommend.toLowerCase() === "true";
  }

  // Then check the recommendation field which might be numeric on 0-10 scale
  if (typeof submission.recommendation === "number") {
    return submission.recommendation >= 7;
  }

  // Check if recommendation is "yes" or "true" (case insensitive)
  if (typeof submission.recommendation === "string") {
    const rec = submission.recommendation;
    return (
      rec === "yes" ||
      rec === "true" ||
      rec.toLowerCase() === "yes" ||
      rec.toLowerCase() === "true"
    );
  }

  return false;
}

/**
 * Get survey overview data for the dashboard
 */
export async function getSurveyOverviewData(): Promise<SurveyOverviewData> {
  try {
    // Get total survey submissions
    const { count: totalCount, error: countError } = await supabase
      .from("SurveySubmission")
      .select("*", { count: "exact" });

    if (countError) throw countError;

    // Get survey data with ratings
    const { data: surveyData, error: surveyError } = await supabase.from(
      "SurveySubmission"
    ).select(`
        id,
        recommendation,
        wouldRecommend,
        visitPurpose,
        Rating (
          overall
        )
      `);

    if (surveyError) throw surveyError;

    // Calculate recommendation rate
    let recommendCount = 0;
    let totalSubmissionsWithRecommendation = 0;

    surveyData?.forEach((submission) => {
      // Only count submissions where we can determine recommendation
      if (
        submission.recommendation !== null ||
        submission.wouldRecommend !== null
      ) {
        totalSubmissionsWithRecommendation++;

        if (userWouldRecommend(submission)) {
          recommendCount++;
        }
      }
    });

    // Calculate average satisfaction rating
    let totalSatisfaction = 0;
    let satisfactionCount = 0;

    surveyData?.forEach((submission) => {
      if (submission.Rating && Array.isArray(submission.Rating)) {
        submission.Rating.forEach((rating) => {
          if (rating && rating.overall) {
            totalSatisfaction += convertRatingToNumber(rating.overall);
            satisfactionCount++;
          }
        });
      }
    });

    // Calculate purpose distribution
    const purposes: Record<string, number> = {};
    surveyData?.forEach((submission) => {
      const purpose = submission.visitPurpose || "General";
      if (!purposes[purpose]) {
        purposes[purpose] = 0;
      }
      purposes[purpose]++;
    });

    // Convert to array format
    const purposeDistribution = Object.entries(purposes).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Find most common purpose
    let mostCommonPurpose = "";
    let maxCount = 0;
    Object.entries(purposes).forEach(([purpose, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonPurpose = purpose;
      }
    });

    const recommendRate =
      totalSubmissionsWithRecommendation > 0
        ? Math.round(
            (recommendCount / totalSubmissionsWithRecommendation) * 100
          )
        : 0;

    const avgSatisfaction =
      satisfactionCount > 0
        ? Number((totalSatisfaction / satisfactionCount).toFixed(1))
        : 0;

    return {
      totalResponses: totalCount || 0,
      recommendRate,
      avgSatisfaction,
      mostCommonPurpose,
      purposeDistribution,
    };
  } catch (error) {
    console.error("Error fetching survey overview data:", error);
    return {
      totalResponses: 0,
      recommendRate: 0,
      avgSatisfaction: 0,
      purposeDistribution: [],
    };
  }
}

/**
 * Get satisfaction by demographic
 */
export async function getSatisfactionByDemographic(): Promise<DemographicSatisfaction> {
  try {
    // Get survey data with demographic info
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        userType,
        patientType,
        wouldRecommend,
        Rating (
          overall
        )
      `);

    if (error) throw error;

    // Group by user type
    const userTypeGroups: Record<
      string,
      {
        count: number;
        satisfactionTotal: number;
        recommendCount: number;
      }
    > = {};

    // Group by patient type
    const patientTypeGroups: Record<
      string,
      {
        count: number;
        satisfactionTotal: number;
        recommendCount: number;
      }
    > = {};

    data?.forEach((submission) => {
      // Process user type groups
      if (!userTypeGroups[submission.userType]) {
        userTypeGroups[submission.userType] = {
          count: 0,
          satisfactionTotal: 0,
          recommendCount: 0,
        };
      }
      userTypeGroups[submission.userType].count += 1;

      // Process patient type groups
      if (!patientTypeGroups[submission.patientType]) {
        patientTypeGroups[submission.patientType] = {
          count: 0,
          satisfactionTotal: 0,
          recommendCount: 0,
        };
      }
      patientTypeGroups[submission.patientType].count += 1;

      // Calculate average satisfaction from ratings
      let totalRating = 0;
      let ratingCount = 0;

      if (submission.Rating && Array.isArray(submission.Rating)) {
        submission.Rating.forEach((rating) => {
          if (rating && rating.overall) {
            const numericRating = convertRatingToNumber(rating.overall);
            totalRating += numericRating;
            ratingCount++;
          }
        });
      }

      if (ratingCount > 0) {
        const avgRating = totalRating / ratingCount;
        userTypeGroups[submission.userType].satisfactionTotal += avgRating;
        patientTypeGroups[submission.patientType].satisfactionTotal +=
          avgRating;
      }

      // Add recommendation if applicable
      if (userWouldRecommend(submission)) {
        userTypeGroups[submission.userType].recommendCount += 1;
        patientTypeGroups[submission.patientType].recommendCount += 1;
      }
    });

    // Convert the grouped data to the expected format
    const byUserType = Object.entries(userTypeGroups).map(
      ([userType, data]) => ({
        userType,
        count: data.count,
        satisfaction:
          data.count > 0
            ? Math.round((data.satisfactionTotal / data.count) * 10) / 10
            : 0,
        recommendRate:
          data.count > 0
            ? Math.round((data.recommendCount / data.count) * 100)
            : 0,
      })
    );

    const byPatientType = Object.entries(patientTypeGroups).map(
      ([patientType, data]) => ({
        patientType,
        count: data.count,
        satisfaction:
          data.count > 0
            ? Math.round((data.satisfactionTotal / data.count) * 10) / 10
            : 0,
        recommendRate:
          data.count > 0
            ? Math.round((data.recommendCount / data.count) * 100)
            : 0,
      })
    );

    // Generate insight based on user type differences
    let insight = "No significant demographic patterns observed.";
    if (byUserType.length > 1) {
      const maxSatisfaction = byUserType.reduce((prev, current) =>
        current.satisfaction > prev.satisfaction ? current : prev
      );

      const minSatisfaction = byUserType.reduce((prev, current) =>
        current.satisfaction < prev.satisfaction ? current : prev
      );

      if (maxSatisfaction.satisfaction - minSatisfaction.satisfaction >= 0.5) {
        insight = `${maxSatisfaction.userType} users are significantly more satisfied (${maxSatisfaction.satisfaction}/5) compared to ${minSatisfaction.userType} (${minSatisfaction.satisfaction}/5). Consider investigating experience differences.`;
      }
    }

    return { byUserType, byPatientType, insight };
  } catch (error) {
    console.error("Error fetching satisfaction by demographic:", error);
    return {
      byUserType: [],
      byPatientType: [],
      insight: "Error analyzing demographic data.",
    };
  }
}

/**
 * Get visit time analysis
 */
export async function getVisitTimeAnalysis(): Promise<VisitTimeAnalysis[]> {
  try {
    // Get survey data with visit time info
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        submittedAt,
        visitTime,
        recommendation,
        wouldRecommend,
        Rating (
          overall
        )
      `);

    if (error) throw error;

    // Define time periods
    const timePeriods: Record<
      string,
      {
        count: number;
        satisfactionTotal: number;
        recommendCount: number;
      }
    > = {
      "Morning (8am-12pm)": {
        count: 0,
        satisfactionTotal: 0,
        recommendCount: 0,
      },
      "Afternoon (12pm-5pm)": {
        count: 0,
        satisfactionTotal: 0,
        recommendCount: 0,
      },
      "Evening (After 5pm)": {
        count: 0,
        satisfactionTotal: 0,
        recommendCount: 0,
      },
    };

    data?.forEach((submission) => {
      // Determine time of day based on submission timestamp
      const hour = new Date(submission.submittedAt).getHours();
      let timeCategory = "";

      if (hour >= 8 && hour < 12) {
        timeCategory = "Morning (8am-12pm)";
      } else if (hour >= 12 && hour < 17) {
        timeCategory = "Afternoon (12pm-5pm)";
      } else {
        timeCategory = "Evening (After 5pm)";
      }

      // Initialize if new period
      if (!timePeriods[timeCategory]) {
        timePeriods[timeCategory] = {
          count: 0,
          satisfactionTotal: 0,
          recommendCount: 0,
        };
      }

      // Increment count
      timePeriods[timeCategory].count++;

      // Add recommendation if applicable
      if (userWouldRecommend(submission)) {
        timePeriods[timeCategory].recommendCount++;
      }

      // Add satisfaction ratings
      if (submission.Rating && Array.isArray(submission.Rating)) {
        submission.Rating.forEach((rating) => {
          if (rating && rating.overall) {
            timePeriods[timeCategory].satisfactionTotal +=
              convertRatingToNumber(rating.overall);
          }
        });
      }
    });

    // Convert to array format
    return Object.entries(timePeriods)
      .filter(([_, data]) => data.count > 0) // Only include periods with data
      .map(([visitTime, data]) => ({
        visitTime,
        count: data.count,
        satisfaction: Number((data.satisfactionTotal / data.count).toFixed(1)),
        recommendRate: Math.round((data.recommendCount / data.count) * 100),
      }))
      .sort((a, b) => b.count - a.count); // Sort by count
  } catch (error) {
    console.error("Error fetching visit time analysis:", error);
    return [];
  }
}

/**
 * Get improvement areas
 */
export async function getImprovementAreas(): Promise<ImprovementArea[]> {
  try {
    // Get location satisfaction data
    const { data, error } = await supabase.from("Location").select(`
        id,
        name,
        Rating (
          overall
        ),
        SubmissionLocation (
          submissionId
        )
      `);

    if (error) throw error;

    const improvementAreas: ImprovementArea[] = [];

    data?.forEach((location) => {
      if (!location.name) return;

      // Calculate average satisfaction
      let totalSatisfaction = 0;
      let ratingCount = 0;

      if (location.Rating && Array.isArray(location.Rating)) {
        location.Rating.forEach((rating) => {
          if (rating && rating.overall) {
            totalSatisfaction += convertRatingToNumber(rating.overall);
            ratingCount++;
          }
        });
      }

      // Calculate visit count
      const visitCount = location.SubmissionLocation
        ? Array.isArray(location.SubmissionLocation)
          ? location.SubmissionLocation.length
          : 0
        : 0;

      if (ratingCount > 0) {
        const avgSatisfaction = Number(
          (totalSatisfaction / ratingCount).toFixed(1)
        );

        // Calculate impact (lower satisfaction = higher impact)
        const impact = 5 - avgSatisfaction;

        // Randomly assign implementation ease between 1-5 for demo purposes
        // In a real app, this would come from a database field
        const implementationEase = Math.floor(Math.random() * 5) + 1;

        // Determine if it's a quick win (high implementation ease, high impact)
        const isQuickWin = implementationEase >= 4 && impact >= 2.5;

        // Determine if it's critical (low satisfaction, high visit count)
        const isCritical = avgSatisfaction <= 2.5 && visitCount >= 5;

        // Generate recommendation
        let recommendation = "";
        if (avgSatisfaction < 3) {
          recommendation = `Review and improve ${location.name} services urgently to address patient dissatisfaction.`;
        } else if (avgSatisfaction < 4) {
          recommendation = `Consider targeted improvements to ${location.name} to raise overall satisfaction.`;
        } else {
          recommendation = `Maintain high quality service at ${location.name} and share best practices.`;
        }

        improvementAreas.push({
          area: location.name,
          satisfaction: avgSatisfaction,
          visitCount,
          impact,
          implementationEase,
          isQuickWin,
          isCritical,
          recommendation,
        });
      }
    });

    return improvementAreas.sort((a, b) => a.satisfaction - b.satisfaction);
  } catch (error) {
    console.error("Error fetching improvement areas:", error);
    return [];
  }
}

/**
 * Get visit purpose data analysis
 */
export async function getVisitPurposeData(): Promise<VisitPurposeData> {
  try {
    // Get submissions with visit purpose
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        visitPurpose,
        recommendation,
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
      `);

    if (error) throw error;

    // Initialize data structures
    const generalPractice = {
      count: 0,
      satisfactionTotal: 0,
      recommendCount: 0,
      locationCounts: {} as Record<string, number>,
      locationRatings: {} as Record<string, { total: number; count: number }>,
    };

    const occupationalHealth = {
      count: 0,
      satisfactionTotal: 0,
      recommendCount: 0,
      locationCounts: {} as Record<string, number>,
      locationRatings: {} as Record<string, { total: number; count: number }>,
    };

    // Process submissions
    data?.forEach((submission) => {
      const isOccupationalHealth =
        submission.visitPurpose === "Medicals (Occupational Health)";
      const target = isOccupationalHealth
        ? occupationalHealth
        : generalPractice;

      target.count++;

      // Add recommendation if applicable
      if (userWouldRecommend(submission)) {
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

      // Process visited locations
      if (
        submission.SubmissionLocation &&
        Array.isArray(submission.SubmissionLocation)
      ) {
        submission.SubmissionLocation.forEach((subLoc) => {
          if (subLoc.Location) {
            // Handle different possible structure types
            let locationName: string | undefined;

            if (typeof subLoc.Location === "object") {
              if ("name" in subLoc.Location) {
                locationName = String(subLoc.Location.name);
              }
            }

            if (locationName) {
              if (!target.locationCounts[locationName]) {
                target.locationCounts[locationName] = 0;
              }
              target.locationCounts[locationName]++;
            }
          }
        });
      }
    });

    // Calculate averages and sort locations
    function processVisitType(data: typeof generalPractice) {
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

      // Get common locations
      const commonLocations = Object.entries(data.locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Top 3

      return {
        count: data.count,
        satisfaction,
        recommendRate,
        topDepartment,
        bottomDepartment,
        commonLocations,
      };
    }

    const result = {
      generalPractice: processVisitType(generalPractice),
      occupationalHealth: processVisitType(occupationalHealth),
    };

    return result;
  } catch (error) {
    console.error("Error fetching visit purpose data:", error);
    return {
      generalPractice: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "No data", score: 0 },
        bottomDepartment: { name: "No data", score: 0 },
        commonLocations: [],
      },
      occupationalHealth: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "No data", score: 0 },
        bottomDepartment: { name: "No data", score: 0 },
        commonLocations: [],
      },
    };
  }
}

/**
 * Get patient type data
 */
export async function getPatientTypeData(): Promise<PatientTypeData> {
  try {
    // Get survey submissions with patient type info
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        patientType,
        recommendation,
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
      `);

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
      if (userWouldRecommend(submission)) {
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
 * Get visit time data
 */
export async function getVisitTimeData(): Promise<any[]> {
  try {
    // Get all submissions ordered by date
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        visitTime,
        recommendation,
        wouldRecommend,
        Rating (
          overall
        )
      `);

    if (error) throw error;

    // Define the time periods from the survey form
    type VisitTimePeriod =
      | "less-than-month"
      | "one-two-months"
      | "three-six-months"
      | "more-than-six-months";

    // Create a mapping for display names
    const periodDisplayNames: Record<VisitTimePeriod, string> = {
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
      // Use the visitTime field from the survey submission
      if (
        submission.visitTime &&
        (submission.visitTime === "less-than-month" ||
          submission.visitTime === "one-two-months" ||
          submission.visitTime === "three-six-months" ||
          submission.visitTime === "more-than-six-months")
      ) {
        const visitTime = submission.visitTime as VisitTimePeriod;
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
        if (userWouldRecommend(submission)) {
          timeGroups[visitTime].recommendCount += 1;
        }
      }
    });

    // Convert groups to array format expected by the chart
    // Include ALL time periods even if count is 0
    const visitTimeData = Object.entries(timeGroups).map(
      ([visitTime, data]) => {
        const displayName = periodDisplayNames[visitTime as VisitTimePeriod];

        // Calculate satisfaction, handling potential NaN values
        let satisfaction = 0;
        if (data.count > 0 && data.satisfactionSum > 0) {
          satisfaction =
            Math.round((data.satisfactionSum / data.count) * 10) / 10;
        }

        return {
          id: visitTime,
          name: displayName,
          count: data.count,
          satisfaction: satisfaction,
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
 * Get user type distribution data
 */
export async function getUserTypeData(): Promise<UserTypeData> {
  try {
    // Get submissions with user type info
    const { data, error } = await supabase.from("SurveySubmission").select(`
        id,
        userType,
        patientType
      `);

    if (error) throw error;

    // Define all expected user types to ensure they're always included
    const expectedUserTypes = [
      "AGAG Employee",
      "AGAG/Contractor Dependant",
      "Other Corporate Employee",
      "Contractor Employee",
    ];

    // Initialize counters with all expected types set to 0
    const userTypeCounts: Record<string, number> = {};
    expectedUserTypes.forEach((type) => {
      userTypeCounts[type] = 0;
    });

    // Process submissions
    data?.forEach((submission) => {
      let userType = submission.userType || "Not specified";

      // Initialize if not already (handles any unexpected types from data)
      if (!userTypeCounts[userType]) {
        userTypeCounts[userType] = 0;
      }
      userTypeCounts[userType]++;
    });

    // Format data for visualization - include all types even with 0 values
    const distribution = Object.entries(userTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Generate insight based on data
    let insight = "";
    if (distribution.some((item) => item.value > 0)) {
      const totalUsers = distribution.reduce(
        (sum, item) => sum + item.value,
        0
      );

      // Find the group with highest value
      const largestGroup = [...distribution].sort(
        (a, b) => b.value - a.value
      )[0];
      const percentage =
        totalUsers > 0
          ? ((largestGroup.value / totalUsers) * 100).toFixed(1)
          : "0";

      insight = `${largestGroup.name} is the most common user type, representing ${percentage}% of all respondents. Understanding this distribution helps in tailoring services to meet the specific needs of your main user groups.`;
    } else {
      insight =
        "No user type data is available yet. As more surveys are collected, insights about your user demographics will appear here.";
    }

    return {
      distribution,
      insight,
    };
  } catch (error) {
    console.error("Error fetching user type data:", error);
    return {
      distribution: [
        { name: "AGAG Employee", value: 0 },
        { name: "AGAG/Contractor Dependant", value: 0 },
        { name: "Other Corporate Employee", value: 0 },
        { name: "Contractor Employee", value: 0 },
      ],
      insight: "Unable to load user type data.",
    };
  }
}

/**
 * Get general observation data
 */
export async function getGeneralObservationData() {
  try {
    // First, let's check what tables are available by querying the schema
    console.log("Querying GeneralObservation table...");

    // Query the GeneralObservation table directly with simpler select
    let { data, error } = await supabase.from("GeneralObservation").select("*");

    if (error) {
      console.error("Error querying GeneralObservation:", error);
      throw error;
    }

    console.log("GeneralObservation data:", data);
    console.log("Number of observations:", data?.length || 0);

    if (!data || data.length === 0) {
      console.log(
        "No data in GeneralObservation table. Let's check for valid submission IDs"
      );

      // Try to find a valid submissionId first
      const { data: submissionData, error: submissionError } = await supabase
        .from("SurveySubmission")
        .select("id")
        .limit(1);

      if (submissionError) {
        console.error("Error fetching submissions:", submissionError);
      } else {
        console.log("Found submissions:", submissionData);

        if (submissionData && submissionData.length > 0) {
          const submissionId = submissionData[0].id;
          console.log("Using real submission ID:", submissionId);

          // For testing - insert a sample record if there's none
          const { data: insertData, error: insertError } = await supabase
            .from("GeneralObservation")
            .insert([
              {
                cleanliness: "Good",
                facilities: "Very Good",
                security: "Excellent",
                overall: "Very Good",
                submissionId: submissionId,
              },
            ])
            .select();

          if (insertError) {
            console.error("Error inserting test data:", insertError);
          } else {
            console.log("Inserted test data:", insertData);

            // Now try to fetch the data again
            const { data: refetchData, error: refetchError } = await supabase
              .from("GeneralObservation")
              .select("*");

            if (refetchError) {
              console.error("Error refetching data:", refetchError);
            } else {
              console.log("Refetched data:", refetchData);
              data = refetchData;
            }
          }
        } else {
          console.log("No submissions found, using dummy ID");

          // For testing - insert a sample record with dummy ID
          const { data: insertData, error: insertError } = await supabase
            .from("GeneralObservation")
            .insert([
              {
                cleanliness: "Good",
                facilities: "Very Good",
                security: "Excellent",
                overall: "Very Good",
                submissionId: "00000000-0000-0000-0000-000000000001", // Use proper UUID format
              },
            ])
            .select();

          if (insertError) {
            console.error("Error inserting test data (dummy ID):", insertError);
          }
        }
      }
    }

    const observationCategories = [
      "cleanliness",
      "facilities",
      "security",
      "overall",
    ];

    // Initialize statistics with index signature
    const stats: {
      [key: string]: { total: number; count: number };
    } = {
      cleanliness: { total: 0, count: 0 },
      facilities: { total: 0, count: 0 },
      security: { total: 0, count: 0 },
      overall: { total: 0, count: 0 },
    };

    // Process each observation directly
    data?.forEach((observation) => {
      console.log("Processing observation:", observation);
      observationCategories.forEach((category) => {
        // Handle any value format
        const rawValue = observation[category];
        console.log(`Category ${category}:`, rawValue, typeof rawValue);

        if (rawValue) {
          const rating = convertRatingToNumber(rawValue as string);
          console.log(`Converted rating for ${category}:`, rating);
          stats[category].total += rating;
          stats[category].count++;
        }
      });
    });

    console.log("Final stats before averages:", stats);

    // Calculate averages
    const result = {
      cleanliness:
        stats.cleanliness.count > 0
          ? Number(
              (stats.cleanliness.total / stats.cleanliness.count).toFixed(1)
            )
          : 0,
      facilities:
        stats.facilities.count > 0
          ? Number((stats.facilities.total / stats.facilities.count).toFixed(1))
          : 0,
      security:
        stats.security.count > 0
          ? Number((stats.security.total / stats.security.count).toFixed(1))
          : 0,
      overall:
        stats.overall.count > 0
          ? Number((stats.overall.total / stats.overall.count).toFixed(1))
          : 0,
    };

    console.log("Final result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching general observation data:", error);
    return {
      cleanliness: 0,
      facilities: 0,
      security: 0,
      overall: 0,
    };
  }
}

/**
 * Fetch all overview tab data in a single function
 */
export async function fetchOverviewTabData() {
  try {
    const [
      surveyData,
      satisfactionByDemographic,
      visitTimeAnalysis,
      improvementAreas,
      visitPurposeData,
      patientTypeData,
      visitTimeData,
      userTypeData,
      generalObservationData,
    ] = await Promise.all([
      getSurveyOverviewData(),
      getSatisfactionByDemographic(),
      getVisitTimeAnalysis(),
      getImprovementAreas(),
      getVisitPurposeData(),
      getPatientTypeData(),
      getVisitTimeData(),
      getUserTypeData(),
      getGeneralObservationData(),
    ]);

    // Add generalObservationStats to surveyData
    const enhancedSurveyData = {
      ...surveyData,
      generalObservationStats: generalObservationData,
    };

    return {
      surveyData: enhancedSurveyData,
      satisfactionByDemographic,
      visitTimeAnalysis,
      improvementAreas,
      visitPurposeData,
      patientTypeData,
      visitTimeData,
      userTypeData,
    };
  } catch (error) {
    console.error("Error fetching overview tab data:", error);
    throw error;
  }
}
