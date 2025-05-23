"use server";

export async function getServicePointDirectly(id: number) {
  console.log(`Starting to fetch service point with ID ${id}`);

  try {
    console.log("Importing prisma client");
    const { prisma } = await import("@/lib/db");

    // Log database connection info (masking password)
    const databaseUrl = process.env.DATABASE_URL || "not set";
    const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ":********@");
    console.log("Database URL:", maskedUrl);
    console.log("Using schema:", "surveys");

    try {
      // Verify the table exists by counting records
      console.log("Checking if ServicePoints table exists...");
      const count =
        await prisma.$queryRaw`SELECT COUNT(*) FROM "surveys"."ServicePoints"`;
      console.log("ServicePoints table record count:", count);
    } catch (countError) {
      console.error("Error counting records:", countError);
    }

    console.log("Prisma client imported, querying database");
    const servicePoint = await prisma.servicePoint.findUnique({
      where: { id },
    });

    console.log("Database query complete, result:", servicePoint);

    // If prisma model query failed, try direct SQL as fallback
    if (!servicePoint) {
      console.log("Prisma query returned null, trying direct SQL");
      try {
        const rawResults = await prisma.$queryRaw`
          SELECT * FROM "surveys"."ServicePoints" WHERE id = ${id}
        `;

        console.log("Direct SQL query result:", rawResults);

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
      } catch (sqlError) {
        console.error("Error in direct SQL query:", sqlError);
      }
    }

    return servicePoint;
  } catch (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }
}
