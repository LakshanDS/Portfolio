import { NextResponse } from "next/server";
import { 
  getAboutCards, 
  createAboutCard, 
  updateAboutCard, 
  deleteAboutCard 
} from "@/lib/data";

export async function GET() {
  try {
    const items = await getAboutCards();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching about cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch about cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await createAboutCard(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating about card:", error);
    return NextResponse.json(
      { error: "Failed to create about card" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    const item = await updateAboutCard(id, updateData);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating about card:", error);
    return NextResponse.json(
      { error: "Failed to update about card" },
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
    
    await deleteAboutCard(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting about card:", error);
    return NextResponse.json(
      { error: "Failed to delete about card" },
      { status: 500 }
    );
  }
}
