import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check if the service point already exists
    const existingPoint = await prisma.servicePoint.findUnique({
      where: { id: 2 },
    });

    if (existingPoint) {
      return NextResponse.json({
        success: true,
        message: "Service point with ID 2 already exists",
        data: existingPoint,
      });
    }

    // Create a new service point with ID 2
    const servicePoint = await prisma.servicePoint.create({
      data: {
        id: 2,
        name: "REAL DATABASE - Consulting Room 1",
        is_active: true,
        show_recommend_question: false,
        show_comments_box: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Created service point with ID 2",
      data: servicePoint,
    });
  } catch (error) {
    console.error("Error creating service point:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
