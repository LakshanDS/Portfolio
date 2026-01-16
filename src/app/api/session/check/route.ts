import { NextResponse } from "next/server";
import { getSession, getSessionTimeRemaining } from "@/lib/server-auth";

/**
 * GET - Check if session is valid and get remaining time
 */
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          timeRemaining: 0 
        },
        { status: 401 }
      );
    }

    const timeRemaining = await getSessionTimeRemaining();

    return NextResponse.json({
      success: true,
      authenticated: true,
      timeRemaining,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        timeRemaining: 0,
        error: "Session check failed" 
      },
      { status: 500 }
    );
  }
}
