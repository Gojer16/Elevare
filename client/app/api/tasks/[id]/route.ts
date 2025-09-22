import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

/**
 * URL params validation
 * - id: task id as non-empty string
 */
const paramsSchema = z.object({
  id: z.string().min(1),
});

/**
 * Task update payload validation
 *
 * Optional fields (partial update):
 * - title: non-empty string (trimmed)
 * - description: string | null
 * - isDone: boolean (server manages completedAt & reflection clearing)
 * - reflection: string | null
 * - tagNames: array of non-empty strings; will upsert & set associations
 */
const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().nullable().optional(),
  isDone: z.boolean().optional(),
  reflection: z.string().nullable().optional(),
  // tagNames if present must be an array of non-empty strings
  tagNames: z.array(z.string().trim().min(1)).optional(),
}).strict();

/**
 * PUT /api/tasks/[id]
 *
 * Auth: required (NextAuth session)
 * Body: Partial task fields (see updateSchema)
 * Behavior:
 *  - Validates route param id and body
 *  - Ensures the task exists and belongs to the current user
 *  - If isDone=false: clears reflection and completedAt
 *  - If isDone=true and not previously completed: sets completedAt
 *  - Upserts tagNames for the user and sets relations (if provided)
 * Success: 200 updated task JSON (includes tags[{id,name}])
 * Errors:
 *  - 400 invalid id/body
 *  - 401 unauthenticated
 *  - 404 task not found or not owned by user
 *  - 500 on unexpected errors/malformed JSON
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract dynamic route `id` from the request URL path (last path segment)
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const id = segments.pop() ?? '';
    const parsedParams = paramsSchema.safeParse({ id });
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', ');
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    const data = parsed.data;

    // Transaction: check ownership, upsert tags (if provided), update task
    const updatedTask = await prisma.$transaction(async (tx) => {
      // ensure task exists and belongs to the current user
      const existing = await tx.task.findUnique({ where: { id } });
      if (!existing || existing.userId !== session.user.id) {
        // Throwing causes the transaction to rollback
        const e: Error & { code?: string } = new Error('NOT_FOUND_OR_FORBIDDEN');
        e.code = 'NOT_FOUND_OR_FORBIDDEN';
        throw e;
      }

      // Build update payload carefully (don't let client set completedAt)
      const updateData: {
        title?: string;
        description?: string | null;
        reflection?: string | null;
        isDone?: boolean;
        completedAt?: Date | null;
        tags?: { set: { id: string }[] };
      } = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (Object.prototype.hasOwnProperty.call(data, 'description'))
        updateData.description = data.description;
      if (Object.prototype.hasOwnProperty.call(data, 'reflection'))
        updateData.reflection = data.reflection;

      // isDone logic: server-manage completedAt and reflection clearing
      if (typeof data.isDone === 'boolean') {
        if (data.isDone === false) {
          updateData.isDone = false;
          updateData.reflection = null;
          updateData.completedAt = null;
        } else {
          // mark done
          updateData.isDone = true;
          // if it wasn't completed before, set completedAt now
          if (!existing.completedAt) updateData.completedAt = new Date();
        }
      }

      // Tag handling (atomic upsert + set)
      if (Object.prototype.hasOwnProperty.call(data, 'tagNames')) {
        const tagNames = data.tagNames ?? [];
        if (!Array.isArray(tagNames) || tagNames.length === 0) {
          // explicit empty array -> clear tags
          updateData.tags = { set: [] };
        } else {
          // upsert tags and set relation
          // Find or create tags for this specific user
          const tags = await Promise.all(
            tagNames.map((name: string) =>
              tx.tag.upsert({
                where: {
                  name_userId: {
                    name,
                    userId: session.user.id
                  }
                },
                update: {},
                create: {
                  name,
                  userId: session.user.id
                },
              })
            )
          );
          updateData.tags = { set: tags.map((t) => ({ id: t.id })) };
        }
      }

      // Perform the update (by id, safe because we already confirmed ownership)
      const updated = await tx.task.update({
        where: { id },
        data: updateData,
        include: {
          tags: {
            select: { id: true, name: true },
          },
        },
      });

      return updated;
    });

    // Success
    return NextResponse.json(updatedTask);
  } catch (err: unknown) {
    // Handle ownership / not found explicitly
    if (err && typeof err === 'object' && 'code' in err && err.code === 'NOT_FOUND_OR_FORBIDDEN') {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Validation errors from zod are already returned above
    // Log details internally; return safe message to client
    console.error('PUT /tasks/[id] error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
