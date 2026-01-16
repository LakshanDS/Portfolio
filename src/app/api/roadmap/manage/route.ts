import { NextResponse } from "next/server";
import { getRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem } from "@/lib/data";

export async function GET() {
  try {
    const items = await getRoadmapItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching roadmap items:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await createRoadmapItem(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating roadmap item:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    const item = await updateRoadmapItem(id, updateData);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating roadmap item:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }
    
    await deleteRoadmapItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting roadmap item:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap item" },
      { status: 500 }
    );
  }
}
