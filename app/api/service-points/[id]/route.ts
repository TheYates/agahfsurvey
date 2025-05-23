import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    console.log(`API: Fetching service point with ID ${id}`);
    // Direct database query bypassing the action
    const servicePoint = await prisma.servicePoint.findUnique({
      where: { id },
    });

    console.log("API result:", servicePoint);

    if (!servicePoint) {
      return NextResponse.json(
        { error: "Service point not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(servicePoint);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
