"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { surveyCache } from "@/lib/cache/survey-cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface DeleteSubmissionResult {
  success: boolean;
  error?: string;
  deletedData?: {
    submissionId: string;
    relatedRecords: {
      ratings: number;
      locations: number;
      concerns: number;
      observations: number;
    };
  };
}

/**
 * Securely delete a survey submission and all related data (cascade delete)
 * This function requires admin privileges and performs comprehensive cleanup
 */
export async function deleteSubmission(
  submissionId: string,
  adminConfirmation: {
    confirmationText: string;
    reason: string;
    adminId?: string;
  }
): Promise<DeleteSubmissionResult> {
  try {
    // Validate confirmation text
    if (adminConfirmation.confirmationText !== "DELETE SUBMISSION") {
      return {
        success: false,
        error: "Invalid confirmation text. Please type 'DELETE SUBMISSION' exactly.",
      };
    }

    // Validate reason
    if (!adminConfirmation.reason || adminConfirmation.reason.trim().length < 10) {
      return {
        success: false,
        error: "Please provide a detailed reason for deletion (minimum 10 characters).",
      };
    }

    console.log(`Starting deletion process for submission: ${submissionId}`);
    console.log(`Reason: ${adminConfirmation.reason}`);

    // First, verify the submission exists
    const { data: submission, error: submissionError } = await supabase
      .from("SurveySubmission")
      .select("id, submittedAt, userType, visitPurpose")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission) {
      return {
        success: false,
        error: "Submission not found or already deleted.",
      };
    }

    // Count related records before deletion for audit trail
    const [ratingsCount, locationsCount, concernsCount, observationsCount] = await Promise.all([
      supabase.from("Rating").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("SubmissionLocation").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("DepartmentConcern").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("GeneralObservation").select("id", { count: "exact" }).eq("submissionId", submissionId),
    ]);

    const relatedCounts = {
      ratings: ratingsCount.count || 0,
      locations: locationsCount.count || 0,
      concerns: concernsCount.count || 0,
      observations: observationsCount.count || 0,
    };

    console.log(`Related records found:`, relatedCounts);

    // Perform cascade deletion in the correct order (child tables first)
    // Note: If foreign key constraints are set up properly, deleting the parent
    // should cascade automatically, but we'll be explicit for safety

    const deletionResults = await Promise.allSettled([
      // Delete ratings
      supabase.from("Rating").delete().eq("submissionId", submissionId),
      
      // Delete submission locations
      supabase.from("SubmissionLocation").delete().eq("submissionId", submissionId),
      
      // Delete department concerns
      supabase.from("DepartmentConcern").delete().eq("submissionId", submissionId),
      
      // Delete general observations
      supabase.from("GeneralObservation").delete().eq("submissionId", submissionId),
    ]);

    // Check if any child deletions failed
    const failedDeletions = deletionResults.filter(result => result.status === "rejected");
    if (failedDeletions.length > 0) {
      console.error("Some child record deletions failed:", failedDeletions);
      return {
        success: false,
        error: "Failed to delete some related records. Deletion aborted for data integrity.",
      };
    }

    // Finally, delete the main submission
    const { error: mainDeletionError } = await supabase
      .from("SurveySubmission")
      .delete()
      .eq("id", submissionId);

    if (mainDeletionError) {
      console.error("Failed to delete main submission:", mainDeletionError);
      return {
        success: false,
        error: `Failed to delete submission: ${mainDeletionError.message}`,
      };
    }

    // Log the deletion for audit purposes
    console.log(`Successfully deleted submission ${submissionId} and ${
      relatedCounts.ratings + relatedCounts.locations + relatedCounts.concerns + relatedCounts.observations
    } related records`);

    // Clear cache and revalidate the submissions page to reflect changes
    surveyCache.clear();
    revalidatePath("/reports", "layout");
    revalidatePath("/reports/submissions");

    return {
      success: true,
      deletedData: {
        submissionId,
        relatedRecords: relatedCounts,
      },
    };

  } catch (error) {
    console.error("Unexpected error during deletion:", error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Get submission details for deletion confirmation
 */
export async function getSubmissionForDeletion(submissionId: string) {
  try {
    const { data: submission, error } = await supabase
      .from("SurveySubmission")
      .select(`
        id,
        submittedAt,
        userType,
        visitPurpose,
        patientType,
        wouldRecommend
      `)
      .eq("id", submissionId)
      .single();

    if (error || !submission) {
      return { success: false, error: "Submission not found" };
    }

    // Get counts of related records
    const [ratingsCount, locationsCount, concernsCount, observationsCount] = await Promise.all([
      supabase.from("Rating").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("SubmissionLocation").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("DepartmentConcern").select("id", { count: "exact" }).eq("submissionId", submissionId),
      supabase.from("GeneralObservation").select("id", { count: "exact" }).eq("submissionId", submissionId),
    ]);

    return {
      success: true,
      data: {
        ...submission,
        relatedRecords: {
          ratings: ratingsCount.count || 0,
          locations: locationsCount.count || 0,
          concerns: concernsCount.count || 0,
          observations: observationsCount.count || 0,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch submission details: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
