import { PrismaClient } from "../lib/generated/prisma";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add logging for database initialization and connection information
console.log("Initializing PrismaClient...");
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(
  `DATABASE_URL format: ${
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 20) + "..."
      : "Not set"
  }`
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

console.log("PrismaClient initialized");

export default prisma;
