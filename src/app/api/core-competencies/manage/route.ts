import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  console.log("PUT request started");
  try {
    const body = await request.json();
    const { id, title, description, expertise, tags, icon } = body;

    console.log("Received PUT request:", { id, title, description, expertise, tags, icon });

    if (!id || !title || !description || !expertise) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("About to update competency with id:", id);
    const competency = await prisma.coreCompetency.update({
      where: { id },
      data: {
        title,
        description,
        expertise,
        tags: tags || "",
        icon: icon || null
      }
    });

    console.log("Updated competency successfully:", competency);
    const response = NextResponse.json(competency);
    console.log("Response created:", response);
    return response;
  } catch (error) {
    console.error("Error updating core competency:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorMessage = error instanceof Error ? error.message : "Failed to update core competency";
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
    console.log("Error response created:", response);
    return response;
  }
}
