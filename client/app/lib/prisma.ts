/**
 * Prisma Client Setup
 * 
 * This file sets up the Prisma client instance with appropriate configuration
 * for different environments. It implements a singleton pattern to prevent
 * creating multiple client instances during development hot-reloading.
 * 
 * The Prisma client is used throughout the application to interact with the database.
 * It provides type-safe database operations based on the schema defined in schema.prisma.
 */

import { PrismaClient } from "@prisma/client";

// Extend the global scope type to include our Prisma client instance
// This helps prevent multiple instances during development hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Determines the appropriate database URL based on the environment
 * 
 * In test environments, it uses a test database URL if available,
 * otherwise it modifies the default URL to point to a test database.
 * 
 * @returns The database URL string for the current environment
 */
const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === "test") {
    // Use test database during tests
    return process.env.TEST_DATABASE_URL || 
           process.env.DATABASE_URL?.replace(/\/[^/]+(\?|$)/, '/elevare_test$1') ||
           'postgresql://postgres:postgres@localhost:5433/elevare_test';
  }
  return process.env.DATABASE_URL;
};

/**
 * The main Prisma client instance
 * 
 * Configured with:
 * - Dynamic database URL based on environment
 * - Appropriate logging levels for different environments
 * 
 * In development, logs queries, errors, and warnings
 * In production, only logs errors
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Store the Prisma instance in the global scope in non-production environments
// This prevents multiple instances during development hot-reloading
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Development-time safeguard: ensure base achievements exist
 * 
 * In non-production environments, this function ensures that the basic
 * achievement definitions exist in the database. This is important for
 * new installations and testing environments where achievements might not exist.
 * 
 * The achievements are loaded from the data/achievements file and upserted
 * to prevent duplication while ensuring they exist.
 */
if (process.env.NODE_ENV !== "production") {
  (async () => {
    try {
      const count = await prisma.achievement.count();
      if (count === 0) {
        const { achievements } = await import("../data/achievements");
        for (const ach of achievements) {
          await prisma.achievement.upsert({
            where: { code: ach.code },
            update: {
              title: ach.title,
              description: ach.description,
              icon: ach.icon,
              category: ach.category,
            },
            create: {
              code: ach.code,
              title: ach.title,
              description: ach.description,
              icon: ach.icon,
              category: ach.category,
            },
          });
        }
      }
    } catch {
      // ignore errors silently - this is just a safeguard for development
    }
  })();
}
