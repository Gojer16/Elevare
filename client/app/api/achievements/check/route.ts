import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { updateStreak } from '@/app/lib/streak';
import { checkAndUnlockAchievements } from '@/app/lib/achievements';
import { prisma } from '@/app/lib/prisma';
import { toZonedTime } from 'date-fns-tz';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Update streak
    const streak = await updateStreak(userId);
    
    // Get user stats for achievement checking
    const [tasksCompleted, reflections, latestCompleted] = await Promise.all([
      prisma.task.count({
        where: { 
          userId,
          isDone: true
        }
      }),
      prisma.task.count({
        where: { 
          userId,
          isDone: true,
          reflection: { not: null }
        }
      }),
      prisma.task.findFirst({
        where: { userId, isDone: true },
        orderBy: { completedAt: 'desc' },
        select: { completedAt: true },
      })
    ]);
    
    // Check and unlock achievements
    // Convert latest completion to user's timezone (if set)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
    let latestForEval: Date | null = latestCompleted?.completedAt ?? null;
    if (latestForEval && user?.timezone) {
      // Convert UTC timestamp to user's zone; hour extraction happens in lib using Date.getHours()
      latestForEval = toZonedTime(latestForEval, user.timezone);
    }

    const newlyUnlocked = await checkAndUnlockAchievements(userId, {
      tasksCompleted,
      streak: streak.count,
      reflections,
      latestCompletionAt: latestForEval,
    });
    
    return NextResponse.json({ 
      streak: streak.count,
      newlyUnlocked 
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}