"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FaCheck, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const statusRes = await fetch('/api/profile-status').then(r => r.json());

        if (isMounted) {
          setStatus(statusRes);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/session/logout', { method: 'POST' });
      router.push("/jasladmin/login");
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleOpenToWork = async () => {
    try {
      const newStatus = !status?.isOpenToWork;
      await fetch('/api/profile-status/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpenToWork: newStatus })
      });
      setStatus({ ...status, isOpenToWork: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#E6EDF3] mb-1">Settings</h1>
        <p className="text-[#9CA3AF] text-sm">Manage your portfolio settings</p>
      </div>

      <Card className="p-6 bg-[#111827] border border-[#1F2937]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#4ADE80]/10 rounded-lg text-[#4ADE80]">
            <FaCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#E6EDF3]">Work Status</h2>
            <p className="text-[#9CA3AF] text-sm">Toggle your availability for new projects</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#1F2937] rounded-md">
          <div>
            <p className="text-sm font-medium text-[#9CA3AF] mb-1">Current Status</p>
            <Badge variant={status?.isOpenToWork ? "success" : "default"}>
              {status?.isOpenToWork ? "Open to Work" : "Not Available"}
            </Badge>
          </div>
          <Button
            onClick={toggleOpenToWork}
            variant={status?.isOpenToWork ? "primary" : "outline"}
            className="gap-2"
          >
            <FaCheck size={12} />
            {status?.isOpenToWork ? "Mark as Unavailable" : "Mark as Available"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-[#1A1F2E] border border-[#4ADE80]/20">
        <div className="flex items-center gap-2 mb-4 text-[#4ADE80] text-sm font-medium">
          <FaCogs size={16} />
          <span>Admin Panel Guide</span>
        </div>
        <div className="space-y-3 text-sm text-[#9CA3AF]">
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Overview</p>
            <p className="text-xs">Dashboard stats and quick access to all sections</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Homepage</p>
            <p className="text-xs">View your live portfolio website</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Projects</p>
            <p className="text-xs">Add, edit, remove projects and their details</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Roadmap</p>
            <p className="text-xs">Manage career milestones and development journey</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">About</p>
            <p className="text-xs">Manage About section content</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">About Me</p>
            <p className="text-xs">Edit personal introduction cards and profile information</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Competencies</p>
            <p className="text-xs">Edit 3 key competencies displayed on homepage</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Skills</p>
            <p className="text-xs">Manage skill categories and individual skills</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Education</p>
            <p className="text-xs">Add, edit, remove education history</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Experience</p>
            <p className="text-xs">Add, edit, remove work experience</p>
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-1">Settings</p>
            <p className="text-xs">Toggle work availability and logout</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-[#111827] border border-[#1F2937]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
            <FaSignOutAlt size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#E6EDF3] mb-1">Logout</h2>
            <p className="text-[#9CA3AF] text-sm">Securely log out of admin panel</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-400 hover:text-red-300 hover:border-red-400/50">
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
