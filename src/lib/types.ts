export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'live' | 'developing' | 'archived' | string;
  imageUrl?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  content?: string | null;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'devops' | 'career' | 'learning' | 'goals' | string;
  status: 'completed' | 'in-progress' | 'planned' | string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileStatus {
  id: string;
  isOpenToWork: boolean;
  statusMessage: string;
  githubUsername: string;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  nickname?: string | null;
  title: string;
  bio: string;
  email: string;
  phone: string;
  phone2?: string | null;
  dateOfBirth?: string | null;
  nic?: string | null;
  gender?: string | null;
  address?: string | null;
  profileImage?: string | null;
  githubUrl: string;
  linkedinUrl: string;
  whatsappUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  icon?: string | null;
  iconColor?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileStats {
  id: string;
  pipelinesFixed: string;
  projectsCount: number;
  selfCommits: number;
  experience: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutCard {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  content: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
