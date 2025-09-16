import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().min(1),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().nullable().optional(),
  isDone: z.boolean().optional(),
  reflection: z.string().nullable().optional(),
  // tagNames if present must be an array of non-empty strings
  tagNames: z.array(z.string().trim().min(1)).optional(),
}).strict();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const parsedParams = paramsSchema.safeParse({ id });
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    const data = parsed.data;

    // Transaction: check ownership, upsert tags (if provided), update task
    const updatedTask = await prisma.$transaction(async (tx) => {
      // ensure task exists and belongs to the current user
      const existing = await tx.task.findUnique({ where: { id } });
      if (!existing || existing.userId !== session.user.id) {
        // Throwing causes the transaction to rollback
        const e: any = new Error('NOT_FOUND_OR_FORBIDDEN');
        e.code = 'NOT_FOUND_OR_FORBIDDEN';
        throw e;
      }

      // Build update payload carefully (don't let client set completedAt)
      const updateData: any = {};

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
          const tags = await Promise.all(
            tagNames.map((name: string) =>
              tx.tag.upsert({
                where: { name },
                update: {},
                create: { name },
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
  } catch (err: any) {
    // Handle ownership / not found explicitly
    if (err?.code === 'NOT_FOUND_OR_FORBIDDEN') {
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
