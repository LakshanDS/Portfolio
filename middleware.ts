import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

type SessionShape = {
  userId: string;
  token: string;
  expiresAt: number;
  signature: string;
};

function parseSessionCookie(value: string): SessionShape | null {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

async function verifySessionSignature(session: SessionShape): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const data = `${session.userId}:${session.token}:${session.expiresAt}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );

  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expected === session.signature;
}

/**
 * Middleware to protect admin routes
 * Validates session cookie on every request to /jasladmin/* routes
 * Simplified to check session presence and expiration only
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[MIDDLEWARE] Request to:", pathname);

  // Allow login page and public routes
  if (pathname === "/jasladmin/login") {
    console.log("[MIDDLEWARE] Allowing login page");
    return NextResponse.next();
  }

  // Protect all /jasladmin/* routes
  if (pathname.startsWith("/jasladmin/")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    console.log("[MIDDLEWARE] Session cookie:", sessionCookie ? "found" : "not found");

    if (!sessionCookie) {
      console.log("[MIDDLEWARE] No session cookie, redirecting to login");
      return NextResponse.redirect(new URL("/jasladmin/login", request.url));
    }

    try {
      const session = parseSessionCookie(sessionCookie.value);

      if (!session) {
        return NextResponse.redirect(new URL("/jasladmin/login", request.url));
      }

      console.log("[MIDDLEWARE] Session data:", {
        userId: session.userId,
        expiresAt: session.expiresAt,
      });

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        console.log("[MIDDLEWARE] Session expired, redirecting to login");
        return NextResponse.redirect(new URL("/jasladmin/login", request.url));
      }

      // Verify session signature to prevent cookie forgery
      const isValid = await verifySessionSignature(session);
      if (!isValid) {
        console.log("[MIDDLEWARE] Session signature invalid, redirecting to login");
        return NextResponse.redirect(new URL("/jasladmin/login", request.url));
      }

      console.log("[MIDDLEWARE] Session valid, allowing access");
    } catch (error) {
      console.log("[MIDDLEWARE] Error parsing session:", error);
      return NextResponse.redirect(new URL("/jasladmin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/jasladmin/:path*"],
};
