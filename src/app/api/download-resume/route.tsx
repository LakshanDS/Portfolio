import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ResumeDocument } from '@/components/resume/ResumeDocument';
import { getProjects, getProfile, getEducation, getExperience, getAllSkills, getRoadmapItems } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import type { Education, Experience, RoadmapItem } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to convert image to base64
async function convertImageToBase64(imagePath: string | undefined): Promise<string | undefined> {
  if (!imagePath) return undefined;

  try {
    // Remove leading slash if present
    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Construct absolute path to the public folder
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    console.log('Converting image to base64:', absolutePath);

    // Read the file
    const imageBuffer = await fs.readFile(absolutePath);

    // Convert to base64
    const base64 = imageBuffer.toString('base64');

    // Determine MIME type based on file extension
    const ext = path.extname(relativePath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return undefined;
  }
}

export async function GET(request: Request) {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = Buffer.from(ip).toString('base64');

  console.log(`Resume downloaded by: ${userAgent} (${ipHash})`);

  try {
    const stats = await prisma.profileStats.findFirst();
    if (stats) {
      await prisma.profileStats.update({
        where: { id: stats.id },
        data: { resumeDownloads: { increment: 1 } }
      });
    } else {
      await prisma.profileStats.create({
        data: {
          pipelinesFixed: "0",
          projectsCount: 0,
          selfCommits: 0,
          experience: "0",
          resumeDownloads: 1
        }
      });
    }
  } catch (err) {
    console.error("Failed to update resume stats", err);
  }

  // Fetch data from database
  const [profile, allProjects, educationData, experienceData, allSkills, allRoadmapItems] = await Promise.all([
    getProfile(),
    getProjects(),
    getEducation(),
    getExperience(),
    getAllSkills(),
    getRoadmapItems(),
  ]);

  const projects = allProjects
    .filter((p: any) => p.status === 'live')
    .slice(0, 3); // Top 4 projects only

  // Filter roadmap items (e.g., in-progress or top priority)
  const roadmapItems = allRoadmapItems
    .filter((item: RoadmapItem) => item.status === 'in-progress')
    .slice(0, 3); // Take top 3 items

  // Transform education data
  const education = educationData.map((edu: Education) => ({
    school: edu.institution,
    degree: edu.title,
    date: `${edu.startDate} - ${edu.endDate}`,
    details: edu.description ? [edu.description] : undefined,
    keyPoints: undefined, // Can be added later if needed
  }));

  // Transform experience data
  const experience = experienceData.map((exp: Experience) => ({
    title: exp.position,
    company: exp.company,
    date: exp.isCurrent ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
    description: exp.description,
    keyPoints: undefined, // Can be added later if needed
  }));

  // Log the image path for debugging
  console.log('Original profileImage path:', profile?.profileImage);

  // Convert profile image to base64 for PDF rendering
  const profileImageBase64 = await convertImageToBase64(profile?.profileImage ?? undefined);
  console.log('Converted profileImage to base64:', profileImageBase64 ? 'Success' : 'Failed/Not available');

  // Use profile data from database or fallback to defaults
  // Convert null values to undefined to match ResumeDocument props type
  const profileData: {
    name: string;
    nickname?: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    phone2?: string;
    dateOfBirth?: string;
    nic?: string;
    gender?: string;
    address?: string;
    profileImage?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    whatsappUrl?: string;
  } = profile ? {
    name: profile.name,
    nickname: profile.nickname ?? undefined,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone,
    phone2: profile.phone2 ?? undefined,
    dateOfBirth: profile.dateOfBirth ?? undefined,
    nic: profile.nic ?? undefined,
    gender: profile.gender ?? undefined,
    address: profile.address ?? undefined,
    profileImage: profileImageBase64,
    githubUrl: profile.githubUrl ?? undefined,
    linkedinUrl: profile.linkedinUrl ?? undefined,
    whatsappUrl: profile.whatsappUrl ?? undefined,
  } : {
      name: "J Avindu Lakshan De Silva",
      title: "DevOps Engineer & Full Stack Developer",
      bio: "I'm Lakshan — an automation-focused DevOps engineer with a fixer's mindset. At my core, I'm someone who can't ignore broken things. If a service throws a warning, I want to know why. If something fails, my instinct is to trace it, understand it and make sure it doesn't fail the same way again. I value speed with control, not panic-driven changes.",
      email: "lakshandesilva112@gmail.com",
      phone: "+94717678199",
      address: "4C1, Ballawila, Kosmulla, Neluwa, Galle. 80082",
    };

  const resumeDocument = (
    <ResumeDocument
      profile={profileData}
      projects={projects}
      experience={experience}
      education={education}
      skills={allSkills}
      roadmap={roadmapItems}
    />
  );

  try {
    const stream = await renderToStream(resumeDocument);

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lakshan-desilva-resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
