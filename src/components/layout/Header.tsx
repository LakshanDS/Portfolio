"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FaFileDownload, FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2937] bg-[#0B0F14]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#4ADE80] text-xl">&gt;_</span>
          <h2 className="text-[#E6EDF3] text-base font-semibold tracking-tight">
            Lakshan De Silva
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${isActive("/") ? "text-[#4ADE80]" : "text-[#9CA3AF] hover:text-[#4ADE80]"}`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`text-sm font-medium transition-colors ${isActive("/projects") ? "text-[#4ADE80]" : "text-[#9CA3AF] hover:text-[#4ADE80]"}`}
          >
            Projects
          </Link>
          <Link
            href="/roadmap"
            className={`text-sm font-medium transition-colors ${isActive("/roadmap") ? "text-[#4ADE80]" : "text-[#9CA3AF] hover:text-[#4ADE80]"}`}
          >
            Self Commits
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${isActive("/about") ? "text-[#4ADE80]" : "text-[#9CA3AF] hover:text-[#4ADE80]"}`}
          >
            About
          </Link>
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="sm"
            className="hidden sm:flex"
            onClick={() => window.open("/api/download-resume", "_blank")}
          >
            <FaFileDownload />
            <span>Resume</span>
          </Button>
          <button
            className="md:hidden text-[#E6EDF3] text-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-[#1F2937] bg-[#0D1117] px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className={`font-medium ${isActive("/") ? "text-[#4ADE80]" : "text-[#9CA3AF]"}`}>
              Home
            </Link>
            <Link href="/projects" className={`font-medium ${isActive("/projects") ? "text-[#4ADE80]" : "text-[#9CA3AF]"}`}>
              Projects
            </Link>
            <Link href="/roadmap" className={`font-medium ${isActive("/roadmap") ? "text-[#4ADE80]" : "text-[#9CA3AF]"}`}>
              Self Commits
            </Link>
            <Link href="/about" className={`font-medium ${isActive("/about") ? "text-[#4ADE80]" : "text-[#9CA3AF]"}`}>
              About
            </Link>
            <button
              onClick={() => window.open("/api/download-resume", "_blank")}
              className="text-[#4ADE80] font-medium text-left flex items-center gap-2"
            >
              <FaFileDownload />
              Resume
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
