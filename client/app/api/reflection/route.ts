import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

/**
 * @swagger
 * /api/reflection:
 *   post:
 *     summary: Creates a new reflection
 *     description: |
 *       Accepts a user's reflection message, generates AI-powered feedback, and persists the reflection.
 *       Can optionally be linked to a specific task.
 *     tags:
 *       - Reflections
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's reflection text.
 *               taskId:
 *                 type: string
 *                 description: Optional ID of the task this reflection is associated with.
 *     responses:
 *       200:
 *         description: Reflection created successfully.
 *       400:
 *         description: Bad request (e.g., message is missing).
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, taskId } = await request.json();
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userId = session.user.id;

    // Fetch recent user activity to provide context for the AI
    const [recentTasks, recentReflections] = await Promise.all([
      prisma.task.findMany({
        where: { userId, isDone: true },
        orderBy: { completedAt: 'desc' },
        take: 5,
        select: { title: true, description: true, completedAt: true }
      }),
      prisma.reflection.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { content: true, createdAt: true }
      })
    ]);

    // Construct the context payload for the AI model
    const context = {
      recentTasks: recentTasks.map(t => ({
        title: t.title,
        description: t.description,
        completedAt: t.completedAt
      })),
      recentReflections: recentReflections.map(r => ({
        content: r.content,
        createdAt: r.createdAt
      })),
      userMessage: message.trim()
    };

    // Generate a thoughtful response from the AI
    const aiResponse = await generateReflectionResponse(context);

    // Save the reflection and AI feedback to the database
    const reflection = await prisma.reflection.create({
      data: {
        content: message.trim(),
        aiFeedback: aiResponse,
        userId,
        // Optionally link the reflection to a specific task
        ...(taskId && { taskId: taskId })
      }
    });

    return NextResponse.json({
      success: true,
      aiResponse,
      reflectionId: reflection.id
    });

  } catch (error) {
    console.error('Error in reflection API (POST):', error);
    return NextResponse.json({ 
      error: 'Failed to process reflection' 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/reflection:
 *   get:
 *     summary: Retrieves reflection history
 *     description: Fetches a paginated list of the authenticated user's past reflections.
 *     tags:
 *       - Reflections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of reflections per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *     responses:
 *       200:
 *         description: A paginated list of reflections.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const [reflections, total] = await prisma.$transaction([
        prisma.reflection.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
            select: {
                id: true,
                content: true,
                aiFeedback: true,
                createdAt: true,
                task: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        }),
        prisma.reflection.count({ where: { userId: session.user.id } })
    ]);

    return NextResponse.json({
      reflections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reflections (GET):', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reflections' 
    }, { status: 500 });
  }
}


/**
 * Generates an AI-powered, reflective response based on the user's message and recent activity.
 * NOTE: This is a placeholder implementation. In a production environment, this would
 * make a call to a dedicated AI service (e.g., Google Gemini).
 * @param context - The user's message and recent activity.
 * @returns A promise that resolves to a string containing the AI's response.
 */
async function generateReflectionResponse(context: {
  recentTasks: Array<{ title: string; description: string | null; completedAt: Date | null }>;
  recentReflections: Array<{ content: string; createdAt: Date }>;
  userMessage: string;
}): Promise<string> {
  try {
    // This is a mock implementation that returns a random thoughtful response.
    // A real implementation would use the context to create a prompt for an LLM.
    const responses = [
      `Thank you for sharing that. It sounds like you're being really thoughtful about your progress. What would you like to focus on improving tomorrow?`,
      `That's a great insight. I can see you've been working on ${context.recentTasks[0]?.title || 'your goals'}. How does this reflection connect to what you've learned recently?`,
      `I appreciate you taking the time to reflect. What's one small step you could take based on what you've shared?`,
      `That's a valuable observation. How do you feel this connects to your overall growth and the progress you've been making?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];

  } catch (error) {
    console.error('Error generating AI response:', error);
    // Return a safe, generic response in case of an error.
    return "I'm here to listen and help you reflect. What else is on your mind today?";
  }
}
