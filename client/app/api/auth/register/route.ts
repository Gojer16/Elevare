import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new user
 *     description: Validates input, checks for existing users, hashes the password, and creates a new user in the database.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully. Returns the new user object (without password).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., missing fields, user already exists).
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate request body
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

  // Do not return the password hash — keep a reference and mark it used so linters
  // don't complain about unused destructured variables.
  const { hashedPassword: _hashedPassword, ...userWithoutPassword } = user;
  void _hashedPassword;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}