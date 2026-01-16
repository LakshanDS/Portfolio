import { ProjectsView } from "@/components/projects/ProjectsView";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsView initialProjects={projects} />;
}
