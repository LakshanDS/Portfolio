"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaFolder,
  FaRoad,
  FaHome,
  FaSignOutAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCogs,
  FaChartLine,
  FaSlidersH,
  FaFileAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[DASHBOARD] Checking authentication...");
      
      try {
        const response = await fetch("/api/session/check", {
          method: "GET",
          credentials: "include",
        });
        
        const data = await response.json();
        console.log("[DASHBOARD] Session result:", data.authenticated ? "found" : "not found");

        if (!data.authenticated) {
          console.log("[DASHBOARD] No session, redirecting to login");
          router.push("/jasladmin/login");
        } else {
          console.log("[DASHBOARD] Session valid, loading dashboard");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[DASHBOARD] Auth check failed:", error);
        router.push("/jasladmin/login");
      }
    };

    checkAuth();

    // Update session timer every second
    const timerInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/session/check", {
          method: "GET",
          credentials: "include",
        });
        
        const data = await response.json();
        
        if (data.authenticated) {
          if (data.timeRemaining === 0) {
            await fetch("/api/session/logout", {
              method: "POST",
              credentials: "include",
            });
            router.push("/jasladmin/login");
          }
        } else {
          router.push("/jasladmin/login");
        }
      } catch (error) {
        console.error("[DASHBOARD] Session check failed:", error);
      }
    }, 30000);

    // Renew session on user activity
    const renewSessionOnActivity = async () => {
      try {
        const response = await fetch("/api/session/renew", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log("Session renewed");
          }
        }
      } catch (error) {
        console.error("Failed to renew session:", error);
      }
    };

    // Debounce session renewal to avoid too frequent calls
    let renewalTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (renewalTimeout) {
        clearTimeout(renewalTimeout);
      }
      // Renew session after 30 seconds of inactivity
      renewalTimeout = setTimeout(() => {
        renewSessionOnActivity();
      }, 30000);
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearInterval(timerInterval);
      if (renewalTimeout) {
        clearTimeout(renewalTimeout);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/session/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/jasladmin/login");
      router.refresh();
    } catch (error) {
      console.error("[DASHBOARD] Logout failed:", error);
      // Still redirect even if logout fails
      router.push("/jasladmin/login");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      <aside className="w-56 border-r border-[#1F2937] bg-[#111827] flex flex-col hidden md:flex">
        <div className="p-4 border-b border-[#1F2937]">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#9CA3AF]">
              &gt;_ Welcome
            </span>
            <span className="text-sm font-semibold text-[#4ADE80]">
              Lakshan
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          <AdminNavLink
            href="/jasladmin/dashboard"
            icon={<FaChartLine size={14} />}
            label="Overview"
          />
          <AdminNavLink
            href="/jasladmin/dashboard/homepage"
            icon={<FaHome size={14} />}
            label="Homepage"
          />
          <AdminNavLink
            href="/jasladmin/dashboard/projects"
            icon={<FaFolder size={14} />}
            label="Projects"
          />
          <AdminNavLink
            href="/jasladmin/dashboard/roadmap"
            icon={<FaRoad size={14} />}
            label="Roadmap"
          />
          <AdminNavLink
            href="/jasladmin/dashboard/about-settings"
            icon={<FaSlidersH size={14} />}
            label="About"
          />

          <div className="pt-2 border-t border-[#1F2937] mt-2">
            <AdminNavLink
              href="/jasladmin/dashboard/about-me"
              icon={<FaFileAlt size={14} />}
              label="About Me"
            />
            <AdminNavLink
              href="/jasladmin/dashboard/education"
              icon={<FaGraduationCap size={14} />}
              label="Education"
            />
            <AdminNavLink
              href="/jasladmin/dashboard/experience"
              icon={<FaBriefcase size={14} />}
              label="Experience"
            />
            <AdminNavLink
              href="/jasladmin/dashboard/competencies"
              icon={<FaFolder size={14} />}
              label="Competencies"
            />
            <AdminNavLink
              href="/jasladmin/dashboard/skills"
              icon={<FaFolder size={14} />}
              label="Skills"
            />

            <div className="pt-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-xs text-[#F87171] hover:text-[#FCA5A5] hover:bg-red-500/10 px-3 py-2"
              >
                <FaSignOutAlt size={14} /> Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Removed bottom settings as requested */}
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

function AdminNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-medium",
        "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E6EDF3]",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
