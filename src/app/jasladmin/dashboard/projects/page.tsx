"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaTimes,
  FaFolderOpen,
  FaSave,
  FaUndo,
  FaToggleOn,
  FaToggleOff,
  FaHeading,
  FaAlignLeft,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

interface ProjectsSettings {
  hero: {
    title: string;
    tagline: string;
  };
  statusBadge: {
    enabled: boolean;
    status: 'operational' | 'non-operational';
  };
  cta: {
    enabled: boolean;
  };
}

const defaultSettings: ProjectsSettings = {
  hero: {
    title: "Engineering Projects",
    tagline: "A curated collection of infrastructure automation, CI/CD pipelines, and cloud-native applications designed for scale."
  },
  statusBadge: {
    enabled: true,
    status: 'operational'
  },
  cta: {
    enabled: true
  }
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<ProjectsSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    category: "Cloud",
    tags: [],
    status: "live",
    imageUrl: "",
    demoUrl: "",
    repoUrl: "",
    content: ""
  });

  const [tagInput, setTagInput] = useState("");

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
      
      const settingsResponse = await fetch('/api/projects-settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings({
          hero: settingsData.hero || defaultSettings.hero,
          statusBadge: settingsData.statusBadge || defaultSettings.statusBadge,
          cta: settingsData.cta || defaultSettings.cta
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/projects-settings', {
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
      setHasChanges(true);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setIsEditing(project.id);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({
      title: "",
      description: "",
      category: "Cloud",
      tags: [],
      status: "live",
      imageUrl: "",
      demoUrl: "",
      repoUrl: "",
      content: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch(`/api/projects/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/projects/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      handleCancel();
      await loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await fetch(`/api/projects/${deleteModal.id}`, { method: 'DELETE' });
        setDeleteModal({ isOpen: false, id: null });
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(tag => tag !== tagToRemove) || [] });
  };

  if (isLoading && projects.length === 0) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">Projects Settings</h1>
          <p className="text-[#9CA3AF] text-sm">Configure projects page and manage portfolio</p>
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
                <FaFolderOpen size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#E6EDF3]">Page Settings</h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Configure page content</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaHeading size={11} className="text-[#4ADE80]" />
                Page Title
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) => {
                  setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm transition-all"
                placeholder="Enter page title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#E6EDF3]">
                <FaAlignLeft size={11} className="text-[#4ADE80]" />
                Tagline
              </label>
              <textarea
                value={settings.hero.tagline}
                onChange={(e) => {
                  setSettings({ ...settings, hero: { ...settings.hero, tagline: e.target.value } });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] text-sm resize-none min-h-[80px] transition-all"
                placeholder="Enter page tagline"
              />
            </div>

            <div className="pt-3 border-t border-[#1F2937] space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1F2937]/30 rounded-xl border border-[#1F2937]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSettings({ ...settings, cta: { ...settings.cta, enabled: !settings.cta.enabled } });
                      setHasChanges(true);
                    }}
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      settings.cta?.enabled 
                        ? 'bg-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/30' 
                        : 'bg-[#6B7280]/20 text-[#6B7280] hover:bg-[#6B7280]/30'
                    }`}
                  >
                    {settings.cta?.enabled ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold ${settings.cta?.enabled ? 'text-[#E6EDF3]' : 'text-[#6B7280]'}`}>Call to Action</h3>
                    <p className={`text-[11px] ${settings.cta?.enabled ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>Show CTA section</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
            <div className="p-5 border-b border-[#1F2937] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 rounded-xl text-[#4ADE80] shadow-lg">
                    <FaFolderOpen size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#E6EDF3]">Projects</h2>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{projects.length} projects in portfolio</p>
                  </div>
                </div>
                <Button onClick={() => setIsAdding(true)} className="gap-2">
                  <FaPlus size={14} />
                  Add Project
                </Button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.map((project) => (
                  <div key={project.id} className={`group p-4 rounded-xl border transition-all duration-200 ${
                    project.status === 'live' 
                      ? 'bg-[#1F2937]/30 border-[#1F2937] hover:bg-[#1F2937]/50 hover:border-[#374151]' 
                      : project.status === 'developing'
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 hover:bg-[#3B82F6]/20'
                      : 'bg-[#0d1117]/50 border-[#1F2937]/30 hover:bg-[#1F2937]/30'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold mb-1 ${
                          project.status === 'live' ? 'text-[#E6EDF3]' : 
                          project.status === 'developing' ? 'text-[#60A5FA]' : 'text-[#6B7280]'
                        }`}>{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {project.category}
                          </Badge>
                          <Badge variant={project.status === 'live' ? 'success' : project.status === 'developing' ? 'primary' : 'ghost'} className="text-[10px]">
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200"
                        >
                          <FaEdit size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mb-3 line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="ghost" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="ghost" className="text-[10px]">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={project.demoUrl || "#"} 
                        target="_blank" 
                        rel={project.demoUrl ? "noopener noreferrer" : "nofollow"}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          project.demoUrl 
                            ? 'bg-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/30 hover:shadow-lg hover:shadow-[#4ADE80]/20' 
                            : 'bg-[#374151]/20 text-[#6B7280] cursor-not-allowed'
                        }`}
                      >
                        <FaExternalLinkAlt size={9} />
                        Demo
                      </a>
                      <a 
                        href={project.repoUrl || "#"} 
                        target="_blank" 
                        rel={project.repoUrl ? "noopener noreferrer" : "nofollow"}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          project.repoUrl 
                            ? 'bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 hover:shadow-lg hover:shadow-[#3B82F6]/20' 
                            : 'bg-[#374151]/20 text-[#6B7280] cursor-not-allowed'
                        }`}
                      >
                        <FaExternalLinkAlt size={9} />
                        Repo
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
                  <FaFolderOpen size={32} className="mx-auto text-[#374151] mb-3" />
                  <p className="text-[#9CA3AF] text-sm mb-2">No projects yet</p>
                  <Button onClick={() => setIsAdding(true)} variant="primary" size="sm">
                    <FaPlus size={12} className="mr-1" />
                    Add Your First Project
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
                {isEditing ? "Edit Project" : "Add New Project"}
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
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Category</label>
                  <select
                    value={formData.category || "Cloud"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  >
                    <option value="Cloud">Cloud</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Status</label>
                  <select
                    value={formData.status || "live"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'live' | 'developing' | 'archived' })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  >
                    <option value="live">Live</option>
                    <option value="developing">Developing</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.displayOrder || 999}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 999 })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    placeholder="999 (default)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={formData.repoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Press Enter to add tag"
                    className="flex-1 px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  />
                  <Button type="button" onClick={handleAddTag} variant="primary" size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-[#9CA3AF]"
                      >
                        <FaTimes size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Content (Markdown)</label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm resize-none min-h-[120px] font-mono transition-all"
                />
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
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Delete Project</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1">Are you sure you want to delete this project? This action cannot be undone.</p>
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
