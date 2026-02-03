import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/api-auth";

/**
 * Debug endpoint to check session cookies
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authError = await requireAuth();
  if (authError) return authError;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  const csrfCookie = cookieStore.get("csrf_token");

  return NextResponse.json({
    sessionCookie: sessionCookie ? {
      name: sessionCookie.name,
      value: sessionCookie.value,
      exists: true,
    } : { exists: false },
    csrfCookie: csrfCookie ? {
      name: csrfCookie.name,
      value: csrfCookie.value,
      exists: true,
    } : { exists: false },
    allCookies: Array.from(cookieStore.getAll()).map(c => ({
      name: c.name,
      value: c.value.substring(0, 50) + (c.value.length > 50 ? "..." : ""),
    })),
  });
}
