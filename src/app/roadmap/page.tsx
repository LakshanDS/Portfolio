"use client";

import { useState, useEffect } from "react";
import { RoadmapItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { FaRocket, FaTerminal, FaFlag, FaCheckCircle, FaHistory } from "react-icons/fa";
import { WhatsNext } from "@/components/roadmap/WhatsNext";

interface RoadmapSettings {
  selfCommitBadge: {
    enabled: boolean;
    text: string;
  };
  hero: {
    title: string;
    description: string;
  };
  terminalText: string[];
  philosophyText: string;
}

export default function RoadmapPage() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [settings, setSettings] = useState<RoadmapSettings>({
    selfCommitBadge: { enabled: true, text: "Self Commit 2024-2025" },
    hero: {
      title: "Building The Future, || One Pipeline at a Time",
      description: "A visual timeline of my professional growth, technical milestones, and future aspirations in the world of DevOps, Cloud Engineering, and Automation."
    },
    terminalText: [
      "$ git add .",
      "$ git commit -m \"self upgrade init\"",
      "[main 3f32d] self upgrade init",
      "Commit successful",
      "self improved"
    ],
    philosophyText: "I believe in automating everything that needs to be done more than once. My goal is to build systems that are self-healing, scalable, and secure by default."
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [roadmapResponse, settingsResponse] = await Promise.all([
          fetch('/api/roadmap'),
          fetch('/api/roadmap-settings')
        ]);
        
        const roadmapData = await roadmapResponse.json();
        setRoadmapItems(roadmapData as RoadmapItem[]);
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const completedItems = roadmapItems.filter(item => item.status === 'completed');
  const last5Completed = completedItems.slice(-5).reverse();
  const totalCompleted = completedItems.length;
  const justCommitted = last5Completed.length;

  const terminalLines = [
    "$ git status",
    ...last5Completed.map(item => `➜ ${item.date}: ${item.title}`),
    ...(Array.isArray(settings.terminalText) ? settings.terminalText : [])
  ];

  if (isLoading) {
    return (
      <div className="bg-[#0B0F14] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ADE80]"></div>
          <p className="text-[#9CA3AF] mt-4">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen relative overflow-hidden">
      <section className="relative py-16 px-6 lg:px-8 border-b border-[#1F2937]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              {settings.selfCommitBadge?.enabled && (
                <Badge variant="primary" className="mb-4 gap-2 inline-flex">
                  <span className="animate-pulse">●</span>
                  {settings.selfCommitBadge.text || "Self Commit 2024-2025"}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#E6EDF3] mb-4">
                {(settings.hero?.title || '').split('||').map((part, i) => (
                  <span key={i}>
                    {i === 0 ? part : <span className="text-[#4ADE80]">{part}</span>}
                  </span>
                ))}
              </h1>
              <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl">
                {settings.hero?.description || ''}
              </p>
            </div>

            <div className="w-full md:w-[45%] flex justify-center md:justify-end">
              <div className="relative bg-[#0D1117] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl w-full">
                <div className="flex gap-1.5 px-4 py-3 bg-[#0B0F14] border-b border-[#1F2937]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="space-y-1">
                    {terminalLines.map((line, index) => {
                      if (line.startsWith('$')) {
                        return (
                          <span key={index} className="text-[#9CA3AF] block">{line}</span>
                        );
                      } else if (line.startsWith('[') || line.startsWith('Commit')) {
                        return (
                          <span key={index} className="text-green-400 block">{line}</span>
                        );
                      } else if (line === 'self improved') {
                        const remaining = totalCompleted - justCommitted;
                        return (
                          <span key={index} className="text-green-400 block">self improved ({remaining}+{justCommitted})</span>
                        );
                      } else if (line.startsWith('➜')) {
                        return (
                          <span key={index} className="text-red-400 block text-sm">{line}</span>
                        );
                      } else {
                        return (
                          <span key={index} className="text-green-400 block">{line}</span>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-8 mb-20 relative">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4ADE80] via-[#4ADE80] to-transparent -translate-x-1/2 hidden sm:block"></div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ADE80]"></div>
              <p className="text-[#9CA3AF] mt-4">Loading roadmap...</p>
            </div>
          ) : roadmapItems.length > 0 ? (
            <div className="space-y-12">
              {roadmapItems.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isFuture = item.status === 'planned';
                const isInProgress = item.status === 'in-progress';
                const isLeft = index % 2 === 0;

                return (
                  <div 
                    key={item.id}
                    className={`relative flex items-center justify-between md:justify-normal mb-12 w-full ${isLeft ? '' : 'md:flex-row-reverse'}`}
                  >
                    <div 
                      className={`absolute left-0 md:left-1/2 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 -translate-x-0 md:-translate-x-1/2 shadow-lg ${
                        isInProgress 
                          ? 'bg-[#4ADE80] text-[#0B0F14] shadow-[0_0_15px_rgba(74,222,128,0.6)]' 
                          : isFuture
                          ? 'bg-[#111827] border-[#4ADE80]/30 text-[#4ADE80]'
                          : 'bg-[#111827] border-[#1F2937] text-[#9CA3AF]'
                      }`}
                    >
                      {isCompleted && (
                        <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20"></div>
                      )}
                      {isInProgress && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#4ADE80] animate-ping opacity-20"></div>
                      )}
                      {isFuture && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#4ADE80] animate-ping opacity-20"></div>
                      )}
                      {!isCompleted && !isFuture && !isInProgress && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#1F2937] animate-ping opacity-20"></div>
                      )}
                      {isCompleted && <FaCheckCircle size={16} className="text-green-500" />}
                      {isFuture && <FaFlag size={16} />}
                      {isInProgress && <FaTerminal size={16} />}
                      {!isCompleted && !isFuture && !isInProgress && <FaHistory size={16} />}
                    </div>

                    <div className="w-full pl-14 md:w-[calc(50%-40px)] md:pl-0 md:pr-0">
                      <div
                        className={`bg-gradient-to-br from-[#111827]/80 to-[#0D1117]/80 p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden ${
                          isInProgress
                            ? 'border-[#4ADE80]/50 shadow-[0_0_20px_rgba(74,222,128,0.1)] hover:from-[#111827]/90 hover:to-[#0D1117]/90'
                            : 'border-[#1F2937] hover:border-[#4ADE80]/50 hover:from-[#111827]/90 hover:to-[#0D1117]/90'
                        }`}
                      >
                        {isInProgress && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-[#1F2937]">
                            <div className="h-full bg-[#4ADE80] w-3/4 animate-pulse"></div>
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant={isCompleted ? "outline" : isInProgress ? "primary" : "secondary"}
                            className={`font-mono ${isInProgress ? 'gap-2' : ''}`}
                          >
                            {isInProgress && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
                            {item.date} · {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Goal'}
                          </Badge>
                          {isCompleted && <FaCheckCircle size={20} className="text-green-500" />}
                          {isInProgress && <FaTerminal size={20} className="text-[#4ADE80]" />}
                        </div>

                        <h3 className="text-lg font-bold text-[#E6EDF3] mb-2">{item.title}</h3>
                        <p className="text-[#9CA3AF] leading-relaxed text-sm mb-4">
                          {item.description}
                        </p>

                        {item.tags && (() => {
                          const tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags;
                          return Array.isArray(tags) && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {tags.slice(0, 3).map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#9CA3AF] text-lg">
                No roadmap items found.
              </p>
            </div>
          )}

          <div className="relative flex justify-center w-full mt-12">
            <div className="w-3 h-3 rounded-full bg-[#4B5563]"></div>
          </div>
        </div>
      </section>

      <WhatsNext roadmapItems={roadmapItems} philosophyText={settings.philosophyText || ''} />
    </div>
  );
}
