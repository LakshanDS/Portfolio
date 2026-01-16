import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Status = "operational" | "non-operational";

interface ProjectsSettings {
  hero: {
    title: string;
    tagline: string;
  };
  statusBadge: {
    enabled: boolean;
    status: Status;
  };
  cta: {
    enabled: boolean;
  };
}

const defaultSettings: ProjectsSettings = {
  hero: {
    title: "Engineering Projects",
    tagline:
      "A curated collection of infrastructure automation, CI/CD pipelines, and cloud-native applications designed for scale.",
  },
  statusBadge: {
    enabled: true,
    status: "operational",
  },
  cta: {
    enabled: true,
  },
};

async function ensureCmsSettingsRow() {
  const existing = await prisma.cmsSettings.findUnique({
    where: { id: "default" },
    select: { id: true },
  });

  if (existing) return;

  await prisma.cmsSettings.create({
    data: {
      id: "default",
      homepage: {} as any,
      about: {} as any,
      roadmap: {} as any,
      projects: defaultSettings as any,
    },
  });
}

export async function GET() {
  try {
    await ensureCmsSettingsRow();

    const row = await prisma.cmsSettings.findUnique({
      where: { id: "default" },
      select: { projects: true },
    });

    // If the row exists but projects is nullish/empty, fall back to defaults
    const projects = (row?.projects ?? defaultSettings) as ProjectsSettings;

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to load projects settings:", error);
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = (await request.json()) as ProjectsSettings;

    await ensureCmsSettingsRow();

    await prisma.cmsSettings.update({
      where: { id: "default" },
      data: {
        projects: settings as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Failed to save projects settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
