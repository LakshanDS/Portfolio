"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  FaGraduationCap, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaTimes,
  FaSave,
  FaExclamationTriangle
} from "react-icons/fa";

export default function AdminEducation() {
  const [education, setEducation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [formData, setFormData] = useState({
    institution: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    displayOrder: 0
  });

  const loadEducation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/education/manage');
      const data = await response.json();
      setEducation(data);
    } catch (error) {
      console.error('Error loading education:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleEdit = (item: any) => {
    setFormData({
      institution: item.institution,
      title: item.title,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      displayOrder: item.displayOrder
    });
    setIsEditing(item.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({
      institution: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      displayOrder: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAdding) {
        await fetch('/api/education/manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else if (isEditing) {
        await fetch('/api/education/manage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: isEditing, ...formData })
        });
      }
      handleCancel();
      await loadEducation();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await fetch(`/api/education/manage?id=${deleteModal.id}`, {
          method: 'DELETE'
        });
        setDeleteModal({ isOpen: false, id: null });
        await loadEducation();
      } catch (error) {
        console.error('Error deleting education:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  if (isLoading) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-1">Education</h1>
          <p className="text-[#9CA3AF] text-sm">Manage your educational qualifications</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <FaPlus size={14} />
          Add Entry
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] shadow-xl flex flex-col max-h-[calc(100vh-180px)]">
        <div className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="group p-4 rounded-xl border bg-[#1F2937]/30 border-[#1F2937] hover:bg-[#1F2937]/50 hover:border-[#374151] transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#E6EDF3] mb-1">{edu.title}</h3>
                    <p className="text-[#4ADE80] text-xs font-medium">{edu.institution}</p>
                    <Badge variant="outline" className="text-[10px] mt-2">
                      {edu.startDate} - {edu.endDate}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="p-1.5 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200"
                    >
                      <FaEdit size={11} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="p-1.5 text-[#9CA3AF] hover:text-red-500 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>

          {education.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#374151] rounded-xl bg-[#111827]/20">
              <FaGraduationCap size={32} className="mx-auto text-[#374151] mb-3" />
              <p className="text-[#9CA3AF] text-sm mb-2">No education entries yet</p>
              <Button onClick={() => setIsAdding(true)} variant="primary" size="sm">
                <FaPlus size={12} className="mr-1" />
                Add First Entry
              </Button>
            </div>
          )}
        </div>
      </Card>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1F2937] rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#E6EDF3]">
                {isEditing ? "Edit Education" : "Add New Education"}
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
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Title / Qualification</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    placeholder="e.g. 2018"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm transition-all"
                    placeholder="e.g. 2022"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937]/50 border border-[#374151] rounded-lg text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 text-sm resize-none min-h-[100px] transition-all"
                  required
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
          <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-[#1F2937]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl shrink-0 border border-red-500/30">
                  <FaExclamationTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Delete Education Entry</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1">Are you sure you want to delete this education entry? This action cannot be undone.</p>
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
