import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma client singleton.
 *
 * Note: If you add new Prisma models (e.g. `CmsSettings`) and TypeScript still
 * complains that `prisma.cmsSettings` doesn't exist, you need to regenerate the
 * Prisma client (`prisma generate`) so the type definitions update.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
