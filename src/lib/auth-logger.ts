/**
 * Authentication logging utility
 * Logs all authentication events for security monitoring
 */

export type AuthEventType =
  | "login_success"
  | "login_failure"
  | "logout"
  | "session_expired"
  | "session_renewed"
  | "rate_limit_exceeded"
  | "csrf_validation_failed";

export interface AuthEvent {
  type: AuthEventType;
  ip?: string;
  userId?: string;
  timestamp: number;
  userAgent?: string;
  details?: Record<string, unknown>;
}

/**
 * Logs an authentication event
 * @param event The authentication event to log
 */
export function logAuthEvent(event: AuthEvent): void {
  const logEntry = {
    ...event,
    timestamp: new Date(event.timestamp).toISOString(),
  };

  // In development, log to console
  if (process.env.NODE_ENV !== "production") {
    console.log(`[AUTH] ${JSON.stringify(logEntry, null, 2)}`);
  }

  // In production, you would send this to a logging service
  // e.g., Sentry, LogRocket, Datadog, etc.
  if (process.env.NODE_ENV === "production") {
    // Example: Send to external logging service
    // logToService(logEntry);
  }
}

/**
 * Logs a successful login
 * @param userId The user ID
 * @param ip The IP address
 * @param userAgent The user agent string
 */
export function logLoginSuccess(
  userId: string,
  ip?: string,
  userAgent?: string
): void {
  logAuthEvent({
    type: "login_success",
    userId,
    ip,
    userAgent,
    timestamp: Date.now(),
  });
}

/**
 * Logs a failed login attempt
 * @param ip The IP address
 * @param reason The reason for failure
 * @param userAgent The user agent string
 */
export function logLoginFailure(
  ip?: string,
  reason?: string,
  userAgent?: string
): void {
  logAuthEvent({
    type: "login_failure",
    ip,
    userAgent,
    timestamp: Date.now(),
    details: { reason },
  });
}

/**
 * Logs a logout event
 * @param userId The user ID
 * @param ip The IP address
 */
export function logLogout(userId: string, ip?: string): void {
  logAuthEvent({
    type: "logout",
    userId,
    ip,
    timestamp: Date.now(),
  });
}

/**
 * Logs a session expiration
 * @param userId The user ID
 * @param ip The IP address
 */
export function logSessionExpired(userId: string, ip?: string): void {
  logAuthEvent({
    type: "session_expired",
    userId,
    ip,
    timestamp: Date.now(),
  });
}

/**
 * Logs a session renewal
 * @param userId The user ID
 * @param ip The IP address
 */
export function logSessionRenewed(userId: string, ip?: string): void {
  logAuthEvent({
    type: "session_renewed",
    userId,
    ip,
    timestamp: Date.now(),
  });
}

/**
 * Logs a rate limit exceeded event
 * @param ip The IP address
 */
export function logRateLimitExceeded(ip: string): void {
  logAuthEvent({
    type: "rate_limit_exceeded",
    ip,
    timestamp: Date.now(),
  });
}

/**
 * Logs a CSRF validation failure
 * @param ip The IP address
 * @param userAgent The user agent string
 */
export function logCSRFValidationFailed(
  ip?: string,
  userAgent?: string
): void {
  logAuthEvent({
    type: "csrf_validation_failed",
    ip,
    userAgent,
    timestamp: Date.now(),
  });
}
