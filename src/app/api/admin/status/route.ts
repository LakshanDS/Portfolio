import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function POST(request: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { isOpenToWork } = await request.json();

        const status = await prisma.profileStatus.findFirst();

        if (status) {
            await prisma.profileStatus.update({
                where: { id: status.id },
                data: { isOpenToWork },
            });
        } else {
            await prisma.profileStatus.create({
                data: {
                    isOpenToWork,
                    statusMessage: "Available for hire",
                    githubUsername: "",
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}
