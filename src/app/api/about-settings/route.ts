import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

/**
 * About Settings API (DB-backed)
 *
 * Stores settings in the singleton `CmsSettings` row: id="default"
 * Field used: `about`
 *
 * This replaces the old JSON filesystem approach.
 */

function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const settings = await prisma.cmsSettings.findUnique({
      where: { id: "default" },
      select: { about: true },
    });

    // Seed should create this, but if DB is empty we return null rather than crashing.
    if (!settings) return NextResponse.json(null);

    return NextResponse.json(settings.about);
  } catch (e) {
    console.error("Error fetching about settings:", e);
    return jsonError("Failed to fetch settings");
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const about = await request.json();

    await prisma.cmsSettings.upsert({
      where: { id: "default" },
      update: { about },
      create: {
        id: "default",
        // Important: create requires all non-null fields
        homepage: {},
        roadmap: {},
        projects: {},
        about,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (e) {
    console.error("Error saving about settings:", e);
    return jsonError("Failed to save settings");
  }
}
