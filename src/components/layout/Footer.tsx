"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/jasladmin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0D1117]">
      <div className="w-full border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#4ADE80] text-xl">&gt;_</span>
                <h3 className="text-[#E6EDF3] text-base font-semibold">
                  Lakshan De Silva
                </h3>
              </div>
              <p className="text-[#9CA3AF] text-sm max-w-md">
                A showcase of my professional journey in DevOps, Cloud Engineering, and Automation.
                Explore my projects, track my growth through self-commits, and learn about my skills and experience.
              </p>
              <p className="text-[#6B7280] text-[14px] italic font-mono mt-8">
                # Learning in public. Automating the rest.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#E6EDF3] font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    Self Commits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#E6EDF3] font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:lakshandesilva112@gmail.com"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/94701234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CA3AF] hover:text-[#4ADE80] text-sm transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 text-center">
            <p className="text-[#9CA3AF] text-sm">
              © {currentYear} Lakshan De Silva. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
