import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Insert department locations
  const departments = [
    "Audiology Unit",
    "Dental Clinic",
    "Dressing Room",
    "Emergency Unit",
    "Eye Clinic",
    "Eric Asubonteng Clinic (Bruno Est.)",
    "Injection Room",
    "Laboratory",
    "Occupational Health",
    "Out-Patient Department (OPD)",
    "Pharmacy",
    "Physiotherapy",
    "RCH",
    "Ultrasound Unit",
    "X-Ray Unit",
  ];

  // Insert ward locations
  const wards = [
    "Female's Ward",
    "Intensive Care Unit (ICU)",
    "Kids Ward",
    "Lying-In Ward",
    "Male's Ward",
    "Maternity Ward",
    "Neonatal Intensive Care Unit (NICU)",
  ];

  // Insert other locations
  const otherLocations = [
    { name: "Canteen Services", type: "canteen" },
    {
      name: "Occupational Health Unit (Medicals)",
      type: "occupational_health",
    },
  ];

  console.log("Creating department locations...");
  for (const name of departments) {
    await prisma.location.upsert({
      where: { name },
      update: {},
      create: {
        name,
        locationType: "department",
      },
    });
  }

  console.log("Creating ward locations...");
  for (const name of wards) {
    await prisma.location.upsert({
      where: { name },
      update: {},
      create: {
        name,
        locationType: "ward",
      },
    });
  }

  console.log("Creating other locations...");
  for (const location of otherLocations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: {
        name: location.name,
        locationType: location.type,
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
