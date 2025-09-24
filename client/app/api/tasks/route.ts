/**
 * API Routes for Task Management in Elevare
 * 
 * This file defines the API endpoints for creating and retrieving tasks.
 * It includes proper authentication, input validation, and database operations.
 * 
 * Endpoints:
 * - GET /api/tasks: Retrieve all tasks for the authenticated user
 * - POST /api/tasks: Create a new task for the authenticated user
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../../app/lib/prisma';
import { z } from 'zod';

/**
 * Task creation payload validation schema
 * 
 * Defines the expected structure and validation rules for creating new tasks.
 * 
 * Fields:
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
 * GET /api/tasks - Retrieve all tasks for the authenticated user
 * 
 * This endpoint fetches all tasks associated with the authenticated user,
 * ordered by creation date (newest first).
 * 
 * Authentication: Required via NextAuth session
 * 
 * Response:
 * - 200: Array of user's tasks with their associated tags
 * - 401: Unauthorized if no valid session exists
 * - 500: Internal server error
 * 
 * @returns NextResponse with array of tasks or error message
 */
export async function GET() {
  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch tasks from database with associated tags
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

    // Return tasks as JSON
    return NextResponse.json(tasks);
  } catch (err) {
    // Log error for debugging and return generic error message
    console.error('GET /tasks error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}

/**
 * POST /api/tasks - Create a new task for the authenticated user
 * 
 * This endpoint creates a new task after validating input and enforcing business rules:
 * - A user can only have one active (not completed) task at a time
 * - A user can only complete one task per day
 * 
 * Authentication: Required via NextAuth session
 * 
 * Request Body: { title: string; description?: string; isDone?: boolean; tagNames?: string[] }
 * 
 * Response:
 * - 200: Created task object
 * - 400: Validation error or business rule violation
 * - 401: Unauthorized if no valid session exists
 * - 500: Internal server error
 * 
 * @param request - HTTP request containing task data
 * @returns NextResponse with created task or error message
 */
export async function POST(request: Request) {
  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Validate input against schema
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

    // Enforce business rules
    if (existingActiveTask) {
      return NextResponse.json({ error: 'You can only have one active task at a time.' }, { status: 400 });
    }

    if (todayCompleted) {
      return NextResponse.json({ error: 'You already completed your daily task today.' }, { status: 400 });
    }

    // Atomic operation: upsert tags + create task to ensure data consistency
    const task = await prisma.$transaction(async (tx) => {
      // Handle tag connections
      let tagConnections: { id: string }[] = [];

      if (tagNames.length > 0) {
        // Create or update tags for this user
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

      // Create the task with associated tags
      return tx.task.create({
        data: {
          title,
          description,
          isDone: isDone ?? false, // Default to false if not provided
          user: { connect: { id: session.user.id } },
          tags: { connect: tagConnections },
        },
      });
    });

    // Return the created task
    return NextResponse.json(task);
  } catch (err) {
    // Log error for debugging and return generic error message
    console.error('POST /tasks error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
