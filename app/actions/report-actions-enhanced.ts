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

export interface OverviewData {
  surveyData: any[];
  visitPurposeData: VisitPurposeData;
  patientTypeData: PatientTypeData;
  visitTimeData: any[];
  satisfactionByDemographic: DemographicSatisfaction;
  visitTimeAnalysis: VisitTimeAnalysis[];
  improvementAreas: ImprovementArea[];
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

    console.log("Visit time analysis:", result);
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

    console.log("Improvement areas:", improvementAreas);
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
    console.log("fetchAllSurveyData: Starting query...");
    // Query all submissions without filtering
    const data = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    console.log(`fetchAllSurveyData: Found ${data.length} submissions`, {
      firstSubmissionDate: data.length > 0 ? data[0].submittedAt : null,
      willRecommendCount: data.filter((s) => s.wouldRecommend === true).length,
      willNotRecommendCount: data.filter((s) => s.wouldRecommend === false)
        .length,
      visitPurposes: [...new Set(data.map((s) => s.visitPurpose))],
      patientTypes: [...new Set(data.map((s) => s.patientType))],
      userTypes: [...new Set(data.map((s) => s.userType))],
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

    console.log("fetchAllSurveyData: Data processing complete");
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
      }

      if (s.wouldRecommend) {
        gpRecommendCount++;
      }
    });

    // Calculate satisfaction and recommend rate for Occupational Health
    let ohSatisfactionSum = 0;
    let ohRecommendCount = 0;

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

    // Sort locations by frequency
    const gpCommonLocations = Object.entries(gpLocationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    const ohCommonLocations = Object.entries(ohLocationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Determine top and bottom departments by satisfaction
    const gpTopDept = {
      name: gpCommonLocations[0]?.name || "N/A",
      score:
        Math.round(
          (gpSatisfactionSum / Math.max(generalPractice.length, 1)) * 10
        ) / 10,
    };
    const gpBottomDept = {
      name: gpCommonLocations[gpCommonLocations.length - 1]?.name || "N/A",
      score:
        Math.round(
          (gpSatisfactionSum / Math.max(generalPractice.length, 1)) * 10
        ) / 10,
    };

    const ohTopDept = {
      name: ohCommonLocations[0]?.name || "N/A",
      score:
        Math.round(
          (ohSatisfactionSum / Math.max(occupationalHealth.length, 1)) * 10
        ) / 10,
    };
    const ohBottomDept = {
      name: ohCommonLocations[ohCommonLocations.length - 1]?.name || "N/A",
      score:
        Math.round(
          (ohSatisfactionSum / Math.max(occupationalHealth.length, 1)) * 10
        ) / 10,
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

    console.log("Visit purpose data:", result);
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
    console.log("fetchPatientTypeData: Starting query...");
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

    console.log(
      `fetchPatientTypeData: Found ${submissions.length} submissions`
    );

    // Split by patient type
    const newPatients = submissions.filter(
      (s) => s.patientType === "New Patient"
    );
    const returningPatients = submissions.filter(
      (s) => s.patientType === "Returning Patient"
    );

    console.log(
      `fetchPatientTypeData: ${newPatients.length} new patients, ${returningPatients.length} returning patients`
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

    console.log("fetchPatientTypeData: Results calculated", {
      newPatients: {
        count: result.newPatients.count,
        satisfaction: result.newPatients.satisfaction,
        recommendRate: result.newPatients.recommendRate,
        topDept: result.newPatients.topDepartment,
        bottomDept: result.newPatients.bottomDepartment,
      },
      returningPatients: {
        count: result.returningPatients.count,
        satisfaction: result.returningPatients.satisfaction,
        recommendRate: result.returningPatients.recommendRate,
        topDept: result.returningPatients.topDepartment,
        bottomDept: result.returningPatients.bottomDepartment,
      },
    });

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
    console.log("fetchVisitTimeData: Starting query...");

    // Get all submissions ordered by date
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        ratings: true,
      },
    });

    console.log(`fetchVisitTimeData: Found ${submissions.length} submissions`);

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

    console.log("fetchVisitTimeData: Processed data:", visitTimeData);
    return visitTimeData;
  } catch (error) {
    console.error("Error fetching visit time data:", error);
    return [];
  }
}

// Update fetchOverviewData with better logging
export async function fetchOverviewData(): Promise<OverviewData> {
  try {
    console.log("fetchOverviewData: Starting data collection process");

    console.log("fetchOverviewData: Fetching surveyData");
    const surveyData = await fetchAllSurveyData();
    console.log(
      `fetchOverviewData: surveyData fetched - ${surveyData.length} items`
    );

    console.log("fetchOverviewData: Fetching visitPurposeData");
    const visitPurposeData = await fetchVisitPurposeData();
    console.log("fetchOverviewData: visitPurposeData fetched", {
      gpCount: visitPurposeData.generalPractice.count,
      ohCount: visitPurposeData.occupationalHealth.count,
    });

    console.log("fetchOverviewData: Fetching patientTypeData");
    const patientTypeData = await fetchPatientTypeData();
    console.log("fetchOverviewData: patientTypeData fetched", {
      newCount: patientTypeData.newPatients.count,
      returningCount: patientTypeData.returningPatients.count,
    });

    console.log("fetchOverviewData: Fetching visitTimeData");
    const visitTimeData = await fetchVisitTimeData();
    console.log(
      `fetchOverviewData: visitTimeData fetched - ${visitTimeData.length} items`
    );

    console.log("fetchOverviewData: Fetching satisfactionByDemographic");
    const satisfactionByDemographic = await fetchSatisfactionByDemographic();
    console.log("fetchOverviewData: satisfactionByDemographic fetched", {
      userTypeCount: satisfactionByDemographic.byUserType.length,
      patientTypeCount: satisfactionByDemographic.byPatientType.length,
    });

    console.log("fetchOverviewData: Fetching visitTimeAnalysis");
    const visitTimeAnalysis = await fetchVisitTimeAnalysis();
    console.log(
      `fetchOverviewData: visitTimeAnalysis fetched - ${visitTimeAnalysis.length} items`
    );

    console.log("fetchOverviewData: Fetching improvementAreas");
    const improvementAreas = await fetchTopImprovementAreas();
    console.log(
      `fetchOverviewData: improvementAreas fetched - ${improvementAreas.length} items`
    );

    const result = {
      surveyData,
      visitPurposeData,
      patientTypeData,
      visitTimeData,
      satisfactionByDemographic,
      visitTimeAnalysis,
      improvementAreas,
    };

    console.log("fetchOverviewData: All data collection complete");
    return result;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
}
