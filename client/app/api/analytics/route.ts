import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get task completion data
    const completedTasks = await prisma.task.findMany({
      where: { 
        userId: session.user.id,
        isDone: true,
      },
      select: { 
        id: true, 
        title: true, 
        completedAt: true,
        createdAt: true,
        tags: {
          select: {
            name: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
    });

    // Filter out tasks with invalid dates and use createdAt as fallback for completedAt.
    const validCompletedTasks = completedTasks.map(task => ({
      ...task,
      // If completedAt is null, use createdAt as fallback.
      completedAt: task.completedAt || task.createdAt
    })).filter(task => task.completedAt !== null);


    // Get task failure data (uncompleted past due).
    const now = new Date();
    const failedTasks = await prisma.task.findMany({
      where: { 
        userId: session.user.id,
        isDone: false,
        createdAt: {
          lt: new Date(now.setDate(now.getDate() - 1)) // Tasks created more than 1 day ago
        }
      },
      select: { 
        id: true, 
        title: true, 
        createdAt: true,
        tags: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });


    // Get tag-based analytics
    const tagAnalytics = await prisma.tag.findMany({
      where: {
        tasks: {
          some: {
            userId: session.user.id
          }
        }
      },
      select: {
        name: true,
        tasks: {
          where: {
            userId: session.user.id
          },
          select: {
            isDone: true,
            completedAt: true
          }
        }
      }
    });

    console.log('Found tag analytics:', tagAnalytics);

    return NextResponse.json({
      completionData: validCompletedTasks,
      failureData: failedTasks,
      tagData: tagAnalytics
    });
  } catch (err) {
    console.error('Analytics API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}