import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from "@/app/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get all tags that belong to the user's tasks
    const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true }
    });

    return NextResponse.json(tags);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name } = await request.json();
    
    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 });
    }

    // Create tag if it doesn't exist
    const tag = await prisma.tag.upsert({
    where: { name_userId: { name: name.trim(), userId: session.user.id } },
    update: {},
    create: { name: name.trim(), userId: session.user.id }
  });

    return NextResponse.json(tag);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}