/**
 * Rate limiting utility for login attempts
 * Limits to 5 failed attempts per IP in 15 minutes
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const attempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Checks if an IP address has exceeded the rate limit
 * @param ip The IP address to check
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  // No previous record or window expired - allow
  if (!record || now > record.resetTime) {
    attempts.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return true;
  }

  // Check if limit exceeded
  if (record.count >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Resets the rate limit for an IP address
 * Call this after a successful login
 * @param ip The IP address to reset
 */
export function resetRateLimit(ip: string) {
  attempts.delete(ip);
}

/**
 * Gets the remaining time until rate limit resets
 * @param ip The IP address to check
 * @returns Remaining time in seconds, or 0 if not rate limited
 */
export function getRateLimitResetTime(ip: string): number {
  const record = attempts.get(ip);
  if (!record) {
    return 0;
  }

  const remaining = record.resetTime - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

/**
 * Gets the number of remaining attempts for an IP
 * @param ip The IP address to check
 * @returns Remaining attempts, or MAX_ATTEMPTS if not rate limited
 */
export function getRemainingAttempts(ip: string): number {
  const record = attempts.get(ip);
  if (!record || Date.now() > record.resetTime) {
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - record.count);
}

/**
 * Cleans up expired rate limit records
 * Call this periodically to prevent memory leaks
 */
export function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [ip, record] of attempts.entries()) {
    if (now > record.resetTime) {
      attempts.delete(ip);
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}
