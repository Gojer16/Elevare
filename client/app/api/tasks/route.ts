import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../../app/lib/prisma';
import { z } from 'zod';

// Zod schema for POST validation
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  isDone: z.boolean().optional(),
  tagNames: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        title: true, 
        description: true, 
        isDone: true, 
        createdAt: true, 
        reflection: true,
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error('GET /tasks error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Validate input
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }
    const { title, description, isDone, tagNames = [] } = parsed.data;

    // Check if user already has an active task (not completed)
    const existingActiveTask = await prisma.task.findFirst({
      where: {
        userId: session.user.id,
        isDone: false,
      },
    });

    if (existingActiveTask) {
      return NextResponse.json({ error: 'You can only have one active task at a time.' }, { status: 400 });
    }

    // Atomic operation: upsert tags + create task
    const task = await prisma.$transaction(async (tx) => {
      let tagConnections: { id: number }[] = [];

      if (tagNames.length > 0) {
        const tags = await Promise.all(
          tagNames.map(name =>
            tx.tag.upsert({
              where: { name },
              update: {},
              create: { name }
            })
          )
        );
        tagConnections = tags.map(tag => ({ id: tag.id }));
      }

      return tx.task.create({
        data: {
          title,
          description,
          isDone: isDone ?? false,
          user: { connect: { id: session.user.id } },
          tags: { connect: tagConnections }
        },
      });
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error('POST /tasks error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
