import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const startTime = Date.now();

    // Make a simple query to keep the database active
    const { count, error } = await supabase
      .from("users")
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
      message: "Database is active",
      responseTime: `${responseTime}ms`,
      userCount: count || 0,
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
