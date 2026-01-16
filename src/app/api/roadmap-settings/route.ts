import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Roadmap settings are now stored in the database in the `CmsSettings` singleton row (id = "default").
 * This route keeps the same contract as before:
 * - GET returns the roadmap settings JSON
 * - POST overwrites the roadmap settings JSON
 */

interface RoadmapSettings {
  selfCommitBadge: {
    enabled: boolean;
    text: string;
  };
  hero: {
    title: string;
    description: string;
  };
  terminalText: string[];
  philosophyText: string;
}

const defaultSettings: RoadmapSettings = {
  selfCommitBadge: {
    enabled: true,
    text: "Self Commit 2024-2025",
  },
  hero: {
    title: "Building The Future, || One Pipeline at a Time",
    description:
      "A visual timeline of my professional growth, technical milestones, and future aspirations in the world of DevOps, Cloud Engineering, and Automation.",
  },
  terminalText: [
    "$ git add .",
    '$ git commit -m "self upgrade init"',
    "[main 3f32d] self upgrade init",
    "Commit successful",
    "self improved",
  ],
  philosophyText:
    "I believe in automating everything that needs to be done more than once. My goal is to build systems that are self-healing, scalable, and secure by default.",
};

async function ensureCmsSettingsRowExists() {
  const existing = await prisma.cmsSettings.findUnique({
    where: { id: "default" },
  });

  if (existing) return existing;

  // Create with defaults for all documents. We only know roadmap defaults here,
  // so for the other docs we store an empty object to keep DB constraints happy.
  return await prisma.cmsSettings.create({
    data: {
      id: "default",
      homepage: {} as any,
      about: {} as any,
      roadmap: defaultSettings as any,
      projects: {} as any,
    },
  });
}

export async function GET() {
  try {
    const row = await ensureCmsSettingsRowExists();
    return NextResponse.json(row.roadmap ?? defaultSettings);
  } catch (error) {
    console.error("Failed to load roadmap settings:", error);
    return NextResponse.json(defaultSettings, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings: RoadmapSettings = await request.json();

    await ensureCmsSettingsRowExists();

    await prisma.cmsSettings.update({
      where: { id: "default" },
      data: {
        roadmap: settings as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Failed to save roadmap settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
