import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params; 
    const body = await request.json();

    if (body.isDone === false) {
      body.reflection = null;
      body.completedAt = null;
    }
    
    // set the completedAt timestamp
    if (body.isDone === true && body.completedAt === undefined) {
      body.completedAt = new Date();
    }

    // Handle tags if provided
    let updateData: any = { ...body };
    
    if (body.tagNames !== undefined) {
      if (Array.isArray(body.tagNames)) {
        // Create or find tags
        const tags = await Promise.all(
          body.tagNames.map((name: string) => 
            prisma.tag.upsert({
              where: { name },
              update: {},
              create: { name }
            })
          )
        );
        
        // Connect the tags to the task
        updateData.tags = { 
          set: tags.map(tag => ({ id: tag.id }))
        };
      } else {
        // If tagNames is not an array, disconnect all tags
        updateData.tags = { 
          set: []
        };
      }
      
      // Remove tagNames from updateData as it's not a valid field
      delete updateData.tagNames;
    }

    const updatedTask = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: updateData,
      include: {
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}