import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


    const { content, isDone } = await request.json();
    if (typeof content !== 'string' || typeof isDone !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { id } = await context.params;

    const updated = await prisma.task.updateMany({
      where: { id, userId: session.user.id },
      data: { content, isDone },
    });

    if (updated.count === 0) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const task = await prisma.task.findUnique({ where: { id } });
    return NextResponse.json(task);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}