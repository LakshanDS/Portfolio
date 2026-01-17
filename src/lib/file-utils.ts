import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * File Management Utilities
 * 
 * Provides functions for file deletion, validation, and path management
 * for uploaded images in the public/uploads directory.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Delete a file from the public directory
 * @param filePath - Relative path from public directory (e.g., "/uploads/hero-123.jpg")
 * @returns Promise that resolves when file is deleted or doesn't exist
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    // Skip if the path is a default static file or external URL
    if (!filePath.startsWith("/uploads/")) {
      return;
    }

    const fullPath = path.join(process.cwd(), "public", filePath);

    // Only delete if file exists
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    // Log error but don't throw - file deletion shouldn't break the app
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

/**
 * Check if a file path is an uploaded file (not a default static file)
 * @param filePath - File path to check
 * @returns True if the file is in the uploads directory
 */
export function isUploadedFile(filePath: string): boolean {
  return filePath?.startsWith("/uploads/") || false;
}

/**
 * Validate if a file is an image based on its extension
 * @param filename - Filename to validate
 * @returns True if the file has a valid image extension
 */
export function isValidImageFilename(filename: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(filename).toLowerCase();
  return validExtensions.includes(ext);
}

/**
 * Get the filename from a file path
 * @param filePath - Full or relative file path
 * @returns Just the filename without directory
 */
export function getFilenameFromPath(filePath: string): string {
  return path.basename(filePath);
}

/**
 * Check if a file exists in the public directory
 * @param filePath - Relative path from public directory
 * @returns True if the file exists
 */
export function fileExists(filePath: string): boolean {
  if (!filePath.startsWith("/")) {
    return false;
  }
  const fullPath = path.join(process.cwd(), "public", filePath);
  return existsSync(fullPath);
}
