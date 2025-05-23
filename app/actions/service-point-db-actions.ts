"use server";

export async function getServicePointDirectly(id: number) {
  console.log(`Starting to fetch service point with ID ${id}`);

  try {
    console.log("Importing prisma client");
    const { prisma } = await import("@/lib/db");

    console.log("Prisma client imported, querying database");
    const servicePoint = await prisma.servicePoint.findUnique({
      where: { id },
    });

    console.log("Database query complete, result:", servicePoint);
    return servicePoint;
  } catch (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }
}
