import { prisma } from "./prisma";
import type { Project, RoadmapItem, SkillCategory, Skill, Education, Experience, AboutCard, CoreCompetency } from "@prisma/client";

interface HomepageSettings {
  hero: {
    title: string;
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

interface AboutSettings {
  sections: any;
  hero: {
    profileImage: string;
    availabilityBadge: {
      enabled: boolean;
      text: string;
    };
    terminalBio: string[];
  };
  stats: any[];
  buttons: any;
  letsConnect: any;
}

export async function getHomepageSettings() {
  try {
    const row = await prisma.cmsSettings.findUnique({
      where: { id: "default" },
      select: { homepage: true },
    });

    return (row?.homepage as unknown as HomepageSettings) ?? null;
  } catch (error) {
    console.warn("Error fetching homepage settings:", error);
    return null;
  }
}

export async function getAboutSettings() {
  try {
    const row = await prisma.cmsSettings.findUnique({
      where: { id: "default" },
      select: { about: true },
    });

    return (row?.about as unknown as AboutSettings) ?? null;
  } catch (error) {
    console.warn("Error fetching about settings:", error);
    return null;
  }
}

export async function createProject(data: {
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: "live" | "developing" | "archived";
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  content?: string;
}) {
  const project = await prisma.project.create({
    data: {
      ...data,
      tags: JSON.stringify(data.tags),
    },
  });
  return { ...project, tags: JSON.parse(project.tags) };
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return null;
    return { ...project, tags: JSON.parse(project.tags) };
  } catch (error) {
    console.warn("Error fetching project:", error);
    return null;
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany();

    const sortedProjects = projects
      .map((p: Project) => ({ ...p, tags: JSON.parse(p.tags) }))
      .sort((a: Project & { tags: string[] }, b: Project & { tags: string[] }) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    return sortedProjects;
  } catch (error) {
    console.warn("Error fetching projects:", error);
    return [];
  }
}

export async function updateProject(id: string, data: any) {
  const updates: any = {};

  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.category !== undefined) updates.category = data.category;
  if (data.tags !== undefined) updates.tags = JSON.stringify(data.tags);
  if (data.status !== undefined) updates.status = data.status;
  if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl;
  if (data.demoUrl !== undefined) updates.demoUrl = data.demoUrl;
  if (data.repoUrl !== undefined) updates.repoUrl = data.repoUrl;
  if (data.content !== undefined) updates.content = data.content;

  const project = await prisma.project.update({ where: { id }, data: updates });
  return { ...project, tags: JSON.parse(project.tags) };
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
}

export async function createRoadmapItem(data: {
  title: string;
  description: string;
  date: string;
  category: string;
  status: "completed" | "in-progress" | "planned";
  tags: string[];
}) {
  const item = await prisma.roadmapItem.create({
    data: {
      ...data,
      tags: JSON.stringify(data.tags),
    },
  });
  return { ...item, tags: JSON.parse(item.tags) };
}

export async function getRoadmapItem(id: string) {
  try {
    const item = await prisma.roadmapItem.findUnique({ where: { id } });
    if (!item) return null;
    return { ...item, tags: JSON.parse(item.tags) };
  } catch (error) {
    console.warn("Error fetching roadmap item:", error);
    return null;
  }
}

export async function getRoadmapItems() {
  try {
    const items = await prisma.roadmapItem.findMany();

    const statusPriority: Record<string, number> = {
      planned: 0,
      "in-progress": 1,
      completed: 2,
    };

    const sortedItems = items
      .map((r: RoadmapItem) => ({ ...r, tags: JSON.parse(r.tags) }))
      .sort((a: RoadmapItem & { tags: string[] }, b: RoadmapItem & { tags: string[] }) => {
        const priorityDiff =
          statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;

        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

    return sortedItems;
  } catch (error) {
    console.warn("Error fetching roadmap items:", error);
    return [];
  }
}

export async function updateRoadmapItem(id: string, data: any) {
  const updates: any = {};

  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.date !== undefined) updates.date = data.date;
  if (data.category !== undefined) updates.category = data.category;
  if (data.status !== undefined) updates.status = data.status;
  if (data.tags !== undefined) updates.tags = JSON.stringify(data.tags);

  const item = await prisma.roadmapItem.update({
    where: { id },
    data: updates,
  });
  return { ...item, tags: JSON.parse(item.tags) };
}

export async function deleteRoadmapItem(id: string) {
  await prisma.roadmapItem.delete({ where: { id } });
}

export async function getProfileStatus() {
  try {
    const status = await prisma.profileStatus.findFirst();
    if (!status) return null;
    return {
      ...status,
      isOpenToWork: Boolean(status.isOpenToWork),
    };
  } catch (error) {
    console.warn("Error fetching profile status:", error);
    return null;
  }
}

export async function updateProfileStatus(id: string, data: any) {
  const updates: any = {};

  if (data.isOpenToWork !== undefined) updates.isOpenToWork = data.isOpenToWork;
  if (data.statusMessage !== undefined)
    updates.statusMessage = data.statusMessage;
  if (data.githubUsername !== undefined)
    updates.githubUsername = data.githubUsername;

  return await prisma.profileStatus.update({ where: { id }, data: updates });
}

export async function getProfile() {
  return await prisma.profile.findFirst();
}

export async function updateProfile(id: string, data: any) {
  const updates: any = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.nickname !== undefined) updates.nickname = data.nickname;
  if (data.title !== undefined) updates.title = data.title;
  if (data.bio !== undefined) updates.bio = data.bio;
  if (data.email !== undefined) updates.email = data.email;
  if (data.email2 !== undefined) updates.email2 = data.email2;
  if (data.phone !== undefined) updates.phone = data.phone;
  if (data.phone2 !== undefined) updates.phone2 = data.phone2;
  if (data.dateOfBirth !== undefined) updates.dateOfBirth = data.dateOfBirth;
  if (data.nic !== undefined) updates.nic = data.nic;
  if (data.address !== undefined) updates.address = data.address;
  if (data.githubUrl !== undefined) updates.githubUrl = data.githubUrl;
  if (data.linkedinUrl !== undefined) updates.linkedinUrl = data.linkedinUrl;
  if (data.whatsappUrl !== undefined) updates.whatsappUrl = data.whatsappUrl;
  if (data.gender !== undefined) updates.gender = data.gender;

  return await prisma.profile.update({ where: { id }, data: updates });
}

export async function getSkillCategories() {
  try {
    return await prisma.skillCategory.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.warn("Error fetching skill categories:", error);
    return [];
  }
}

export async function createSkillCategory(data: {
  name: string;
  icon: string;
  displayOrder: number;
}) {
  return await prisma.skillCategory.create({ data });
}

export async function updateSkillCategory(id: string, data: any) {
  const existingCategory = await prisma.skillCategory.findUnique({
    where: { id },
  });
  if (!existingCategory) {
    throw new Error(`Skill category with id ${id} not found`);
  }

  const updates: any = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.icon !== undefined) updates.icon = data.icon;
  if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;

  return await prisma.skillCategory.update({ where: { id }, data: updates });
}

export async function deleteSkillCategory(id: string) {
  await prisma.skillCategory.delete({ where: { id } });
}

export async function createSkill(data: {
  categoryId: string;
  name: string;
  icon?: string;
  iconColor?: string;
  displayOrder: number;
}) {
  return await prisma.skill.create({ data });
}

export async function updateSkill(id: string, data: any) {
  const existingSkill = await prisma.skill.findUnique({ where: { id } });
  if (!existingSkill) {
    throw new Error(`Skill with id ${id} not found`);
  }

  const updates: any = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.icon !== undefined) updates.icon = data.icon;
  if (data.iconColor !== undefined) updates.iconColor = data.iconColor;
  if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;

  return await prisma.skill.update({ where: { id }, data: updates });
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({ where: { id } });
}

export async function getAllSkills() {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: { skills: { orderBy: { displayOrder: "asc" } } },
    });

    return categories.map((category: SkillCategory & { skills: Skill[] }) => ({
      category,
      skills: category.skills,
    }));
  } catch (error) {
    console.warn("Error fetching all skills:", error);
    return [];
  }
}

export async function createEducation(data: {
  institution: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  displayOrder: number;
}) {
  return await prisma.education.create({ data });
}

export async function updateEducation(id: string, data: any) {
  const updates: any = {};

  if (data.institution !== undefined) updates.institution = data.institution;
  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.startDate !== undefined) updates.startDate = data.startDate;
  if (data.endDate !== undefined) updates.endDate = data.endDate;
  if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;

  return await prisma.education.update({ where: { id }, data: updates });
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({ where: { id } });
}

export async function getEducation() {
  return await prisma.education.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function createExperience(data: {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}) {
  return await prisma.experience.create({ data });
}

export async function updateExperience(id: string, data: any) {
  const updates: any = {};

  if (data.company !== undefined) updates.company = data.company;
  if (data.position !== undefined) updates.position = data.position;
  if (data.description !== undefined) updates.description = data.description;
  if (data.startDate !== undefined) updates.startDate = data.startDate;
  if (data.endDate !== undefined) updates.endDate = data.endDate;
  if (data.isCurrent !== undefined) updates.isCurrent = data.isCurrent;

  return await prisma.experience.update({ where: { id }, data: updates });
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
}

export async function getExperience() {
  try {
    return await prisma.experience.findMany({ orderBy: { startDate: "desc" } });
  } catch (error) {
    console.warn("Error fetching experience:", error);
    return [];
  }
}

export async function getProfileStats() {
  return await prisma.profileStats.findFirst();
}

export async function updateProfileStats(id: string, data: any) {
  const updates: any = {};

  if (data.pipelinesFixed !== undefined)
    updates.pipelinesFixed = data.pipelinesFixed;
  if (data.projectsCount !== undefined)
    updates.projectsCount = data.projectsCount;
  if (data.selfCommits !== undefined) updates.selfCommits = data.selfCommits;
  if (data.experience !== undefined) updates.experience = data.experience;

  return await prisma.profileStats.update({ where: { id }, data: updates });
}

export async function createAboutCard(data: {
  title: string;
  icon: string;
  iconColor: string;
  content: string;
  displayOrder: number;
}) {
  return await prisma.aboutCard.create({ data });
}

export async function updateAboutCard(id: string, data: any) {
  const updates: any = {};

  if (data.title !== undefined) updates.title = data.title;
  if (data.icon !== undefined) updates.icon = data.icon;
  if (data.iconColor !== undefined) updates.iconColor = data.iconColor;
  if (data.content !== undefined) updates.content = data.content;
  if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;

  return await prisma.aboutCard.update({ where: { id }, data: updates });
}

export async function deleteAboutCard(id: string) {
  await prisma.aboutCard.delete({ where: { id } });
}

export async function getAboutCards() {
  return await prisma.aboutCard.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function getRoadmapStats() {
  try {
    const [completed, inProgress] = await Promise.all([
      prisma.roadmapItem.count({ where: { status: "completed" } }),
      prisma.roadmapItem.count({ where: { status: "in-progress" } }),
    ]);

    return {
      completed,
      inProgress,
    };
  } catch (error) {
    console.warn("Error fetching roadmap stats:", error);
    return { completed: 0, inProgress: 0 };
  }
}

export async function getProjectsByCategory(category: string) {
  const allProjects = await getProjects();
  if (category === "All") {
    return allProjects;
  }
  return allProjects.filter((p: Project & { tags: string[] }) => p.category === category);
}

export async function getProjectById(id: string) {
  return await getProject(id);
}

export async function getRoadmapByCategory(category: string) {
  const allRoadmap = await getRoadmapItems();
  if (category === "All") {
    return allRoadmap;
  }
  return allRoadmap.filter((r: RoadmapItem & { tags: string[] }) => r.category === category);
}

export async function getRoadmapById(id: string) {
  return await getRoadmapItem(id);
}

export async function getAllSkillsWithCategories() {
  return await getAllSkills();
}

export async function getEducationById(id: string) {
  const all = await getEducation();
  return all.find((e: Education) => e.id === id) || null;
}

export async function getExperienceById(id: string) {
  const all = await getExperience();
  return all.find((e: Experience) => e.id === id) || null;
}

export async function getAboutCardById(id: string) {
  const all = await getAboutCards();
  return all.find((c: AboutCard) => c.id === id) || null;
}

export async function getSkillCategoriesWithSkills() {
  try {
    return await prisma.skillCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: { skills: { orderBy: { displayOrder: "asc" } } },
    });
  } catch (error) {
    console.warn("Error fetching skill categories with skills:", error);
    return [];
  }
}

export async function getCoreCompetencies() {
  try {
    return await prisma.coreCompetency.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.warn("Error fetching core competencies:", error);
    return [];
  }
}

export async function getCoreCompetencyById(id: string) {
  const all = await getCoreCompetencies();
  return all.find((c: CoreCompetency) => c.id === id) || null;
}
