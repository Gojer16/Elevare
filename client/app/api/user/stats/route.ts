import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma';

/**
 * @swagger
 * /api/user/stats:
 *   get:
 *     summary: Retrieve user statistics
 *     description: Fetches a variety of user statistics, including completed tasks, written reflections, and streak information.
 *     responses:
 *       200:
 *         description: Successfully retrieved user statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasksCompleted:
 *                   type: integer
 *                   description: The total number of completed tasks.
 *                 reflectionsWritten:
 *                   type: integer
 *                   description: The total number of written reflections.
 *                 streakCount:
 *                   type: integer
 *                   description: The current streak count.
 *                 longestStreak:
 *                   type: integer
 *                   description: The longest streak achieved by the user.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get tasks stats
    const tasksCompleted = await prisma.task.count({
      where: { 
        userId: session.user.id,
        isDone: true
      }
    });

    // Get reflections stats
    const reflectionsWritten = await prisma.task.count({
      where: { 
        userId: session.user.id,
        isDone: true,
        reflection: {
          not: null
        }
      }
    });

    // Get streak info
    const streak = await prisma.streak.findUnique({
      where: { userId: session.user.id }
    });

    const stats = {
      tasksCompleted,
      reflectionsWritten,
      streakCount: streak?.count || 0,
      longestStreak: streak?.longest || 0
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}