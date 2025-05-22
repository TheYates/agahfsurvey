import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function resetServicePoints() {
  try {
    console.log("Deleting all service point feedback...");
    await prisma.servicePointFeedback.deleteMany({});

    console.log("Deleting all service points...");
    await prisma.servicePoint.deleteMany({});

    console.log("Reset complete!");
  } catch (error) {
    console.error("Error resetting service points:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetServicePoints();
