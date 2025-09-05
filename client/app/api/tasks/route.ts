import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, description: true, isDone: true, createdAt: true, reflection: true },
    });

    // Reset tasks that were completed yesterday or earlier
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedTasks = await Promise.all(tasks.map(async (task) => {
  if (task.completedAt) {
    const taskDate = new Date(task.completedAt);
    taskDate.setHours(0, 0, 0, 0);

    // If completed before today → reset
    if (taskDate < today) {
      await prisma.task.update({
        where: { id: task.id },
        data: { isDone: false, completedAt: null, reflection: null },
      });
      return { ...task, isDone: false, completedAt: null, reflection: null };
    }
  }

  return task;
}));

    return NextResponse.json(updatedTasks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, isDone } = await request.json();
    if (typeof title !== 'string' || title.trim() === '') return NextResponse.json({ error: 'Invalid title' }, { status: 400 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingTaskToday = await prisma.task.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
        },
        isDone: false,
      },
    });

    if (existingTaskToday) {
      return NextResponse.json({ error: 'You can only have one active task per day.' }, { status: 400 });
    }

    const task = await prisma.task.create({
    data: {
      title,
      description,
      isDone: isDone ?? false,
      completedAt: isDone ? new Date() : null,
      user: { connect: { id: session.user.id } },
    },
  });

    return NextResponse.json(task);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

