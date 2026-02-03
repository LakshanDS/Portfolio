import { NextResponse } from "next/server";
import { getSession } from "./server-auth";

/**
 * Authentication middleware for API routes
 * Returns null if authenticated, or an error response if not
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }

  return null; // Auth successful
}

/**
 * Helper to wrap API handlers with authentication
 * Usage:
 * export const POST = withAuth(async (request) => { ... });
 */
export function withAuth(
  handler: (request: Request, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: Request, ...args: any[]) => {
    const authError = await requireAuth();
    if (authError) return authError;

    return handler(request, ...args);
  };
}
