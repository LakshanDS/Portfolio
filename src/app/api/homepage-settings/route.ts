import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

/**
 * Homepage settings are stored in the singleton `CmsSettings` row (id = "default").
 * The `homepage` column is Prisma `Json`, mirroring the previous `homepage-settings.json` shape.
 */

const SETTINGS_ID = "default";

async function getOrCreateCmsSettingsRow() {
  const existing = await prisma.cmsSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: { id: true, homepage: true },
  });

  if (existing) return existing;

  // If the seed hasn't run yet for some reason, initialize with a safe default.
  // (Keeping it minimal to avoid guessing your entire homepage schema here.)
  return await prisma.cmsSettings.create({
    data: {
      id: SETTINGS_ID,
      homepage: {
        hero: {
          title: "",
          description: "",
          primaryButtonText: "",
          primaryButtonLink: "",
          secondaryButtonText: "",
          secondaryButtonLink: "",
          imageUrl: "",
        },
        sections: {},
      },
      about: {},
      roadmap: {},
      projects: {},
    },
    select: { id: true, homepage: true },
  });
}

export async function GET() {
  try {
    const row = await getOrCreateCmsSettingsRow();
    return NextResponse.json(row.homepage);
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const homepageSettings = await request.json();

    await prisma.cmsSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {
        homepage: homepageSettings,
      },
      create: {
        id: SETTINGS_ID,
        homepage: homepageSettings,
        about: {},
        roadmap: {},
        projects: {},
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving homepage settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
