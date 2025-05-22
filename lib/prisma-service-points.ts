import { PrismaClient } from "./generated/prisma";
import {
  ServicePoint,
  ServicePointFeedback,
} from "@/app/actions/service-point-actions";

// Create a single PrismaClient instance for the whole app
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Ensure we don't create multiple instances in development
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Adapters to convert between Prisma and our app models
function adaptPrismaServicePoint(prismaServicePoint: any): ServicePoint {
  return {
    id: prismaServicePoint.id,
    name: prismaServicePoint.name,
    is_active: prismaServicePoint.is_active,
    show_recommend_question: prismaServicePoint.show_recommend_question ?? true,
    show_comments_box: prismaServicePoint.show_comments_box ?? true,
    created_at: prismaServicePoint.created_at.toISOString(),
    updated_at: prismaServicePoint.updated_at?.toISOString(),
  };
}

function adaptPrismaServicePointFeedback(
  prismaFeedback: any
): ServicePointFeedback {
  return {
    id: prismaFeedback.id.toString(),
    service_point_id: prismaFeedback.service_point_id,
    rating: prismaFeedback.rating,
    recommend: prismaFeedback.recommend,
    comment: prismaFeedback.comment,
    created_at: prismaFeedback.created_at.toISOString(),
    updated_at: prismaFeedback.updated_at?.toISOString(),
  };
}

// Service Points Functions
export async function getServicePoints(): Promise<ServicePoint[]> {
  const servicePoints = await prisma.servicePoint.findMany({
    orderBy: { name: "asc" },
  });
  return servicePoints.map(adaptPrismaServicePoint);
}

export async function getServicePointById(
  id: number
): Promise<ServicePoint | null> {
  const servicePoint = await prisma.servicePoint.findUnique({
    where: { id },
  });
  return servicePoint ? adaptPrismaServicePoint(servicePoint) : null;
}

export async function createServicePoint(
  data: Omit<ServicePoint, "id" | "created_at" | "updated_at">
): Promise<ServicePoint> {
  const servicePoint = await prisma.servicePoint.create({
    data,
  });
  return adaptPrismaServicePoint(servicePoint);
}

export async function updateServicePoint(
  id: number,
  data: Partial<Omit<ServicePoint, "id" | "created_at" | "updated_at">>
): Promise<ServicePoint> {
  const servicePoint = await prisma.servicePoint.update({
    where: { id },
    data,
  });
  return adaptPrismaServicePoint(servicePoint);
}

export async function deleteServicePoint(id: number): Promise<void> {
  await prisma.servicePoint.delete({
    where: { id },
  });
}

// Service Point Feedback Functions
export async function getServicePointFeedback(
  servicePointId: number,
  limit = 50
): Promise<ServicePointFeedback[]> {
  const feedback = await prisma.servicePointFeedback.findMany({
    where: { service_point_id: servicePointId },
    orderBy: { created_at: "desc" },
    take: limit,
  });
  return feedback.map(adaptPrismaServicePointFeedback);
}

export async function submitFeedback(data: {
  service_point_id: number;
  rating: number;
  recommend?: boolean;
  comment?: string;
}): Promise<ServicePointFeedback> {
  const feedback = await prisma.servicePointFeedback.create({
    data,
  });
  return adaptPrismaServicePointFeedback(feedback);
}

// Statistics Functions
export async function getServicePointFeedbackStats(
  timeRange = "all",
  servicePointId: string | number = "all"
) {
  // Build the where condition based on time range
  let dateCondition = {};
  const now = new Date();

  if (timeRange !== "all") {
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    dateCondition = {
      created_at: {
        gte: startDate,
      },
    };
  }

  // Add service point condition if specified
  let servicePointCondition = {};
  if (servicePointId !== "all") {
    const id =
      typeof servicePointId === "string"
        ? parseInt(servicePointId, 10)
        : servicePointId;
    servicePointCondition = {
      service_point_id: id,
    };
  }

  // Combine conditions
  const whereCondition = {
    ...dateCondition,
    ...servicePointCondition,
  };

  // Get all service points
  const servicePoints = await prisma.servicePoint.findMany();

  // Get all feedback with the conditions
  const allFeedback = await prisma.servicePointFeedback.findMany({
    where: whereCondition,
    include: {
      service_point: true,
    },
  });

  // Process overall statistics
  const totalFeedback = allFeedback.length;
  let totalRating = 0;
  let totalRecommends = 0;
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  allFeedback.forEach((feedback) => {
    totalRating += feedback.rating;
    if (feedback.recommend) {
      totalRecommends++;
    }
    // Ensure rating is between 1-5
    const safeRating = Math.min(Math.max(1, feedback.rating), 5);
    ratingDistribution[safeRating as 1 | 2 | 3 | 4 | 5]++;
  });

  const overallStats = {
    totalFeedback,
    averageRating: totalFeedback > 0 ? totalRating / totalFeedback : 0,
    recommendRate:
      totalFeedback > 0 ? (totalRecommends / totalFeedback) * 100 : 0,
    ratingDistribution,
  };

  // Process statistics per service point
  const servicePointStatsMap = new Map();

  servicePoints.forEach((sp) => {
    servicePointStatsMap.set(sp.id, {
      id: sp.id,
      name: sp.name,
      totalFeedback: 0,
      totalRating: 0,
      recommendCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  });

  allFeedback.forEach((feedback) => {
    const spStats = servicePointStatsMap.get(feedback.service_point_id);
    if (spStats) {
      spStats.totalFeedback++;
      spStats.totalRating += feedback.rating;
      if (feedback.recommend) {
        spStats.recommendCount++;
      }
      // Ensure rating is between 1-5
      const safeRating = Math.min(Math.max(1, feedback.rating), 5);
      spStats.ratingDistribution[safeRating as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  const servicePointStats = Array.from(servicePointStatsMap.values()).map(
    (sp) => ({
      id: sp.id,
      name: sp.name,
      totalFeedback: sp.totalFeedback,
      averageRating:
        sp.totalFeedback > 0 ? sp.totalRating / sp.totalFeedback : 0,
      recommendRate:
        sp.totalFeedback > 0 ? (sp.recommendCount / sp.totalFeedback) * 100 : 0,
      ratingDistribution: sp.ratingDistribution,
    })
  );

  return {
    overall: overallStats,
    servicePoints: servicePointStats,
  };
}

export async function getServicePointFeedbackItems(
  timeRange = "all",
  servicePointId: string | number = "all",
  limit = 50
) {
  // Build the where condition based on time range
  let dateCondition = {};
  const now = new Date();

  if (timeRange !== "all") {
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    dateCondition = {
      created_at: {
        gte: startDate,
      },
    };
  }

  // Add service point condition if specified
  let servicePointCondition = {};
  if (servicePointId !== "all") {
    const id =
      typeof servicePointId === "string"
        ? parseInt(servicePointId, 10)
        : servicePointId;
    servicePointCondition = {
      service_point_id: id,
    };
  }

  // Combine conditions
  const whereCondition = {
    ...dateCondition,
    ...servicePointCondition,
  };

  // Get feedback with service point data
  const feedback = await prisma.servicePointFeedback.findMany({
    where: whereCondition,
    include: {
      service_point: true,
    },
    orderBy: { created_at: "desc" },
    take: limit,
  });

  return feedback.map((item) => ({
    ...adaptPrismaServicePointFeedback(item),
    ServicePoints: adaptPrismaServicePoint(item.service_point),
  }));
}

export default prisma;
