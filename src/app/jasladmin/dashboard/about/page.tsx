"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconPicker } from "@/components/ui/IconPicker";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";

export default function AdminAbout() {
  const [aboutCards, setAboutCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    iconColor: "",
    content: "",
    displayOrder: 0
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await fetch('/api/about-cards/manage');
        const result = await response.json();
        if (isMounted) {
          setAboutCards(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading about cards:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/about-cards/manage');
      const result = await response.json();
      setAboutCards(result);
    } catch (error) {
      console.error('Error loading about cards:', error);
    }
  };

  const handleEdit = (card: any) => {
    setFormData({
      title: card.title,
      icon: card.icon,
      iconColor: card.iconColor,
      content: card.content,
      displayOrder: card.displayOrder
    });
    setIsEditing(card.id);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      icon: "",
      iconColor: "",
      content: "",
      displayOrder: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing) return;

    try {
      await fetch('/api/about-cards/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: isEditing, ...formData })
      });

      handleCancel();
      await loadData();
    } catch (error) {
      console.error('Error saving about card:', error);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#E6EDF3] mb-1">About Section</h1>
        <p className="text-[#9CA3AF] text-sm">Manage the About section displayed on your portfolio</p>
      </div>

      {isEditing && (
        <Card className="p-6 bg-[#111827] border border-[#1F2937]">
          <h2 className="text-lg font-semibold text-[#E6EDF3] mb-4">
            Edit About Card
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-md text-[#E6EDF3] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] min-h-[120px]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IconPicker
                value={formData.icon}
                onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                label="Icon"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={handleCancel} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Card
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aboutCards.map((card) => (
          <Card key={card.id} className="p-6 bg-[#111827] border border-[#1F2937]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${card.iconColor}20`, color: card.iconColor }}>
                  <span className="text-xl">{card.icon}</span>
                </div>
                <h3 className="font-semibold text-[#E6EDF3]">{card.title}</h3>
              </div>
              <button onClick={() => handleEdit(card)} className="p-1.5 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] transition-all duration-200">
                <FaEdit size={11} />
              </button>
            </div>

            <p className="text-[#9CA3AF] leading-relaxed text-sm">
              {card.content}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
