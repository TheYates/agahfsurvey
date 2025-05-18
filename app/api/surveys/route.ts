import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { submitSurvey } from "@/app/actions/survey-actions";

// GET /api/surveys - Get all surveys (paginated)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [surveys, total] = await Promise.all([
      prisma.surveySubmission.findMany({
        skip,
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
      }),
      prisma.surveySubmission.count(),
    ]);

    return NextResponse.json({
      surveys,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

// POST /api/surveys - Submit a new survey
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the survey data
    if (
      !data.visitTime ||
      !data.visitPurpose ||
      !data.locations ||
      !data.locations.length
    ) {
      return NextResponse.json(
        { error: "Missing required survey fields" },
        { status: 400 }
      );
    }

    // Submit the survey using the server action
    const result = await submitSurvey(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
