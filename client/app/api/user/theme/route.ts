import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { Theme as PrismaTheme } from '@prisma/client';
import { z } from "zod";

const ThemeSchema = z.enum(["modern", "minimal"]);
const TimezoneSchema = z.string().min(1);

/**
 * @swagger
 * /api/user/theme:
 *   patch:
 *     summary: Update user theme preference
 *     description: Updates the theme preference for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [modern, minimal]
 *                 description: The desired theme.
 *     responses:
 *       200:
 *         description: Successfully updated theme preference.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   description: The updated theme preference.
 *       400:
 *         description: Invalid theme provided.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal server error.
 */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const theme = ThemeSchema.parse(body.theme);

    // Prisma enum values are uppercase (e.g. 'MODERN', 'MINIMAL')
    const themeValue = theme.toUpperCase() as unknown as PrismaTheme;

    const updated = await prisma.user.update({
      where: { id: session.user.id }, 
      data: { themePreference: themeValue },
    });

    return NextResponse.json({ theme: updated.themePreference });
  } catch (err) {
    console.error("theme:update", {
      error: err instanceof Error ? err.message : err,
    });

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid theme", details: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/theme:
 *   put:
 *     summary: Update user timezone
 *     description: Updates the timezone for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timezone:
 *                 type: string
 *                 description: The desired timezone.
 *     responses:
 *       200:
 *         description: Successfully updated timezone.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID.
 *                 timezone:
 *                   type: string
 *                   description: The updated timezone.
 *       400:
 *         description: Invalid timezone provided.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal server error.
 */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const timezone = TimezoneSchema.parse(body.timezone);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { timezone },
    });

    return NextResponse.json({
      id: updated.id,
      timezone: updated.timezone,
    });
  } catch (err) {
    console.error("timezone:update", {
      error: err instanceof Error ? err.message : err,
    });

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid timezone", details: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
