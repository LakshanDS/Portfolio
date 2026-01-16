"use client";

import { Badge } from "@/components/ui/Badge";
import { FaBriefcase } from "react-icons/fa";

interface AvailabilityBannerProps {
  isOpenToWork: boolean; // Live status from DB
  badgeText?: string;
}

export function AvailabilityBanner({ isOpenToWork, badgeText = "Available for Work" }: AvailabilityBannerProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Badge
        variant="outline"
        className={`gap-2 px-5 py-2 text-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] ${isOpenToWork
          ? "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.2)] animate-pulse-slow"
          : "border-[#374151] bg-[#1F2937]/50 text-[#9CA3AF]"
          }`}
      >
        <FaBriefcase className="w-4 h-4" />
        {badgeText}
      </Badge>
    </div>
  );
}
