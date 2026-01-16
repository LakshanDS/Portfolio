"use client";

import { useEffect, useState } from "react";
import { RoadmapItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaMapSigns,
  FaSave,
  FaUndo,
  FaToggleOn,
  FaToggleOff,
  FaHeading,
  FaAlignLeft,
  FaTerminal,
  FaQuoteLeft,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

interface RoadmapSettings {
  selfCommitBadge: {
    enabled: boolean;
    text: string;
  };
  hero: {
    title: string;
    description: string;
  };
  terminalText: string[];
  philosophyText: string;
}

const defaultSettings: RoadmapSettings = {
  selfCommitBadge: {
    enabled: true,
    text: "Self Commit 2024-2025"
  },
  hero: {
    title: "Building The Future, || One Pipeline at a Time",
    description: "A visual timeline of my professional growth, technical milestones, and future aspirations in the world of DevOps, Cloud Engineering, and Automation."
  },
  terminalText: [
    "$ git add .",
    "$ git commit -m \"self upgrade init\"",
    "[main 3f32d] self upgrade init",
    "Commit successful",
    "self improved"
  ],
  philosophyText: "I believe in automating everything that needs to be done more than once. My goal is to build systems that are self-healing, scalable, and secure by default."
};

export default function AdminRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [settings, setSettings] = useState<RoadmapSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [formData, setFormData] = useState<Partial<RoadmapItem>>({
    title: "",
    description: "",
    date: "",
    category: "devops",
    status: "planned",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/roadmap/manage');
      const data = await response.json();
      setItems(data);

      const settingsResponse = await fetch('/api/roadmap-settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings({
          selfCommitBadge: settingsData.selfCommitBadge || defaultSettings.selfCommitBadge,
          hero: settingsData.hero || defaultSettings.hero,
          terminalText: settingsData.terminalText || defaultSettings.terminalText,
          philosophyText: settingsData.philosophyText || defaultSettings.philosophyText
        });
        setTerminalInput(settingsData.terminalText.join('\n'));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/roadmap-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setHasChanges(false);
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleResetSettings = () => {
    if (confirm('Reset to default settings?')) {
      setSettings(defaultSettings);
      setTerminalInput(defaultSettings.terminalText.join('\n'));
      setHasChanges(true);
    }
  };

  const handleEdit = (item: RoadmapItem) => {
    setFormData(item);
    setIsEditing(item.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({
      title: "",
      description: "",
      date: "",
      category: "devops",
      status: "planned",
      tags: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch('/api/roadmap/manage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: isEditing, ...formData })
        });
      } else {
        await fetch('/api/roadmap/manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      handleCancel();
      await loadItems();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await fetch(`/api/roadmap/manage?id=${deleteModal.id}`, { method: 'DELETE' });
        setDeleteModal({ isOpen: false, id: null });
        await loadItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  if (isLoading && items.length === 0) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">Roadmap Settings</h1>
          <p className="text-[#9CA3AF] text-sm">Configure roadmap page and manage timeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetSettings} className="flex items-center gap-2">
            <FaUndo size={12} />
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={!hasChanges} className="flex items-center gap-2">
            <FaSave size={12} />
            {hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl">
          <div className="p-5 border-b border-[#1F2937]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 rounded-xl text-[#4ADE80] shadow-lg">
                <FaMapSigns size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#E6EDF3]">Page Settings</h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Configure page content</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1F2937]/30 rounded-xl border border-[#1F2937]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSettings({ ...settings, selfCommitBadge: { ...settings.selfCommitBadge!, enabled: !settings.selfCommitBadge?.enabled } });
                    setHasChanges(true);
                  }}
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${settings.selfCommitBadge?.enabled
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/30'
                    : 'bg-[#6B7280]/20 text-[#6B7280] hover:bg-[#6B7280]/30'
                    }`}
                >
                  {settings.selfCommitBadge?.enabled ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                </button>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${settings.selfCommitBadge?.enabled ? 'text-[#E6EDF3]' : 'text-[#6B7280]'}`}>Self Commit Badge</h3>
                  <p className={`text-[11px] ${settings.selfCommitBadge?.enabled ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>Show commitment badge</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaHeading size={11} className="text-[#4ADE80]" />
                Page Title
              </label>
              <textarea
                value={settings.hero.title}
                onChange={(e) => {
                  setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[60px] transition-all"
                placeholder="Building The Future, || One Pipeline at a Time"
              />
              <p className="text-[10px] text-[#6B7280]">Use || to separate text. The part after will be highlighted in green.</p>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaAlignLeft size={11} className="text-[#4ADE80]" />
                Page Description
              </label>
              <textarea
                value={settings.hero.description}
                onChange={(e) => {
                  setSettings({ ...settings, hero: { ...settings.hero, description: e.target.value } });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[150px] transition-all"
                placeholder="Enter page description"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaTerminal size={11} className="text-[#4ADE80]" />
                Terminal Text (One per line)
              </label>
              <textarea
                value={terminalInput}
                onChange={(e) => {
                  setTerminalInput(e.target.value);
                  setSettings({ ...settings, terminalText: e.target.value.split('\n').filter(line => line.trim()) });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[120px] font-mono text-xs transition-all"
                placeholder="$ git status"
              />
              <p className="text-[10px] text-[#6B7280]">Each line will be a separate terminal line</p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-[#1F2937]">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaQuoteLeft size={11} className="text-[#4ADE80]" />
                What&apos;s Next Philosophy
              </label>
              <textarea
                value={settings.philosophyText}
                onChange={(e) => {
                  setSettings({ ...settings, philosophyText: e.target.value });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[100px] italic transition-all"
                placeholder="Enter philosophy text"
              />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
            <div className="p-5 border-b border-[#1F2937] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 rounded-xl text-[#4ADE80] shadow-lg">
                    <FaMapSigns size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#E6EDF3]">Roadmap Items</h2>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{items.length} items in timeline</p>
                  </div>
                </div>
                <Button onClick={() => setIsAdding(true)} className="gap-2">
                  <FaPlus size={14} />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <div key={item.id} className={`group p-4 rounded-xl border transition-all duration-200 ${item.status === 'completed'
                    ? 'bg-[#1F2937]/30 border-[#1F2937] hover:bg-[#1F2937]/50 hover:border-[#374151]'
                    : item.status === 'in-progress'
                      ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 hover:bg-[#4ADE80]/20'
                      : 'bg-[#0d1117]/50 border-[#1F2937]/30 hover:bg-[#1F2937]/30'
                    }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold mb-1 ${item.status === 'completed' ? 'text-[#E6EDF3]' :
                          item.status === 'in-progress' ? 'text-[#4ADE80]' : 'text-[#6B7280]'
                          }`}>{item.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#9CA3AF]">{item.date}</span>
                          <Badge variant="outline" className="text-[10px] py-0">
                            {item.category}
                          </Badge>
                          <Badge variant={item.status === 'completed' ? 'success' : item.status === 'in-progress' ? 'primary' : 'ghost'} className="text-[10px] py-0">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200"
                        >
                          <FaEdit size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="ghost" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="ghost" className="text-[10px]">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
                  <FaMapSigns size={32} className="mx-auto text-[#374151] mb-3" />
                  <p className="text-[#9CA3AF] text-sm mb-2">No roadmap items yet</p>
                  <Button onClick={() => setIsAdding(true)} variant="primary" size="sm">
                    <FaPlus size={12} className="mr-1" />
                    Add Your First Item
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#E6EDF3]">
                {isEditing ? "Edit Roadmap Item" : "Add New Item"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Date / Quarter</label>
                  <input
                    type="text"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    placeholder="e.g. Q4 2024"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm resize-none min-h-[80px] transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Category</label>
                  <div className="relative">
                    <input
                      list="category-suggestions"
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                      placeholder="e.g. DevOps"
                    />
                    <datalist id="category-suggestions">
                      <option value="DevOps" />
                      <option value="Career" />
                      <option value="Learning" />
                      <option value="Goals" />
                      {Array.from(new Set(items.map(item => item.category))).map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Status</label>
                  <select
                    value={formData.status || "planned"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'in-progress' | 'planned' })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Press Enter to add tag"
                    className="flex-1 px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  />
                  <Button type="button" onClick={addTag} variant="primary" size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-[#9CA3AF]"
                      >
                        <FaTimes size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" onClick={handleCancel} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex items-center gap-2">
                  <FaSave size={12} />
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-[#1F2937]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl shrink-0">
                  <FaExclamationTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Delete Roadmap Item</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1">Are you sure you want to delete this roadmap item? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#0d1117]/50 flex justify-end gap-3">
              <Button onClick={cancelDelete} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
