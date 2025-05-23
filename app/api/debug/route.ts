import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const diagnostics: {
    database_url: string;
    direct_url: string;
    node_env: string;
    prisma_models: string[];
    service_points_count: number;
    survey_count: number;
    error: string | null;
  } = {
    database_url: process.env.DATABASE_URL
      ? "Set (first 20 chars): " +
        process.env.DATABASE_URL.substring(0, 20) +
        "..."
      : "Not set",
    direct_url: process.env.DIRECT_URL
      ? "Set (first 20 chars): " +
        process.env.DIRECT_URL.substring(0, 20) +
        "..."
      : "Not set",
    node_env: process.env.NODE_ENV || "Not set",
    prisma_models: [],
    service_points_count: 0,
    survey_count: 0,
    error: null,
  };

  // Try to get Prisma models
  try {
    diagnostics.prisma_models = Object.keys(prisma);
  } catch (error) {
    diagnostics.error =
      "Error accessing Prisma client: " +
      (error instanceof Error ? error.message : String(error));
    return NextResponse.json(diagnostics);
  }

  // Try to count service points
  try {
    diagnostics.service_points_count = await prisma.servicePoint.count();
  } catch (error) {
    diagnostics.error =
      "Error counting service points: " +
      (error instanceof Error ? error.message : String(error));
    return NextResponse.json(diagnostics);
  }

  // Try to count surveys
  try {
    diagnostics.survey_count = await prisma.surveySubmission.count();
  } catch (error) {
    diagnostics.error =
      "Error counting surveys: " +
      (error instanceof Error ? error.message : String(error));
  }

  return NextResponse.json(diagnostics);
}
