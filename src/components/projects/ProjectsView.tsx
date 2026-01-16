"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CategoryFilter } from "@/components/projects/CategoryFilter";
import { Badge } from "@/components/ui/Badge";
import { CallToAction } from "@/components/home/CallToAction";
import { Project } from "@/lib/types";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface ProjectsSettings {
  hero: {
    title: string;
    tagline: string;
  };
  cta: {
    enabled: boolean;
  };
}

interface ProjectsViewProps {
  initialProjects: Project[];
}

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const settings = {
    hero: {
      title: "Engineering Projects",
      tagline: "A curated collection of infrastructure automation, CI/CD pipelines, and cloud-native applications designed for scale."
    },
    statusBadge: {
      enabled: true,
      status: 'operational' as const
    },
    cta: {
      enabled: true
    }
  };
  
  const categories = ["All", ...Array.from(new Set(initialProjects.map((p) => p.category)))];

  const filteredProjects = initialProjects.filter((project) => {
    return selectedCategory === "All" || project.category === selectedCategory;
  });

  return (
    <div className="bg-[#0B0F14] relative min-h-screen overflow-hidden">
      <section className="relative flex items-center justify-center min-h-[400px] py-16 px-6 lg:px-8 border-b border-[#1F2937] z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.08),transparent_70%)] pointer-events-none"></div>

        <div className="relative max-w-4xl w-full flex flex-col items-center text-center gap-6 z-10">
          {settings.statusBadge.enabled && (
            <Badge className={`gap-2 ${
              settings.statusBadge.status === 'operational' 
                ? 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20' 
                : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  settings.statusBadge.status === 'operational' ? 'bg-[#4ADE80]' : 'bg-[#EF4444]'
                } opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  settings.statusBadge.status === 'operational' ? 'bg-[#4ADE80]' : 'bg-[#EF4444]'
                }`}></span>
              </span>
              {settings.statusBadge.status === 'operational' ? 'System Operational' : 'System Non-Operational'}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#E6EDF3]">
            {settings.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl leading-relaxed">
            {settings.hero.tagline}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              projectCount={filteredProjects.length}
            />
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[#374151] rounded-2xl bg-[#111827]/20">
              <p className="text-[#9CA3AF] text-lg">
                No projects found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                }}
                className="mt-4 text-[#3ECF8E] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {settings.cta.enabled && <CallToAction />}
    </div>
  );
}
