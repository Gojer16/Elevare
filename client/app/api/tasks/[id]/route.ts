/**
 * API Route for Updating Tasks in Elevare
 * 
 * This file defines the PUT endpoint for updating existing tasks.
 * It includes proper authentication, input validation, and database operations.
 * 
 * Endpoint:
 * - PUT /api/tasks/[id]: Update an existing task for the authenticated user
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

/**
 * URL parameters validation schema
 * 
 * Validates the task ID parameter from the route
 * - id: task id as non-empty string
 */
const paramsSchema = z.object({
  id: z.string().min(1),
});

/**
 * Task update payload validation schema
 * 
 * Defines the expected structure and validation rules for updating tasks.
 * All fields are optional to allow for partial updates.
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
 * PUT /api/tasks/[id] - Update an existing task
 * 
 * This endpoint updates a specific task after validating the user's authorization
 * and input data. It enforces business logic for task completion and reflection handling.
 * 
 * Authentication: Required via NextAuth session
 * 
 * Path Parameters: { id: string } - The ID of the task to update
 * Request Body: Partial task fields (see updateSchema)
 * 
 * Behavior:
 * - Validates route param id and request body
 * - Ensures the task exists and belongs to the current user
 * - If isDone=false: clears reflection and completedAt
 * - If isDone=true and not previously completed: sets completedAt
 * - Upserts tagNames for the user and sets relations (if provided)
 * 
 * Response:
 * - 200: Updated task object (includes tags[{id,name}])
 * - 400: Invalid ID or request body
 * - 401: Unauthorized if no valid session exists
 * - 404: Task not found or not owned by user
 * - 500: Internal server error
 * 
 * @param request - HTTP request containing the update data
 * @returns NextResponse with updated task or error message
 */
export async function PUT(request: Request) {
  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract task ID from URL path
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const id = segments.pop() ?? '';
    const parsedParams = paramsSchema.safeParse({ id });
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
    }

    // Validate request body
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', ');
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    const data = parsed.data;

    // Execute the update in a database transaction to ensure data consistency
    const updatedTask = await prisma.$transaction(async (tx) => {
      // Verify that the task exists and belongs to the current user
      const existing = await tx.task.findUnique({ where: { id } });
      if (!existing || existing.userId !== session.user.id) {
        // Throwing causes the transaction to rollback
        const e: Error & { code?: string } = new Error('NOT_FOUND_OR_FORBIDDEN');
        e.code = 'NOT_FOUND_OR_FORBIDDEN';
        throw e;
      }

      // Build update payload, carefully handling special fields
      const updateData: {
        title?: string;
        description?: string | null;
        reflection?: string | null;
        isDone?: boolean;
        completedAt?: Date | null;
        tags?: { set: { id: string }[] };
      } = {};

      // Copy allowed fields from request data
      if (data.title !== undefined) updateData.title = data.title;
      if (Object.prototype.hasOwnProperty.call(data, 'description'))
        updateData.description = data.description;
      if (Object.prototype.hasOwnProperty.call(data, 'reflection'))
        updateData.reflection = data.reflection;

      // Handle task completion logic on the server side
      // This ensures proper handling of completedAt and reflection fields
      if (typeof data.isDone === 'boolean') {
        if (data.isDone === false) {
          updateData.isDone = false;
          updateData.reflection = null;
          updateData.completedAt = null;
        } else {
          // Marking task as done
          updateData.isDone = true;
          // If it wasn't completed before, set completedAt to now
          if (!existing.completedAt) updateData.completedAt = new Date();
        }
      }

      // Handle tag associations with upserting logic
      if (Object.prototype.hasOwnProperty.call(data, 'tagNames')) {
        const tagNames = data.tagNames ?? [];
        if (!Array.isArray(tagNames) || tagNames.length === 0) {
          // Explicitly empty array means clear all tags
          updateData.tags = { set: [] };
        } else {
          // Upsert tags and create associations for this user
          // Find or create tags specific to this user
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

      // Perform the actual update operation
      // Since we've already verified ownership, this is safe to execute by ID
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

    // Return the successfully updated task
    return NextResponse.json(updatedTask);
  } catch (err: unknown) {
    // Handle explicit ownership / not found errors
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
