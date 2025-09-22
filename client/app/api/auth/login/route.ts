import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in a user
 *     description: |
 *       Verifies user credentials against the database.
 *       Note: This endpoint validates credentials and returns user data, but it does not create a session.
 *       Session management is handled by NextAuth.js.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Returns the user object (without password).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate request body
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check if user exists and has a password
    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify the password
    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isCorrectPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

  // Do not return the password hash - destructure and mark as used to satisfy lint
  const { hashedPassword, ...userWithoutPassword } = user as User;
  void hashedPassword; // mark deliberately unused

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}