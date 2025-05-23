import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Find all service points
    const servicePoints = await prisma.servicePoint.findMany();

    // Get raw SQL query results for comparison
    const rawResults =
      await prisma.$queryRaw`SELECT * FROM "surveys"."ServicePoints"`;

    // Debug connection information
    const databaseUrl = process.env.DATABASE_URL || "not set";
    const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ":********@");

    // Return detailed debug information
    return NextResponse.json({
      success: true,
      connection: {
        url: maskedUrl,
        schema: "surveys",
      },
      prismaResults: {
        count: servicePoints.length,
        data: servicePoints,
      },
      rawSqlResults: {
        count: Array.isArray(rawResults) ? rawResults.length : "unknown",
        data: rawResults,
      },
    });
  } catch (error) {
    console.error("Error in service points debug API:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
