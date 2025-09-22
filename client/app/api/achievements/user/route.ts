import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

/**
 * @swagger
 * /api/achievements/user:
 *   get:
 *     summary: Retrieves achievements for the authenticated user
 *     description: Fetches a list of all achievements that the currently authenticated user has unlocked.
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A JSON array of user achievement objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   achievementId:
 *                     type: string
 *                     description: The ID of the unlocked achievement.
 *                   unlockedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the achievement was unlocked.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
  try {
    // Authenticate the user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all achievements for the specified user
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        achievementId: true,
        unlockedAt: true
      }
    });
    
    return NextResponse.json(userAchievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
