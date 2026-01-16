import { NextResponse } from "next/server";
import { clearSession, clearSessionCookie } from "@/lib/server-auth";
import { logLogout } from "@/lib/auth-logger";

/**
 * POST - Logout and clear the session
 */
export async function POST() {
  try {
    await clearSession();

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear session cookie
    response.headers.set("Set-Cookie", clearSessionCookie());

    // Log logout
    logLogout("admin");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
