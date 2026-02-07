import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import { Project, RoadmapItem } from '@/lib/types';

// Register Roboto Font
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  // LEFT COLUMN STYLES (Sidebar)
  leftColumn: {
    width: '30%',
    backgroundColor: '#f4f6f8',
    padding: 15, // Keep basic padding for top/bottom
    paddingLeft: 30, // Increased left margin
    paddingRight: 10, // Slight right spacing
    paddingTop: 30,
    minHeight: '100%',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: 'cover',
    borderWidth: 3,
    borderColor: '#137fec',
  },
  leftSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a2332',
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 2,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 7,
    color: '#666',
    marginBottom: 1,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 8,
    color: '#333',
    lineHeight: 1.3,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#137fec',
    marginTop: 6,
    marginBottom: 3,
  },
  skillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  skillTag: {
    fontSize: 7,
    color: '#444',
    backgroundColor: '#e2e8f0',
    padding: '2 5',
    borderRadius: 3,
  },

  // RIGHT COLUMN STYLES (Main Content)
  rightColumn: {
    width: '70%',
    padding: 20, // Basic padding
    paddingRight: 40, // More margin on the right
    paddingLeft: 25, // Gap from sidebar
    paddingTop: 35,
  },
  headerSection: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#137fec',
    paddingBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2332',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    color: '#137fec',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#137fec', // Changed to BLUE
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Removed sectionTitleUnderline
  summaryText: {
    fontSize: 9,
    textAlign: 'justify',
    lineHeight: 1.5,
    color: '#444',
  },

  // Content Items
  itemContainer: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a2332',
  },
  itemDate: {
    fontSize: 8,
    color: '#137fec',
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 8.5,
    color: '#444',
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  bulletPoint: {
    fontSize: 8.5,
    color: '#444',
    marginBottom: 2,
    paddingLeft: 8,
  },

  // Project specifics
  projectLink: {
    fontSize: 8,
    color: '#137fec',
    textDecoration: 'none',
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  projectTag: {
    fontSize: 7,
    color: '#666',
    backgroundColor: '#f0f4f8',
    padding: '2 5',
    borderRadius: 3,
  },
});

interface ResumeProps {
  profile: {
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
  };
  experience: {
    title: string;
    company?: string;
    date: string;
    description: string;
    keyPoints?: string[];
  }[];
  education: {
    school: string;
    degree: string;
    date: string;
    details?: string[];
    keyPoints?: string[];
  }[];
  projects: Project[];
  skills?: {
    category: { name: string };
    skills: { name: string }[];
  }[];
  roadmap?: RoadmapItem[];
  baseUrl?: string;
}

const calculateAge = (dob?: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

type SocialPlatform = 'linkedin' | 'github';

const getSocialHandle = (url?: string, platform?: SocialPlatform) => {
  if (!url) return null;

  const extractFromPath = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return null;

    if (platform === 'linkedin') {
      const sections = ['in', 'company', 'school', 'pub'];
      if (sections.includes(parts[0]) && parts[1]) {
        return parts[1];
      }
      return parts[parts.length - 1];
    }

    if (platform === 'github') {
      return parts[0] || parts[parts.length - 1];
    }

    return parts[parts.length - 1];
  };

  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(normalized);
    return extractFromPath(parsed.pathname);
  } catch {
    return extractFromPath(url);
  }
};

export const ResumeDocument = ({ profile, experience, education, projects, skills, roadmap, baseUrl }: ResumeProps) => {
  const age = calculateAge(profile.dateOfBirth);
  const linkedinHandle = getSocialHandle(profile.linkedinUrl, 'linkedin');
  const githubHandle = getSocialHandle(profile.githubUrl, 'github');
  const normalizeStatus = (status?: string) => {
    const normalized = (status ?? '').toString().trim().toLowerCase();
    if (normalized === 'archive') return 'archived';
    if (normalized === 'devloping') return 'developing';
    return normalized;
  };
  const liveProjects = projects.filter((project) => normalizeStatus(project.status) === 'live');
  const keyProjects = (liveProjects.length > 0 ? liveProjects : projects).slice(0, 3);
  const developingProjects = projects
    .filter((project) => normalizeStatus(project.status) === 'developing')
    .slice(0, 3);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* LEFT COLUMN (SIDEBAR) */}
        <View style={styles.leftColumn}>
          {/* Profile Image */}
          {profile.profileImage && (
            <View style={styles.profileImageContainer}>
              <Image src={profile.profileImage} style={styles.profileImage} />
            </View>
          )}

          {/* Personal Info */}
          <Text style={styles.leftSectionTitle}>Personal Info</Text>

          {profile.dateOfBirth && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{profile.dateOfBirth}</Text>
            </View>
          )}

          {age && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{age} years</Text>
            </View>
          )}

          {profile.gender && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profile.gender}</Text>
            </View>
          )}

          {/* Contact */}
          <Text style={styles.leftSectionTitle}>Contact</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
            <Text style={styles.infoValue}>{profile.phone2}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>

          {profile.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profile.address.split(',')[0]}</Text>
              <Text style={styles.infoValue}>{profile.address.split(',').slice(1).join(',')}</Text>
            </View>
          )}

          {profile.whatsappUrl && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>WhatsApp</Text>
              <Link src={profile.whatsappUrl} style={styles.infoValue}>
                {profile.whatsappUrl.split('/').pop()}
              </Link>
            </View>
          )}

          {profile.linkedinUrl && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>LinkedIn</Text>
              <Link src={profile.linkedinUrl} style={styles.infoValue}>
                {linkedinHandle || 'LinkedIn Profile'}
              </Link>
            </View>
          )}

          {profile.githubUrl && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GitHub</Text>
              <Link src={profile.githubUrl} style={styles.infoValue}>
                {githubHandle || 'GitHub Profile'}
              </Link>
            </View>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <>
              <Text style={styles.leftSectionTitle}>Skills</Text>
              {skills.map((cat, i) => (
                <View key={i} style={{ marginBottom: 10 }} wrap={false}>
                  <Text style={styles.skillCategoryTitle}>{cat.category.name}</Text>
                  <View style={styles.skillList}>
                    {cat.skills.map((skill, j) => (
                      <Text key={j} style={styles.skillTag}>{skill.name}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        {/* RIGHT COLUMN (MAIN CONTENT) */}
        <View style={styles.rightColumn}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.jobTitle}>{profile.title}</Text>
          </View>

          {/* Profile */}
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summaryText}>{profile.bio}</Text>
          </View>

          {/* key project */}
          {keyProjects.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Key Project</Text>
              {keyProjects.map((project, i) => (
                <View key={i} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{project.title}</Text>
                    {project.id && baseUrl && (
                      <Link src={`${baseUrl}/projects/${project.id}`} style={styles.projectLink}>See Doc</Link>
                    )}
                  </View>
                  <Text style={styles.itemDescription}>{project.description}</Text>
                  {project.tags && project.tags.length > 0 && (
                    <View style={styles.projectTags}>
                      {project.tags.slice(0, 5).map((tag, j) => (
                        <Text key={j} style={styles.projectTag}>{tag}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* developing projects */}
          {developingProjects.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Developing Projects</Text>
              {developingProjects.map((project, i) => (
                <View key={i} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{project.title}</Text>
                    {project.id && baseUrl && (
                      <Link src={`${baseUrl}/projects/${project.id}`} style={styles.projectLink}>See Doc</Link>
                    )}
                  </View>
                  <Text style={styles.itemDescription}>{project.description}</Text>
                  {project.tags && project.tags.length > 0 && (
                    <View style={styles.projectTags}>
                      {project.tags.slice(0, 5).map((tag, j) => (
                        <Text key={j} style={styles.projectTag}>{tag}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Roadmap / Focus */}
          {roadmap && roadmap.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Current Focus</Text>
              {roadmap.map((item, i) => (
                <View key={i} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={{ ...styles.itemDate, textTransform: 'capitalize' }}>
                      {item.status.replace('-', ' ')}
                    </Text>
                  </View>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.itemDate}>{edu.date}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.degree}</Text>
                {edu.details && edu.details.map((detail, j) => (
                  <Text key={j} style={styles.itemDescription}>{detail}</Text>
                ))}
              </View>
            ))}
          </View>

          {/* Experience */}
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemDate}>{exp.date}</Text>
                </View>
                {exp.company && <Text style={styles.itemSubtitle}>{exp.company}</Text>}
                <Text style={styles.itemDescription}>{exp.description}</Text>
                {exp.keyPoints && exp.keyPoints.map((point, j) => (
                  <Text key={j} style={styles.bulletPoint}>• {point}</Text>
                ))}
              </View>
            ))}
          </View>

        </View>
      </Page>
    </Document>
  );
};
