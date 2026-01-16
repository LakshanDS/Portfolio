"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FaTools, FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";
import Image from "next/image";
import { getIconComponent } from "@/lib/iconMap";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const statusColors = {
    live: 'text-green-400',
    developing: 'text-yellow-400 animate-pulse',
    archived: 'text-slate-300'
  };

  const statusDotColors = {
    live: 'bg-green-400',
    developing: 'bg-yellow-400',
    archived: 'bg-slate-400'
  };

  const parseTags = () => {
    try {
      return typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags;
    } catch {
      return [];
    }
  };

  const tags = parseTags();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        variant="gradient"
        className="group flex flex-col overflow-hidden hover:border-[#4ADE80]/50 transition-all duration-300"
      >
        <div className="h-48 w-full relative overflow-hidden">
          <Image
            src={project.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          
          <div className="absolute top-3 right-3 flex gap-2">
            <div className={`flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || 'text-slate-300'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[project.status as keyof typeof statusDotColors] || 'bg-slate-400'}`}></span>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {project.category && (
                <Badge variant="primary" className="text-xs font-medium">
                  {project.category}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-[#E6EDF3] mb-2 group-hover:text-[#4ADE80] transition-colors hover-primary-text">
              {project.title}
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
            {tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-1 rounded bg-[#1F2937] text-xs text-[#9CA3AF] border border-[#1F2937]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-white/5 mt-2">
            <Link href={`/projects/${project.id}`}>
              <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-2">
                <FaBookOpen size={14} />
                See Project Doc
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link
                href={project.demoUrl || '#'}
                target={project.demoUrl ? '_blank' : undefined}
                rel={project.demoUrl ? 'noopener noreferrer' : undefined}
                onClick={(e) => !project.demoUrl && e.preventDefault()}
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!project.demoUrl}
                  className={`w-full flex items-center justify-center gap-2 ${project.demoUrl ? '' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <FaExternalLinkAlt size={14} />
                  Live Demo
                </Button>
              </Link>
              <Link
                href={project.repoUrl || '#'}
                target={project.repoUrl ? '_blank' : undefined}
                rel={project.repoUrl ? 'noopener noreferrer' : undefined}
                onClick={(e) => !project.repoUrl && e.preventDefault()}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!project.repoUrl}
                  className={`w-full flex items-center justify-center gap-2 ${project.repoUrl ? '' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <FaTools size={14} />
                  Source Code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
