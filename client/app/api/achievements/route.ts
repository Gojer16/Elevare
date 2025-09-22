import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Retrieves all achievements
 *     description: Fetches a list of all achievements from the database, ordered by their creation date.
 *     tags:
 *       - Achievements
 *     responses:
 *       200:
 *         description: A JSON array of achievement objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
