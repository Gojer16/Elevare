import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
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
