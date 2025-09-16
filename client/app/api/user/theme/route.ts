import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const ThemeSchema = z.enum(["modern", "minimal"]);
const TimezoneSchema = z.string().min(1);

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const theme = ThemeSchema.parse(body.theme);

    const updated = await prisma.user.update({
      where: { id: session.user.id }, 
      data: { themePreference: theme.toUpperCase() },
    });

    return NextResponse.json({ theme: updated.themePreference });
  } catch (err) {
    console.error("theme:update", {
      error: err instanceof Error ? err.message : err,
    });

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid theme", details: err.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
        { error: "Invalid timezone", details: err.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
