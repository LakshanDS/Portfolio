import { getSkillCategoriesWithSkills } from "@/lib/data";

export async function ToolsOfTrade() {
  const categories = await getSkillCategoriesWithSkills();
  const allSkills = categories.flatMap(cat => cat.skills);

  const toolLogos = [
    { name: 'Ansible', icon: '🔧' },
    { name: 'Jenkins', icon: '🚀' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Kubernetes', icon: '☸️' },
    { name: 'Grafana', icon: '📊' },
    { name: 'Prometheus', icon: '🔥' },
    { name: 'Azure', icon: '☁️' },
    { name: 'AWS', icon: '🛡️' },
    { name: 'Terraform', icon: '🏗️' },
    { name: 'Git', icon: '📦' },
    { name: 'Python', icon: '🐍' },
    { name: 'Bash', icon: '⌨️' },
  ];

  const duplicatedTools = [...toolLogos, ...toolLogos];

  return (
    <section className="w-full overflow-hidden py-8 bg-[#0D1117]/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-[#0B0F14] to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-[#0B0F14] to-transparent z-10"></div>
          <div className="flex animate-marquee whitespace-nowrap gap-12 py-6 items-center">
            {[...duplicatedTools, ...duplicatedTools].map((tool, index) => (
              <div
                key={`${tool.name}-${index}`}
                className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="text-base font-semibold text-[#9CA3AF]">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
