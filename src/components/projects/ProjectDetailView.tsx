"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MermaidDiagram } from "@/components/ui/MermaidDiagram";
import { ExpandableModal } from "@/components/ui/ExpandableModal";
import { CommentsSection } from "@/components/projects/CommentsSection";
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaCode, FaListUl } from "react-icons/fa";
import { Project } from "@/lib/types";

interface ProjectDetailViewProps {
  project: Project;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [activeSection, setActiveSection] = useState("");
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<"image" | "mermaid" | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!project.content) {
      requestAnimationFrame(() => {
        setHeadings([]);
      });
      return;
    }

    const lines = project.content.split("\n");
    const extractedHeadings: { id: string; text: string; level: number }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        extractedHeadings.push({ id, text, level });
      }
    });

    requestAnimationFrame(() => {
      setHeadings(extractedHeadings);
    });
  }, [project.content]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      let currentSection = "";

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        if (headings.length > 0) {
          setActiveSection(headings[headings.length - 1].id);
        }
        return;
      }

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          if (element.offsetTop <= scrollPosition) {
            currentSection = heading.id;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Auto-scroll the sidebar nav to keep active item visible
  useEffect(() => {
    if (activeSection && navRef.current) {
      const activeElement = navRef.current.querySelector(`a[href="#${activeSection}"]`) as HTMLElement;
      if (activeElement) {
        const container = navRef.current;
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // Custom scroll logic to ensure only the sidebar scrolls and doesn't affect main window
        if (elementTop < containerTop) {
          container.scrollTo({ top: elementTop, behavior: "smooth" });
        } else if (elementBottom > containerBottom) {
          container.scrollTo({ top: elementBottom - container.clientHeight, behavior: "smooth" });
        }
      }
    }
  }, [activeSection]);

  const components = {
    h1: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return <h1 id={id} className="text-3xl md:text-4xl font-black text-[#E6EDF3] mt-12 mb-6 scroll-mt-24 first:mt-0">{children}</h1>;
    },
    h2: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-bold text-[#E6EDF3] mt-10 mb-4 pb-2 border-b border-[#1F2937] scroll-mt-24 flex items-center gap-2">
        <span className="text-[#4ADE80]">#</span> {children}
      </h2>;
    },
    h3: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-bold text-[#E6EDF3] mt-8 mb-3 scroll-mt-24">{children}</h3>;
    },
    p: ({ children }: any) => <p className="text-[#9CA3AF] leading-relaxed mb-6">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-outside ml-6 mb-6 text-[#9CA3AF] space-y-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-outside ml-6 mb-6 text-[#9CA3AF] space-y-2">{children}</ol>,
    li: ({ children }: any) => <li className="pl-1">{children}</li>,
    a: ({ href, children }: any) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#4ADE80] hover:text-[#4ADE80]/80 underline underline-offset-4 transition-colors">
        {children}
      </a>
    ),
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      // Check if this is a block code - either has language class OR is inside pre tag
      // When inside a pre tag via ReactMarkdown, node.tagName will be 'code' but parent is pre
      const isInPre = node?.position?.start?.line !== node?.position?.end?.line ||
        String(children).includes('\n');
      const isBlock = Boolean(match) || isInPre;

      // Handle mermaid code blocks
      if (isBlock && language === "mermaid") {
        const chart = String(children).replace(/\n$/, "");
        return (
          <div
            onClick={() => {
              setExpandedContent(chart);
              setExpandedType("mermaid");
            }}
            className="cursor-pointer hover:ring-2 hover:ring-[#4ADE80] transition-all rounded-lg"
            title="Click to expand diagram"
          >
            <MermaidDiagram chart={chart} />
          </div>
        );
      }

      // For block code, return styled code with proper whitespace preservation
      if (isBlock) {
        return (
          <code
            className="font-mono text-sm text-[#E6EDF3] block"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            {...props}
          >
            {children}
          </code>
        );
      }

      // Inline code
      return (
        <code className="bg-[#1F2937] text-[#4ADE80] px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => {
      // Check if this contains a mermaid diagram (MermaidDiagram returns a div, not code)
      const childType = children?.type?.name || children?.type;
      if (childType === 'MermaidDiagram' || childType === 'MermaidDiagramInner') {
        return <>{children}</>;
      }

      // Wrap code blocks in styled container
      return (
        <div className="bg-[#0D1117] rounded-lg p-4 mb-6 border border-[#1F2937] overflow-x-auto shadow-inner">
          {children}
        </div>
      );
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#4ADE80] pl-4 italic text-[#9CA3AF] my-6 bg-[#4ADE80]/5 py-2 pr-2 rounded-r">
        {children}
      </blockquote>
    ),
    img: ({ src, alt }: any) => (
      <div
        className="my-8 rounded-xl overflow-hidden border border-[#1F2937] shadow-2xl cursor-pointer hover:ring-2 hover:ring-[#4ADE80] transition-all"
        onClick={() => {
          setExpandedContent(src);
          setExpandedType("image");
        }}
        title="Click to expand image"
      >
        <Image src={src} alt={alt} width={800} height={400} className="w-full h-auto" unoptimized />
        {alt && <div className="bg-[#0D1117] p-2 text-center text-xs text-[#6B7280] font-mono">{alt}</div>}
      </div>
    ),
  };

  return (
    <div className="bg-[#0B0F14] min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,222,128,0.05),transparent_70%)] pointer-events-none"></div>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0B0F14]/80 backdrop-blur-md border-b border-[#1F2937] z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors group">
            <FaChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm">Back to Projects</span>
          </Link>
          <div className="flex gap-4">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" title="View Repository" className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors">
                <FaGithub size={20} />
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" title="View Live Demo" className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors">
                <FaExternalLinkAlt size={18} />
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 pb-24 px-6 lg:px-8 relative z-10">
        <div className="flex flex-col mb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20">
              {project.category}
            </Badge>
            {project.status === "live" && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
                </span>
                <span className="text-xs font-medium text-[#4ADE80]">Live System</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#E6EDF3] leading-tight mb-6">
                {project.title}
              </h1>

              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-8 border-l-2 border-[#1F2937] pl-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#4ADE80] border border-[#1F2937]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4ADE80] to-[#22c55e] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-xl overflow-hidden border border-[#1F2937] shadow-2xl bg-[#0D1117] aspect-video">
                  <Image
                    src={project.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"}
                    alt={project.title}
                    fill
                    className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-3 p-6 rounded-xl bg-[#111827]/50 border border-[#1F2937]">
                {project.demoUrl ? (
                  <Button className="w-full justify-center" variant="primary" onClick={() => { if (project.demoUrl) window.open(project.demoUrl, '_blank'); }}>
                    View Live Demo
                  </Button>
                ) : (
                  <Button className="w-full justify-center opacity-50 cursor-not-allowed" variant="primary" disabled>
                    View Live Demo
                  </Button>
                )}
                {project.repoUrl ? (
                  <Button className="w-full justify-center" variant="outline" onClick={() => { if (project.repoUrl) window.open(project.repoUrl, '_blank'); }}>
                    Source Code
                  </Button>
                ) : (
                  <Button className="w-full justify-center opacity-50 cursor-not-allowed" variant="outline" disabled>
                    Source Code
                  </Button>
                )}
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="flex flex-col max-h-[calc(100vh-16rem)]">
                  <h3 className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-4 pl-2 border-l-2 border-[#4ADE80] flex-shrink-0">
                    Checkpoints
                  </h3>
                  <nav ref={navRef} className="space-y-1 border-l border-[#1F2937] ml-0.5 overflow-y-auto pr-2 relative">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-xs py-1.5 pl-4 border-l-2 -ml-[1px] transition-all ${activeSection === heading.id
                          ? "border-[#4ADE80] text-[#4ADE80] font-medium"
                          : "border-transparent text-[#6B7280] hover:text-[#9CA3AF] hover:border-[#374151]"
                          } ${heading.level > 1 ? "ml-2" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                          setActiveSection(heading.id);
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Mobile Actions */}
            <div className="lg:hidden mb-8 grid grid-cols-2 gap-4">
              {project.demoUrl ? (
                <Button variant="primary" onClick={() => { if (project.demoUrl) window.open(project.demoUrl, '_blank'); }}>
                  View Live
                </Button>
              ) : (
                <Button variant="primary" disabled>
                  View Live
                </Button>
              )}
              {project.repoUrl ? (
                <Button variant="outline" onClick={() => { if (project.repoUrl) window.open(project.repoUrl, '_blank'); }}>
                  Code
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Code
                </Button>
              )}
            </div>

            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-p:text-[#9CA3AF] prose-a:text-[#4ADE80] prose-li:text-[#9CA3AF] prose-strong:text-[#E6EDF3]">
              {project.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {project.content}
                </ReactMarkdown>
              ) : (
                <div className="text-center py-20 border border-dashed border-[#1F2937] rounded-xl bg-[#111827]/50">
                  <FaCode size={32} className="mx-auto text-[#1F2937] mb-3" />
                  <p className="text-[#6B7280] font-mono">Documentation module not initialized.</p>
                </div>
              )}
            </div>

            <CommentsSection projectId={project.id} />
          </div>

        </div>
      </main >

      <ExpandableModal
        isOpen={!!expandedContent}
        onClose={() => {
          setExpandedContent(null);
          setExpandedType(null);
        }}
      >
        {expandedContent && expandedType === "image" && (
          <Image
            src={expandedContent}
            alt="Expanded view"
            width={1200}
            height={800}
            className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
            unoptimized
          />
        )}
        {expandedContent && expandedType === "mermaid" && (
          <div className="bg-[#0D1117] p-4 rounded-lg overflow-hidden w-[95vw] h-[90vh] flex flex-col">
            <MermaidDiagram
              chart={expandedContent}
              className="!p-0 !m-0 !border-0 !shadow-none w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-none"
            />
          </div>
        )}
      </ExpandableModal>
    </div >
  );
}
