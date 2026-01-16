"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconPicker } from "@/components/ui/IconPicker";
import { getIconComponent } from "@/lib/iconMap";
import { FaCloud, FaCogs, FaTerminal, FaChartLine, FaShieldAlt, FaRocket, FaServer, FaCode, FaEdit, FaTimes, FaSave, FaPlus } from "react-icons/fa";

interface Competency {
  id: string;
  title: string;
  description: string;
  expertise: string;
  tags: string;
  icon?: string;
  categoryId: string | null;
}

export default function AdminCompetencies() {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expertise: "",
    tags: "",
    icon: "",
    newTag: ""
  });

  const parseTags = (tags: string): string[] => {
    if (!tags) return [];
    try {
      return typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch {
      // Fallback for comma-separated format
      return tags.split(',').map(t => t.trim()).filter(t => t);
    }
  };

  const formatTags = (tags: string[]): string => {
    return JSON.stringify(tags);
  };

  const loadData = async () => {
    try {
      const response = await fetch('/api/core-competencies');
      const result = await response.json();
      setCompetencies(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading competencies:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (competency: Competency) => {
    setFormData({
      title: competency.title,
      description: competency.description,
      expertise: competency.expertise,
      tags: competency.tags,
      icon: competency.icon || "",
      newTag: ""
    });
    setIsEditing(competency.id);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      description: "",
      expertise: "",
      tags: "",
      icon: "",
      newTag: ""
    });
  };

  const handleAddTag = () => {
    if (!formData.newTag.trim()) return;

    const currentTags = parseTags(formData.tags);
    if (!currentTags.includes(formData.newTag.trim())) {
      const newTags = [...currentTags, formData.newTag.trim()];
      setFormData({ ...formData, tags: formatTags(newTags), newTag: "" });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = parseTags(formData.tags);
    const newTags = currentTags.filter(t => t !== tagToRemove);
    setFormData({ ...formData, tags: formatTags(newTags) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing) return;

    const payload = { id: isEditing, title: formData.title, description: formData.description, expertise: formData.expertise, tags: formData.tags, icon: formData.icon };
    console.log("Submitting update:", payload);

    try {
      const response = await fetch('/api/core-competencies/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || 'Failed to update competency');
        } catch {
          throw new Error(text || 'Failed to update competency');
        }
      }

      setUpdateMessage({ type: 'success', text: 'Competency updated successfully!' });
      handleCancel();
      await loadData();

      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (error) {
      console.error('Error updating competency:', error);
      setUpdateMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update competency' });
      setTimeout(() => setUpdateMessage(null), 5000);
    }
  };


  const getStatusDot = (expertise: string) => {
    const statusConfig = {
      'Expert': { color: 'bg-[#4ADE80]', label: 'Expert' },
      'Intermediate': { color: 'bg-[#FBBF24]', label: 'Intermediate' },
      'Beginner': { color: 'bg-[#F97316]', label: 'Beginner' }
    };
    return statusConfig[expertise as keyof typeof statusConfig] || { color: 'bg-[#9CA3AF]', label: expertise };
  };

  if (isLoading) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  const currentTags = parseTags(formData.tags);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">Competencies</h1>
          <p className="text-[#9CA3AF] text-sm">Manage your core competencies (3 items)</p>
        </div>
      </div>

      {updateMessage && (
        <div className={`px-4 py-3 rounded-lg border ${updateMessage.type === 'success'
            ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
          } text-sm font-medium`}>
          {updateMessage.text}
        </div>
      )}

      <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
        <div className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competencies.map((competency) => {
              const status = getStatusDot(competency.expertise);
              const tags = parseTags(competency.tags);

              const CompetencyIcon = competency.icon ? getIconComponent(competency.icon) : null;

              return (
                <div key={competency.id} className="group p-6 rounded-xl border bg-gradient-to-br from-[#111827]/80 to-[#0D1117]/80 border-[#1F2937] hover:border-[#4ADE80]/50 hover:from-[#111827]/90 hover:to-[#0D1117]/90 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 border border-[#4ADE80]/30 flex items-center justify-center">
                        <div className="text-2xl">
                          {CompetencyIcon ? <CompetencyIcon className="text-[#4ADE80]" /> : <FaCogs className="text-[#4ADE80]" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} title={status.label} />
                        <button onClick={() => handleEdit(competency)} className="p-1.5 rounded-lg flex items-center justify-center text-[#4ADE80] bg-[#4ADE80]/0 hover:bg-[#4ADE80]/20 hover:text-[#4ADE80] transition-all duration-200">
                          <FaEdit size={11} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-[#E6EDF3] text-lg font-bold mb-2">
                      {competency.title}
                    </h3>

                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 flex-1">
                      {competency.description}
                    </p>

                    <div className="pt-4 border-t border-[#1F2937]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#9CA3AF] text-xs font-mono uppercase tracking-wider">
                          Technologies
                        </span>
                        <span className="text-[#4ADE80] text-xs font-mono">
                          {tags.length}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {tags.slice(0, 6).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#4ADE80] border border-[#1F2937] hover:border-[#4ADE80]/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 6 && (
                          <span className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#9CA3AF] border border-[#1F2937]">
                            +{tags.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {competencies.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
              <FaCogs size={32} className="mx-auto text-[#374151] mb-3" />
              <p className="text-[#9CA3AF] text-sm mb-2">No competencies yet</p>
            </div>
          )}
        </div>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#E6EDF3]">
                Edit Competency
              </h3>
              <button
                onClick={handleCancel}
                className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] min-h-[120px] resize-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Expertise Level</label>
                <select
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] transition-all"
                  required
                >
                  <option value="">Select expertise level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Icon</label>
                <IconPicker
                  value={formData.icon}
                  onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                  label="Select an icon"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Manage Technologies</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                      placeholder="Add new technology..."
                      className="flex-1 px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" className="px-3">
                      <FaPlus size={12} />
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {currentTags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-mono bg-[#0D1117] px-3 py-1.5 rounded-md text-[#4ADE80] border border-[#1F2937] flex items-center gap-2 group"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9CA3AF] hover:text-red-400"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" onClick={handleCancel} variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Update Competency
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
