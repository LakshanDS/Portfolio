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

    // Debug logging to help diagnose issues
    console.log('System info raw data:', {
      mem: { total: mem.total, used: mem.used, active: mem.active, free: mem.free },
      fs: fs.map(f => ({ fs: f.fs, mount: f.mount, size: f.size, used: f.used, use: f.use })),
      network: network[0]
    });

    const net = network[0] || { rx_sec: 0, tx_sec: 0 };

    // Find the root filesystem (mount point '/') instead of using the first filesystem
    const rootFs = fs.find(f => f.mount === '/') || fs[0];

    const systemInfo = {
      cpuLoad: Math.round(cpu.currentLoad),
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used, // Use mem.used instead of mem.active for better Linux compatibility
        usagePercentage: Math.round((mem.used / mem.total) * 100),
      },
      storage: {
        total: rootFs?.size || 0,
        used: rootFs?.used || 0,
        usagePercentage: Math.round(rootFs?.use || 0),
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
