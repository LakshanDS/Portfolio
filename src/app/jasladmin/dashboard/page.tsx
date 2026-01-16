"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FaFolder,
  FaRoad,
  FaExternalLinkAlt,
  FaDownload,
  FaServer,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaNetworkWired,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DashboardData {
  counts: {
    projects: number;
    roadmap: number;
    resumeDownloads: number;
  };
  status: {
    isOpenToWork: boolean;
  };
  system: {
    cpuLoad: number;
    memory: {
      total: number;
      free: number;
      used: number;
      usagePercentage: number;
    };
    storage: {
      total: number;
      used: number;
      usagePercentage: number;
    };
    network: {
      rx_sec: number;
      tx_sec: number;
    };
  };
  visits: Array<{ date: string; count: number }>;
  comments: Array<{
    id: string;
    name: string | null;
    email: string | null;
    content: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [netHistory, setNetHistory] = useState<Array<{ time: string, rx: number, tx: number }>>([]);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const json = await response.json();

      setData(json);
      setLoading(false);

      setNetHistory(prev => {
        const now = new Date().toLocaleTimeString();
        const newPoint = {
          time: now,
          rx: json.system.network.rx_sec,
          tx: json.system.network.tx_sec
        };
        const newHistory = [...prev, newPoint];
        return newHistory.slice(-20);
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = async () => {
    if (!data) return;
    setTogglingStatus(true);
    const newState = !data.status.isOpenToWork;

    setData({ ...data, status: { ...data.status, isOpenToWork: newState } });

    try {
      await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpenToWork: newState })
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      setData({ ...data, status: { ...data.status, isOpenToWork: !newState } });
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading || !data) {
    return <div className="p-6 text-[#9CA3AF] text-sm animate-pulse">Loading dashboard...</div>;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytes: number) => {
    return `${formatBytes(bytes)}/s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#E6EDF3] mb-1">Overview</h1>
          <p className="text-[#9CA3AF] text-sm">System Performance & Portfolio Stats</p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.open('/', '_blank')}
          className="border-[#30363d] text-[#E6EDF3] hover:bg-[#30363d]"
        >
          <FaExternalLinkAlt className="mr-2" size={12} />
          Visit Portfolio
        </Button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937] hover:border-[#30363d] transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs mb-1">Total Projects</p>
              <h3 className="text-2xl font-semibold text-[#E6EDF3] group-hover:text-[#4ADE80] transition-colors">{data.counts.projects}</h3>
            </div>
            <div className="p-2 bg-[#4ADE80]/10 rounded-lg text-[#4ADE80]">
              <FaFolder size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937] hover:border-[#30363d] transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs mb-1">Roadmap Items</p>
              <h3 className="text-2xl font-semibold text-[#E6EDF3] group-hover:text-purple-400 transition-colors">{data.counts.roadmap}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <FaRoad size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937] hover:border-[#30363d] transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs mb-1">Resume Downloads</p>
              <h3 className="text-2xl font-semibold text-[#E6EDF3] group-hover:text-blue-400 transition-colors">{data.counts.resumeDownloads}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <FaDownload size={20} />
            </div>
          </div>
        </Card>

        <Card
          className="p-4 bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937] hover:border-[#30363d] transition-all cursor-pointer relative overflow-hidden group"
          onClick={toggleStatus}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[#9CA3AF] text-xs mb-1">Work Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${data.status.isOpenToWork ? 'bg-[#4ADE80] animate-pulse' : 'bg-gray-500'}`} />
                <span className={`text-sm font-semibold ${data.status.isOpenToWork ? 'text-[#4ADE80]' : 'text-gray-400'}`}>
                  {data.status.isOpenToWork ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-lg transition-colors ${data.status.isOpenToWork ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-gray-700/50 text-gray-400'}`}>
              <FaNetworkWired size={20} />
            </div>
          </div>
          {data.status.isOpenToWork && (
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 bg-[#4ADE80]" />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column (Charts & Logs) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Traffic Chart */}
          <Card className="p-6 bg-[#111827] border border-[#1F2937] bg-gradient-to-br from-[#111827] via-[#0D1117] to-black/40">
            <h3 className="text-[#E6EDF3] font-semibold mb-2 flex items-center">
              <span className="w-1 h-5 bg-[#4ADE80] rounded-sm mr-3 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              Traffic Overview
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.visits}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#4B5563"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#4B5563"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#E6EDF3', borderRadius: '8px' }}
                    itemStyle={{ color: '#4ADE80' }}
                    cursor={{ stroke: '#374151' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4ADE80"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Network Graph */}
          <Card className="p-6 bg-[#111827] border border-[#1F2937] bg-gradient-to-br from-[#111827] via-[#0D1117] to-black/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[#E6EDF3] font-semibold flex items-center">
                <span className="w-1 h-5 bg-blue-500 rounded-sm mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Network Activity (Live)
              </h3>
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-[#4ADE80] flex items-center gap-1"><FaArrowDown /> {formatSpeed(data.system.network.rx_sec)}</span>
                <span className="text-blue-400 flex items-center gap-1"><FaArrowUp /> {formatSpeed(data.system.network.tx_sec)}</span>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netHistory}>
                  <defs>
                    <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis
                    stroke="#4B5563"
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => formatBytes(val)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#E6EDF3', borderRadius: '8px' }}
                    formatter={(value: number | undefined, name: string | undefined) => value !== undefined ? formatSpeed(value) : ''}
                  />
                  <Area type="monotone" dataKey="rx" stroke="#4ADE80" fill="url(#colorRx)" strokeWidth={2} name="Download" />
                  <Area type="monotone" dataKey="tx" stroke="#3B82F6" fill="url(#colorTx)" strokeWidth={2} name="Upload" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>


        </div>

        {/* Right Column (System Info) */}
        <div className="flex flex-col gap-6 h-full">
          <Card className="p-5 bg-gradient-to-br from-[#111827] to-[#0D1117] border border-[#1F2937]">
            <h4 className="text-sm font-medium text-[#9CA3AF] mb-4 flex items-center gap-2">
              <FaServer className="text-blue-500" /> Server Load
            </h4>

            {/* CPU */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#E6EDF3] flex items-center gap-1.5"><FaMicrochip /> CPU</span>
                <span className="text-[#4ADE80] font-mono">{data.system.cpuLoad}%</span>
              </div>
              <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-[#4ADE80] transition-all duration-500" style={{ width: `${data.system.cpuLoad}%` } as React.CSSProperties} />
              </div>
            </div>

            {/* RAM */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#E6EDF3] flex items-center gap-1.5"><FaMemory /> RAM</span>
                <span className="text-blue-400 font-mono">
                  {data.system.memory.usagePercentage}% <span className="text-[#6B7280]">|</span> {formatBytes(data.system.memory.used)}
                </span>
              </div>
              <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${data.system.memory.usagePercentage}%` } as React.CSSProperties} />
              </div>
            </div>

            {/* Storage (Moved Here) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#E6EDF3] flex items-center gap-1.5"><FaHdd /> Storage</span>
                <span className="text-purple-400 font-mono">
                  {data.system.storage.usagePercentage}% <span className="text-[#6B7280]">|</span> {formatBytes(data.system.storage.used)}
                </span>
              </div>
              <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${data.system.storage.usagePercentage}%` } as React.CSSProperties} />
              </div>
            </div>
          </Card>

          {/* Comments Scroller */}
          <Card className="flex flex-col flex-1 min-h-[300px] bg-[#0D1117] border border-[#1F2937] overflow-hidden">
            <div className="p-3 bg-[#161B22] border-b border-[#1F2937] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
              <span className="text-xs font-semibold text-[#E6EDF3] uppercase tracking-wider">Messages Stream</span>
              <span className="ml-auto text-[10px] text-[#9CA3AF] bg-[#1F2937] px-1.5 py-0.5 rounded-full">{data.comments.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
              {data.comments.length > 0 ? (
                <div className="divide-y divide-[#1F2937]">
                  {data.comments.map((comment) => (
                    <div key={comment.id} className={`p-4 hover:bg-[#161B22] transition-colors ${!comment.isRead ? 'bg-[#161B22]/30' : ''}`}>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#E6EDF3]">{comment.name || 'Anonymous'}</span>
                          {!comment.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                        </div>
                        <span className="text-[10px] text-[#6B7280]">{new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>

                      {comment.email && (
                        <div className="text-[10px] text-[#9CA3AF] mb-2 font-mono truncate">{comment.email}</div>
                      )}

                      <p className="text-xs text-[#C9D1D9] leading-relaxed break-words whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#484F58] italic p-6 text-center">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">New comments will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

