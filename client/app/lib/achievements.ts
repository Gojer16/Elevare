import { prisma } from './prisma';

export interface AchievementStats {
  tasksCompleted: number;
  streak: number;
  reflections: number;
  latestCompletionAt: Date | null;
}

export async function checkAndUnlockAchievements(userId: string, stats: AchievementStats) {
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(unlocked.map((ua) => ua.achievementId));

  const all = await prisma.achievement.findMany();
  const newlyUnlocked: typeof all = [];

  for (const ach of all) {
    if (unlockedIds.has(ach.id)) continue;

    let conditionMet = false;
    switch (ach.code) {
      case "first_task":
        conditionMet = stats.tasksCompleted >= 1;
        break;
      case "tasks_10":
        conditionMet = stats.tasksCompleted >= 10;
        break;
      case "tasks_100":
        conditionMet = stats.tasksCompleted >= 100;
        break;
      case "streak_3":
        conditionMet = stats.streak >= 3;
        break;
      case "streak_7":
        conditionMet = stats.streak >= 7;
        break;
      case "streak_30":
        conditionMet = stats.streak >= 30;
        break;
      case "first_reflection":
        conditionMet = stats.reflections >= 1;
        break;
      case "reflections_10":
        conditionMet = stats.reflections >= 10;
        break;
      case "reflections_100":
        conditionMet = stats.reflections >= 100;
        break;
      // Time-based achievements
      case "night_owl": {
        // Completed a task between 00:00 and 04:59 (server time)
        const dt = stats.latestCompletionAt ? new Date(stats.latestCompletionAt) : null;
        const hour = dt ? dt.getHours() : null;
        conditionMet = hour !== null && hour >= 0 && hour < 5;
        break;
      }
      case "early_bird": {
        // Completed a task before 07:00 (server time)
        const dt = stats.latestCompletionAt ? new Date(stats.latestCompletionAt) : null;
        const hour = dt ? dt.getHours() : null;
        conditionMet = hour !== null && hour < 7;
        break;
      }
    }

    if (conditionMet) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: ach.id,
          },
        },
        update: {},
        create: { userId, achievementId: ach.id },
      });
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}