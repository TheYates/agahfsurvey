"use server";

export async function getServicePointDirectly(id: number) {
  console.log(`Starting to fetch service point with ID ${id}`);

  try {
    console.log("Importing prisma client");
    const { prisma } = await import("@/lib/db");

    // Skip the model query and go straight to SQL
    console.log("Using direct SQL query for service point");

    const rawResults = await prisma.$queryRaw`
      SELECT * FROM "surveys"."ServicePoints" WHERE id = ${id}
    `;

    console.log("SQL query result:", rawResults);

    if (Array.isArray(rawResults) && rawResults.length > 0) {
      // Convert snake_case to camelCase for consistency
      const result = rawResults[0];
      return {
        id: result.id,
        name: result.name,
        isActive: result.is_active,
        showRecommendQuestion: result.show_recommend_question,
        showCommentsBox: result.show_comments_box,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }
}
