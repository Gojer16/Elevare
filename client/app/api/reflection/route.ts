import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

/**
 * Reflection API Endpoint
 * 
 * Handles AI-powered reflection conversations and saves reflection data.
 * Integrates with the existing Gemini AI service for intelligent responses.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationId } = await request.json();
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userId = session.user.id;

    // Get user's recent task and reflection history for context
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

    // Create context for AI
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

    // Call AI service for reflection response
    const aiResponse = await generateReflectionResponse(context);

    // Save the reflection conversation
    const reflection = await prisma.reflection.create({
      data: {
        content: message.trim(),
        aiFeedback: aiResponse,
        userId,
        // Optionally link to a specific task if conversationId is provided
        ...(conversationId && { taskId: conversationId })
      }
    });

    return NextResponse.json({
      success: true,
      aiResponse,
      reflectionId: reflection.id
    });

  } catch (error) {
    console.error('Error in reflection API:', error);
    return NextResponse.json({ 
      error: 'Failed to process reflection' 
    }, { status: 500 });
  }
}

/**
 * Generate AI response for reflection using Gemini
 */
async function generateReflectionResponse(context: {
  recentTasks: Array<{ title: string; description: string | null; completedAt: Date | null }>;
  recentReflections: Array<{ content: string; createdAt: Date }>;
  userMessage: string;
}): Promise<string> {
  try {
    // For now, we'll use a simple prompt. In the future, this could be enhanced
    // with the full Gemini integration from the server-side services
    
    // TODO: Replace with actual Gemini API call
    // For now, return a thoughtful mock response
    const responses = [
      `I hear you saying: "${context.userMessage}". That's a meaningful reflection. What patterns do you notice in how you're approaching your goals lately?`,
      `Thank you for sharing that. It sounds like you're being really thoughtful about your progress. What would you like to focus on improving tomorrow?`,
      `That's a great insight. I can see you've been working on ${context.recentTasks[0]?.title || 'your goals'}. How does this reflection connect to what you've learned recently?`,
      `I appreciate you taking the time to reflect. What's one small step you could take based on what you've shared?`,
      `That's a valuable observation. How do you feel this connects to your overall growth and the progress you've been making?`
    ];

    // Return a random response for now (in production, this would be the AI response)
    return responses[Math.floor(Math.random() * responses.length)];

  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm here to listen and help you reflect. What else is on your mind today?";
  }
}

/**
 * Get reflection history for a user
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reflections = await prisma.reflection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
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
    });

    return NextResponse.json({
      reflections,
      hasMore: reflections.length === limit
    });

  } catch (error) {
    console.error('Error fetching reflections:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reflections' 
    }, { status: 500 });
  }
}