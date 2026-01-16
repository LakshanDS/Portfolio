import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = commentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, content } = result.data;

        const comment = await prisma.comment.create({
            data: {
                name: name || "Anonymous",
                email: email || null,
                content,
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50");

        const comments = await prisma.comment.findMany({
            orderBy: [
                { isRead: 'asc' }, // Unread first
                { createdAt: 'desc' } // Newest first
            ],
            take: limit,
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}
