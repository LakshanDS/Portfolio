"use client";

import { useEffect, useState } from "react";
import { Profile, ProfileStats } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [statsData, setStatsData] = useState<Partial<ProfileStats>>({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/profile/manage');
        const data = await response.json();
        
        if (isMounted) {
          setProfile(data.profile);
          setStats(data.stats);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = () => {
    if (profile) {
      setFormData(profile);
    }
    if (stats) {
      setStatsData(stats);
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setStatsData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetch('/api/profile/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile?.id,
          statsId: stats?.id,
          profileData: formData,
          statsData
        })
      });
      
      handleCancel();
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="text-[#9CA3AF] text-sm animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-[#E6EDF3] mb-1">Profile</h1>
          <p className="text-[#9CA3AF] text-sm">Manage your profile information</p>
        </div>
        {!isEditing && (
          <Button variant="primary" size="sm" onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <Card className="p-4 bg-[#111827] border border-[#1F2937]">
            <h2 className="text-sm font-semibold text-[#E6EDF3] mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#9CA3AF] mb-1">Name</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.name}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Title</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.title}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[#9CA3AF] mb-1">Bio</p>
                <p className="text-[#E6EDF3]">{profile?.bio}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#111827] border border-[#1F2937]">
            <h2 className="text-sm font-semibold text-[#E6EDF3] mb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {profile?.nickname && (
                <div>
                  <p className="text-[#9CA3AF] mb-1">Nickname</p>
                  <p className="text-[#E6EDF3] font-medium">{profile.nickname}</p>
                </div>
              )}
              {profile?.dateOfBirth && (
                <div>
                  <p className="text-[#9CA3AF] mb-1">Date of Birth</p>
                  <p className="text-[#E6EDF3] font-medium">{profile.dateOfBirth}</p>
                </div>
              )}
              {profile?.nic && (
                <div>
                  <p className="text-[#9CA3AF] mb-1">NIC</p>
                  <p className="text-[#E6EDF3] font-medium">{profile.nic}</p>
                </div>
              )}
              {profile?.gender && (
                <div>
                  <p className="text-[#9CA3AF] mb-1">Gender</p>
                  <p className="text-[#E6EDF3] font-medium">{profile.gender}</p>
                </div>
              )}
              {profile?.address && (
                <div className="md:col-span-2">
                  <p className="text-[#9CA3AF] mb-1">Address</p>
                  <p className="text-[#E6EDF3] font-medium">{profile.address}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-[#111827] border border-[#1F2937]">
            <h2 className="text-sm font-semibold text-[#E6EDF3] mb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#9CA3AF] mb-1">Email</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Phone</p>
                <p className="text-[#E6EDF3] font-medium">
                  {profile?.phone}
                  {profile?.phone2 && ` / ${profile.phone2}`}
                </p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Phone 2 (Optional)</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.phone2 || '-'}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">GitHub</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.githubUrl}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">LinkedIn</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.linkedinUrl}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">WhatsApp URL</p>
                <p className="text-[#E6EDF3] font-medium">{profile?.whatsappUrl || '-'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#111827] border border-[#1F2937]">
            <h2 className="text-sm font-semibold text-[#E6EDF3] mb-3">Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#9CA3AF] mb-1">Pipelines Fixed</p>
                <p className="text-[#E6EDF3] font-medium">{stats?.pipelinesFixed}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Projects Count</p>
                <p className="text-[#E6EDF3] font-medium">{stats?.projectsCount}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Self Commits</p>
                <p className="text-[#E6EDF3] font-medium">{stats?.selfCommits}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] mb-1">Experience</p>
                <p className="text-[#E6EDF3] font-medium">{stats?.experience}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-5 bg-[#111827] border border-[#1F2937]">
          <h2 className="text-sm font-semibold text-[#E6EDF3] mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-medium text-[#9CA3AF] block">Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs font-medium text-[#9CA3AF] block">Title</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="bio" className="text-xs font-medium text-[#9CA3AF] block">Bio</label>
                <textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm h-20 focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
            </div>

            <h3 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider pt-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nickname" className="text-xs font-medium text-[#9CA3AF] block">Nickname</label>
                <input
                  id="nickname"
                  type="text"
                  value={formData.nickname || ""}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-xs font-medium text-[#9CA3AF] block">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="nic" className="text-xs font-medium text-[#9CA3AF] block">NIC</label>
                <input
                  id="nic"
                  type="text"
                  value={formData.nic || ""}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-xs font-medium text-[#9CA3AF] block">Gender</label>
                <select
                  id="gender"
                  value={formData.gender || ""}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="address" className="text-xs font-medium text-[#9CA3AF] block">Address</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="profileImage" className="text-xs font-medium text-[#9CA3AF] block">Profile Image URL</label>
                <input
                  id="profileImage"
                  type="text"
                  value={formData.profileImage || ""}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  placeholder="/myself.jpeg"
                />
              </div>
            </div>

            <h3 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider pt-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium text-[#9CA3AF] block">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-medium text-[#9CA3AF] block">Phone 1</label>
                <input
                  id="phone"
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone2" className="text-xs font-medium text-[#9CA3AF] block">Phone 2 (Optional)</label>
                <input
                  id="phone2"
                  type="text"
                  value={formData.phone2 || ""}
                  onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="github_url" className="text-xs font-medium text-[#9CA3AF] block">GitHub URL</label>
                <input
                  id="github_url"
                  type="url"
                  value={formData.githubUrl || ""}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="linkedin_url" className="text-xs font-medium text-[#9CA3AF] block">LinkedIn URL</label>
                <input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="whatsapp_url" className="text-xs font-medium text-[#9CA3AF] block">WhatsApp URL</label>
                <input
                  id="whatsapp_url"
                  type="url"
                  value={formData.whatsappUrl || ""}
                  onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  placeholder="https://wa.me/..."
                />
              </div>
            </div>

            <h3 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider pt-2">Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="pipelines_fixed" className="text-xs font-medium text-[#9CA3AF] block">Pipelines Fixed</label>
                <input
                  id="pipelines_fixed"
                  type="text"
                  value={statsData.pipelinesFixed || ""}
                  onChange={(e) => setStatsData({ ...statsData, pipelinesFixed: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="projects_count" className="text-xs font-medium text-[#9CA3AF] block">Projects Count</label>
                <input
                  id="projects_count"
                  type="number"
                  value={statsData.projectsCount || 0}
                  onChange={(e) => setStatsData({ ...statsData, projectsCount: parseInt(e.target.value) })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="self_commits" className="text-xs font-medium text-[#9CA3AF] block">Self Commits</label>
                <input
                  id="self_commits"
                  type="number"
                  value={statsData.selfCommits || 0}
                  onChange={(e) => setStatsData({ ...statsData, selfCommits: parseInt(e.target.value) })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="experience" className="text-xs font-medium text-[#9CA3AF] block">Experience</label>
                <input
                  id="experience"
                  type="text"
                  value={statsData.experience || ""}
                  onChange={(e) => setStatsData({ ...statsData, experience: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F2937] rounded p-2 text-[#E6EDF3] text-sm focus:border-[#4ADE80] outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
