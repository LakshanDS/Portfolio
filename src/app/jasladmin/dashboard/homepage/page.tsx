"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FaHome,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaUpload,
  FaSave,
  FaUndo,
  FaToggleOn,
  FaToggleOff,
  FaLink,
  FaHeading,
  FaAlignLeft,
  FaUser,
} from "react-icons/fa";

interface HomepageSettings {
  hero: {
    title: string;
    tagline: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    imageUrl: string;
  };
  sections: {
    toolsOfTrade: { enabled: boolean; title: string; subtitle: string };
    competencies: { enabled: boolean; title: string; subtitle: string };
    roadmap: { enabled: boolean; title: string; subtitle: string };
    projects: { enabled: boolean; title: string; subtitle: string };
    cta: { enabled: boolean; title: string; subtitle: string };
  };
}

const defaultSettings: HomepageSettings = {
  hero: {
    title: "root@portfolio: Hi, I'm Lakshan!",
    tagline: "DevOps Engineer & Cloud Architect",
    description:
      "I bridge the gap between development and operations to deliver reliable software faster. Specialist in Ubuntu, Oracle, GitHub, GCP, and AWS.",
    primaryButtonText: "View Projects",
    primaryButtonLink: "/projects",
    secondaryButtonText: "Contact Me",
    secondaryButtonLink: "/about#contact",
    imageUrl: "/myself.jpeg",
  },
  sections: {
    toolsOfTrade: {
      enabled: true,
      title: "Tools of Trade",
      subtitle: "Technologies & Platforms",
    },
    competencies: {
      enabled: true,
      title: "Core Competencies",
      subtitle: "Key Areas of Expertise",
    },
    roadmap: {
      enabled: true,
      title: "Development Journey",
      subtitle: "Career Progression",
    },
    projects: {
      enabled: true,
      title: "Featured Work",
      subtitle: "Latest Deployments",
    },
    cta: {
      enabled: true,
      title: "Get In Touch",
      subtitle: "Let's Build Something Amazing",
    },
  },
};

export default function AdminHomepage() {
  const [settings, setSettings] = useState<HomepageSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/homepage-settings");
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setSettings(data);
            setImagePreview(data.hero.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/homepage-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setHasChanges(false);
        alert("Settings saved successfully to homepage-settings.json!");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
  };

  const handleReset = () => {
    if (confirm("Reset to default settings?")) {
      setSettings(defaultSettings);
      setImagePreview(defaultSettings.hero.imageUrl);
      setHasChanges(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      updateHero("imageUrl", url);
    }
  };

  const updateHero = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
    setHasChanges(true);
  };

  const updateSection = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section as keyof typeof prev.sections],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const openEditModal = (section: string) => {
    setEditingSection(section);
  };

  const closeEditModal = () => {
    setEditingSection(null);
  };

  if (isLoading) {
    return (
      <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">
            Homepage Settings
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-[#9CA3AF] text-sm">
              Configure homepage content and sections
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <FaUndo size={12} />
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <FaSave size={12} />
            {hasChanges ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl">
          <div className="p-5 border-b border-[#1F2937]">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 rounded-xl text-[#4ADE80] shadow-lg">
                <FaHome size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#E6EDF3]">
                  Hero Content
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Configure the main hero section
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#1F2937]/30 rounded-xl border border-[#1F2937]">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#374151] bg-[#0d1117] group cursor-pointer">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                  <div className="text-center text-white">
                    <FaUpload size={16} className="mx-auto mb-1" />
                    <span className="text-[10px] font-medium">Change</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#E6EDF3]">
                  Profile Image
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Hover and click to change your profile picture
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaHeading size={11} className="text-[#4ADE80]" />
                Title
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm transition-all"
                placeholder="Enter hero title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaAlignLeft size={11} className="text-[#4ADE80]" />
                Description{" "}
                <span className="text-[#6B7280] ml-1">
                  (Use ||text|| for green highlight)
                </span>
              </label>
              <textarea
                value={settings.hero.description}
                onChange={(e) => updateHero("description", e.target.value)}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[80px] transition-all"
                placeholder="Enter hero description (e.g., I bridge the gap between development and operations to deliver ||reliable software|| faster.)"
              />
            </div>

            <div className="pt-3 border-t border-[#1F2937]">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3] mb-3">
                <FaLink size={11} className="text-[#4ADE80]" />
                Call to Action Buttons
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.hero.primaryButtonText}
                      onChange={(e) =>
                        updateHero("primaryButtonText", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-[#1F2937]/50 border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.hero.primaryButtonLink}
                      onChange={(e) =>
                        updateHero("primaryButtonLink", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-[#1F2937]/50 border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-xs transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.hero.secondaryButtonText}
                      onChange={(e) =>
                        updateHero("secondaryButtonText", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-[#1F2937]/50 border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.hero.secondaryButtonLink}
                      onChange={(e) =>
                        updateHero("secondaryButtonLink", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-[#1F2937]/50 border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-xs transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl">
          <div className="p-5 border-b border-[#1F2937]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 rounded-xl text-[#4ADE80] shadow-lg">
                <FaEdit size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#E6EDF3]">
                  Section Settings
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Toggle sections and customize titles
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <SectionCard
              name="toolsOfTrade"
              title={settings.sections.toolsOfTrade.title}
              subtitle={settings.sections.toolsOfTrade.subtitle}
              enabled={settings.sections.toolsOfTrade.enabled}
              onToggle={(enabled) =>
                updateSection("toolsOfTrade", "enabled", enabled)
              }
              onEdit={() => openEditModal("toolsOfTrade")}
            />

            <SectionCard
              name="competencies"
              title={settings.sections.competencies.title}
              subtitle={settings.sections.competencies.subtitle}
              enabled={settings.sections.competencies.enabled}
              onToggle={(enabled) =>
                updateSection("competencies", "enabled", enabled)
              }
              onEdit={() => openEditModal("competencies")}
            />

            <SectionCard
              name="roadmap"
              title={settings.sections.roadmap.title}
              subtitle={settings.sections.roadmap.subtitle}
              enabled={settings.sections.roadmap.enabled}
              onToggle={(enabled) =>
                updateSection("roadmap", "enabled", enabled)
              }
              onEdit={() => openEditModal("roadmap")}
            />

            <SectionCard
              name="projects"
              title={settings.sections.projects.title}
              subtitle={settings.sections.projects.subtitle}
              enabled={settings.sections.projects.enabled}
              onToggle={(enabled) =>
                updateSection("projects", "enabled", enabled)
              }
              onEdit={() => openEditModal("projects")}
            />

            <SectionCard
              name="cta"
              title={settings.sections.cta.title}
              subtitle={settings.sections.cta.subtitle}
              enabled={settings.sections.cta.enabled}
              onToggle={(enabled) => updateSection("cta", "enabled", enabled)}
              onEdit={() => openEditModal("cta")}
            />
          </div>
        </Card>
      </div>

      {editingSection && (
        <EditModal
          section={editingSection}
          settings={settings}
          onClose={closeEditModal}
          onUpdate={(title, subtitle) => {
            updateSection(editingSection, "title", title);
            updateSection(editingSection, "subtitle", subtitle);
            closeEditModal();
          }}
        />
      )}
    </div>
  );
}

function SectionCard({
  name,
  title,
  subtitle,
  enabled,
  onToggle,
  onEdit,
}: {
  name: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
        enabled
          ? "bg-[#1F2937]/30 border-[#1F2937] hover:bg-[#1F2937]/50 hover:border-[#374151]"
          : "bg-[#0d1117]/50 border-[#1F2937]/50 hover:bg-[#1F2937]/30"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(!enabled)}
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
            enabled
              ? "bg-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/30"
              : "bg-[#6B7280]/20 text-[#6B7280] hover:bg-[#6B7280]/30"
          }`}
        >
          {enabled ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
        </button>
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold ${enabled ? "text-[#E6EDF3]" : "text-[#6B7280]"}`}
          >
            {title}
          </h3>
          <p
            className={`text-[11px] leading-tight ${enabled ? "text-[#9CA3AF]" : "text-[#4B5563]"}`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className={`flex-shrink-0 p-1.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
          enabled
            ? "text-[#4ADE80] hover:bg-[#4ADE80]/10"
            : "text-[#6B7280] hover:bg-[#6B7280]/10"
        }`}
      >
        <FaEdit size={11} />
      </button>
    </div>
  );
}

function EditModal({
  section,
  settings,
  onClose,
  onUpdate,
}: {
  section: string;
  settings: HomepageSettings;
  onClose: () => void;
  onUpdate: (title: string, subtitle: string) => void;
}) {
  const sectionData =
    settings.sections[section as keyof typeof settings.sections];
  const [localTitle, setLocalTitle] = useState(sectionData.title);
  const [localSubtitle, setLocalSubtitle] = useState(sectionData.subtitle);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-[#E6EDF3]">Edit Section</h3>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
          >
            <FaTimesCircle size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3] mb-2">
              <FaHeading size={11} className="text-[#4ADE80]" />
              Section Title
            </label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3] mb-2">
              <FaAlignLeft size={11} className="text-[#4ADE80]" />
              Section Subtitle
            </label>
            <input
              type="text"
              value={localSubtitle}
              onChange={(e) => setLocalSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUpdate(localTitle, localSubtitle)}
            className="flex items-center gap-2"
          >
            <FaSave size={12} />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
