import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from "@/app/lib/prisma";

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Retrieves all tags for the user
 *     description: Fetches a list of all tags created by the authenticated user.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tags.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all tags belonging to the authenticated user
    const tags = await prisma.tag.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true }
    });

    return NextResponse.json(tags);
  } catch (err) {
    console.error('Tags API GET Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Creates or retrieves a tag
 *     description: Creates a new tag if it doesn't exist for the user, or retrieves the existing tag if it does. The check is case-insensitive.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The existing tag was retrieved.
 *       201:
 *         description: A new tag was created.
 *       400:
 *         description: Bad request (e.g., invalid tag name).
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

    const { name } = await request.json();
    const trimmedName = name?.trim();
    
    if (typeof trimmedName !== 'string' || trimmedName === '') {
      return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 });
    }

    // Use a transaction to find or create the tag
    const { tag, created } = await prisma.$transaction(async (tx) => {
        const existingTag = await tx.tag.findFirst({
            where: {
                userId: session.user.id,
                name: {
                    equals: trimmedName,
                    mode: 'insensitive'
                }
            }
        });

        if (existingTag) {
            return { tag: existingTag, created: false };
        }

        const newTag = await tx.tag.create({
            data: {
                name: trimmedName,
                userId: session.user.id
            }
        });
        return { tag: newTag, created: true };
    });

    return NextResponse.json(tag, { status: created ? 201 : 200 });
  } catch (err) {
    console.error('Tags API POST Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
