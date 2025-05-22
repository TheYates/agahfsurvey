import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function seedServicePoints() {
  console.log("Seeding service points...");

  // First check if we already have service points to avoid duplicating
  const existingCount = await prisma.servicePoint.count();
  if (existingCount > 0) {
    console.log(
      `Found ${existingCount} existing service points, skipping seeding.`
    );
    return;
  }

  // Service points data
  const servicePointsData = [
    { name: "Consulting Room 1", location: "consulting_room", is_active: true },
    { name: "Consulting Room 2", location: "consulting_room", is_active: true },
    { name: "Consulting Room 3", location: "consulting_room", is_active: true },
    { name: "Consulting Room 4", location: "consulting_room", is_active: true },
    { name: "Consulting Room 5", location: "consulting_room", is_active: true },
    { name: "Consulting Room 6", location: "consulting_room", is_active: true },
    { name: "Consulting Room 7", location: "consulting_room", is_active: true },
    { name: "Consulting Room 8", location: "consulting_room", is_active: true },
    { name: "Consulting Room 9", location: "consulting_room", is_active: true },
    { name: "Emergency Unit", location: "emergency", is_active: true },
    { name: "Physiotherapy Unit", location: "physiotherapy", is_active: true },
    { name: "VIP Consulting Room", location: "vip", is_active: true },
    { name: "X-Ray Unit", location: "xray", is_active: true },
    { name: "Ultrasound Unit", location: "ultrasound", is_active: true },
  ];

  // Create service points
  const createdServicePoints = await prisma.servicePoint.createMany({
    data: servicePointsData,
    skipDuplicates: true,
  });

  console.log(`Created ${createdServicePoints.count} service points`);

  // Get the created service points to use their IDs
  const servicePoints = await prisma.servicePoint.findMany();

  console.log(
    "Service Points created:",
    servicePoints.map((sp) => `${sp.id}: ${sp.name}`).join(", ")
  );

  // Find service points by name
  const getServicePointIdByName = (name: string): number => {
    const point = servicePoints.find((sp) => sp.name === name);
    return point ? point.id : -1;
  };

  // Sample feedback data
  const feedbackData = [
    {
      service_point_id: getServicePointIdByName("Consulting Room 1"),
      rating: 5,
      recommend: true,
      comment: "Excellent service, very friendly staff!",
    },
    {
      service_point_id: getServicePointIdByName("Consulting Room 1"),
      rating: 4,
      recommend: true,
      comment: "Good service but had to wait a bit.",
    },
    {
      service_point_id: getServicePointIdByName("Consulting Room 2"),
      rating: 5,
      recommend: true,
      comment: "The doctor was very thorough and professional!",
    },
    {
      service_point_id: getServicePointIdByName("Emergency Unit"),
      rating: 3,
      recommend: false,
      comment: "Fast service but not very friendly.",
    },
    {
      service_point_id: getServicePointIdByName("Physiotherapy Unit"),
      rating: 4,
      recommend: true,
      comment: "Great service at physiotherapy",
    },
    {
      service_point_id: getServicePointIdByName("Consulting Room 3"),
      rating: 2,
      recommend: false,
      comment: "Long wait times and staff seemed overwhelmed",
    },
    {
      service_point_id: getServicePointIdByName("X-Ray Unit"),
      rating: 5,
      recommend: true,
      comment: "X-Ray technician was very professional",
    },
    {
      service_point_id: getServicePointIdByName("Emergency Unit"),
      rating: 4,
      recommend: true,
      comment: "Emergency was handled quickly and efficiently",
    },
    {
      service_point_id: getServicePointIdByName("VIP Consulting Room"),
      rating: 5,
      recommend: true,
      comment: "Excellent VIP care and attention",
    },
    {
      service_point_id: getServicePointIdByName("Ultrasound Unit"),
      rating: 4,
      recommend: true,
      comment: "Ultrasound technician was knowledgeable and caring",
    },
  ];

  // Create feedback
  const createdFeedback = await prisma.servicePointFeedback.createMany({
    data: feedbackData,
    skipDuplicates: true,
  });

  console.log(`Created ${createdFeedback.count} feedback entries`);
}

export async function seedServicePointsData() {
  try {
    await seedServicePoints();
  } catch (error) {
    console.error("Error seeding service points:", error);
  }
}

// Allow running directly with: npx ts-node prisma/seed-service-points.ts
if (require.main === module) {
  seedServicePointsData()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
