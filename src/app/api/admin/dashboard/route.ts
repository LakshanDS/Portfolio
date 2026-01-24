import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import si from "systeminformation";

export async function GET() {
  try {
    const [cpu, mem, fs] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
    ]);

    const rootFs = fs.find(f => f.mount === '/') || fs[0];

    const systemInfo = {
      cpuLoad: Math.round(cpu.currentLoad),
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
        usagePercentage: Math.round((mem.used / mem.total) * 100),
      },
      storage: {
        total: rootFs?.size || 0,
        used: rootFs?.used || 0,
        usagePercentage: Math.round(rootFs?.use || 0),
      }
    };

    const [projectCount, roadmapCount, profileStatus, profileStats, visits, comments, visitorsByLocation] =
      await Promise.all([
        prisma.project.count(),
        prisma.roadmapItem.count(),
        prisma.profileStatus.findFirst(),
        prisma.profileStats.findFirst(),
        prisma.pageVisit.groupBy({
          by: ['date'],
          _sum: {
            count: true
          },
          orderBy: {
            date: 'asc'
          },
          take: 30
        }),
        prisma.comment.findMany({
          orderBy: [
            { isRead: 'asc' },
            { createdAt: 'desc' }
          ],
          take: 50,
        }),
        prisma.pageVisit.groupBy({
          by: ['country'],
          _count: {
            ipAddress: true
          },
          where: {
            country: {
              not: null
            }
          },
          orderBy: {
            _count: {
              ipAddress: 'desc'
            }
          }
        }),
      ]);

    const totalVisitorsWithLocation = visitorsByLocation.reduce((sum, loc) => sum + loc._count.ipAddress, 0);
    const locationStats = visitorsByLocation.map(loc => ({
      country: loc.country,
      count: loc._count.ipAddress,
      percentage: totalVisitorsWithLocation > 0 ? Math.round((loc._count.ipAddress / totalVisitorsWithLocation) * 100) : 0
    }));

    return NextResponse.json({
      counts: {
        projects: projectCount || 0,
        roadmap: roadmapCount || 0,
        resumeDownloads: profileStats?.resumeDownloads || 0,
      },
      status: {
        isOpenToWork: profileStatus?.isOpenToWork || false,
      },
      system: systemInfo,
      visits: visits.map((v: any) => ({ date: v.date, count: v._sum.count || 0 })),
      comments: comments,
      locationStats: locationStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
