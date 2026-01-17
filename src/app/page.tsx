import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AvailabilityBanner } from "@/components/home/AvailabilityBanner";
import { TypewriterTitle } from "@/components/home/TypewriterTitle";
import { CallToAction } from "@/components/home/CallToAction";
import { ToolsOfTrade } from "@/components/home/ToolsOfTrade";
import {
  getProjects,
  getProfileStatus,
  getRoadmapItems,
  getAboutSettings,
  getCoreCompetencies,
  getHomepageSettings,
} from "@/lib/data";
import { getIconComponent } from "@/lib/iconMap";
import { FaCogs } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const defaultHomepageSettings = {
  hero: {
    title: "root@portfolio: Hi, I'm Lakshan!",
    tagline: "DevOps Engineer & Cloud Architect",
    description:
      "I bridge the gap between development and operations to deliver reliable software faster. Specialist in Ubuntu, Oracle, GitHub, GCP, and AWS.",
    primaryButtonText: "View Projects",
    primaryButtonLink: "/projects",
    secondaryButtonText: "Contact Me",
    secondaryButtonLink: "/about#contact",
    imageUrl: "/myself.jpeg",
  },
  sections: {
    toolsOfTrade: {
      enabled: true,
      title: "Tools of Trade",
      subtitle: "Technologies & Platforms",
    },
    competencies: {
      enabled: true,
      title: "Core Competencies",
      subtitle: "Key Areas of Expertise",
    },
    roadmap: {
      enabled: true,
      title: "Development Journey",
      subtitle: "Career Progression",
    },
    projects: {
      enabled: true,
      title: "Featured Work",
      subtitle: "Latest Deployments",
    },
    cta: {
      enabled: true,
      title: "Get In Touch",
      subtitle: "Let's Build Something Amazing",
    },
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    projects,
    profile,
    roadmapItems,
    aboutSettings,
    coreCompetencies,
    homepageSettings,
  ] = await Promise.all([
    getProjects().then((res) => res.slice(0, 3)),
    getProfileStatus(),
    getRoadmapItems(),
    getAboutSettings(),
    getCoreCompetencies(),
    getHomepageSettings(),
  ]);

  const settings = homepageSettings || defaultHomepageSettings;

  const latestRoadmap = roadmapItems.slice(0, 3);

  return (
    <div className="bg-[#0B0F14] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[600px] pt-24 pb-14 px-6 lg:px-8 border-b border-[#1F2937] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.08),transparent_70%)]"></div>

        <div className="relative max-w-4xl w-full flex flex-col items-center text-center gap-6 z-10">
          {/* Profile Photo */}
          <div className="relative group mb-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4ADE80] to-[#4ADE80] rounded-full blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#1F2937] shadow-2xl bg-[#111827]">
              {settings.hero?.imageUrl ? (
                <Image
                  src={settings.hero.imageUrl}
                  alt="Lakshan De Silva"
                  fill
                  priority
                  className="object-cover transform transition duration-700 group-hover:scale-110"
                />
              ) : null}
            </div>
          </div>

          {/* Availability Banner - Now synced with DB status */}
          <AvailabilityBanner
            isOpenToWork={profile?.isOpenToWork ?? false}
            badgeText={
              aboutSettings?.hero?.availabilityBadge?.text ??
              "Available for Work"
            }
          />

          {/* Typing Title */}
          <TypewriterTitle title={settings.hero?.title || ""} />

          {/* Description */}
          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl leading-relaxed font-mono mt-1">
            {(settings.hero?.description || "")
              .split("||")
              .map((part, index) => {
                if (index % 2 === 1) {
                  return (
                    <span key={index} className="text-[#4ADE80]">
                      {part}
                    </span>
                  );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
              })}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <Link href={settings.hero?.primaryButtonLink || "#"}>
              <Button variant="primary" size="lg" className="px-10">
                {settings.hero?.primaryButtonText || "View Projects"}
              </Button>
            </Link>
            <Link href="/about#contact">
              <Button variant="outline" size="lg" className="px-10">
                {settings.hero?.secondaryButtonText || "Contact Me"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {settings.sections?.toolsOfTrade?.enabled && <ToolsOfTrade />}

      {/* Core Competencies Section */}
      {settings.sections?.competencies?.enabled && (
        <section className="py-24 px-6 bg-[#0B0F14]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-12">
              <h2 className="text-sm font-mono text-[#4ADE80] uppercase tracking-[0.3em] mb-2">
                {settings.sections?.competencies?.subtitle || ""}
              </h2>
              <div className="flex items-end justify-between">
                <h3 className="text-[#E6EDF3] text-2xl md:text-3xl font-bold leading-tight pb-3">
                  {settings.sections?.competencies?.title || ""}
                </h3>
                <Link href="/competencies">
                  <Button variant="ghost" className="group">
                    View All{" "}
                    <span className="group-hover:translate-x-1 transition-transform ml-2">
                      →
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="h-1 w-20 bg-[#4ADE80] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreCompetencies.map((competency) => {
                const CompetencyIcon = competency.icon
                  ? getIconComponent(competency.icon)
                  : null;

                const statusConfig = {
                  Expert: { color: "bg-[#4ADE80]", label: "Expert" },
                  Intermediate: {
                    color: "bg-[#FBBF24]",
                    label: "Intermediate",
                  },
                  Beginner: { color: "bg-[#F97316]", label: "Beginner" },
                };
                const status = statusConfig[
                  competency.expertise as keyof typeof statusConfig
                ] || { color: "bg-[#9CA3AF]", label: competency.expertise };

                const tags: string[] = competency.tags
                  ? typeof competency.tags === "string"
                    ? JSON.parse(competency.tags)
                    : competency.tags
                  : [];

                return (
                  <div
                    key={competency.id}
                    className="group p-6 rounded-xl border bg-gradient-to-br from-[#111827]/80 to-[#0D1117]/80 border-[#1F2937] hover:border-[#4ADE80]/50 hover:from-[#111827]/90 hover:to-[#0D1117]/90 transition-all duration-300"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 border border-[#4ADE80]/30 flex items-center justify-center">
                          <div className="text-2xl">
                            {CompetencyIcon ? (
                              <CompetencyIcon className="text-[#4ADE80]" />
                            ) : (
                              <FaCogs className="text-[#4ADE80]" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="relative group/dot cursor-pointer">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${status.color} transition-all duration-300 group-hover/dot:w-auto group-hover/dot:px-2 group-hover/dot:h-6 group-hover/dot:rounded-md group-hover/dot:flex group-hover/dot:items-center group-hover/dot:gap-1.5`}
                            >
                              <span className="text-xs font-mono text-[#0B0F14] font-medium opacity-0 group-hover/dot:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-[#E6EDF3] text-lg font-bold mb-2">
                        {competency.title}
                      </h3>

                      <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 flex-1">
                        {competency.description}
                      </p>

                      <div className="pt-4 border-t border-[#1F2937]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#9CA3AF] text-xs font-mono uppercase tracking-wider">
                            Technologies
                          </span>
                          <span className="text-[#4ADE80] text-xs font-mono">
                            {tags.length}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#4ADE80] border border-[#1F2937] hover:border-[#4ADE80]/50 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 4 && (
                            <span className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#9CA3AF] border border-[#1F2937]">
                              +{tags.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {coreCompetencies.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
                <FaCogs size={32} className="mx-auto text-[#374151] mb-3" />
                <p className="text-[#9CA3AF] text-sm mb-2">
                  No competencies yet
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Roadmap Section */}
      {settings.sections?.roadmap?.enabled && (
        <section className="py-24 px-6 bg-[#0B0F14] relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
              {/* Left Tile: Text & Progress */}
              <div className="flex flex-col">
                <div>
                  <h2 className="text-sm font-mono text-[#4ADE80] uppercase tracking-[0.3em] mb-2">
                    {settings.sections?.roadmap?.subtitle || ""}
                  </h2>
                  <h3 className="text-[#E6EDF3] text-2xl md:text-3xl font-bold leading-tight pb-3">
                    {settings.sections?.roadmap?.title || ""}
                  </h3>
                  <div className="h-1 w-20 bg-[#4ADE80] rounded-full mb-6"></div>

                  <p className="text-[#9CA3AF] text-[18px] leading-relaxed mb-4">
                    Life, like any great system, evolves one step at a time.
                    This is my ongoing log of growth, challenges, and
                    self-learning of life and beyond DevOps.
                  </p>

                  <p className="text-[#9CA3AF] text-base leading-relaxed font-mono">
                    Growth comes from iteration, not perfection. Failure isn’t a
                    mistake, it’s part of the process; and i love that progress!
                  </p>
                </div>

                {/* Bottom-aligned sections */}
                <div className="mt-auto">
                  {/* In Progress Section (Flat) */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
                      <span className="text-[#4ADE80] font-mono text-sm uppercase tracking-wider">
                        Current Focus
                      </span>
                    </div>

                    {roadmapItems
                      .filter((i) => i.status === "in-progress")
                      .slice(0, 1)
                      .map((item) => (
                        <div key={item.id}>
                          <h4 className="text-[#E6EDF3] text-xl font-bold mb-2">
                            {item.title}
                          </h4>
                          <p className="text-[#9CA3AF] text-sm mb-4">
                            {item.description}
                          </p>

                          <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#4ADE80] h-full w-[65%] animate-pulse"></div>
                          </div>
                          <div className="flex justify-between text-xs font-mono text-[#6B7280] mt-2">
                            <span>In Progress</span>
                            <span>65%</span>
                          </div>
                        </div>
                      ))}

                    {roadmapItems.filter((i) => i.status === "in-progress")
                      .length === 0 && (
                      <p className="text-[#6B7280] italic">
                        No active items currently in progress.
                      </p>
                    )}
                  </div>

                  {/* Categories List */}
                  {roadmapItems.length > 0 && (
                    <>
                      <div className="h-px bg-[#1F2937] w-full my-6"></div>

                      <div>
                        <h4 className="text-[#4ADE80] font-mono text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full"></span>
                          Explored Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            new Set(roadmapItems.map((item) => item.category)),
                          )
                            .sort()
                            .slice(0, 6)
                            .map((category) => (
                              <span
                                key={category}
                                className="px-3 py-1.5 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-xs font-mono text-[#4ADE80] hover:bg-[#4ADE80]/20 transition-colors cursor-default"
                              >
                                {category}
                              </span>
                            ))}

                          {Array.from(
                            new Set(roadmapItems.map((item) => item.category)),
                          ).length > 6 && (
                            <span className="px-3 py-1.5 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-xs font-mono text-[#4ADE80] flex items-center">
                              +
                              {Array.from(
                                new Set(
                                  roadmapItems.map((item) => item.category),
                                ),
                              ).length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Tile: Self Commits (Journal) */}
              <div className="bg-gradient-to-br from-[#111827]/80 to-[#0D1117]/80 border border-[#1F2937] rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* Decorative header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#1F2937] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1F2937] rounded-lg text-[#4ADE80]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[#E6EDF3] text-lg font-bold">
                        Self Commits
                      </h3>
                      <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">
                        Roadmap.log
                      </p>
                    </div>
                  </div>
                  <Link href="/roadmap">
                    <span className="text-[#4ADE80] text-sm hover:underline cursor-pointer">
                      View All &rarr;
                    </span>
                  </Link>
                </div>

                <div className="space-y-6 relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#1F2937]"></div>

                  {/* Prioritize Goals, then others. Limit to 3 or 4 items */}
                  {roadmapItems
                    .sort((a, b) => {
                      const statusOrder: Record<string, number> = {
                        planned: 0,
                        "in-progress": 1,
                        completed: 2,
                      };
                      return (
                        (statusOrder[a.status] ?? 99) -
                        (statusOrder[b.status] ?? 99)
                      );
                    })
                    .slice(0, 4)
                    .map((item, index) => {
                      const isGoal = item.status === "planned";
                      const isInProgress = item.status === "in-progress";

                      return (
                        <div key={item.id} className="relative pl-12 group">
                          {/* Dot/Icon */}
                          <div
                            className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-[#0B0F14] flex items-center justify-center z-10
                              ${isInProgress ? "bg-[#4ADE80] text-[#0B0F14]" : isGoal ? "bg-[#1F2937] text-[#4ADE80] border-[#4ADE80]/20" : "bg-[#1F2937] text-[#6B7280]"}`}
                          >
                            {isInProgress ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                              </svg>
                            ) : isGoal ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            )}
                          </div>

                          <div className="bg-[#0B0F14]/50 border border-[#1F2937]/50 rounded-lg p-4 group-hover:border-[#4ADE80]/20 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <h4
                                className={`text-sm font-bold ${isInProgress ? "text-[#4ADE80]" : "text-[#E6EDF3]"}`}
                              >
                                {item.title}
                              </h4>
                              <span className="text-[10px] font-mono text-[#6B7280] bg-[#1F2937] px-1.5 py-0.5 rounded">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-[#9CA3AF] text-xs line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Preview */}
      {settings.sections?.projects?.enabled && (
        <section className="py-24 px-6 bg-[#0B0F14]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-12">
              <h2 className="text-sm font-mono text-[#4ADE80] uppercase tracking-[0.3em] mb-2">
                {settings.sections?.projects?.subtitle || ""}
              </h2>
              <div className="flex items-end justify-between">
                <h3 className="text-[#E6EDF3] text-2xl md:text-3xl font-bold leading-tight pb-3">
                  {settings.sections?.projects?.title || ""}
                </h3>
                <Link href="/projects">
                  <Button variant="ghost" className="group">
                    View All Systems{" "}
                    <span className="group-hover:translate-x-1 transition-transform ml-2">
                      →
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="h-1 w-20 bg-[#4ADE80] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project as any}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-[#6B7280] font-mono">
                  No active deployments found in registry.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {settings.sections?.cta?.enabled && (
        <CallToAction
          title={settings.sections?.cta?.title || ""}
          subtitle={settings.sections?.cta?.subtitle || ""}
        />
      )}
    </div>
  );
}
