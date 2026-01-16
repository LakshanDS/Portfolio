# TODO List - Supabase to Prisma Migration Fixes
**Generated**: 2026-01-10
**Priority Order**: Critical -> High -> Medium -> Low

---

## Critical (Build Blocking)

### 1. Fix Resume API Route Type Mismatch
**Bug ID**: [BUG-2026-01-10-001](file:///d:/Projects/Portfolio/progress/bugs/BUG-2026-01-10-001.md)
**File**: [src/app/api/download-resume/route.tsx](file:///d:/Projects/Portfolio/src/app/api/download-resume/route.tsx#L67-L76)
**Issue**: Projects array passed to ResumeDocument has `tags: string` but interface expects `tags: string[]`

**Fix**:
```typescript
// Before (line 67-71):
const projects = await prisma.project.findMany({
  where: { status: 'live' },
  take: 5,
  orderBy: { createdAt: 'desc' }
});

// After:
const projects = await prisma.project.findMany({
  where: { status: 'live' },
  take: 5,
  orderBy: { createdAt: 'desc' }
}).then(projects =>
  projects.map(p => ({ ...p, tags: JSON.parse(p.tags) }))
);
```

**Verification**: Run `npx tsc --noEmit` and verify no error on line 76

---

### 2. Fix Field Name Inconsistencies (snake_case -> camelCase)
**Bug ID**: [BUG-2026-01-10-002](file:///d:/Projects/Portfolio/progress/bugs/BUG-2026-01-10-002.md)

**Files to Update**:

#### 2a. Admin Projects Page
**File**: [src/app/jasladmin/(dashboard)/projects/page.tsx](file:///d:/Projects/Portfolio/src/app/jasladmin/(dashboard)/projects/page.tsx)
**Lines**: 33, 80, 240-241, 250-251, 260-261
**Changes**:
- Replace `image_url` with `imageUrl`
- Replace `demo_url` with `demoUrl`
- Replace `repo_url` with `repoUrl`

#### 2b. Project Detail View
**File**: [src/components/projects/ProjectDetailView.tsx](file:///d:/Projects/Portfolio/src/components/projects/ProjectDetailView.tsx)
**Lines**: 164-301 (multiple occurrences)
**Changes**: All occurrences of `image_url`, `demo_url`, `repo_url` -> camelCase

#### 2c. Resume Document
**File**: [src/components/resume/ResumeDocument.tsx](file:///d:/Projects/Portfolio/src/components/resume/ResumeDocument.tsx)
**Lines**: 170-171
**Changes**: `demo_url` -> `demoUrl`

**Verification**: Run `npx tsc --noEmit` and verify property name errors are resolved

---

### 3. Fix Status/Category Type Narrowing
**Bug ID**: [BUG-2026-01-10-003](file:///d:/Projects/Portfolio/progress/bugs/BUG-2026-01-10-003.md)

**Root Cause**: Prisma returns `string` for these fields but interfaces expect union types

**Fix in data.ts**: Add type narrowing to all functions that return data with status/category fields

**Functions to Update in [src/lib/data.ts](file:///d:/Projects/Portfolio/src/lib/data.ts)**:

```typescript
// Update getProjects() at line 29-32:
export async function getProjects() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return projects.map(p => ({
    ...p,
    tags: JSON.parse(p.tags),
    status: p.status as 'live' | 'developing' | 'archived'
  }));
}

// Update getRoadmapItems() at line 78-81:
export async function getRoadmapItems() {
  const items = await prisma.roadmapItem.findMany({ orderBy: { date: 'desc' } });
  return items.map(r => ({
    ...r,
    tags: JSON.parse(r.tags),
    status: r.status as 'completed' | 'in-progress' | 'planned',
    category: r.category as 'devops' | 'career' | 'learning' | 'goals'
  }));
}

// Update all other get functions similarly:
// - getProject() (line 23-27)
// - getRoadmapItem() (line 72-76)
// - updateProject() (line 47-49)
// - updateRoadmapItem() (line 93-95)
```

**Verification**: Run `npx tsc --noEmit` and verify type incompatibility errors are resolved

---

### 4. Fix Date Field Name Inconsistencies
**Files**: Multiple admin dashboard pages
**Issue**: Mix of `created_at`, `updated_at`, `start_date`, `end_date` vs camelCase

**Files to Update**:
1. [src/app/jasladmin/(dashboard)/education/page.tsx](file:///d:/Projects/Portfolio/src/app/jasladmin/(dashboard)/education/page.tsx) - Line 21 interface
2. [src/app/jasladmin/(dashboard)/experience/page.tsx](file:///d:/Projects/Portfolio/src/app/jasladmin/(dashboard)/experience/page.tsx) - Line 21 interface
3. [src/app/jasladmin/(dashboard)/about-me/page.tsx](file:///d:/Projects/Portfolio/src/app/jasladmin/(dashboard)/about-me/page.tsx) - Line 20 interface
4. [src/app/jasladmin/(dashboard)/profile/page.tsx](file:///d:/Projects/Portfolio/src/app/jasladmin/(dashboard)/profile/page.tsx) - Line 24 interface

**Changes**:
- `created_at` -> `createdAt`
- `updated_at` -> `updatedAt`
- `start_date` -> `startDate`
- `end_date` -> `endDate`
- `display_order` -> `displayOrder`
- `icon_color` -> `iconColor`
- `pipelines_fixed` -> `pipelinesFixed`
- `projects_count` -> `projectsCount`
- `self_commits` -> `selfCommits`
- `github_url` -> `githubUrl`
- `linkedin_url` -> `linkedinUrl`
- `whatsapp_url` -> `whatsappUrl`
- `category_id` -> `categoryId`

**Note**: Update both interface definitions and all references in the same files

---

## High Priority

### 5. Remove Supabase Package Dependency
**Bug ID**: [BUG-2026-01-10-004](file:///d:/Projects/Portfolio/progress/bugs/BUG-2026-01-10-004.md)
**File**: [package.json](file:///d:/Projects/Portfolio/package.json#L9)

**Actions**:
1. Remove line 9: `"@supabase/auth-helpers-nextjs": "^0.15.0",`
2. Run: `npm uninstall @supabase/auth-helpers-nextjs`
3. Run: `npm install` to update package-lock.json

**Verification**: Confirm package is no longer in node_modules and package-lock.json

---

### 6. Clean Up Environment Configuration
**Bug ID**: [BUG-2026-01-10-005](file:///d:/Projects/Portfolio/progress/bugs/BUG-2026-01-10-005.md)

#### 6a. Update src/lib/env.ts
**File**: [src/lib/env.ts](file:///d:/Projects/Portfolio/src/lib/env.ts)
**Action**: Remove or replace Supabase-related configuration with Prisma/SQLite configuration

**Suggested Replacement**:
```typescript
/**
 * Environment variables for the application
 */

// Validate required environment variables
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

if (!databaseUrl) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

export const env = {
  database: {
    url: databaseUrl,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  github: {
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "",
    token: process.env.GITHUB_TOKEN || "",
  },
};

export function isDatabaseConfigured(): boolean {
  return !!databaseUrl;
}
```

#### 6b. Update .env.example
**File**: [.env.example](file:///d:/Projects/Portfolio/.env.example)
**Action**: Replace Supabase variables with Prisma/SQLite variables

**Suggested Content**:
```env
# Database
DATABASE_URL="file:./dev.db"

# Admin
ADMIN_PASSWORD=your-secure-password

# GitHub
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-token
```

---

## Medium Priority

### 7. Remove Type Assertions (`as any`)
**Files**: Multiple files in src/lib/data.ts and admin dashboard pages
**Issue**: Type assertions bypass type safety and hide underlying issues

**Actions**:
1. Identify all `as any` assertions using `grep -r "as any" src/`
2. Replace with proper type definitions or type guards
3. Example fixes:

```typescript
// Instead of:
const project = await prisma.project.update({ where: { id }, data: updates });

// Use proper typing:
const project = await prisma.project.update({
  where: { id },
  data: updates as Prisma.ProjectUpdateInput
});

// Or better, define proper update types:
interface ProjectUpdateData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  status?: 'live' | 'developing' | 'archived';
  imageUrl?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  content?: string | null;
}
```

---

### 8. Update TypeScript Interfaces to Match Prisma Generated Types
**File**: [src/lib/types.ts](file:///d:/Projects/Portfolio/src/lib/types.ts)
**Issue**: Manual interface definitions may diverge from Prisma-generated types

**Option A**: Use Prisma Generated Types (Recommended)
```typescript
// Instead of defining interfaces manually, import from Prisma:
import { Project as PrismaProject, RoadmapItem as PrismaRoadmapItem } from '@prisma/client';

// Use Prisma types directly:
export type Project = PrismaProject & {
  tags: string[]; // Override tags to be parsed array
};

export type RoadmapItem = PrismaRoadmapItem & {
  tags: string[];
};
```

**Option B**: Keep Manual Interfaces but Ensure Compatibility
```typescript
// Ensure all fields exactly match Prisma schema
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[]; // Note: this differs from schema which has string
  status: 'live' | 'developing' | 'archived';
  imageUrl?: string | null;  // Prisma: String?
  demoUrl?: string | null;   // Prisma: String?
  repoUrl?: string | null;   // Prisma: String?
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Low Priority

### 9. Add Error Boundaries
**Files**: Layout and page components
**Action**: Add React error boundaries to catch and display errors gracefully

---

### 10. Add Database Migration Strategy
**Context**: SQLite doesn't have built-in migration system
**Action**: Create migration scripts for production database updates

---

### 11. Set Up Database Backup Strategy
**Context**: SQLite file needs regular backups
**Action**: Create backup scripts and automation

---

## Verification Steps After Fixes

1. **TypeScript Check**:
   ```bash
   npx tsc --noEmit
   ```
   Expected: No errors

2. **Build Check**:
   ```bash
   npm run build
   ```
   Expected: Successful build

3. **Dev Server Test**:
   ```bash
   npm run dev
   ```
   Expected: Server starts without errors

4. **Database Connection Test**:
   - Verify SQLite database is accessible
   - Test CRUD operations in admin panel

5. **End-to-End Test**:
   - Navigate to all public pages
   - Test admin panel functionality
   - Verify data persists correctly

---

## Estimated Time to Complete

- Critical issues: 2-3 hours
- High priority: 30 minutes
- Medium priority: 1-2 hours
- Low priority: 2-3 hours

**Total Estimated Time**: 5-8.5 hours

---

## Notes

- All file paths are absolute paths for easy navigation
- Each TODO item includes specific line numbers where possible
- Priority is based on impact on build and deployment
- After completing critical and high priority items, the build should succeed
