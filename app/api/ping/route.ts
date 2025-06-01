import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Make a simple query to keep the database active
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Database is active",
    });
  } catch (error) {
    console.error("Ping error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
