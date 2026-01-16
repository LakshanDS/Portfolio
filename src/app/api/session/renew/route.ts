import { NextResponse } from "next/server";
import { getSession, renewSession, setSessionCookie } from "@/lib/server-auth";
import { logSessionRenewed } from "@/lib/auth-logger";

/**
 * POST - Renew the current session
 * Extends session expiration by 5 minutes
 */
export async function POST() {
  try {
    const currentSession = await getSession();

    if (!currentSession) {
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 401 }
      );
    }

    // Renew session
    const renewedSession = await renewSession();

    if (!renewedSession) {
      return NextResponse.json(
        { success: false, error: "Failed to renew session" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Session renewed",
      expiresAt: renewedSession.expiresAt,
    });

    // Set renewed session cookie
    response.headers.set("Set-Cookie", await setSessionCookie(renewedSession));

    // Log session renewal
    logSessionRenewed(renewedSession.userId);

    return response;
  } catch (error) {
    console.error("Session renewal error:", error);
    return NextResponse.json(
      { success: false, error: "Session renewal failed" },
      { status: 500 }
    );
  }
}
