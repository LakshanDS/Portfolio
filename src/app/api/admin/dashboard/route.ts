import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import si from "systeminformation";

export async function GET() {
  try {
    const [cpu, mem, fs, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
    ]);

    const net = network[0] || { rx_sec: 0, tx_sec: 0 };

    const systemInfo = {
      cpuLoad: Math.round(cpu.currentLoad),
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.active,
        usagePercentage: Math.round((mem.active / mem.total) * 100),
      },
      storage: {
        total: fs[0]?.size || 0,
        used: fs[0]?.used || 0,
        usagePercentage: Math.round(fs[0]?.use || 0),
      },
      network: {
        rx_sec: Math.round(net.rx_sec || 0), // Bytes per second download
        tx_sec: Math.round(net.tx_sec || 0), // Bytes per second upload
      }
    };

    const [projectCount, roadmapCount, profileStatus, profileStats, visits, comments] =
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
          take: 30 // Last 30 days
        }),
        prisma.comment.findMany({
          orderBy: [
            { isRead: 'asc' },
            { createdAt: 'desc' }
          ],
          take: 50,
        }),
      ]);

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
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
