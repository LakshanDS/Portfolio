import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if request has a body
    const text = await request.text();
    if (!text) {
      console.warn('Empty request body in track-visit');
      return NextResponse.json({ success: true });
    }

    // Parse JSON
    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      console.warn('Invalid JSON in track-visit:', text);
      return NextResponse.json({ success: true });
    }

    const { path } = body;
    const date = new Date().toISOString().split("T")[0];

    await prisma.pageVisit.upsert({
      where: {
        path_date: {
          path: path || "/",
          date: date,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        path: path || "/",
        date: date,
        count: 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('Unexpected error in track-visit:', error);
    return NextResponse.json({ success: true }); // Always return success to not break frontend
  }
}
