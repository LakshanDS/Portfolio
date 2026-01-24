import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});

interface LocationData {
    country: string;
    city: string;
}

async function getLocationFromIP(ip: string): Promise<LocationData | null> {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        if (!response.ok) return null;
        
        const data = await response.json();
        
        if (data.status === "success") {
            return {
                country: data.country,
                city: data.city,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
}

function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    
    if (realIP) {
        return realIP;
    }
    
    return "unknown";
}

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

        const { projectId, name, email, content } = result.data;

        const ip = getClientIP(req);
        const userAgent = req.headers.get("user-agent") || null;
        
        const location = await getLocationFromIP(ip);

        const comment = await prisma.comment.create({
            data: {
                projectId,
                name: name || null,
                email: email || null,
                content,
                ipAddress: ip !== "unknown" ? ip : null,
                userAgent,
                country: location?.country || null,
                city: location?.city || null,
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
        const projectId = searchParams.get("projectId");

        const whereClause = projectId ? { projectId } : {};

        const comments = await prisma.comment.findMany({
            where: whereClause,
            orderBy: [
                { isRead: 'asc' },
                { createdAt: 'desc' }
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
