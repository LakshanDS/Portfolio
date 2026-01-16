import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline" | "secondary" | "ghost";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#111827] border border-[#1F2937] text-[#9CA3AF]",
    primary: "bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80]",
    success: "bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80]",
    warning: "bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]",
    error: "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]",
    outline: "border border-[#374151] text-[#9CA3AF] bg-transparent",
    secondary: "bg-[#374151]/20 border border-[#374151]/30 text-[#E6EDF3]",
    ghost: "bg-transparent border-none text-[#9CA3AF] hover:bg-[#1F2937]/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
