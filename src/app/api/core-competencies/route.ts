import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const competencies = await prisma.coreCompetency.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        category: {
          include: {
            skills: true
          }
        }
      }
    });

    return NextResponse.json(competencies);
  } catch (error) {
    console.error("Error fetching core competencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch core competencies" },
      { status: 500 }
    );
  }
}
