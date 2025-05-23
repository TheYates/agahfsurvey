"use server";

export async function getServicePointDirectly(id: number) {
  console.log(`[SERVER ACTION] Starting to fetch service point with ID ${id}`);

  try {
    console.log("[SERVER ACTION] Importing prisma client");
    const { prisma } = await import("@/lib/db");

    // Use Prisma model since our debug showed it works
    const servicePoint = await prisma.servicePoint.findUnique({
      where: { id },
    });

    // Log the result to server console
    console.log("[SERVER ACTION] Prisma result:", JSON.stringify(servicePoint));

    if (!servicePoint) {
      console.log("[SERVER ACTION] Service point not found, trying direct SQL");
      // Fallback to direct SQL if needed
      const rawResults = await prisma.$queryRaw`
        SELECT * FROM "surveys"."ServicePoints" WHERE id = ${id}
      `;

      console.log(
        "[SERVER ACTION] SQL query result:",
        JSON.stringify(rawResults)
      );

      if (Array.isArray(rawResults) && rawResults.length > 0) {
        // Convert snake_case to camelCase for consistency
        const result = rawResults[0];
        const mappedResult = {
          id: result.id,
          name: result.name,
          isActive: result.is_active,
          showRecommendQuestion: result.show_recommend_question,
          showCommentsBox: result.show_comments_box,
          createdAt: result.created_at,
          updatedAt: result.updated_at,
        };
        console.log(
          "[SERVER ACTION] Returning mapped SQL result:",
          JSON.stringify(mappedResult)
        );
        return mappedResult;
      }
    } else {
      // Convert the Prisma result to ensure consistent property naming
      const mappedResult = {
        id: servicePoint.id,
        name: servicePoint.name,
        isActive: servicePoint.is_active,
        showRecommendQuestion: servicePoint.show_recommend_question,
        showCommentsBox: servicePoint.show_comments_box,
        createdAt: servicePoint.created_at,
        updatedAt: servicePoint.updated_at,
      };
      console.log(
        "[SERVER ACTION] Returning mapped Prisma result:",
        JSON.stringify(mappedResult)
      );
      return mappedResult;
    }

    console.log("[SERVER ACTION] No service point found with ID:", id);
    return null;
  } catch (error) {
    console.error(`[SERVER ACTION] Error fetching service point ${id}:`, error);
    return null;
  }
}
