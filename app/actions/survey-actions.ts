"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@/lib/generated/prisma";

// Type for survey submission data
type SurveyFormData = {
  visitTime: string;
  visitPurpose: string;
  locations: string[];
  visitedOtherPlaces: boolean;
  departmentRatings: Record<string, Record<string, string>>;
  departmentConcerns: Record<string, string>;
  generalObservation: {
    cleanliness?: string;
    facilities?: string;
    security?: string;
    overall?: string;
  };
  wouldRecommend: string;
  whyNotRecommend: string;
  recommendation: string;
  userType: string;
  patientType: string;
};

/**
 * Submit survey data to the database
 */
export async function submitSurvey(data: SurveyFormData) {
  try {
    // Start a transaction to ensure all related records are created together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the survey submission
      const submission = await tx.surveySubmission.create({
        data: {
          visitTime: data.visitTime,
          visitPurpose: data.visitPurpose,
          visitedOtherPlaces: data.visitedOtherPlaces,
          wouldRecommend: data.wouldRecommend === "Yes",
          whyNotRecommend:
            data.wouldRecommend === "No" ? data.whyNotRecommend : null,
          recommendation: data.recommendation || null,
          userType: data.userType,
          patientType: data.patientType,
        },
      });

      // 2. Create general observations
      await tx.generalObservation.create({
        data: {
          submissionId: submission.id,
          cleanliness: data.generalObservation.cleanliness,
          facilities: data.generalObservation.facilities,
          security: data.generalObservation.security,
          overall: data.generalObservation.overall,
        },
      });

      // 3. Find or create locations and add them to the submission
      for (const locationName of data.locations) {
        // Find the location to get its ID and type
        const location = await tx.location.findFirst({
          where: {
            name: locationName,
          },
        });

        if (!location) {
          console.error(`Location not found: ${locationName}`);
          continue;
        }

        // Create the relationship between submission and location
        await tx.submissionLocation.create({
          data: {
            submissionId: submission.id,
            locationId: location.id,
          },
        });

        // Process ratings based on location type
        if (data.departmentRatings[locationName]) {
          const ratings = data.departmentRatings[locationName];
          const ratingData: any = {
            submissionId: submission.id,
            locationId: location.id,
          };

          // Common fields for all location types
          if (ratings["reception"]) ratingData.reception = ratings["reception"];
          if (ratings["professionalism"])
            ratingData.professionalism = ratings["professionalism"];
          if (ratings["understanding"])
            ratingData.understanding = ratings["understanding"];
          if (ratings["promptness-care"])
            ratingData.promptnessCare = ratings["promptness-care"];
          if (ratings["promptness-feedback"])
            ratingData.promptnessFeedback = ratings["promptness-feedback"];
          if (ratings["overall"]) ratingData.overall = ratings["overall"];

          // Ward-specific fields
          if (location.locationType === "ward") {
            if (ratings["admission"])
              ratingData.admission = ratings["admission"];
            if (ratings["nurse-professionalism"])
              ratingData.nurseProfessionalism =
                ratings["nurse-professionalism"];
            if (ratings["doctor-professionalism"])
              ratingData.doctorProfessionalism =
                ratings["doctor-professionalism"];
            if (ratings["discharge"])
              ratingData.discharge = ratings["discharge"];
          }

          // Food-related fields (for ward and canteen)
          if (
            location.locationType === "ward" ||
            location.locationType === "canteen"
          ) {
            if (ratings["food-quality"])
              ratingData.foodQuality = ratings["food-quality"];
          }

          // Create the rating entry with the appropriate fields
          await tx.rating.create({ data: ratingData });
        }

        // Save any concerns for this location
        if (data.departmentConcerns[locationName]) {
          await tx.departmentConcern.create({
            data: {
              submissionId: submission.id,
              locationId: location.id,
              concern: data.departmentConcerns[locationName],
            },
          });
        }
      }

      return submission;
    });

    // Revalidate related paths
    revalidatePath("/");
    revalidatePath("/thank-you");
    revalidatePath("/reports");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error submitting survey:", error);
    return {
      success: false,
      error: "Failed to submit survey. Please try again.",
    };
  }
}

/**
 * Get all locations for the survey
 */
export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

/**
 * Get recent survey submissions (for the reports page)
 */
export async function getRecentSurveys(limit = 10) {
  try {
    const surveys = await prisma.surveySubmission.findMany({
      take: limit,
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        generalObservations: true,
        submissionLocations: {
          include: {
            location: true,
          },
        },
        ratings: true,
      },
    });

    return surveys;
  } catch (error) {
    console.error("Error fetching recent surveys:", error);
    return [];
  }
}
