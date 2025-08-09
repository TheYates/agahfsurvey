import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const startTime = Date.now();
    const supabase = createClient();

    // Make a simple query to keep the database active
    const { count, error } = await supabase
      .from("Location")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Database ping failed:", error);
      return NextResponse.json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      }, { status: 500 });
    }

    const responseTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(`✅ Database keep-alive successful at ${timestamp} (${responseTime}ms)`);

    return NextResponse.json({
      status: "ok",
      timestamp,
      message: "Database is active and responding",
      responseTime: `${responseTime}ms`,
      locationCount: count || 0,
      service: "AGA Health Foundation Survey",
      version: "1.0.0"
    });
  } catch (error) {
    console.error("Ping error:", error);
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Internal server error",
    }, { status: 500 });
  }
}

// Allow POST requests for manual triggers
export async function POST() {
  return GET();
}
