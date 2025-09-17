import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

function targetFor(code: string): number | null {
  switch (code) {
    case 'first_task': return 1;
    case 'tasks_10': return 10;
    case 'tasks_100': return 100;
    case 'first_reflection': return 1;
    case 'reflections_10': return 10;
    case 'reflections_100': return 100;
    case 'streak_3': return 3;
    case 'streak_7': return 7;
    case 'streak_30': return 30;
    case 'night_owl': return 1; // time-based, mark as 1 when condition met
    case 'early_bird': return 1; // time-based, mark as 1 when condition met
    default: return null;
  }
}

function conditionTextFor(code: string): string | null {
  switch (code) {
    case 'streak_3': return 'Maintain a 3-day streak';
    case 'streak_7': return 'Maintain a 7-day streak';
    case 'streak_30': return 'Maintain a 30-day streak';
    case 'tasks_10': return 'Complete 10 tasks';
    case 'tasks_100': return 'Complete 100 tasks';
    case 'first_task': return 'Complete your first task';
    case 'first_reflection': return 'Write your first reflection';
    case 'reflections_10': return 'Write 10 reflections';
    case 'reflections_100': return 'Write 100 reflections';
    case 'night_owl': return 'Complete a task between 00:00–04:59';
    case 'early_bird': return 'Complete a task before 07:00';
    default: return null;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const [achievements, unlocked, tasksCompleted, reflectionsWritten, streak] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true },
      }),
      prisma.task.count({ where: { userId, isDone: true } }),
      prisma.task.count({ where: { userId, isDone: true, reflection: { not: null } } }),
      prisma.streak.findUnique({ where: { userId } }),
    ]);

    const unlockedMap = new Map(unlocked.map(u => [u.achievementId, u.unlockedAt]));

    const progress = achievements.map(a => {
      const t = targetFor(a.code);
      let current = 0;
      if (a.code.startsWith('tasks')) current = tasksCompleted;
      else if (a.code.startsWith('reflections') || a.code === 'first_reflection') current = reflectionsWritten;
      else if (a.code.startsWith('streak')) current = streak?.count ?? 0;
      else if (a.code === 'first_task') current = tasksCompleted;
      // time-based: current remains 0 unless unlocked

      const ua = unlockedMap.get(a.id) || null;
      const isUnlocked = ua !== null;

      // For time-based, set current to 1 if unlocked so UI shows 100%
      if ((a.code === 'night_owl' || a.code === 'early_bird') && isUnlocked) {
        current = 1;
      }

      return {
        id: a.id,
        code: a.code,
        title: a.title,
        description: a.description,
        icon: a.icon,
        category: a.category,
        target: t,
        current,
        unlocked: isUnlocked,
        unlockedAt: ua,
        conditionText: conditionTextFor(a.code),
      };
    });

    return NextResponse.json({
      totals: {
        total: achievements.length,
        unlocked: unlocked.length,
        completion: achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0,
      },
      progress,
    });
  } catch (error) {
    console.error('Error fetching achievements progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


