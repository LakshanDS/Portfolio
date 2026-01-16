-- Portfolio Database Schema
-- SQLite Database Schema for Portfolio Management System
-- Generated from Prisma Schema

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Projects Table
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

-- Roadmap Items Table
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

-- Profile Status Table
CREATE TABLE IF NOT EXISTS "ProfileStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isOpenToWork" BOOLEAN NOT NULL DEFAULT 0,
    "statusMessage" TEXT NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- Profile Table
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "githubUrl" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "whatsappUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Skill Categories Table
CREATE TABLE IF NOT EXISTS "SkillCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Skills Table
CREATE TABLE IF NOT EXISTS "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "iconColor" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id") ON DELETE CASCADE
);

-- Education Table
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

-- Experience Table
CREATE TABLE IF NOT EXISTS "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Profile Stats Table
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

-- Page Visits Table
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

-- About Cards Table
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

-- Core Competencies Table
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
    FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id")
);

-- Comments Table
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Project_category_idx" ON "Project"("category");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "RoadmapItem_status_idx" ON "RoadmapItem"("status");
CREATE INDEX IF NOT EXISTS "RoadmapItem_category_idx" ON "RoadmapItem"("category");
CREATE INDEX IF NOT EXISTS "Skill_categoryId_idx" ON "Skill"("categoryId");
CREATE INDEX IF NOT EXISTS "CoreCompetency_categoryId_idx" ON "CoreCompetency"("categoryId");
CREATE INDEX IF NOT EXISTS "PageVisit_path_idx" ON "PageVisit"("path");
CREATE INDEX IF NOT EXISTS "PageVisit_date_idx" ON "PageVisit"("date");
