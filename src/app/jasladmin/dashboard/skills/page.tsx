"use client";

import { useEffect, useState } from "react";
import { SkillCategory, Skill } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconPicker } from "@/components/ui/IconPicker";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaSave,
  FaExclamationTriangle,
  FaCode
} from "react-icons/fa";

export default function AdminSkills() {
  const [categories, setCategories] = useState<{ category: SkillCategory; skills: Skill[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; type: 'skill' | 'category' }>({
    isOpen: false,
    id: null,
    type: 'skill'
  });

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    categoryId: "",
    icon: "",
    displayOrder: 0
  });

  const [categoryForm, setCategoryForm] = useState<Partial<SkillCategory>>({
    name: "",
    icon: "",
    displayOrder: 0
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/skills/manage');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setIsEditing(skill.id);
    setIsAddingSkill(null);
    setIsAddingCategory(false);
  };

  const handleEditCategory = (category: SkillCategory) => {
    setCategoryForm(category);
    setIsEditing('cat-' + category.id);
    setIsAddingSkill(null);
    setIsAddingCategory(false);
  };

  const handleAddSkill = (categoryId: string) => {
    setFormData({ name: "", categoryId, icon: "", displayOrder: 0 });
    setIsAddingSkill(categoryId);
    setIsEditing(null);
    setIsAddingCategory(false);
  };

  const handleAddCategory = () => {
    setCategoryForm({ name: "", icon: "", displayOrder: 0 });
    setIsAddingCategory(true);
    setIsAddingSkill(null);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAddingSkill(null);
    setIsAddingCategory(false);
    setFormData({ name: "", categoryId: "", icon: "", displayOrder: 0 });
    setCategoryForm({ name: "", icon: "", displayOrder: 0 });
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing && !isEditing.toString().startsWith('cat-')) {
        response = await fetch('/api/skills/manage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'skill', id: isEditing, ...formData })
        });
      } else if (isAddingSkill) {
        response = await fetch('/api/skills/manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'skill', ...formData })
        });
      }

      if (response && !response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save skill');
        if (response.status === 404) {
          await loadData();
        }
        return;
      }

      handleCancel();
      await loadData();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('An error occurred while saving the skill');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing && isEditing.toString().startsWith('cat-')) {
        const categoryId = isEditing.toString().replace('cat-', '');
        response = await fetch('/api/skills/manage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'category', id: categoryId, ...categoryForm })
        });
      } else {
        response = await fetch('/api/skills/manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'category', ...categoryForm })
        });
      }

      if (response && !response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save category');
        if (response.status === 404) {
          await loadData();
        }
        return;
      }

      handleCancel();
      await loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('An error occurred while saving the category');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    setDeleteModal({ isOpen: true, id, type: 'skill' });
  };

  const handleDeleteCategory = async (id: string) => {
    setDeleteModal({ isOpen: true, id, type: 'category' });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await fetch(`/api/skills/manage?id=${deleteModal.id}&type=${deleteModal.type}`, { method: 'DELETE' });
        setDeleteModal({ isOpen: false, id: null, type: 'skill' });
        await loadData();
      } catch (error) {
        console.error(`Error deleting ${deleteModal.type}:`, error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null, type: 'skill' });
  };

  if (isLoading) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">Skills</h1>
          <p className="text-[#9CA3AF] text-sm">Manage your technical skills</p>
        </div>
        <Button onClick={handleAddCategory} className="gap-2">
          <FaPlus size={14} />
          Add Category
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
        <div className="p-5 overflow-y-auto flex-1">
          {categories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
              <FaCode size={32} className="mx-auto text-[#374151] mb-3" />
              <p className="text-[#9CA3AF] text-sm mb-2">No skill categories yet</p>
              <Button onClick={handleAddCategory} variant="primary" size="sm">
                <FaPlus size={12} className="mr-1" />
                Add First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((item) => (
                <div key={item.category.id} className="p-4 rounded-xl border bg-[#1F2937]/30 border-[#1F2937] hover:border-[#374151] transition-all duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="primary" className="font-mono text-sm">
                        {item.category.icon}
                      </Badge>
                      <h3 className="text-base font-semibold text-[#E6EDF3]">{item.category.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddSkill(item.category.id)} className="gap-2">
                        <FaPlus size={12} />
                        Add Skill
                      </Button>
                      <button
                        onClick={() => handleEditCategory(item.category)}
                        className="p-2 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200"
                        aria-label="Edit category"
                      >
                        <FaEdit size={14} />
                      </button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50" onClick={() => handleDeleteCategory(item.category.id)}>
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </div>

                  {item.skills.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {item.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] rounded-lg border border-[#1F2937] hover:border-[#4ADE80]/50 transition-colors group"
                        >
                          <span className="text-sm text-[#E6EDF3]">{skill.icon}</span>
                          <span className="text-sm text-[#E6EDF3] flex-1">{skill.name}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-1.5 rounded flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200"
                              aria-label="Edit skill"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-1.5 rounded flex items-center justify-center text-[#9CA3AF] hover:text-red-400"
                              aria-label="Delete skill"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9CA3AF] text-sm text-center py-6">No skills added yet</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {(isAddingCategory || (isEditing && isEditing.toString().startsWith('cat-'))) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#E6EDF3]">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label htmlFor="category-name" className="block text-xs font-medium text-[#9CA3AF] mb-1">Name</label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryForm.name || ""}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  required
                />
              </div>
              <IconPicker
                value={categoryForm.icon || ""}
                onChange={(iconName) => setCategoryForm({ ...categoryForm, icon: iconName })}
                label="Icon"
              />

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

      {(isAddingSkill || (isEditing && !isEditing.toString().startsWith('cat-'))) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#E6EDF3]">
                {isEditing ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-[#9CA3AF] hover:text-[#E6EDF3] transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div>
                <label htmlFor="skill-name" className="block text-xs font-medium text-[#9CA3AF] mb-1">Name</label>
                <input
                  id="skill-name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                  required
                />
              </div>
              <IconPicker
                value={formData.icon || ""}
                onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                label="Icon (Optional)"
              />

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
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-[#1F2937]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl shrink-0 border border-red-500/30">
                  <FaExclamationTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Delete {deleteModal.type === 'skill' ? 'Skill' : 'Category'}</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1">Are you sure you want to delete this {deleteModal.type === 'skill' ? 'skill' : 'category'}? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#0d1117]/50 flex justify-end gap-3">
              <Button onClick={cancelDelete} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
