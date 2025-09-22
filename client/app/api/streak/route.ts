import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

/**
 * @swagger
 * /api/streak:
 *   get:
 *     summary: Retrieves the user's streak data
 *     description: Fetches the current streak data for the authenticated user. If a streak record does not exist, it creates one with default values.
 *     tags:
 *       - Streaks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak data retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user's streak record
    let streak = await prisma.streak.findUnique({
      where: { userId: session.user.id }
    });

    // If no streak record exists, create one
    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId: session.user.id,
          count: 0,
          longest: 0,
          lastActive: new Date(0) // Initialize to the epoch
        }
      });
    }

    return NextResponse.json(streak);
  } catch (err) {
    console.error('Streak API GET Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/streak:
 *   post:
 *     summary: Updates the user's streak
 *     description: Modifies the user's streak based on the provided action (`increment` or `reset`).
 *     tags:
 *       - Streaks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [increment, reset]
 *     responses:
 *       200:
 *         description: Streak updated successfully.
 *       400:
 *         description: Bad request (e.g., invalid action).
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    // Ensure a streak record exists
    let streak = await prisma.streak.findUnique({
      where: { userId: session.user.id }
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId: session.user.id,
          count: 0,
          longest: 0,
          lastActive: new Date(0)
        }
      });
    }

    if (action === 'increment') {
      // Normalize dates to compare just the day, not the time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActiveDate = new Date(streak.lastActive);
      lastActiveDate.setHours(0, 0, 0, 0);
      
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((today.getTime() - lastActiveDate.getTime()) / oneDay));

      // Case 1: Activity on the same day. Do nothing.
      if (diffDays === 0) {
        return NextResponse.json(streak);
      }
      
      // Case 2: Activity on a consecutive day. Increment streak.
      if (diffDays === 1) {
        const newCount = streak.count + 1;
        streak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: newCount,
            longest: Math.max(streak.longest, newCount), // Update longest if new streak is greater
            lastActive: new Date()
          }
        });
      } 
      // Case 3: A day or more was missed. Reset streak to 1.
      else {
        streak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: 1,
            lastActive: new Date()
          }
        });
      }
    } else if (action === 'reset') {
      // Explicitly reset the streak to 0
      streak = await prisma.streak.update({
        where: { id: streak.id },
        data: {
          count: 0
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(streak);
  } catch (err) {
    console.error('Streak API POST Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
