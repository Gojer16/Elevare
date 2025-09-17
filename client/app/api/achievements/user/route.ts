import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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