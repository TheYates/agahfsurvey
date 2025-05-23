"use server";

export async function getServicePointDirectly(id: number) {
  console.log(`[SERVER ACTION] Starting to fetch service point with ID ${id}`);

  try {
    console.log("[SERVER ACTION] Importing prisma client");
    const { prisma } = await import("@/lib/db");

    // Skip Prisma model and use direct SQL
    console.log("[SERVER ACTION] Using direct SQL query");
    const rawResults = await prisma.$queryRaw`
      SELECT * FROM "surveys"."ServicePoints" WHERE id = ${id}
    `;

    console.log(
      "[SERVER ACTION] SQL query result:",
      JSON.stringify(rawResults)
    );

    if (Array.isArray(rawResults) && rawResults.length > 0) {
      // Create a clean, simple object with no Date objects
      const result = rawResults[0];
      const cleanResult = {
        id: result.id,
        name: result.name,
        showRecommendQuestion: result.show_recommend_question ? true : false,
        showCommentsBox: result.show_comments_box ? true : false,
        // Stringify dates to avoid serialization issues
        createdAt: result.created_at ? result.created_at.toISOString() : null,
        updatedAt: result.updated_at ? result.updated_at.toISOString() : null,
      };

      console.log(
        "[SERVER ACTION] Returning clean result:",
        JSON.stringify(cleanResult)
      );
      return cleanResult;
    }

    console.log("[SERVER ACTION] No service point found with ID:", id);
    return null;
  } catch (error) {
    console.error(`[SERVER ACTION] Error fetching service point ${id}:`, error);
    return null;
  }
}
