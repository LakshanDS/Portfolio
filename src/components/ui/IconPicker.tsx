"use client";

import { useState, useEffect } from "react";
import { getIconComponent, iconMetadata, iconCategories } from "@/lib/iconMap";
import { FaSearch, FaTimes } from "react-icons/fa";

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredIcons = iconMetadata.filter((icon) => {
        const matchesSearch =
            searchQuery === "" ||
            icon.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            icon.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || icon.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative">
            {label && (
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm transition-all flex items-center justify-between hover:bg-[#1F2937]"
            >
                <div className="flex items-center gap-2">
                    {value && (() => {
                        const IconComponent = getIconComponent(value);
                        return IconComponent ? <IconComponent className="text-[#4ADE80]" /> : null;
                    })()}
                    <span className={value ? "" : "text-[#9CA3AF]"}>
                        {value || "Select an icon..."}
                    </span>
                </div>
                <FaSearch className="text-[#9CA3AF]" size={12} />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#1F2937]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#E6EDF3]">
                                    Select an Icon
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
                                    aria-label="Close icon picker"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={14} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search icons..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="px-6 py-3 border-b border-[#1F2937] overflow-x-auto">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === "All"
                                        ? "bg-[#4ADE80] text-[#0B0F14]"
                                        : "bg-[#1F2937]/50 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E6EDF3]"
                                        }`}
                                >
                                    All ({iconMetadata.length})
                                </button>
                                {iconCategories.map((category) => {
                                    const count = iconMetadata.filter(
                                        (icon) => icon.category === category
                                    ).length;
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                                ? "bg-[#4ADE80] text-[#0B0F14]"
                                                : "bg-[#1F2937]/50 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E6EDF3]"
                                                }`}
                                        >
                                            {category} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {filteredIcons.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaSearch className="mx-auto text-[#374151] mb-3" size={32} />
                                    <p className="text-[#9CA3AF] text-sm">No icons found</p>
                                    <p className="text-[#6B7280] text-xs mt-1">
                                        Try a different search term or category
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                    {filteredIcons.map((icon) => {
                                        const isSelected = value === icon.name;
                                        return (
                                            <button
                                                key={icon.name}
                                                type="button"
                                                onClick={() => {
                                                    onChange(icon.name);
                                                    setIsOpen(false);
                                                }}
                                                className={`group relative p-3 rounded-lg border transition-all duration-200 ${isSelected
                                                    ? "bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]"
                                                    : "bg-[#1F2937]/30 border-[#1F2937] text-[#9CA3AF] hover:bg-[#1F2937] hover:border-[#374151] hover:text-[#E6EDF3]"
                                                    }`}
                                                title={icon.displayName}
                                            >
                                                <icon.component className="w-6 h-6 mx-auto" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0B0F14] border border-[#1F2937] rounded text-xs text-[#E6EDF3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {icon.displayName}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#1F2937] bg-[#0d1117]/50">
                            <div className="flex justify-between items-center text-xs text-[#9CA3AF]">
                                <span>
                                    {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""}{" "}
                                    {searchQuery || selectedCategory !== "All" ? "found" : "available"}
                                </span>
                                {value && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange("");
                                            setIsOpen(false);
                                        }}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Clear selection
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
