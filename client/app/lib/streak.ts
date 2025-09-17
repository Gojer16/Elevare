import { prisma } from './prisma';
import { isSameDay, subDays } from 'date-fns';

export async function updateStreak(userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  if (!streak) {
    return prisma.streak.create({
      data: { userId, count: 1, longest: 1, lastActive: today },
    });
  }

  const lastActive = new Date(streak.lastActive);
  lastActive.setHours(0, 0, 0, 0); // Normalize to start of day
  const yesterday = subDays(today, 1);

  if (isSameDay(lastActive, today)) {
    // already updated today
    return streak;
  }

  if (isSameDay(lastActive, yesterday)) {
    // continue streak
    const newCount = streak.count + 1;
    return prisma.streak.update({
      where: { userId },
      data: {
        count: newCount,
        longest: Math.max(newCount, streak.longest),
        lastActive: today,
      },
    });
  } else {
    // missed a day, reset streak
    return prisma.streak.update({
      where: { userId },
      data: { count: 1, lastActive: today },
    });
  }
}

export async function getUserStreak(userId: string) {
  return prisma.streak.findUnique({
    where: { userId },
  });
}