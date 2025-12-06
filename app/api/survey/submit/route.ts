import { NextRequest, NextResponse } from "next/server";
import { submitSurveyToSupabase, type SurveyFormData } from "@/lib/supabase/survey-submission";

export async function POST(request: NextRequest) {
  try {
    const surveyData: SurveyFormData = await request.json();

    // Validate that we have survey data
    if (!surveyData) {
      return NextResponse.json(
        { success: false, error: "No survey data provided" },
        { status: 400 }
      );
    }

    // Submit to Supabase
    const result = await submitSurveyToSupabase(surveyData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        id: result.id,
        message: "Survey submitted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to submit survey" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error submitting survey:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
