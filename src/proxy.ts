import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to check if a path is an admin route
function isAdminRoute(path: string): boolean {
  return path.startsWith("/jasladmin") && path !== "/jasladmin/login";
}

// Helper to get session from cookies
function getSession(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only check admin routes (excluding login)
  if (!isAdminRoute(path)) {
    return NextResponse.next();
  }

  const session = getSession(request);

  // No session found - redirect to login
  if (!session) {
    const loginUrl = new URL("/jasladmin/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Check if session is expired
  if (Date.now() > session.expiresAt) {
    const loginUrl = new URL("/jasladmin/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("admin_session");
    return response;
  }

  // Session is valid - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
