import crypto from "crypto";

/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 */

/**
 * Generates a cryptographically secure CSRF token
 * @returns A 64-character hex string
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validates a CSRF token against the stored token
 * @param token The token to validate
 * @param storedToken The stored token to compare against
 * @returns true if tokens match, false otherwise
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  // Use constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(token, "hex"),
    Buffer.from(storedToken, "hex")
  );
}

/**
 * Generates a CSRF token and stores it in a cookie
 * @param cookieName The name of the cookie to store the token in
 * @returns The CSRF token and the cookie header
 */
export function createCSRFTokenCookie(cookieName: string = "csrf_token") {
  const token = generateCSRFToken();

  const cookieHeader = `${cookieName}=${token}; HttpOnly; Secure=${
    process.env.NODE_ENV === "production"
  }; SameSite=Strict; Path=/; Max-Age=3600`; // 1 hour

  return {
    token,
    cookieHeader,
  };
}

/**
 * Extracts the CSRF token from cookies
 * @param cookieHeader The Cookie header value
 * @param cookieName The name of the cookie to extract
 * @returns The CSRF token or null if not found
 */
export function extractCSRFTokenFromCookie(
  cookieHeader: string | null,
  cookieName: string = "csrf_token"
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;
    }
  }

  return null;
}
