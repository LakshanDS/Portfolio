-- Add tracking fields to PageVisit and Comment tables
-- This migration adds visitor tracking capabilities

PRAGMA foreign_keys = ON;

-- ============================================
-- Step 1: Add new columns to PageVisit table
-- ============================================
-- SQLite allows adding columns with ALTER TABLE
ALTER TABLE "PageVisit" ADD COLUMN "country" TEXT;
ALTER TABLE "PageVisit" ADD COLUMN "city" TEXT;
ALTER TABLE "PageVisit" ADD COLUMN "ipAddress" TEXT;

-- ============================================
-- Step 2: Recreate PageVisit table to change unique constraint
-- ============================================
-- SQLite doesn't support dropping unique constraints directly
-- We need to recreate the table with the new constraint

-- Create new PageVisit table with updated schema
CREATE TABLE "PageVisit_new" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "country" TEXT,
  "city" TEXT,
  "ipAddress" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Copy data from old table to new table
INSERT INTO "PageVisit_new" ("id", "path", "date", "count", "country", "city", "ipAddress", "createdAt", "updatedAt")
SELECT "id", "path", "date", "count", "country", "city", "ipAddress", "createdAt", "updatedAt"
FROM "PageVisit";

-- Drop old table
DROP TABLE "PageVisit";

-- Rename new table to original name
ALTER TABLE "PageVisit_new" RENAME TO "PageVisit";

-- Create new unique index with updated constraint
CREATE UNIQUE INDEX "PageVisit_ipAddress_path_date_key" ON "PageVisit"("ipAddress", "path", "date");

-- ============================================
-- Step 3: Add new columns to Comment table
-- ============================================
-- SQLite allows adding columns with ALTER TABLE
ALTER TABLE "Comment" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Comment" ADD COLUMN "country" TEXT;
ALTER TABLE "Comment" ADD COLUMN "city" TEXT;
ALTER TABLE "Comment" ADD COLUMN "ipAddress" TEXT;
ALTER TABLE "Comment" ADD COLUMN "userAgent" TEXT;

-- ============================================
-- Step 4: Add foreign key constraint to Comment table
-- ============================================
-- SQLite doesn't support adding foreign keys with ALTER TABLE
-- We need to recreate the table

-- Create new Comment table with updated schema
CREATE TABLE "Comment_new" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT,
  "name" TEXT,
  "email" TEXT,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "country" TEXT,
  "city" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from old table to new table
INSERT INTO "Comment_new" ("id", "projectId", "name", "email", "content", "isRead", "country", "city", "ipAddress", "userAgent", "createdAt")
SELECT "id", "projectId", "name", "email", "content", "isRead", "country", "city", "ipAddress", "userAgent", "createdAt"
FROM "Comment";

-- Drop old table
DROP TABLE "Comment";

-- Rename new table to original name
ALTER TABLE "Comment_new" RENAME TO "Comment";

-- ============================================
-- Step 5: Remove unique index on CmsSettings table
-- ============================================
-- The unique index on 'id' is not needed since 'id' is already a primary key
DROP INDEX IF EXISTS "CmsSettings_id_key";
