import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma';

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