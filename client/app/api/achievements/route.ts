import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

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