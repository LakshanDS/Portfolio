/**
 * Environment variable validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = ["SESSION_SECRET", "DATABASE_URL"];

/**
 * Validates that all required environment variables are set
 * Throws an error if any are missing
 */
export function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate SESSION_SECRET is not the fallback
  if (process.env.SESSION_SECRET === "fallback-secret-change-in-production") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET must be set to a secure random string in production"
      );
    } else {
      console.warn(
        "WARNING: Using fallback SESSION_SECRET. Set SESSION_SECRET in .env for better security."
      );
    }
  }

  // Validate SESSION_SECRET length
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters long for security"
    );
  }
}

/**
 * Generates a cryptographically secure random secret
 * @returns A 64-character hex string
 */
export function generateSecureSecret(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validates environment on module load
 */
if (typeof window === "undefined") {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error);
    // Don't throw in development to allow app to start
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
}
