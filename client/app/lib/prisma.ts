import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Use test database during tests
const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === "test") {
    return process.env.TEST_DATABASE_URL || 
           process.env.DATABASE_URL?.replace(/\/[^/]+(\?|$)/, '/elevare_test$1') ||
           'postgresql://postgres:postgres@localhost:5433/elevare_test';
  }
  return process.env.DATABASE_URL;
};

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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Development-time safeguard: ensure achievements exist
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
      // ignore errors silently
    }
  })();
}
