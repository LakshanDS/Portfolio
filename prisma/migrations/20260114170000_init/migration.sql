-- Initial v1 Migration - Complete Database Schema
-- This creates all tables needed for the portfolio application
-- Consolidated with migrations: add_personal_info_to_profile, add_email2_to_profile

PRAGMA foreign_keys = ON;

-- User table (added from add_personal_info_to_profile)
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "secret" TEXT NOT NULL,
  "isRegistered" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Project table
CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "tags" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "imageUrl" TEXT,
  "demoUrl" TEXT,
  "repoUrl" TEXT,
  "content" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 999,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- RoadmapItem table
CREATE TABLE IF NOT EXISTS "RoadmapItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "tags" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- ProfileStatus table
CREATE TABLE IF NOT EXISTS "ProfileStatus" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "isOpenToWork" BOOLEAN NOT NULL DEFAULT false,
  "statusMessage" TEXT NOT NULL,
  "githubUsername" TEXT NOT NULL,
  "updatedAt" DATETIME NOT NULL
);

-- Profile table (updated with personal info fields from add_personal_info_to_profile and email2 from add_email2_to_profile)
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "nickname" TEXT,
  "title" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email2" TEXT,
  "phone" TEXT NOT NULL,
  "phone2" TEXT,
  "dateOfBirth" TEXT,
  "nic" TEXT,
  "gender" TEXT,
  "address" TEXT,
  "profileImage" TEXT,
  "githubUrl" TEXT NOT NULL,
  "linkedinUrl" TEXT NOT NULL,
  "whatsappUrl" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- SkillCategory table
CREATE TABLE IF NOT EXISTS "SkillCategory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Skill table
CREATE TABLE IF NOT EXISTS "Skill" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "icon" TEXT,
  "iconColor" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Skill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Education table
CREATE TABLE IF NOT EXISTS "Education" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "institution" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Experience table
CREATE TABLE IF NOT EXISTS "Experience" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "company" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT,
  "isCurrent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- ProfileStats table
CREATE TABLE IF NOT EXISTS "ProfileStats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pipelinesFixed" TEXT NOT NULL,
  "projectsCount" INTEGER NOT NULL,
  "selfCommits" INTEGER NOT NULL,
  "experience" TEXT NOT NULL,
  "resumeDownloads" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- PageVisit table
CREATE TABLE IF NOT EXISTS "PageVisit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Unique constraint for PageVisit
CREATE UNIQUE INDEX IF NOT EXISTS "PageVisit_path_date_key" ON "PageVisit"("path", "date");

-- AboutCard table
CREATE TABLE IF NOT EXISTS "AboutCard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "iconColor" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- CoreCompetency table
CREATE TABLE IF NOT EXISTS "CoreCompetency" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "expertise" TEXT NOT NULL,
  "tags" TEXT NOT NULL DEFAULT '',
  "icon" TEXT,
  "categoryId" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CoreCompetency_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CmsSettings table (singleton for storing all settings as JSONB - updated from TEXT to JSONB)
CREATE TABLE IF NOT EXISTS "CmsSettings" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  "homepage" JSONB NOT NULL,
  "about" JSONB NOT NULL,
  "roadmap" JSONB NOT NULL,
  "projects" JSONB NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Unique index for CmsSettings
CREATE UNIQUE INDEX IF NOT EXISTS "CmsSettings_id_key" ON "CmsSettings"("id");
