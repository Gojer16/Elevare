import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { updateStreak } from '@/app/lib/streak';
import { checkAndUnlockAchievements } from '@/app/lib/achievements';
import { prisma } from '@/app/lib/prisma';
import { toZonedTime } from 'date-fns-tz';

/**
 * @swagger
 * /api/achievements/check:
 *   post:
 *     summary: Checks and unlocks achievements for the user
 *     description: Evaluates the user's progress, updates their streak, and unlocks any new achievements they have earned.
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked for achievements.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streak:
 *                   type: integer
 *                   description: The user's current streak count.
 *                 newlyUnlocked:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
 *                   description: A list of newly unlocked achievements.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Update user's daily streak
    const streak = await updateStreak(userId);
    
    // Gather statistics for achievement evaluation
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
    
    // Adjust timestamp for user's timezone if available
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
    let latestForEval: Date | null = latestCompleted?.completedAt ?? null;
    if (latestForEval && user?.timezone) {
      // Convert UTC timestamp to user's zone for accurate 'early bird'/'night owl' type achievements
      latestForEval = toZonedTime(latestForEval, user.timezone);
    }

    // Check for and unlock any new achievements
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
