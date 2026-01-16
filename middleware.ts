import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/server-auth";

const SESSION_COOKIE_NAME = "admin_session";

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
      const session = JSON.parse(sessionCookie.value);

      console.log("[MIDDLEWARE] Session data:", {
        userId: session.userId,
        expiresAt: session.expiresAt,
      });

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        console.log("[MIDDLEWARE] Session expired, redirecting to login");
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
