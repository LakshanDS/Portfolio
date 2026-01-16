import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { promises as fs } from "fs";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function readJsonFromRoot(filename: string) {
  const filePath = path.join(process.cwd(), filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function main() {
  console.log("🌱 Starting database seeding...");

  console.log("⚙️ Seeding CMS Settings...");

  const homepageSettings = {
    hero: {
      title: "root@portfolio: Hi, I'm Lakshan!",
      tagline: "DevOps Engineer & Cloud Architect",
      description:
        "I bridge the gap between development and operations to deliver reliable software faster. Specialist in Ubuntu, Oracle, GitHub, GCP, and AWS.",
      primaryButtonText: "View Projects",
      primaryButtonLink: "/projects",
      secondaryButtonText: "Contact Me",
      secondaryButtonLink: "/about#contact",
      imageUrl: "/myself.jpeg",
    },
    sections: {
      toolsOfTrade: {
        enabled: true,
        title: "Tools of Trade",
        subtitle: "Technologies & Platforms",
      },
      competencies: {
        enabled: true,
        title: "Core Competencies",
        subtitle: "Key Areas of Expertise",
      },
      roadmap: {
        enabled: true,
        title: "Development Journey",
        subtitle: "Career Progression",
      },
      projects: {
        enabled: true,
        title: "Featured Work",
        subtitle: "Latest Deployments",
      },
      cta: {
        enabled: true,
        title: "Let's Build Something Together",
        subtitle:
          "I am currently open to new opportunities and collaborations. Check out my full project portfolio or reach out directly.",
      },
    },
  };
  const aboutSettings = {
    sections: {
      hero: { enabled: true, title: "About Me" },
      stats: { enabled: true, title: "Stats" },
      aboutMe: { enabled: true, title: "About Me" },
      skills: { enabled: true, title: "Skills & Expertise" },
      education: { enabled: true, title: "Education" },
      experience: { enabled: true, title: "Experience" },
      letsConnect: { enabled: true, title: "Let's Connect" },
    },
    hero: {
      profileImage: "/myself.jpeg",
      availabilityBadge: {
        enabled: true,
        text: "Available for Work",
      },
      terminalBio: [
        "$ whoami",
        "> DevOps Engineer | Cloud Specialist | Automation Expert",
        "$ cat philosophy.txt",
        "> I don't ignore broken things. I fix them.",
        "$ systemctl status my-mindset",
        "> ● Active: Fixer mode | Automation: enabled | Learning: 24/7",
      ],
    },
    stats: [
      {
        enabled: true,
        label: "Pipelines Fixed",
        value: "100+",
        icon: "FaCogs",
      },
      { enabled: true, label: "Projects", value: "7", icon: "FaFolder" },
      { enabled: true, label: "Self Commits", value: "15", icon: "FaGitAlt" },
      { enabled: true, label: "Experience", value: "2+", icon: "FaClock" },
    ],
    buttons: {
      downloadResume: {
        enabled: true,
        text: "Download Resume",
        link: "/api/download-resume",
      },
      seeRoadmap: {
        enabled: true,
        text: "See My Roadmap",
        link: "/roadmap",
      },
    },
    letsConnect: {
      email: { enabled: true, address: "lakshandesilva112@gmail.com" },
      linkedin: {
        enabled: true,
        address: "https://linkedin.com/in/lakshandesilva",
      },
      github: { enabled: true, address: "https://github.com/lakshanDS" },
      whatsapp: { enabled: true, address: "https://wa.me/+94717678199" },
    },
  };
  const roadmapSettings = {
    selfCommitBadge: {
      enabled: true,
      text: "Self Commit 2024-2025",
    },
    hero: {
      title: "Building The Future, || One Pipeline at a Time",
      description:
        "A visual timeline of my professional growth, technical milestones, and future aspirations in the world of DevOps, Cloud Engineering, and Automation.",
    },
    terminalText: [
      "$ git add .",
      '$ git commit -m "self upgrade init"',
      "[main 3f32d] self upgrade init",
      "Commit successful",
      "self improved",
    ],
    philosophyText:
      "I believe in automating everything that needs to be done more than once. My goal is to build systems that are self-healing, scalable, and secure by default.",
  };
  const projectsSettings = {};

  await prisma.cmsSettings.upsert({
    where: { id: "default" },
    update: {
      homepage: homepageSettings,
      about: aboutSettings,
      roadmap: roadmapSettings,
      projects: projectsSettings,
    },
    create: {
      id: "default",
      homepage: homepageSettings,
      about: aboutSettings,
      roadmap: roadmapSettings,
      projects: projectsSettings,
    },
  });

  console.log("📦 Seeding Profile...");
  await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "J Avindu Lakshan De Silva",
      nickname: "lakshan",
      title: "Junior DevOps & Cloud Engineer",
      bio: "Passionate developer with expertise in building scalable applications and managing cloud infrastructure. Specialized in React, Next.js, and modern DevOps practices.",
      email: "lakshandesilva112@gmail.com",
      email2: "lakshandesilva@proton.me",
      phone: "+94717678199",
      phone2: "+94787678199",
      dateOfBirth: "2000-04-02",
      nic: "200009300429",
      gender: "Male",
      address: "4C1, Ballawila, Kosmulla, Neluwa, Galle. zip 80082",
      profileImage: "/myself.jpeg",
      githubUrl: "https://github.com/lakshanDS",
      linkedinUrl: "https://linkedin.com/in/lakshandesilva",
      whatsappUrl: "https://wa.me/+94717678199",
    },
  });

  console.log("📊 Seeding Profile Status...");
  await prisma.profileStatus.upsert({
    where: { id: "default-status" },
    update: {},
    create: {
      id: "default-status",
      isOpenToWork: true,
      statusMessage: "Available for Work",
      githubUsername: "LakshanDS",
    },
  });

  console.log("📈 Seeding Profile Stats...");
  await prisma.profileStats.upsert({
    where: { id: "default-stats" },
    update: {},
    create: {
      id: "default-stats",
      pipelinesFixed: "100+",
      projectsCount: 7,
      selfCommits: 500,
      experience: "2+",
      resumeDownloads: 0,
    },
  });

  console.log("🎓 Seeding Education...");
  const educationData = [
    {
      id: "edu-1",
      institution: "NELUWA NATIONAL SCHOOL",
      title: "G.C.E. ADVANCED LEVEL (Technology Stream with IT)",
      description:
        "Technology Stream with Information and Communication Technology",
      startDate: "2017",
      endDate: "2019",
      displayOrder: 1,
    },
    {
      id: "edu-2",
      institution: "NELUWA NATIONAL SCHOOL",
      title: "G.C.E. ORDINARY LEVEL",
      description:
        "Ordinary Level with 9 subjects including Mathematics, Geography, and Design Technology",
      startDate: "2011",
      endDate: "2016",
      displayOrder: 2,
    },
    {
      id: "edu-3",
      institution: "ACTIVE TECH NETWORKS",
      title: "DIPLOMA IN NETWORKING",
      description: "Networking fundamentals and infrastructure management",
      startDate: "2021",
      endDate: "2023",
      displayOrder: 3,
    },
  ];

  for (const edu of educationData) {
    await prisma.education.upsert({
      where: { id: edu.id },
      update: edu,
      create: edu,
    });
  }

  console.log("💼 Seeding Experience...");
  await prisma.experience.upsert({
    where: { id: "exp-1" },
    update: {},
    create: {
      id: "exp-1",
      company: "Self-employed",
      position: "FREELANCE GRAPHIC DESIGNER AND DEVELOPER",
      description:
        "Working as a freelance graphic designer and developer, creating responsive web applications and visual designs for clients worldwide.",
      startDate: "2021",
      endDate: "Present",
      isCurrent: true,
    },
  });

  console.log("🎯 Seeding Skill Categories...");
  const skillCategories = [
    {
      id: "cat-devops",
      name: "DevOps & Cloud",
      icon: "FaCloud",
      displayOrder: 1,
    },
    {
      id: "cat-frontend",
      name: "Frontend Development",
      icon: "FaCode",
      displayOrder: 2,
    },
    {
      id: "cat-backend",
      name: "Backend Development",
      icon: "FaServer",
      displayOrder: 3,
    },
    {
      id: "cat-tools",
      name: "Tools & Technologies",
      icon: "FaTools",
      displayOrder: 4,
    },
  ];

  for (const category of skillCategories) {
    await prisma.skillCategory.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  console.log("⚡ Seeding Skills...");
  const skills = [
    {
      id: "skill-1",
      categoryId: "cat-devops",
      name: "AWS",
      icon: "SiAmazon",
      iconColor: "#FF9900",
      displayOrder: 1,
    },
    {
      id: "skill-2",
      categoryId: "cat-devops",
      name: "Docker",
      icon: "SiDocker",
      iconColor: "#2496ED",
      displayOrder: 2,
    },
    {
      id: "skill-3",
      categoryId: "cat-devops",
      name: "Kubernetes",
      icon: "SiKubernetes",
      iconColor: "#326CE5",
      displayOrder: 3,
    },
    {
      id: "skill-4",
      categoryId: "cat-devops",
      name: "GitLab CI/CD",
      icon: "SiGitlab",
      iconColor: "#FC6D26",
      displayOrder: 4,
    },
    {
      id: "skill-5",
      categoryId: "cat-devops",
      name: "Terraform",
      icon: "SiTerraform",
      iconColor: "#7B42BC",
      displayOrder: 5,
    },
    {
      id: "skill-6",
      categoryId: "cat-frontend",
      name: "React",
      icon: "SiReact",
      iconColor: "#61DAFB",
      displayOrder: 1,
    },
    {
      id: "skill-7",
      categoryId: "cat-frontend",
      name: "Next.js",
      icon: "SiNextdotjs",
      iconColor: "#000000",
      displayOrder: 2,
    },
    {
      id: "skill-8",
      categoryId: "cat-frontend",
      name: "TypeScript",
      icon: "SiTypescript",
      iconColor: "#3178C6",
      displayOrder: 3,
    },
    {
      id: "skill-9",
      categoryId: "cat-frontend",
      name: "Tailwind CSS",
      icon: "SiTailwindcss",
      iconColor: "#06B6D4",
      displayOrder: 4,
    },
    {
      id: "skill-10",
      categoryId: "cat-backend",
      name: "Node.js",
      icon: "SiNodedotjs",
      iconColor: "#339933",
      displayOrder: 1,
    },
    {
      id: "skill-11",
      categoryId: "cat-backend",
      name: "Python",
      icon: "SiPython",
      iconColor: "#3776AB",
      displayOrder: 2,
    },
    {
      id: "skill-12",
      categoryId: "cat-backend",
      name: "PostgreSQL",
      icon: "SiPostgresql",
      iconColor: "#4169E1",
      displayOrder: 3,
    },
    {
      id: "skill-13",
      categoryId: "cat-backend",
      name: "Prisma",
      icon: "SiPrisma",
      iconColor: "#2D3748",
      displayOrder: 4,
    },
    {
      id: "skill-14",
      categoryId: "cat-tools",
      name: "Git",
      icon: "FaGitAlt",
      iconColor: "#F05032",
      displayOrder: 1,
    },
    {
      id: "skill-15",
      categoryId: "cat-tools",
      name: "VS Code",
      icon: "SiVisualstudiocode",
      iconColor: "#007ACC",
      displayOrder: 2,
    },
    {
      id: "skill-16",
      categoryId: "cat-tools",
      name: "Linux",
      icon: "SiLinux",
      iconColor: "#FCC624",
      displayOrder: 3,
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: skill,
      create: skill,
    });
  }

  console.log("💡 Seeding Core Competencies...");
  const coreCompetencies = [
    {
      id: "cc-1",
      title: "Cloud & DevOps Mastery",
      description:
        "Expertise in designing, deploying, and managing cloud infrastructure with a focus on automation and scalability. Proficient in AWS, Docker, Kubernetes, and Infrastructure as Code.",
      expertise: "Expert",
      tags: JSON.stringify([
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "CI/CD",
      ]),
      icon: "FaCloud",
      categoryId: "cat-devops",
      displayOrder: 1,
    },
    {
      id: "cc-2",
      title: "CI/CD Pipeline Architect",
      description:
        "Building and optimizing continuous integration and deployment pipelines using GitLab CI, Jenkins, and modern DevOps tools. Reducing deployment time and improving reliability.",
      expertise: "Expert",
      tags: JSON.stringify(["GitLab", "Jenkins", "Automation", "CI/CD"]),
      icon: "FaCogs",
      categoryId: "cat-devops",
      displayOrder: 2,
    },
    {
      id: "cc-3",
      title: "Full-Stack Development",
      description:
        "Creating responsive, modern web applications using React, Next.js, TypeScript, and cutting-edge frontend frameworks. Building scalable backend systems with Node.js and databases.",
      expertise: "Advanced",
      tags: JSON.stringify([
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Prisma",
      ]),
      icon: "FaCode",
      categoryId: "cat-frontend",
      displayOrder: 3,
    },
  ];

  for (const competency of coreCompetencies) {
    await prisma.coreCompetency.upsert({
      where: { id: competency.id },
      update: competency,
      create: competency,
    });
  }

  console.log("📄 Seeding About Cards...");
  const aboutCards = [
    {
      id: "card-1",
      title: "Problem Solver",
      icon: "FaLightbulb",
      iconColor: "#FDB813",
      content:
        "I thrive on solving complex technical challenges and finding elegant solutions to difficult problems. Every obstacle is an opportunity to learn and grow.",
      displayOrder: 1,
    },
    {
      id: "card-2",
      title: "Team Collaboration",
      icon: "FaUsers",
      iconColor: "#4ADE80",
      content:
        "Strong believer in teamwork and open communication. I enjoy mentoring junior developers and learning from experienced colleagues.",
      displayOrder: 2,
    },
    {
      id: "card-3",
      title: "Continuous Learning",
      icon: "FaBook",
      iconColor: "#60A5FA",
      content:
        "Technology evolves rapidly, and I'm committed to staying current with the latest tools, frameworks, and best practices in software development.",
      displayOrder: 3,
    },
    {
      id: "card-4",
      title: "Quality Focused",
      icon: "FaCheckCircle",
      iconColor: "#A78BFA",
      content:
        "Dedicated to writing clean, maintainable code with comprehensive testing. Quality and reliability are at the core of everything I build.",
      displayOrder: 4,
    },
  ];

  for (const card of aboutCards) {
    await prisma.aboutCard.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
  }

  console.log("🚀 Seeding Projects...");
  const projects = [
    {
      id: "proj-1",
      title: "Cloud Infrastructure Manager",
      description:
        "A comprehensive dashboard for managing AWS and GCP resources with automated scaling and cost optimization features.",
      category: "Cloud",
      tags: JSON.stringify(["AWS", "GCP", "Docker", "Kubernetes", "Terraform"]),
      status: "live",
      imageUrl:
        "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop",
      demoUrl: "https://demo.example.com/cloud-manager",
      repoUrl: "https://github.com/example/cloud-manager",
      displayOrder: 1,
      content: `# Cloud Infrastructure Manager

A powerful dashboard for managing cloud resources across multiple providers.

## Features

- Multi-cloud support (AWS, GCP)
- Automated scaling based on metrics
- Cost optimization recommendations
- Real-time monitoring and alerts
- Infrastructure as Code integration

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Cloud**: AWS SDK, Google Cloud SDK
- **Infrastructure**: Terraform, Docker`,
    },
    {
      id: "proj-2",
      title: "DevOps Pipeline Automation",
      description:
        "CI/CD pipeline builder that streamlines deployment workflows with GitLab integration and automated testing.",
      category: "DevOps",
      tags: JSON.stringify(["CI/CD", "GitLab", "Jenkins", "Docker", "Bash"]),
      status: "live",
      imageUrl:
        "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=800&h=600&fit=crop",
      demoUrl: "https://demo.example.com/devops-pipeline",
      repoUrl: "https://github.com/example/devops-pipeline",
      displayOrder: 2,
      content: `# DevOps Pipeline Automation

Automate your CI/CD workflows with this powerful pipeline builder.

## Features

- Visual pipeline designer
- GitLab & GitHub integration
- Automated testing frameworks
- One-click deployments
- Rollback capabilities
- Pipeline templates

## Tech Stack

- **CI/CD**: GitLab CI, Jenkins
- **Containers**: Docker, Kubernetes
- **Automation**: Bash, Python
- **Monitoring**: Prometheus, Grafana`,
    },
    {
      id: "proj-3",
      title: "Kubernetes Cluster Manager",
      description:
        "Multi-cluster management tool for monitoring and deploying containerized applications with Helm support.",
      category: "Infrastructure",
      tags: JSON.stringify([
        "Kubernetes",
        "Helm",
        "Docker",
        "Prometheus",
        "Grafana",
      ]),
      status: "live",
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      demoUrl: "https://demo.example.com/k8s-manager",
      repoUrl: "https://github.com/example/k8s-manager",
      displayOrder: 3,
      content: `# Kubernetes Cluster Manager

Manage multiple Kubernetes clusters from a single interface.

## Features

- Multi-cluster management
- Helm chart repository
- Real-time pod monitoring
- Auto-scaling policies
- Resource usage analytics
- GitOps workflows

## Tech Stack

- **Language**: Go
- **Orchestration**: Kubernetes API
- **Monitoring**: Prometheus, Grafana
- **Deployment**: Helm, ArgoCD
- **Container**: Docker`,
    },
    {
      id: "proj-4",
      title: "Real-time Analytics Dashboard",
      description:
        "Data visualization platform with WebSocket streaming and customizable chart components for live metrics.",
      category: "Full Stack",
      tags: JSON.stringify(["React", "D3.js", "WebSocket", "Node.js", "Redis"]),
      status: "live",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      demoUrl: "https://demo.example.com/analytics-dashboard",
      repoUrl: "https://github.com/example/analytics-dashboard",
      displayOrder: 4,
      content: `# Real-time Analytics Dashboard

A powerful data visualization platform with real-time streaming capabilities.

## Features

- WebSocket streaming
- Customizable charts (D3.js)
- Multiple data sources
- Data export (CSV, JSON)
- Collaborative dashboards
- Real-time alerts

## Tech Stack

- **Frontend**: React, D3.js, TypeScript
- **Backend**: Node.js, Socket.io
- **Cache**: Redis
- **Database**: PostgreSQL, TimescaleDB
- **Infrastructure**: Docker, Nginx`,
    },
    {
      id: "proj-5",
      title: "Portfolio Management System",
      description:
        "Full-stack application for tracking and managing personal projects with analytics, SEO optimization, and admin panel.",
      category: "Full Stack",
      tags: JSON.stringify([
        "Next.js",
        "React",
        "Prisma",
        "TypeScript",
        "Tailwind",
      ]),
      status: "live",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      demoUrl: "https://demo.example.com/portfolio-manager",
      repoUrl: "https://github.com/example/portfolio-manager",
      displayOrder: 5,
      content: `# Portfolio Management System

A complete solution for managing your portfolio projects.

## Features

- Project tracking and categorization
- Analytics dashboard
- SEO optimization
- Responsive design
- Admin panel with authentication
- Markdown content editor
- Visitor analytics

## Tech Stack

- **Framework**: Next.js 14
- **ORM**: Prisma
- **Database**: SQLite (PostgreSQL ready)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel`,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }

  console.log("🗺️ Seeding Roadmap Items...");
  const roadmapItems = [
    {
      id: "road-1",
      title: "AWS Solutions Architect Certification",
      description:
        "Achieved professional certification in designing distributed systems and implementing AWS infrastructure.",
      date: "Q1 2024",
      category: "learning",
      tags: JSON.stringify(["AWS", "Cloud", "Certification"]),
      status: "completed",
    },
    {
      id: "road-2",
      title: "Kubernetes Cluster Deployment",
      description:
        "Successfully deployed and managed production Kubernetes clusters with high availability and auto-scaling.",
      date: "Q2 2024",
      category: "devops",
      tags: JSON.stringify(["Kubernetes", "Docker", "CI/CD", "Helm"]),
      status: "completed",
    },
    {
      id: "road-3",
      title: "CI/CD Pipeline Optimization",
      description:
        "Implemented GitLab CI/CD pipelines reducing deployment time by 60% and improving reliability.",
      date: "Q3 2024",
      category: "devops",
      tags: JSON.stringify(["GitLab", "CI/CD", "Jenkins", "Automation"]),
      status: "completed",
    },
    {
      id: "road-4",
      title: "Senior DevOps Engineer Promotion",
      description:
        "Promoted to Senior DevOps Engineer role, leading a team of 5 engineers and managing critical infrastructure.",
      date: "Q4 2024",
      category: "career",
      tags: JSON.stringify(["Leadership", "DevOps", "Team Management"]),
      status: "completed",
    },
    {
      id: "road-5",
      title: "Terraform Infrastructure as Code",
      description:
        "Migrated manual infrastructure provisioning to Terraform, achieving 100% IaC adoption across all environments.",
      date: "Q1 2025",
      category: "devops",
      tags: JSON.stringify([
        "Terraform",
        "IaC",
        "Infrastructure",
        "Automation",
      ]),
      status: "completed",
    },
    {
      id: "road-6",
      title: "Multi-Cloud Architecture Implementation",
      description:
        "Designing and implementing hybrid cloud strategy spanning AWS, GCP, and Azure for improved redundancy and performance.",
      date: "Q2 2025",
      category: "devops",
      tags: JSON.stringify([
        "Multi-Cloud",
        "AWS",
        "GCP",
        "Azure",
        "Architecture",
      ]),
      status: "in-progress",
    },
    {
      id: "road-7",
      title: "AI/ML Pipeline Integration",
      description:
        "Integrating machine learning models into CI/CD pipelines for automated testing, deployment, and model versioning.",
      date: "Q3 2025",
      category: "learning",
      tags: JSON.stringify(["AI/ML", "MLOps", "Python", "TensorFlow", "CI/CD"]),
      status: "planned",
    },
    {
      id: "road-8",
      title: "Open Source Contribution Goal",
      description:
        "Contributing to major open-source projects in the DevOps and cloud-native ecosystem, aiming for 100+ contributions.",
      date: "Q4 2025",
      category: "learning",
      tags: JSON.stringify(["Open Source", "Community", "Development"]),
      status: "planned",
    },
  ];

  for (const item of roadmapItems) {
    await prisma.roadmapItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("✅ Database seeding completed successfully!");
  console.log("📊 Summary:");

  const profileCount = await prisma.profile.count();
  const profileStatusCount = await prisma.profileStatus.count();
  const profileStatsCount = await prisma.profileStats.count();
  const educationCount = await prisma.education.count();
  const experienceCount = await prisma.experience.count();
  const skillCategoryCount = await prisma.skillCategory.count();
  const skillCount = await prisma.skill.count();
  const competencyCount = await prisma.coreCompetency.count();
  const aboutCardCount = await prisma.aboutCard.count();
  const projectCount = await prisma.project.count();
  const roadmapCount = await prisma.roadmapItem.count();

  console.log(`  - Profile: ${profileCount}`);
  console.log(`  - Profile Status: ${profileStatusCount}`);
  console.log(`  - Profile Stats: ${profileStatsCount}`);
  console.log(`  - Education: ${educationCount}`);
  console.log(`  - Experience: ${experienceCount}`);
  console.log(`  - Skill Categories: ${skillCategoryCount}`);
  console.log(`  - Skills: ${skillCount}`);
  console.log(`  - Core Competencies: ${competencyCount}`);
  console.log(`  - About Cards: ${aboutCardCount}`);
  console.log(`  - Projects: ${projectCount}`);
  console.log(`  - Roadmap Items: ${roadmapCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
