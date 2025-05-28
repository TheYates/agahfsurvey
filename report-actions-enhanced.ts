"use server";

import { prisma } from "@/lib/db";

// Define types for enhanced analysis
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

export interface VisitTimeAnalysis {
  visitTime: string;
  count: number;
  satisfaction: number;
  recommendRate: number;
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
}

export interface ImprovementArea {
  locationId: number;
  locationName: string;
  satisfaction: number;
  visitCount: number;
  impactScore: number;
  isQuickWin: boolean;
  isCritical: boolean;
}

export interface Department {
  name: string;
  score: number;
}

export interface VisitLocation {
  name: string;
  count: number;
}

export interface VisitPurposeData {
  generalPractice: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: Department;
    bottomDepartment: Department;
    commonLocations: VisitLocation[];
  };
  occupationalHealth: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: Department;
    bottomDepartment: Department;
    commonLocations: VisitLocation[];
  };
}

export interface PatientTypeData {
  newPatients: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: Department;
    bottomDepartment: Department;
  };
  returningPatients: {
    count: number;
    satisfaction: number;
    recommendRate: number;
    topDepartment: Department;
    bottomDepartment: Department;
  };
}

// Create a new interface for user type distribution
export interface UserTypeDistribution {
  name: string;
  value: number;
}

export interface OverviewData {
  surveyData: any[];
  visitPurposeData: VisitPurposeData;
  patientTypeData: PatientTypeData;
  visitTimeData: any[];
  satisfactionByDemographic: DemographicSatisfaction;
  visitTimeAnalysis: VisitTimeAnalysis[];
  improvementAreas: ImprovementArea[];
  userTypeData: {
    distribution: UserTypeDistribution[];
    insight: string;
  };
}

// Update the DepartmentData interface
export interface DepartmentData {
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

// Add this interface for Ward data
export interface WardData {
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
  capacity?: number;
  occupancy?: number;
}

// Update OccupationalHealthData interface to include top/lowest locations
export interface OccupationalHealthData {
  id: string;
  name: string;
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
  topRatedLocations: Array<{ name: string; rating: number }>;
  lowestRatedLocations: Array<{ name: string; rating: number }>;
}

// Mock data for development
const mockData = {
  getRecommendations: (): Recommendation[] => [
    {
      submissionId: "1",
      submittedAt: new Date().toISOString(),
      recommendation: "Improve waiting times",
      visitPurpose: "General Practice",
      patientType: "New Patient",
      userType: "AGAG Employee",
    },
    {
      submissionId: "2",
      submittedAt: new Date().toISOString(),
      recommendation: "More staff at the pharmacy",
      visitPurpose: "General Practice",
      patientType: "Returning Patient",
      userType: "Contractor Employee",
    },
  ],

  getNotRecommendReasons: (): NotRecommendReason[] => [
    {
      submissionId: "1",
      submittedAt: new Date().toISOString(),
      reason: "Long waiting times",
      visitPurpose: "General Practice",
      patientType: "New Patient",
      locations: ["OPD", "Pharmacy"],
    },
  ],

  getDepartmentConcerns: (): DepartmentConcern[] => [
    {
      submissionId: "1",
      submittedAt: new Date().toISOString(),
      locationName: "OPD",
      concern: "Too crowded",
      visitPurpose: "General Practice",
      patientType: "New Patient",
      userType: "AGAG Employee",
    },
  ],

  getVisitTimeAnalysis: (): VisitTimeAnalysis[] => [
    {
      visitTime: "Morning",
      count: 45,
      satisfaction: 4.2,
      recommendRate: 85,
    },
    {
      visitTime: "Afternoon",
      count: 32,
      satisfaction: 3.8,
      recommendRate: 72,
    },
    {
      visitTime: "Evening",
      count: 18,
      satisfaction: 4.0,
      recommendRate: 80,
    },
  ],

  getSatisfactionByDemographic: (): DemographicSatisfaction => ({
    byUserType: [
      {
        userType: "AGAG Employee",
        satisfaction: 4.3,
        recommendRate: 88,
        count: 56,
      },
      {
        userType: "Contractor Employee",
        satisfaction: 3.9,
        recommendRate: 75,
        count: 34,
      },
    ],
    byPatientType: [
      {
        patientType: "New Patient",
        satisfaction: 4.1,
        recommendRate: 82,
        count: 45,
      },
      {
        patientType: "Returning Patient",
        satisfaction: 4.4,
        recommendRate: 90,
        count: 38,
      },
    ],
  }),

  getTopImprovementAreas: (): ImprovementArea[] => [
    {
      locationId: 1,
      locationName: "OPD",
      satisfaction: 3.5,
      visitCount: 65,
      impactScore: 8.2,
      isQuickWin: true,
      isCritical: false,
    },
    {
      locationId: 2,
      locationName: "Pharmacy",
      satisfaction: 3.2,
      visitCount: 45,
      impactScore: 7.8,
      isQuickWin: false,
      isCritical: true,
    },
    {
      locationId: 3,
      locationName: "Laboratory",
      satisfaction: 3.8,
      visitCount: 30,
      impactScore: 6.5,
      isQuickWin: true,
      isCritical: false,
    },
  ],
};

// Fetch recommendations
export async function fetchRecommendations(): Promise<Recommendation[]> {
  try {
    const submissions = await prisma.surveySubmission.findMany({
      where: {
        recommendation: {
          not: null,
        },
      },
      select: {
        id: true,
        submittedAt: true,
        recommendation: true,
        visitPurpose: true,
        patientType: true,
        userType: true,
      },
    });

    return submissions.map((s) => ({
      submissionId: s.id,
      submittedAt: s.submittedAt.toISOString(),
      recommendation: s.recommendation || "",
      visitPurpose: s.visitPurpose,
      patientType: s.patientType,
      userType: s.userType,
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

// Fetch reasons for not recommending
export async function fetchNotRecommendReasons(): Promise<
  NotRecommendReason[]
> {
  try {
    const submissions = await prisma.surveySubmission.findMany({
      where: {
        wouldRecommend: false,
        whyNotRecommend: {
          not: null,
        },
      },
      include: {
        submissionLocations: {
          include: {
            location: true,
          },
        },
      },
    });

    return submissions.map((s) => ({
      submissionId: s.id,
      submittedAt: s.submittedAt.toISOString(),
      reason: s.whyNotRecommend || "",
      visitPurpose: s.visitPurpose,
      patientType: s.patientType,
      locations: s.submissionLocations.map((sl) => sl.location.name),
    }));
  } catch (error) {
    console.error("Error fetching not recommend reasons:", error);
    return [];
  }
}

// Fetch department concerns
export async function fetchDepartmentConcerns(): Promise<DepartmentConcern[]> {
  try {
    const concerns = await prisma.departmentConcern.findMany({
      include: {
        submission: true,
        location: true,
      },
    });

    return concerns.map((c) => ({
      submissionId: c.submissionId,
      submittedAt: c.submission.submittedAt.toISOString(),
      locationName: c.location.name,
      concern: c.concern,
      visitPurpose: c.submission.visitPurpose,
      patientType: c.submission.patientType,
      userType: c.submission.userType,
    }));
  } catch (error) {
    console.error("Error fetching department concerns:", error);
    return [];
  }
}

// Fetch visit time analysis
export async function fetchVisitTimeAnalysis(): Promise<VisitTimeAnalysis[]> {
  try {
    // Query for morning, afternoon, and evening data
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    // Extract the hour from submittedAt to categorize by time of day
    const timeGroups: Record<
      string,
      {
        count: number;
        satisfactionSum: number;
        recommendCount: number;
      }
    > = {
      "Morning (8am-12pm)": { count: 0, satisfactionSum: 0, recommendCount: 0 },
      "Afternoon (12pm-5pm)": {
        count: 0,
        satisfactionSum: 0,
        recommendCount: 0,
      },
      "Evening (After 5pm)": {
        count: 0,
        satisfactionSum: 0,
        recommendCount: 0,
      },
    };

    submissions.forEach((submission) => {
      const hour = new Date(submission.submittedAt).getHours();
      let timeCategory = "";

      if (hour >= 8 && hour < 12) {
        timeCategory = "Morning (8am-12pm)";
      } else if (hour >= 12 && hour < 17) {
        timeCategory = "Afternoon (12pm-5pm)";
      } else {
        timeCategory = "Evening (After 5pm)";
      }

      timeGroups[timeCategory].count += 1;

      // Calculate average satisfaction from ratings if available
      const avgRating =
        submission.ratings.length > 0
          ? submission.ratings.reduce((sum, rating) => {
              // Convert string ratings to numbers (assuming 1-5 scale)
              const overallRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;
              return sum + overallRating;
            }, 0) / submission.ratings.length
          : 0;

      timeGroups[timeCategory].satisfactionSum += avgRating;

      if (submission.wouldRecommend) {
        timeGroups[timeCategory].recommendCount += 1;
      }
    });

    // Convert the grouped data to the expected format
    const result: VisitTimeAnalysis[] = Object.entries(timeGroups).map(
      ([visitTime, data]) => ({
        visitTime,
        count: data.count,
        satisfaction:
          data.count > 0
            ? Math.round((data.satisfactionSum / data.count) * 10) / 10
            : 0,
        recommendRate:
          data.count > 0
            ? Math.round((data.recommendCount / data.count) * 100)
            : 0,
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching visit time analysis:", error);
    return [];
  }
}

// Fetch satisfaction by demographic
export async function fetchSatisfactionByDemographic(): Promise<DemographicSatisfaction> {
  try {
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    // Group by user type
    const userTypeGroups: Record<
      string,
      {
        count: number;
        satisfactionSum: number;
        recommendCount: number;
      }
    > = {};

    // Group by patient type
    const patientTypeGroups: Record<
      string,
      {
        count: number;
        satisfactionSum: number;
        recommendCount: number;
      }
    > = {};

    submissions.forEach((submission) => {
      // Process user type groups
      if (!userTypeGroups[submission.userType]) {
        userTypeGroups[submission.userType] = {
          count: 0,
          satisfactionSum: 0,
          recommendCount: 0,
        };
      }
      userTypeGroups[submission.userType].count += 1;

      // Process patient type groups
      if (!patientTypeGroups[submission.patientType]) {
        patientTypeGroups[submission.patientType] = {
          count: 0,
          satisfactionSum: 0,
          recommendCount: 0,
        };
      }
      patientTypeGroups[submission.patientType].count += 1;

      // Calculate average satisfaction from ratings
      const avgRating =
        submission.ratings.length > 0
          ? submission.ratings.reduce((sum, rating) => {
              // Convert string ratings to numbers (assuming 1-5 scale)
              const overallRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;
              return sum + overallRating;
            }, 0) / submission.ratings.length
          : 0;

      userTypeGroups[submission.userType].satisfactionSum += avgRating;
      patientTypeGroups[submission.patientType].satisfactionSum += avgRating;

      if (submission.wouldRecommend) {
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
            ? Math.round((data.satisfactionSum / data.count) * 10) / 10
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
            ? Math.round((data.satisfactionSum / data.count) * 10) / 10
            : 0,
        recommendRate:
          data.count > 0
            ? Math.round((data.recommendCount / data.count) * 100)
            : 0,
      })
    );

    console.log("Demographic satisfaction:", { byUserType, byPatientType });
    return { byUserType, byPatientType };
  } catch (error) {
    console.error("Error fetching satisfaction by demographic:", error);
    return {
      byUserType: [],
      byPatientType: [],
    };
  }
}

// Fetch top improvement areas
export async function fetchTopImprovementAreas(): Promise<ImprovementArea[]> {
  try {
    const locations = await prisma.location.findMany({
      include: {
        submissionLocations: {
          include: {
            submission: {
              include: {
                ratings: true,
              },
            },
          },
        },
      },
    });

    const improvementAreas = locations
      .filter((location) => location.submissionLocations.length > 0)
      .map((location) => {
        // Count visits to this location
        const visitCount = location.submissionLocations.length;

        // Calculate satisfaction score
        let satisfactionSum = 0;
        let ratingCount = 0;

        location.submissionLocations.forEach((sl) => {
          sl.submission.ratings.forEach((rating) => {
            if (rating.locationId === location.id) {
              const overallRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;

              satisfactionSum += overallRating;
              ratingCount++;
            }
          });
        });

        const satisfaction =
          ratingCount > 0
            ? Math.round((satisfactionSum / ratingCount) * 10) / 10
            : 0;

        // Calculate impact score based on visit count and satisfaction
        // Lower satisfaction with higher visit count = higher impact
        const impactScore = (5 - satisfaction) * Math.log(visitCount + 1);

        // Determine if it's a quick win or critical issue
        const isQuickWin =
          satisfaction < 4 && impactScore > 3 && impactScore < 7;
        const isCritical = satisfaction < 3 && impactScore >= 7;

        return {
          locationId: location.id,
          locationName: location.name,
          satisfaction,
          visitCount,
          impactScore: Math.round(impactScore * 10) / 10,
          isQuickWin,
          isCritical,
        };
      })
      .sort((a, b) => b.impactScore - a.impactScore);

    return improvementAreas;
  } catch (error) {
    console.error("Error fetching top improvement areas:", error);
    return [];
  }
}

// Update fetchAllSurveyData with better logging
export async function fetchAllSurveyData(
  locationFilter: string | null = null,
  dateRange: { from: string; to: string } | null = null
): Promise<any[]> {
  try {
    // Query all submissions without filtering
    const data = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    // Map the data to return
    const mappedData = data.map((s) => ({
      submissionId: s.id,
      submittedAt: s.submittedAt.toISOString(),
      recommendation: s.recommendation || "",
      visitPurpose: s.visitPurpose,
      patientType: s.patientType,
      userType: s.userType,
      wouldRecommend: s.wouldRecommend,
      satisfaction:
        s.ratings.length > 0
          ? s.ratings.reduce((sum, rating) => {
              const overallRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;
              return sum + overallRating;
            }, 0) / s.ratings.length
          : 0,
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    return [];
  }
}

export async function fetchVisitPurposeData(): Promise<VisitPurposeData> {
  try {
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
        submissionLocations: {
          include: {
            location: true,
          },
        },
      },
    });

    // Filter submissions by visit purpose
    const generalPractice = submissions.filter(
      (s) => s.visitPurpose === "General Practice"
    );
    const occupationalHealth = submissions.filter(
      (s) => s.visitPurpose === "Medicals (Occupational Health)"
    );

    // Calculate satisfaction and recommend rate for General Practice
    let gpSatisfactionSum = 0;
    let gpRecommendCount = 0;

    // Track ratings by department for General Practice
    const gpDepartmentRatings: Record<string, { sum: number; count: number }> =
      {};

    generalPractice.forEach((s) => {
      // Calculate average rating
      if (s.ratings.length > 0) {
        const avgRating =
          s.ratings.reduce((sum, rating) => {
            const overallRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + overallRating;
          }, 0) / s.ratings.length;

        gpSatisfactionSum += avgRating;

        // Track ratings by department
        s.submissionLocations.forEach((sl) => {
          const deptName = sl.location.name;
          if (!gpDepartmentRatings[deptName]) {
            gpDepartmentRatings[deptName] = { sum: 0, count: 0 };
          }

          // Add this submission's rating to the department
          gpDepartmentRatings[deptName].sum += avgRating;
          gpDepartmentRatings[deptName].count++;
        });
      }

      if (s.wouldRecommend) {
        gpRecommendCount++;
      }
    });

    // Calculate satisfaction and recommend rate for Occupational Health
    let ohSatisfactionSum = 0;
    let ohRecommendCount = 0;

    // Track ratings by department for Occupational Health
    const ohDepartmentRatings: Record<string, { sum: number; count: number }> =
      {};

    occupationalHealth.forEach((s) => {
      // Calculate average rating
      if (s.ratings.length > 0) {
        const avgRating =
          s.ratings.reduce((sum, rating) => {
            const overallRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + overallRating;
          }, 0) / s.ratings.length;

        ohSatisfactionSum += avgRating;

        // Track ratings by department
        s.submissionLocations.forEach((sl) => {
          const deptName = sl.location.name;
          if (!ohDepartmentRatings[deptName]) {
            ohDepartmentRatings[deptName] = { sum: 0, count: 0 };
          }

          // Add this submission's rating to the department
          ohDepartmentRatings[deptName].sum += avgRating;
          ohDepartmentRatings[deptName].count++;
        });
      }

      if (s.wouldRecommend) {
        ohRecommendCount++;
      }
    });

    // Calculate location stats for each visit purpose
    const gpLocationCounts: Record<string, number> = {};
    const ohLocationCounts: Record<string, number> = {};

    generalPractice.forEach((s) => {
      s.submissionLocations.forEach((sl) => {
        const locName = sl.location.name;
        gpLocationCounts[locName] = (gpLocationCounts[locName] || 0) + 1;
      });
    });

    occupationalHealth.forEach((s) => {
      s.submissionLocations.forEach((sl) => {
        const locName = sl.location.name;
        ohLocationCounts[locName] = (ohLocationCounts[locName] || 0) + 1;
      });
    });

    // Sort locations by frequency for common locations display
    const gpCommonLocations = Object.entries(gpLocationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Instead of just counting visits, also track the most recent visit date
    const ohLocationData: Record<
      string,
      { count: number; lastVisitDate: string }
    > = {};

    occupationalHealth.forEach((s) => {
      s.submissionLocations.forEach((sl) => {
        const locName = sl.location.name;
        if (!ohLocationData[locName]) {
          ohLocationData[locName] = {
            count: 0,
            lastVisitDate: s.submittedAt.toISOString(),
          };
        } else {
          // Update last visit date if this submission is more recent
          if (s.submittedAt > new Date(ohLocationData[locName].lastVisitDate)) {
            ohLocationData[locName].lastVisitDate = s.submittedAt.toISOString();
          }
        }
        ohLocationData[locName].count += 1;
      });
    });

    // When creating the commonLocations array, sort by count first, then by date if counts are equal
    const ohCommonLocations = Object.entries(ohLocationData)
      .map(([name, data]) => ({
        name,
        count: data.count,
        lastVisitDate: data.lastVisitDate,
      }))
      .sort((a, b) => {
        // First sort by count (descending)
        if (b.count !== a.count) return b.count - a.count;
        // If counts are equal, sort by date (most recent first)
        return (
          new Date(b.lastVisitDate).getTime() -
          new Date(a.lastVisitDate).getTime()
        );
      })
      .filter((loc) => loc.name !== "Occupational Health Unit (Medicals)")
      .slice(0, 5); // Show top 5 instead of just 3

    // Calculate average ratings for each department with a minimum threshold of 2 ratings
    const MIN_RATING_THRESHOLD = 2; // Minimum number of ratings to be considered

    const gpDepartmentAverages = Object.entries(gpDepartmentRatings)
      .filter(([_, data]) => data.count >= MIN_RATING_THRESHOLD) // Only include departments with sufficient ratings
      .map(([name, data]) => ({
        name,
        score: Math.round((data.sum / data.count) * 10) / 10,
        count: data.count,
      }))
      .sort((a, b) => b.score - a.score);

    const ohDepartmentAverages = Object.entries(ohDepartmentRatings)
      .filter(
        ([name, data]) =>
          data.count >= MIN_RATING_THRESHOLD && // Only include departments with sufficient ratings
          name !== "Occupational Health Unit (Medicals)" // Exclude the main OH unit
      )
      .map(([name, data]) => ({
        name,
        score: Math.round((data.sum / data.count) * 10) / 10,
        count: data.count,
      }))
      .sort((a, b) => b.score - a.score);

    // Determine top and bottom departments by actual ratings
    const gpTopDept =
      gpDepartmentAverages.length > 0
        ? gpDepartmentAverages[0]
        : { name: gpCommonLocations[0]?.name || "N/A", score: 0 };

    const gpBottomDept =
      gpDepartmentAverages.length > 0
        ? gpDepartmentAverages[gpDepartmentAverages.length - 1]
        : {
            name:
              gpCommonLocations[gpCommonLocations.length - 1]?.name || "N/A",
            score: 0,
          };

    const ohTopDept =
      ohDepartmentAverages.length > 0
        ? ohDepartmentAverages[0]
        : { name: ohCommonLocations[0]?.name || "N/A", score: 0 };

    const ohBottomDept =
      ohDepartmentAverages.length > 0
        ? ohDepartmentAverages[ohDepartmentAverages.length - 1]
        : {
            name:
              ohCommonLocations[ohCommonLocations.length - 1]?.name || "N/A",
            score: 0,
          };

    const result = {
      generalPractice: {
        count: generalPractice.length,
        satisfaction:
          Math.round(
            (gpSatisfactionSum / Math.max(generalPractice.length, 1)) * 10
          ) / 10,
        recommendRate: Math.round(
          (gpRecommendCount / Math.max(generalPractice.length, 1)) * 100
        ),
        topDepartment: gpTopDept,
        bottomDepartment: gpBottomDept,
        commonLocations: gpCommonLocations,
      },
      occupationalHealth: {
        count: occupationalHealth.length,
        satisfaction:
          Math.round(
            (ohSatisfactionSum / Math.max(occupationalHealth.length, 1)) * 10
          ) / 10,
        recommendRate: Math.round(
          (ohRecommendCount / Math.max(occupationalHealth.length, 1)) * 100
        ),
        topDepartment: ohTopDept,
        bottomDepartment: ohBottomDept,
        commonLocations: ohCommonLocations,
      },
    };

    return result;
  } catch (error) {
    console.error("Error fetching visit purpose data:", error);
    return {
      generalPractice: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "N/A", score: 0 },
        bottomDepartment: { name: "N/A", score: 0 },
        commonLocations: [],
      },
      occupationalHealth: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "N/A", score: 0 },
        bottomDepartment: { name: "N/A", score: 0 },
        commonLocations: [],
      },
    };
  }
}

export async function fetchPatientTypeData(): Promise<PatientTypeData> {
  try {
    // Get all submissions with ratings and locations
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
        submissionLocations: {
          include: {
            location: true,
          },
        },
      },
    });

    // Split by patient type
    const newPatients = submissions.filter(
      (s) => s.patientType === "New Patient"
    );
    const returningPatients = submissions.filter(
      (s) => s.patientType === "Returning Patient"
    );

    // Process new patients data
    let newPatientsSatisfactionSum = 0;
    let newPatientsRecommendCount = 0;

    // Track department ratings for new patients
    const newPatientsDepartmentRatings: Record<
      string,
      { sum: number; count: number }
    > = {};

    newPatients.forEach((patient) => {
      // Calculate satisfaction
      if (patient.ratings.length > 0) {
        const avgRating =
          patient.ratings.reduce((sum, rating) => {
            const overallRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + overallRating;
          }, 0) / patient.ratings.length;

        newPatientsSatisfactionSum += avgRating;
      }

      // Count recommendations
      if (patient.wouldRecommend) {
        newPatientsRecommendCount++;
      }

      // Track department ratings
      patient.ratings.forEach((rating) => {
        const locationInfo = patient.submissionLocations.find(
          (sl) => sl.locationId === rating.locationId
        );

        if (locationInfo) {
          const deptName = locationInfo.location.name;
          if (!newPatientsDepartmentRatings[deptName]) {
            newPatientsDepartmentRatings[deptName] = { sum: 0, count: 0 };
          }

          const overallRating =
            rating.overall === "Excellent"
              ? 5
              : rating.overall === "Very Good"
              ? 4
              : rating.overall === "Good"
              ? 3
              : rating.overall === "Fair"
              ? 2
              : rating.overall === "Poor"
              ? 1
              : 0;

          newPatientsDepartmentRatings[deptName].sum += overallRating;
          newPatientsDepartmentRatings[deptName].count++;
        }
      });
    });

    // Process returning patients data
    let returningPatientsSatisfactionSum = 0;
    let returningPatientsRecommendCount = 0;

    // Track department ratings for returning patients
    const returningPatientsDepartmentRatings: Record<
      string,
      { sum: number; count: number }
    > = {};

    returningPatients.forEach((patient) => {
      // Calculate satisfaction
      if (patient.ratings.length > 0) {
        const avgRating =
          patient.ratings.reduce((sum, rating) => {
            const overallRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + overallRating;
          }, 0) / patient.ratings.length;

        returningPatientsSatisfactionSum += avgRating;
      }

      // Count recommendations
      if (patient.wouldRecommend) {
        returningPatientsRecommendCount++;
      }

      // Track department ratings
      patient.ratings.forEach((rating) => {
        const locationInfo = patient.submissionLocations.find(
          (sl) => sl.locationId === rating.locationId
        );

        if (locationInfo) {
          const deptName = locationInfo.location.name;
          if (!returningPatientsDepartmentRatings[deptName]) {
            returningPatientsDepartmentRatings[deptName] = { sum: 0, count: 0 };
          }

          const overallRating =
            rating.overall === "Excellent"
              ? 5
              : rating.overall === "Very Good"
              ? 4
              : rating.overall === "Good"
              ? 3
              : rating.overall === "Fair"
              ? 2
              : rating.overall === "Poor"
              ? 1
              : 0;

          returningPatientsDepartmentRatings[deptName].sum += overallRating;
          returningPatientsDepartmentRatings[deptName].count++;
        }
      });
    });

    // Calculate top and bottom departments for new patients
    const newPatientsDeptRatings = Object.entries(newPatientsDepartmentRatings)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        score: Math.round((data.sum / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.score - a.score);

    const newPatientsTopDept =
      newPatientsDeptRatings.length > 0
        ? newPatientsDeptRatings[0]
        : { name: "N/A", score: 0 };

    const newPatientsBottomDept =
      newPatientsDeptRatings.length > 0
        ? newPatientsDeptRatings[newPatientsDeptRatings.length - 1]
        : { name: "N/A", score: 0 };

    // Calculate top and bottom departments for returning patients
    const returningPatientsDeptRatings = Object.entries(
      returningPatientsDepartmentRatings
    )
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        score: Math.round((data.sum / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.score - a.score);

    const returningPatientsTopDept =
      returningPatientsDeptRatings.length > 0
        ? returningPatientsDeptRatings[0]
        : { name: "N/A", score: 0 };

    const returningPatientsBottomDept =
      returningPatientsDeptRatings.length > 0
        ? returningPatientsDeptRatings[returningPatientsDeptRatings.length - 1]
        : { name: "N/A", score: 0 };

    const result = {
      newPatients: {
        count: newPatients.length,
        satisfaction:
          newPatients.length > 0
            ? Math.round(
                (newPatientsSatisfactionSum / newPatients.length) * 10
              ) / 10
            : 0,
        recommendRate:
          newPatients.length > 0
            ? Math.round((newPatientsRecommendCount / newPatients.length) * 100)
            : 0,
        topDepartment: newPatientsTopDept,
        bottomDepartment: newPatientsBottomDept,
      },
      returningPatients: {
        count: returningPatients.length,
        satisfaction:
          returningPatients.length > 0
            ? Math.round(
                (returningPatientsSatisfactionSum / returningPatients.length) *
                  10
              ) / 10
            : 0,
        recommendRate:
          returningPatients.length > 0
            ? Math.round(
                (returningPatientsRecommendCount / returningPatients.length) *
                  100
              )
            : 0,
        topDepartment: returningPatientsTopDept,
        bottomDepartment: returningPatientsBottomDept,
      },
    };

    return result;
  } catch (error) {
    console.error("Error fetching patient type data:", error);
    return {
      newPatients: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "N/A", score: 0 },
        bottomDepartment: { name: "N/A", score: 0 },
      },
      returningPatients: {
        count: 0,
        satisfaction: 0,
        recommendRate: 0,
        topDepartment: { name: "N/A", score: 0 },
        bottomDepartment: { name: "N/A", score: 0 },
      },
    };
  }
}

export async function fetchVisitTimeData(): Promise<any[]> {
  try {
    // Get all submissions ordered by date
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

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
    submissions.forEach((submission) => {
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
        if (submission.ratings.length > 0) {
          const avgRating =
            submission.ratings.reduce((sum, rating) => {
              const overallRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;
              return sum + overallRating;
            }, 0) / submission.ratings.length;

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

    return visitTimeData;
  } catch (error) {
    console.error("Error fetching visit time data:", error);
    return [];
  }
}

// Add new function to fetch user type distribution
export async function fetchUserTypeDistribution(): Promise<{
  distribution: UserTypeDistribution[];
  insight: string;
}> {
  try {
    console.log("Fetching user type distribution data...");

    // Get all survey submissions
    const submissions = await prisma.surveySubmission.findMany();

    // Count user types
    const userTypeCounts: Record<string, number> = {};

    submissions.forEach((submission) => {
      if (submission.userType) {
        userTypeCounts[submission.userType] =
          (userTypeCounts[submission.userType] || 0) + 1;
      }
    });

    // Format data for visualization
    const distribution = Object.entries(userTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Generate insight based on data
    let insight = "";
    if (distribution.length > 0) {
      const totalUsers = distribution.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const largestGroup = distribution[0];
      const percentage = ((largestGroup.value / totalUsers) * 100).toFixed(1);

      insight = `${largestGroup.name} is the most common user type, representing ${percentage}% of all respondents. Understanding this distribution helps in tailoring services to meet the specific needs of your main user groups.`;
    } else {
      insight =
        "No user type data is available yet. As more surveys are collected, insights about your user demographics will appear here.";
    }

    // Ensure there's always something to display
    const finalDistribution =
      distribution.length > 0
        ? distribution
        : [
            { name: "AGAG Employee", value: 0 },
            { name: "AGAG/Contractor Dependant", value: 0 },
            { name: "Other Corporate Employee", value: 0 },
            { name: "Contractor Employee", value: 0 },
          ];

    return {
      distribution: finalDistribution,
      insight,
    };
  } catch (error) {
    console.error("Error fetching user type distribution:", error);
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

// Update fetchOverviewData with better logging
export async function fetchOverviewData(): Promise<OverviewData> {
  try {
    const surveyData = await fetchAllSurveyData();

    const visitPurposeData = await fetchVisitPurposeData();

    const patientTypeData = await fetchPatientTypeData();

    const visitTimeData = await fetchVisitTimeData();

    const satisfactionByDemographic = await fetchSatisfactionByDemographic();

    const visitTimeAnalysis = await fetchVisitTimeAnalysis();

    const improvementAreas = await fetchTopImprovementAreas();

    const userTypeData = await fetchUserTypeDistribution();

    const result = {
      surveyData,
      visitPurposeData,
      patientTypeData,
      visitTimeData,
      satisfactionByDemographic,
      visitTimeAnalysis,
      improvementAreas,
      userTypeData,
    };

    return result;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
}

// Fix the fetchDepartments function to use camelCase in the database queries
export async function fetchDepartments(): Promise<DepartmentData[]> {
  try {
    console.log("fetchDepartments: Starting query...");

    // Get all locations from the database
    const locations = await prisma.location.findMany({
      where: {
        locationType: "department",
      },
    });

    console.log(`fetchDepartments: Found ${locations.length} departments`);

    // Get all submissions that include these locations
    const submissionLocations = await prisma.submissionLocation.findMany({
      include: {
        location: true,
        submission: {
          include: {
            ratings: true,
          },
        },
      },
      where: {
        location: {
          locationType: "department",
        },
      },
    });

    console.log(
      `fetchDepartments: Found ${submissionLocations.length} submission locations`
    );

    // Count submissions per location and calculate metrics
    const departmentMap = new Map<
      string,
      {
        id: string;
        name: string;
        type: string;
        visitCount: number;
        recommendCount: number;
        ratings: {
          reception: { sum: number; count: number };
          professionalism: { sum: number; count: number };
          understanding: { sum: number; count: number };
          "promptness-care": { sum: number; count: number };
          "promptness-feedback": { sum: number; count: number };
          overall: { sum: number; count: number };
        };
      }
    >();

    // Initialize department map for all locations
    locations.forEach((location) => {
      departmentMap.set(location.id.toString(), {
        id: location.id.toString(),
        name: location.name,
        type: "department",
        visitCount: 0,
        recommendCount: 0,
        ratings: {
          reception: { sum: 0, count: 0 },
          professionalism: { sum: 0, count: 0 },
          understanding: { sum: 0, count: 0 },
          "promptness-care": { sum: 0, count: 0 },
          "promptness-feedback": { sum: 0, count: 0 },
          overall: { sum: 0, count: 0 },
        },
      });
    });

    // Process each submission location
    submissionLocations.forEach((sl) => {
      const locationId = sl.location.id.toString();
      const dept = departmentMap.get(locationId);

      if (dept) {
        // Count visit
        dept.visitCount++;

        // Count recommendation
        if (sl.submission.wouldRecommend) {
          dept.recommendCount++;
        }

        // Process ratings
        sl.submission.ratings.forEach((rating) => {
          // Handle each rating category
          if (rating.reception) {
            const value =
              rating.reception === "Excellent"
                ? 5
                : rating.reception === "Very Good"
                ? 4
                : rating.reception === "Good"
                ? 3
                : rating.reception === "Fair"
                ? 2
                : rating.reception === "Poor"
                ? 1
                : 0;

            dept.ratings.reception.sum += value;
            dept.ratings.reception.count++;
          }

          if (rating.professionalism) {
            const value =
              rating.professionalism === "Excellent"
                ? 5
                : rating.professionalism === "Very Good"
                ? 4
                : rating.professionalism === "Good"
                ? 3
                : rating.professionalism === "Fair"
                ? 2
                : rating.professionalism === "Poor"
                ? 1
                : 0;

            dept.ratings.professionalism.sum += value;
            dept.ratings.professionalism.count++;
          }

          if (rating.understanding) {
            const value =
              rating.understanding === "Excellent"
                ? 5
                : rating.understanding === "Very Good"
                ? 4
                : rating.understanding === "Good"
                ? 3
                : rating.understanding === "Fair"
                ? 2
                : rating.understanding === "Poor"
                ? 1
                : 0;

            dept.ratings.understanding.sum += value;
            dept.ratings.understanding.count++;
          }

          if (rating.promptnessCare) {
            const value =
              rating.promptnessCare === "Excellent"
                ? 5
                : rating.promptnessCare === "Very Good"
                ? 4
                : rating.promptnessCare === "Good"
                ? 3
                : rating.promptnessCare === "Fair"
                ? 2
                : rating.promptnessCare === "Poor"
                ? 1
                : 0;

            dept.ratings["promptness-care"].sum += value;
            dept.ratings["promptness-care"].count++;
          }

          if (rating.promptnessFeedback) {
            const value =
              rating.promptnessFeedback === "Excellent"
                ? 5
                : rating.promptnessFeedback === "Very Good"
                ? 4
                : rating.promptnessFeedback === "Good"
                ? 3
                : rating.promptnessFeedback === "Fair"
                ? 2
                : rating.promptnessFeedback === "Poor"
                ? 1
                : 0;

            dept.ratings["promptness-feedback"].sum += value;
            dept.ratings["promptness-feedback"].count++;
          }

          if (rating.overall) {
            const value =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;

            dept.ratings.overall.sum += value;
            dept.ratings.overall.count++;
          }
        });
      }
    });

    // Convert the map to array and calculate averages
    const departmentsData: DepartmentData[] = Array.from(
      departmentMap.values()
    ).map((dept) => {
      // Calculate recommend rate
      const recommendRate =
        dept.visitCount > 0
          ? Math.round((dept.recommendCount / dept.visitCount) * 100)
          : 0;

      // Calculate average ratings
      const ratings = {
        reception:
          dept.ratings.reception.count > 0
            ? Number(
                (
                  dept.ratings.reception.sum / dept.ratings.reception.count
                ).toFixed(1)
              )
            : 0,
        professionalism:
          dept.ratings.professionalism.count > 0
            ? Number(
                (
                  dept.ratings.professionalism.sum /
                  dept.ratings.professionalism.count
                ).toFixed(1)
              )
            : 0,
        understanding:
          dept.ratings.understanding.count > 0
            ? Number(
                (
                  dept.ratings.understanding.sum /
                  dept.ratings.understanding.count
                ).toFixed(1)
              )
            : 0,
        "promptness-care":
          dept.ratings["promptness-care"].count > 0
            ? Number(
                (
                  dept.ratings["promptness-care"].sum /
                  dept.ratings["promptness-care"].count
                ).toFixed(1)
              )
            : 0,
        "promptness-feedback":
          dept.ratings["promptness-feedback"].count > 0
            ? Number(
                (
                  dept.ratings["promptness-feedback"].sum /
                  dept.ratings["promptness-feedback"].count
                ).toFixed(1)
              )
            : 0,
        overall:
          dept.ratings.overall.count > 0
            ? Number(
                (dept.ratings.overall.sum / dept.ratings.overall.count).toFixed(
                  1
                )
              )
            : 0,
      };

      // Calculate overall satisfaction as average of all ratings or use overall rating if available
      const overallValues = Object.values(ratings).filter((val) => val > 0);
      const satisfaction =
        ratings.overall > 0
          ? ratings.overall
          : overallValues.length > 0
          ? Number(
              (
                overallValues.reduce((a, b) => a + b, 0) / overallValues.length
              ).toFixed(1)
            )
          : 0;

      return {
        id: dept.id,
        name: dept.name,
        type: dept.type,
        visitCount: dept.visitCount,
        satisfaction,
        recommendRate,
        ratings,
      };
    });

    console.log(
      `fetchDepartments: Processed ${departmentsData.length} departments with data`
    );
    return departmentsData;
  } catch (error) {
    console.error("Error fetching departments data:", error);
    return [];
  }
}

// Function to fetch real ward data
export async function fetchWards(): Promise<WardData[]> {
  try {
    console.log("fetchWards: Starting query...");

    // Get all locations from the database with type "ward"
    const locations = await prisma.location.findMany({
      where: {
        locationType: "ward",
      },
    });

    console.log(`fetchWards: Found ${locations.length} wards`);

    // Get all submissions that include these locations
    const submissionLocations = await prisma.submissionLocation.findMany({
      include: {
        location: true,
        submission: {
          include: {
            ratings: true,
          },
        },
      },
      where: {
        location: {
          locationType: "ward",
        },
      },
    });

    console.log(
      `fetchWards: Found ${submissionLocations.length} submission locations for wards`
    );

    // Count submissions per location and calculate metrics
    const wardMap = new Map<
      string,
      {
        id: string;
        name: string;
        type: string;
        visitCount: number;
        recommendCount: number;
        ratings: {
          reception: { sum: number; count: number };
          professionalism: { sum: number; count: number };
          understanding: { sum: number; count: number };
          "promptness-care": { sum: number; count: number };
          "promptness-feedback": { sum: number; count: number };
          overall: { sum: number; count: number };
        };
      }
    >();

    // Initialize ward map for all locations
    locations.forEach((location) => {
      wardMap.set(location.id.toString(), {
        id: location.id.toString(),
        name: location.name,
        type: "ward",
        visitCount: 0,
        recommendCount: 0,
        ratings: {
          reception: { sum: 0, count: 0 },
          professionalism: { sum: 0, count: 0 },
          understanding: { sum: 0, count: 0 },
          "promptness-care": { sum: 0, count: 0 },
          "promptness-feedback": { sum: 0, count: 0 },
          overall: { sum: 0, count: 0 },
        },
      });
    });

    // Process each submission location
    submissionLocations.forEach((sl) => {
      const locationId = sl.location.id.toString();
      const ward = wardMap.get(locationId);

      if (ward) {
        // Count visit
        ward.visitCount++;

        // Count recommendation
        if (sl.submission.wouldRecommend) {
          ward.recommendCount++;
        }

        // Process ratings
        sl.submission.ratings.forEach((rating) => {
          // Handle each rating category
          if (rating.reception) {
            const value =
              rating.reception === "Excellent"
                ? 5
                : rating.reception === "Very Good"
                ? 4
                : rating.reception === "Good"
                ? 3
                : rating.reception === "Fair"
                ? 2
                : rating.reception === "Poor"
                ? 1
                : 0;

            ward.ratings.reception.sum += value;
            ward.ratings.reception.count++;
          }

          if (rating.professionalism) {
            const value =
              rating.professionalism === "Excellent"
                ? 5
                : rating.professionalism === "Very Good"
                ? 4
                : rating.professionalism === "Good"
                ? 3
                : rating.professionalism === "Fair"
                ? 2
                : rating.professionalism === "Poor"
                ? 1
                : 0;

            ward.ratings.professionalism.sum += value;
            ward.ratings.professionalism.count++;
          }

          if (rating.understanding) {
            const value =
              rating.understanding === "Excellent"
                ? 5
                : rating.understanding === "Very Good"
                ? 4
                : rating.understanding === "Good"
                ? 3
                : rating.understanding === "Fair"
                ? 2
                : rating.understanding === "Poor"
                ? 1
                : 0;

            ward.ratings.understanding.sum += value;
            ward.ratings.understanding.count++;
          }

          if (rating.promptnessCare) {
            const value =
              rating.promptnessCare === "Excellent"
                ? 5
                : rating.promptnessCare === "Very Good"
                ? 4
                : rating.promptnessCare === "Good"
                ? 3
                : rating.promptnessCare === "Fair"
                ? 2
                : rating.promptnessCare === "Poor"
                ? 1
                : 0;

            ward.ratings["promptness-care"].sum += value;
            ward.ratings["promptness-care"].count++;
          }

          if (rating.promptnessFeedback) {
            const value =
              rating.promptnessFeedback === "Excellent"
                ? 5
                : rating.promptnessFeedback === "Very Good"
                ? 4
                : rating.promptnessFeedback === "Good"
                ? 3
                : rating.promptnessFeedback === "Fair"
                ? 2
                : rating.promptnessFeedback === "Poor"
                ? 1
                : 0;

            ward.ratings["promptness-feedback"].sum += value;
            ward.ratings["promptness-feedback"].count++;
          }

          if (rating.overall) {
            const value =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;

            ward.ratings.overall.sum += value;
            ward.ratings.overall.count++;
          }
        });
      }
    });

    // Convert the map to array and calculate averages
    const wardsData: WardData[] = Array.from(wardMap.values()).map((ward) => {
      // Calculate recommend rate
      const recommendRate =
        ward.visitCount > 0
          ? Math.round((ward.recommendCount / ward.visitCount) * 100)
          : 0;

      // Calculate average ratings
      const ratings = {
        reception:
          ward.ratings.reception.count > 0
            ? Number(
                (
                  ward.ratings.reception.sum / ward.ratings.reception.count
                ).toFixed(1)
              )
            : 0,
        professionalism:
          ward.ratings.professionalism.count > 0
            ? Number(
                (
                  ward.ratings.professionalism.sum /
                  ward.ratings.professionalism.count
                ).toFixed(1)
              )
            : 0,
        understanding:
          ward.ratings.understanding.count > 0
            ? Number(
                (
                  ward.ratings.understanding.sum /
                  ward.ratings.understanding.count
                ).toFixed(1)
              )
            : 0,
        "promptness-care":
          ward.ratings["promptness-care"].count > 0
            ? Number(
                (
                  ward.ratings["promptness-care"].sum /
                  ward.ratings["promptness-care"].count
                ).toFixed(1)
              )
            : 0,
        "promptness-feedback":
          ward.ratings["promptness-feedback"].count > 0
            ? Number(
                (
                  ward.ratings["promptness-feedback"].sum /
                  ward.ratings["promptness-feedback"].count
                ).toFixed(1)
              )
            : 0,
        overall:
          ward.ratings.overall.count > 0
            ? Number(
                (ward.ratings.overall.sum / ward.ratings.overall.count).toFixed(
                  1
                )
              )
            : 0,
      };

      // Calculate overall satisfaction as average of all ratings or use overall rating if available
      const overallValues = Object.values(ratings).filter((val) => val > 0);
      const satisfaction =
        ratings.overall > 0
          ? ratings.overall
          : overallValues.length > 0
          ? Number(
              (
                overallValues.reduce((a, b) => a + b, 0) / overallValues.length
              ).toFixed(1)
            )
          : 0;

      // Random sensible values for capacity and occupancy since these are typically in the ward system
      // In a real application, these would come from a ward management system
      const capacity = Math.floor(Math.random() * 20) + 10; // 10-30 beds
      const occupancy = Math.floor(Math.random() * capacity); // Random occupancy below capacity

      return {
        id: ward.id,
        name: ward.name,
        type: ward.type,
        visitCount: ward.visitCount,
        satisfaction,
        recommendRate,
        ratings,
        capacity,
        occupancy,
      };
    });

    console.log(`fetchWards: Processed ${wardsData.length} wards with data`);
    return wardsData;
  } catch (error) {
    console.error("Error fetching wards data:", error);
    return [];
  }
}

// Fetch occupational health specific data
export async function fetchOccupationalHealthData(): Promise<{
  ohData: OccupationalHealthData | null;
  ohConcerns: DepartmentConcern[];
}> {
  try {
    console.log("Fetching occupational health specific data...");

    // Get all submissions with occupational health visit purpose
    const ohSubmissions = await prisma.surveySubmission.findMany({
      where: {
        visitPurpose: "Medicals (Occupational Health)",
      },
      include: {
        ratings: true,
        submissionLocations: {
          include: {
            location: true,
          },
        },
        departmentConcerns: {
          include: {
            location: true,
          },
        },
      },
    });

    console.log(
      `Found ${ohSubmissions.length} occupational health submissions`
    );

    // If no data found, return null with empty concerns
    if (ohSubmissions.length === 0) {
      return { ohData: null, ohConcerns: [] };
    }

    // Calculate visit count
    const visitCount = ohSubmissions.length;

    // Track ratings by location
    const locationRatings: Record<string, { sum: number; count: number }> = {};

    // Calculate satisfaction from ratings (if available)
    let totalSatisfaction = 0;
    let totalRecommend = 0;
    let ratingCount = 0;

    // Initialize ratings object
    const aggregatedRatings: Record<string, number> = {
      reception: 0,
      professionalism: 0,
      understanding: 0,
      "promptness-care": 0,
      "promptness-feedback": 0,
      overall: 0,
    };

    const ratingCounts: Record<string, number> = {
      reception: 0,
      professionalism: 0,
      understanding: 0,
      "promptness-care": 0,
      "promptness-feedback": 0,
      overall: 0,
    };

    // Process each submission's ratings
    for (const submission of ohSubmissions) {
      // Calculate overall satisfaction
      if (submission.ratings && submission.ratings.length > 0) {
        // Average the overall ratings for this submission
        const submissionOverallRating =
          submission.ratings.reduce((sum: number, rating: any) => {
            // Convert string ratings to numbers (1-5 scale)
            const numericRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;

            return sum + numericRating;
          }, 0) / submission.ratings.length;

        totalSatisfaction += submissionOverallRating;
        ratingCount++;

        // Track ratings by location
        if (
          submission.submissionLocations &&
          submission.submissionLocations.length > 0
        ) {
          submission.submissionLocations.forEach((submissionLocation) => {
            const locationName = submissionLocation.location.name;

            // Initialize location in tracking if not exists
            if (!locationRatings[locationName]) {
              locationRatings[locationName] = { sum: 0, count: 0 };
            }

            // Add this submission's rating to the location
            locationRatings[locationName].sum += submissionOverallRating;
            locationRatings[locationName].count++;
          });
        }
      }

      // Count recommendation
      if (submission.wouldRecommend) {
        totalRecommend++;
      }

      // Process detailed ratings
      if (submission.ratings) {
        for (const rating of submission.ratings) {
          const processRating = (field: string, value: string | null) => {
            if (!value) return; // Skip if null

            const numericValue =
              value === "Excellent"
                ? 5
                : value === "Very Good"
                ? 4
                : value === "Good"
                ? 3
                : value === "Fair"
                ? 2
                : value === "Poor"
                ? 1
                : 0;

            if (numericValue > 0) {
              aggregatedRatings[field] =
                (aggregatedRatings[field] || 0) + numericValue;
              ratingCounts[field] = (ratingCounts[field] || 0) + 1;
            }
          };

          // Process each rating field
          processRating("reception", rating.reception);
          processRating("professionalism", rating.professionalism);
          processRating("understanding", rating.understanding);
          processRating("promptness-care", rating.promptnessCare);
          processRating("promptness-feedback", rating.promptnessFeedback);
          processRating("overall", rating.overall);
        }
      }
    }

    // Calculate averages for each rating category
    const finalRatings = {
      reception:
        ratingCounts.reception > 0
          ? aggregatedRatings.reception / ratingCounts.reception
          : 0,
      professionalism:
        ratingCounts.professionalism > 0
          ? aggregatedRatings.professionalism / ratingCounts.professionalism
          : 0,
      understanding:
        ratingCounts.understanding > 0
          ? aggregatedRatings.understanding / ratingCounts.understanding
          : 0,
      "promptness-care":
        ratingCounts["promptness-care"] > 0
          ? aggregatedRatings["promptness-care"] /
            ratingCounts["promptness-care"]
          : 0,
      "promptness-feedback":
        ratingCounts["promptness-feedback"] > 0
          ? aggregatedRatings["promptness-feedback"] /
            ratingCounts["promptness-feedback"]
          : 0,
      overall:
        ratingCounts.overall > 0
          ? aggregatedRatings.overall / ratingCounts.overall
          : 0,
    };

    // Calculate overall metrics
    const avgSatisfaction =
      ratingCount > 0 ? totalSatisfaction / ratingCount : 0;
    const recommendRate =
      visitCount > 0 ? (totalRecommend / visitCount) * 100 : 0;

    // Calculate average ratings per location and prepare top/lowest lists
    const locationAverages = Object.entries(locationRatings)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        rating: Number((data.sum / data.count).toFixed(1)),
      }))
      .filter((loc) => loc.name !== "Occupational Health Unit (Medicals)"); // Exclude the main OH unit itself

    // Sort by rating (descending for top, ascending for lowest)
    const topRatedLocations = [...locationAverages]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3); // Get top 3

    const lowestRatedLocations = [...locationAverages]
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3); // Get bottom 3

    console.log("Top rated locations during OH visits:", topRatedLocations);
    console.log(
      "Lowest rated locations during OH visits:",
      lowestRatedLocations
    );

    // Format concerns
    const ohConcerns: DepartmentConcern[] = ohSubmissions.flatMap(
      (submission) => {
        if (!submission.departmentConcerns) return [];

        return submission.departmentConcerns.map((concern) => ({
          submissionId: submission.id,
          submittedAt: submission.submittedAt.toISOString(),
          locationName: concern.location.name,
          concern: concern.concern,
          visitPurpose: submission.visitPurpose,
          patientType: submission.patientType,
          userType: submission.userType,
        }));
      }
    );

    // Create occupational health data object
    const ohData: OccupationalHealthData = {
      id: "occupational-health",
      name: "Occupational Health Unit (Medicals)",
      visitCount,
      satisfaction: avgSatisfaction,
      recommendRate,
      ratings: finalRatings,
      topRatedLocations,
      lowestRatedLocations,
    };

    return {
      ohData,
      ohConcerns,
    };
  } catch (error) {
    console.error("Error fetching occupational health data:", error);
    return {
      ohData: null,
      ohConcerns: [],
    };
  }
}

// Fix the property names in the fetchOverallSatisfactionDistribution function
export async function fetchOverallSatisfactionDistribution(): Promise<
  { name: string; value: number }[]
> {
  try {
    console.log("Fetching overall satisfaction distribution...");

    // Get all survey submissions with ratings
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    // Initialize counters for all possible rating values (1-5)
    const distribution: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };

    // Count occurrences of each rating
    submissions.forEach((submission) => {
      // Calculate the numeric overall rating from ratings
      let overallRating = 0;

      if (submission.ratings && submission.ratings.length > 0) {
        // Average the overall ratings for this submission
        overallRating = Math.round(
          submission.ratings.reduce((sum, rating) => {
            // Convert string ratings to numbers (1-5 scale)
            const numericRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + numericRating;
          }, 0) / submission.ratings.length
        );
      }

      // Log each submission's calculated rating for debugging
      console.log(
        `Submission ${submission.id}: calculated rating=${overallRating}`
      );

      // Get rating as string to use as key in distribution
      const rating = overallRating.toString();

      // Handle any ratings outside 1-5 range
      if (rating >= "1" && rating <= "5") {
        distribution[rating] = (distribution[rating] || 0) + 1;
      } else {
        console.log(`Found rating outside 1-5 range: ${rating}`);
      }
    });

    console.log("Overall satisfaction distribution:", distribution);

    // Convert to array format expected by pie chart
    const result = Object.entries(distribution).map(([name, value]) => ({
      name,
      value: value as number,
    }));

    // Sort by rating (1-5)
    result.sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return result;
  } catch (error) {
    console.error("Error fetching overall satisfaction distribution:", error);
    // Return empty distribution with all rating values
    return [
      { name: "1", value: 0 },
      { name: "2", value: 0 },
      { name: "3", value: 0 },
      { name: "4", value: 0 },
      { name: "5", value: 0 },
    ];
  }
}

// Add these interfaces to match the ones from report-actions.ts
export interface SurveyData {
  id: string | number;
  created_at: string;
  overall_rating: number;
  recommendation_rating: number;
  visit_purpose?: string;
  locations_visited?: string[];
}

export interface DepartmentRating {
  locationId: number;
  locationName: string;
  category: string;
  rating: string;
  count: number;
}

export interface LocationVisit {
  location: string;
  visit_count: number;
  average_rating: number;
}

// Add these functions to match the ones from report-actions.ts
export async function getSurveyData(): Promise<SurveyData[]> {
  try {
    const surveys = await prisma.surveySubmission.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        submissionLocations: {
          include: {
            location: true,
          },
        },
        ratings: true,
      },
    });

    // Transform the data to match the expected SurveyData interface
    const formattedData = surveys.map((survey) => {
      // Calculate the actual overall rating based on ratings
      let overallRating = 0;
      if (survey.ratings && survey.ratings.length > 0) {
        // Average the overall ratings for this submission
        overallRating =
          survey.ratings.reduce((sum, rating) => {
            // Convert string ratings to numbers (1-5 scale)
            const numericRating =
              rating.overall === "Excellent"
                ? 5
                : rating.overall === "Very Good"
                ? 4
                : rating.overall === "Good"
                ? 3
                : rating.overall === "Fair"
                ? 2
                : rating.overall === "Poor"
                ? 1
                : 0;
            return sum + numericRating;
          }, 0) / survey.ratings.length;
      }

      return {
        id: survey.id,
        created_at: survey.submittedAt.toISOString(),
        overall_rating: Math.round(overallRating * 10) / 10, // Round to 1 decimal place
        recommendation_rating: survey.wouldRecommend ? 10 : 0,
        visit_purpose: survey.visitPurpose,
        locations_visited: survey.submissionLocations.map(
          (sl) => sl.location.name
        ),
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error in getSurveyData:", error);
    // Return empty array instead of mock data
    return [];
  }
}

// Get department ratings
export async function getDepartmentRatings(): Promise<DepartmentRating[]> {
  try {
    // Get all ratings
    const allRatings = await prisma.rating.findMany({
      include: {
        location: true,
      },
    });

    // Group ratings by location, category, and rating value to count occurrences
    const ratingGroups: Record<string, DepartmentRating> = {};

    for (const rating of allRatings) {
      if (rating.location.locationType !== "department") continue;

      // Process each rating category
      const processCategory = (category: string, value: string | null) => {
        if (!value) return; // Skip if no rating

        const key = `${rating.locationId}-${category}-${value}`;

        if (!ratingGroups[key]) {
          ratingGroups[key] = {
            locationId: rating.locationId,
            locationName: rating.location.name,
            category,
            rating: value,
            count: 0,
          };
        }

        ratingGroups[key].count++;
      };

      // Process each rating field
      processCategory("reception", rating.reception);
      processCategory("professionalism", rating.professionalism);
      processCategory("understanding", rating.understanding);
      processCategory("promptness-care", rating.promptnessCare);
      processCategory("promptness-feedback", rating.promptnessFeedback);
      processCategory("overall", rating.overall);
    }

    // Convert groups to array
    const departmentRatings = Object.values(ratingGroups);

    return departmentRatings;
  } catch (error) {
    console.error("Error in getDepartmentRatings:", error);
    return [];
  }
}

// Get location visits
export async function getLocationVisits(): Promise<LocationVisit[]> {
  try {
    // Query to get count of visits per location
    const locationCounts = await prisma.submissionLocation.groupBy({
      by: ["locationId"],
      _count: {
        locationId: true,
      },
    });

    // Get location details and calculate average ratings
    const locationData = await Promise.all(
      locationCounts.map(async (count) => {
        const location = await prisma.location.findUnique({
          where: { id: count.locationId },
          include: {
            ratings: true,
          },
        });

        if (!location) {
          return {
            location: "Unknown",
            visit_count: count._count.locationId,
            average_rating: 0,
          };
        }

        // Calculate average rating if ratings exist
        let totalRating = 0;
        let ratingCount = 0;

        // Get all ratings for this location
        const locationRatings = await prisma.rating.findMany({
          where: { locationId: location.id },
        });

        // Calculate average rating
        if (locationRatings.length > 0) {
          locationRatings.forEach((rating) => {
            if (rating.overall) {
              const numericRating =
                rating.overall === "Excellent"
                  ? 5
                  : rating.overall === "Very Good"
                  ? 4
                  : rating.overall === "Good"
                  ? 3
                  : rating.overall === "Fair"
                  ? 2
                  : rating.overall === "Poor"
                  ? 1
                  : 0;

              if (numericRating > 0) {
                totalRating += numericRating;
                ratingCount++;
              }
            }
          });
        }

        const averageRating =
          ratingCount > 0
            ? Math.round((totalRating / ratingCount) * 10) / 10
            : 0;

        return {
          location: location.name,
          visit_count: count._count.locationId,
          average_rating: averageRating,
        };
      })
    );

    return locationData;
  } catch (error) {
    console.error("Error in getLocationVisits:", error);
    return [];
  }
}

// New interface to represent a detailed submission
export interface DetailedSubmission {
  id: string;
  submittedAt: string;
  visitTime: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  wouldRecommend: boolean;
  recommendation: string | null;
  whyNotRecommend: string | null;
  locations: {
    id: number;
    name: string;
    type: string;
  }[];
  ratings: {
    locationId: number;
    locationName: string;
    reception: string | null;
    professionalism: string | null;
    understanding: string | null;
    promptnessCare: string | null;
    promptnessFeedback: string | null;
    overall: string | null;
  }[];
  concerns: {
    locationId: number;
    locationName: string;
    concern: string;
  }[];
  generalObservation: {
    cleanliness: string | null;
    facilities: string | null;
    security: string | null;
    overall: string | null;
  };
}

// Get a specific survey submission by ID
export async function getSubmissionById(
  id: string
): Promise<DetailedSubmission | null> {
  try {
    const submission = await prisma.surveySubmission.findUnique({
      where: { id },
      include: {
        submissionLocations: {
          include: {
            location: true,
          },
        },
        ratings: {
          include: {
            location: true,
          },
        },
        departmentConcerns: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!submission) {
      return null;
    }

    // Format ratings by location
    const formattedRatings = submission.ratings.map((rating) => ({
      locationId: rating.locationId,
      locationName: rating.location.name,
      reception: rating.reception,
      professionalism: rating.professionalism,
      understanding: rating.understanding,
      promptnessCare: rating.promptnessCare,
      promptnessFeedback: rating.promptnessFeedback,
      overall: rating.overall,
    }));

    // Format concerns by location
    const formattedConcerns = submission.departmentConcerns.map((concern) => ({
      locationId: concern.locationId,
      locationName: concern.location.name,
      concern: concern.concern,
    }));

    // Format locations
    const formattedLocations = submission.submissionLocations.map((sl) => ({
      id: sl.location.id,
      name: sl.location.name,
      type: sl.location.locationType,
    }));

    // Simplify the general observation extraction - we'll use a dummy approach
    // since we're encountering type issues with the rating schema
    const generalObservation = {
      cleanliness: null,
      facilities: null,
      security: null,
      overall: null,
    };

    return {
      id: submission.id,
      submittedAt: submission.submittedAt.toISOString(),
      visitTime: submission.visitTime,
      visitPurpose: submission.visitPurpose,
      patientType: submission.patientType,
      userType: submission.userType,
      wouldRecommend: submission.wouldRecommend ?? false, // Default to false if null
      recommendation: submission.recommendation,
      whyNotRecommend: submission.whyNotRecommend,
      locations: formattedLocations,
      ratings: formattedRatings,
      concerns: formattedConcerns,
      generalObservation,
    };
  } catch (error) {
    console.error("Error fetching submission by ID:", error);
    return null;
  }
}
