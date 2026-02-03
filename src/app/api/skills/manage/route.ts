import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  getAllSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill,
  deleteSkill
} from "@/lib/data";

export async function GET() {
  try {
    const categories = await getAllSkills();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await request.json();
    const { type, ...rest } = data;

    let result;
    if (type === 'category') {
      result = await createSkillCategory(rest);
    } else if (type === 'skill') {
      result = await createSkill(rest);
    } else {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await request.json();
    const { type, id, ...rest } = data;

    let result;
    if (type === 'category') {
      result = await updateSkillCategory(id, rest);
    } else if (type === 'skill') {
      result = await updateSkill(id, rest);
    } else {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating skill:", error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { error: "ID and type are required" },
        { status: 400 }
      );
    }

    if (type === 'category') {
      await deleteSkillCategory(id);
    } else if (type === 'skill') {
      await deleteSkill(id);
    } else {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
