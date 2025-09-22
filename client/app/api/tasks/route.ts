import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../../app/lib/prisma';
import { z } from 'zod';

/**
 * Task creation payload validation
 *
 * Fields
 * - title: required, non-empty string (trimmed)
 * - description: optional string
 * - isDone: optional boolean (defaults to false)
 * - tagNames: optional array of tag names (strings); tags are upserted per user
 */
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  isDone: z.boolean().optional(),
  tagNames: z.array(z.string()).optional(),
});

/**
 * GET /api/tasks
 *
 * Auth: required (NextAuth session)
 * Behavior: Returns the authenticated user's tasks ordered by createdAt desc.
 * Response: 200 JSON array of tasks: { id, title, description, isDone, createdAt, reflection, tags[{id,name}] }
 * Errors:
 *  - 401 when unauthenticated
 *  - 500 on unexpected errors
 */
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

/**
 * POST /api/tasks
 *
 * Auth: required (NextAuth session)
 * Body: { title: string; description?: string; isDone?: boolean; tagNames?: string[] }
 * Rules:
 *  - Only one active (isDone=false) task per user at a time
 *  - Tags are upserted per-user and connected atomically in a transaction
 * Success: 200 task JSON
 * Errors:
 *  - 400 invalid body or when an active task already exists
 *  - 401 unauthenticated
 *  - 500 on unexpected errors/malformed JSON
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Validate input
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', ') }, { status: 400 });
    }
    const { title, description, isDone, tagNames = [] } = parsed.data;

    // Check if user already has an active task (not completed)
    const existingActiveTask = await prisma.task.findFirst({
      where: {
        userId: session.user.id,
        isDone: false,
      },
    });

    // Also prevent creating a new task if the user already completed a task today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCompleted = await prisma.task.findFirst({
      where: {
        userId: session.user.id,
        isDone: true,
        completedAt: { gte: startOfToday },
      },
    });

    if (existingActiveTask) {
      return NextResponse.json({ error: 'You can only have one active task at a time.' }, { status: 400 });
    }

    if (todayCompleted) {
      return NextResponse.json({ error: 'You already completed your daily task today.' }, { status: 400 });
    }

    // Atomic operation: upsert tags + create task
    const task = await prisma.$transaction(async (tx) => {
      // Tag connections use string ids (cuid)
      let tagConnections: { id: string }[] = [];

      if (tagNames.length > 0) {
        const tags = await Promise.all(
          tagNames.map((name: string) =>
            tx.tag.upsert({
              where: { name_userId: { name, userId: session.user.id } },
              update: {},
              create: { name, user: { connect: { id: session.user.id } } },
            })
          )
        );
        tagConnections = tags.map((tag) => ({ id: tag.id }));
      }

      return tx.task.create({
        data: {
          title,
          description,
          isDone: isDone ?? false,
          user: { connect: { id: session.user.id } },
          tags: { connect: tagConnections },
        },
      });
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error('POST /tasks error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
