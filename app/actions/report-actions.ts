"use server";

import { prisma } from "@/lib/db";

// Define types here instead of importing them
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

// Mock data service for fallback
const mockDataService = {
  getSurveyData: (): SurveyData[] => [
    {
      id: 1,
      created_at: new Date().toISOString(),
      overall_rating: 4,
      recommendation_rating: 8,
      visit_purpose: "General Practice",
      locations_visited: ["Out-Patient Department (OPD)", "Pharmacy"],
    },
  ],
  getDepartmentRatings: (): DepartmentRating[] => [
    {
      locationId: 1,
      locationName: "Out-Patient Department (OPD)",
      category: "overall",
      rating: "Very Good",
      count: 1,
    },
  ],
  getLocationVisits: (): LocationVisit[] => [
    {
      location: "Out-Patient Department (OPD)",
      visit_count: 5,
      average_rating: 4.2,
    },
    {
      location: "Pharmacy",
      visit_count: 3,
      average_rating: 3.8,
    },
  ],
};

// Get all survey data
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
    const formattedData = surveys.map((survey) => ({
      id: survey.id,
      created_at: survey.submittedAt.toISOString(),
      overall_rating: 4, // Default value since rating format conversion would be complex
      recommendation_rating: survey.wouldRecommend ? 10 : 0,
      visit_purpose: survey.visitPurpose,
      locations_visited: survey.submissionLocations.map(
        (sl) => sl.location.name
      ),
    }));

    return formattedData;
  } catch (error) {
    console.error("Error in getSurveyData:", error);
    return mockDataService.getSurveyData();
  }
}

// Get department ratings
export async function getDepartmentRatings(): Promise<DepartmentRating[]> {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        location: {
          locationType: "department",
        },
      },
      include: {
        location: true,
      },
    });

    // Transform the data to match the expected DepartmentRating interface
    const departmentRatings: DepartmentRating[] = [];

    for (const rating of ratings) {
      // Add reception rating if it exists
      if (rating.reception) {
        departmentRatings.push({
          locationId: rating.locationId,
          locationName: rating.location.name,
          category: "reception",
          rating: rating.reception,
          count: 1,
        });
      }

      // Add professionalism rating if it exists
      if (rating.professionalism) {
        departmentRatings.push({
          locationId: rating.locationId,
          locationName: rating.location.name,
          category: "professionalism",
          rating: rating.professionalism,
          count: 1,
        });
      }

      // Add overall rating if it exists
      if (rating.overall) {
        departmentRatings.push({
          locationId: rating.locationId,
          locationName: rating.location.name,
          category: "overall",
          rating: rating.overall,
          count: 1,
        });
      }
    }

    return departmentRatings;
  } catch (error) {
    console.error("Error in getDepartmentRatings:", error);
    return mockDataService.getDepartmentRatings();
  }
}

// Get location visits
export async function getLocationVisits(): Promise<LocationVisit[]> {
  try {
    const locationCounts = await prisma.submissionLocation.groupBy({
      by: ["locationId"],
      _count: {
        locationId: true,
      },
    });

    const locationData = await Promise.all(
      locationCounts.map(async (count) => {
        const location = await prisma.location.findUnique({
          where: { id: count.locationId },
        });

        return {
          location: location?.name || "Unknown",
          visit_count: count._count.locationId,
          average_rating: 4, // Default value
        };
      })
    );

    return locationData;
  } catch (error) {
    console.error("Error in getLocationVisits:", error);
    return mockDataService.getLocationVisits();
  }
}
