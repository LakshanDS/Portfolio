"use client";

import { FaChartBar, FaRocket, FaCloud, FaServer, FaBolt, FaLock, FaChartLine } from "react-icons/fa";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  projectCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  projectCount,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex items-center justify-between">
        <h3 className="text-[#E6EDF3] text-xl font-bold">Browse by Category</h3>
        <span className="text-[#9CA3AF] text-sm">
          Showing {projectCount} {projectCount === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 border border-[#4ADE80]/30 shadow-lg shadow-[#4ADE80]/25"
                  : "bg-gradient-to-br from-[#111827]/80 to-[#0D1117]/80 border border-[#1F2937] hover:border-[#4ADE80]/50 hover:from-[#111827]/90 hover:to-[#0D1117]/90"
              }`}
            >
              {getCategoryIcon(category)}
              <p
                className={`text-sm font-medium ${
                  isSelected ? "text-[#4ADE80]" : "text-[#9CA3AF]"
                }`}
              >
                {category}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getCategoryIcon(category: string) {
  const icons: Record<string, React.ReactElement> = {
    All: <FaChartBar />,
    "CI/CD": <FaRocket />,
    Cloud: <FaCloud />,
    Infrastructure: <FaServer />,
    Scripting: <FaBolt />,
    Security: <FaLock />,
    Monitoring: <FaChartLine />,
  };
  return icons[category] || <FaChartBar />;
}
