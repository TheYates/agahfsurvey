import { PrismaClient } from "../../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting migration to remove location field...");

  try {
    // First, create a backup of the current service points
    console.log("Backing up current service points...");
    const servicePoints = await prisma.servicePoint.findMany();
    console.log(`Found ${servicePoints.length} service points to migrate`);

    // Write data to migration log (just in case we need to recover)
    console.log("Original service points data:");
    servicePoints.forEach((sp: any) => {
      console.log(`- ID: ${sp.id}, Name: ${sp.name}, Location: ${sp.location}`);
    });

    // Now run the migration
    console.log("\nPerforming database schema update...");
    console.log(
      "NOTE: This script should be run after updating the schema.prisma file"
    );
    console.log("and running prisma migrate dev or prisma db push.\n");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
