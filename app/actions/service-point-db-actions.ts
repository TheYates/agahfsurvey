"use server";

export async function getServicePointDirectly(id: number) {
  const { prisma } = await import("@/lib/db");

  try {
    const servicePoint = await prisma.servicePoint.findUnique({
      where: { id },
    });

    console.log("ServicePoint fetched directly:", servicePoint);
    return servicePoint;
  } catch (error) {
    console.error(`Error fetching service point ${id}:`, error);
    return null;
  }
}
