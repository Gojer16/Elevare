import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get or create streak for user
    let streak = await prisma.streak.findUnique({
      where: { userId: session.user.id }
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId: session.user.id,
          count: 0,
          longest: 0,
          lastActive: new Date(0) // Initialize to epoch
        }
      });
    }

    return NextResponse.json(streak);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action } = await request.json();

    // Get current streak
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(streak.lastActive);
    lastActive.setHours(0, 0, 0, 0);
    
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((today.getTime() - lastActive.getTime()) / oneDay));

    if (action === 'increment') {
      // If it's the same day, don't increment
      if (diffDays === 0) {
        return NextResponse.json(streak);
      }
      
      // If it's consecutive day, increment streak
      if (diffDays === 1) {
        const newCount = streak.count + 1;
        const newLongest = Math.max(streak.longest, newCount);
        
        streak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: newCount,
            longest: newLongest,
            lastActive: new Date()
          }
        });
      } 
      // If more than one day has passed, reset streak
      else if (diffDays > 1) {
        streak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: 1,
            lastActive: new Date()
          }
        });
      }
    } else if (action === 'reset') {
      // Reset streak to 0
      streak = await prisma.streak.update({
        where: { id: streak.id },
        data: {
          count: 0
        }
      });
    }

    return NextResponse.json(streak);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}