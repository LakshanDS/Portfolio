import {
  FaCode, FaTools, FaRocket, FaLightbulb, FaCogs, FaHeart, FaUsers, FaCloud,
  FaDatabase, FaServer, FaNetworkWired, FaShieldAlt, FaBug, FaTerminal,
  FaChartLine, FaProjectDiagram, FaGitAlt, FaDocker, FaLinux, FaAws,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdCard,
  FaGraduationCap, FaBriefcase, FaCheckCircle, FaClock, FaFire, FaStar,
  FaGlobe, FaMobile, FaDesktop, FaLaptop, FaPalette, FaCamera, FaMusic,
  FaGamepad, FaBook, FaPencilAlt, FaFileAlt, FaFolder, FaHome, FaBuilding,
  FaCar, FaPlane, FaBicycle, FaCoffee, FaPizzaSlice, FaUtensils,
  FaShoppingCart, FaCreditCard, FaMoneyBill, FaChartBar, FaChartPie,
  FaBell, FaFlag, FaTag, FaTags, FaSearch, FaFilter, FaCog, FaWrench,
  FaDownload, FaUpload, FaShare, FaLink, FaLock, FaUnlock, FaKey,
  FaEye, FaEyeSlash, FaThumbsUp, FaThumbsDown, FaComment, FaComments
} from "react-icons/fa";


import {
  SiTypescript, SiNextdotjs, SiReact, SiNodedotjs, SiPython, SiPostgresql,
  SiRedis, SiKubernetes, SiDocker, SiGithub, SiGitlab, SiJenkins, SiTerraform,
  SiAnsible, SiPrometheus, SiGrafana, SiElasticsearch, SiNginx, SiApache,
  SiMongodb, SiMysql, SiGraphql, SiJavascript, SiHtml5, SiCss3, SiTailwindcss,
  SiVuedotjs, SiAngular, SiDjango, SiFlask, SiFastapi, SiExpress, SiNestjs,
  SiGooglecloud, SiLinux, SiUbuntu, SiDebian,
  SiRedhat, SiCentos, SiAndroid, SiApple, SiSlack,
  SiDiscord, SiTrello, SiJira, SiConfluence, SiNotion, SiFigma, SiSketch,
  SiAmazon
} from "react-icons/si";

export interface IconMetadata {
  name: string;
  displayName: string;
  category: string;
  component: React.ComponentType<{ className?: string }>;
}

export interface IconMapping {
  [key: string]: React.ComponentType<{ className?: string }>;
}

export const iconMetadata: IconMetadata[] = [
  { name: "FaCode", displayName: "Code", category: "Development", component: FaCode },
  { name: "FaTerminal", displayName: "Terminal", category: "Development", component: FaTerminal },
  { name: "FaBug", displayName: "Bug", category: "Development", component: FaBug },
  { name: "FaGitAlt", displayName: "Git", category: "Development", component: FaGitAlt },
  { name: "FaFileAlt", displayName: "File", category: "Development", component: FaFileAlt },
  { name: "FaFolder", displayName: "Folder", category: "Development", component: FaFolder },
  { name: "FaBook", displayName: "Book", category: "Development", component: FaBook },
  { name: "FaPencilAlt", displayName: "Pencil", category: "Development", component: FaPencilAlt },
  { name: "FaServer", displayName: "Server", category: "Infrastructure", component: FaServer },
  { name: "FaCloud", displayName: "Cloud", category: "Infrastructure", component: FaCloud },
  { name: "FaDatabase", displayName: "Database", category: "Infrastructure", component: FaDatabase },
  { name: "FaNetworkWired", displayName: "Network", category: "Infrastructure", component: FaNetworkWired },
  { name: "FaDocker", displayName: "Docker", category: "Infrastructure", component: FaDocker },
  { name: "FaLinux", displayName: "Linux", category: "Infrastructure", component: FaLinux },
  { name: "FaAws", displayName: "AWS", category: "Infrastructure", component: FaAws },
  { name: "FaShieldAlt", displayName: "Shield", category: "Infrastructure", component: FaShieldAlt },
  { name: "FaLock", displayName: "Lock", category: "Infrastructure", component: FaLock },
  { name: "FaUnlock", displayName: "Unlock", category: "Infrastructure", component: FaUnlock },
  { name: "FaKey", displayName: "Key", category: "Infrastructure", component: FaKey },
  { name: "FaTools", displayName: "Tools", category: "Tools", component: FaTools },
  { name: "FaCogs", displayName: "Cogs", category: "Tools", component: FaCogs },
  { name: "FaCog", displayName: "Cog", category: "Tools", component: FaCog },
  { name: "FaWrench", displayName: "Wrench", category: "Tools", component: FaWrench },
  { name: "FaFilter", displayName: "Filter", category: "Tools", component: FaFilter },
  { name: "FaSearch", displayName: "Search", category: "Tools", component: FaSearch },

  { name: "FaChartLine", displayName: "Chart Line", category: "Business", component: FaChartLine },
  { name: "FaChartBar", displayName: "Chart Bar", category: "Business", component: FaChartBar },
  { name: "FaChartPie", displayName: "Chart Pie", category: "Business", component: FaChartPie },
  { name: "FaProjectDiagram", displayName: "Project", category: "Business", component: FaProjectDiagram },
  { name: "FaBriefcase", displayName: "Briefcase", category: "Business", component: FaBriefcase },
  { name: "FaBuilding", displayName: "Building", category: "Business", component: FaBuilding },
  { name: "FaMoneyBill", displayName: "Money", category: "Business", component: FaMoneyBill },
  { name: "FaCreditCard", displayName: "Credit Card", category: "Business", component: FaCreditCard },
  { name: "FaShoppingCart", displayName: "Shopping Cart", category: "Business", component: FaShoppingCart },
  { name: "FaRocket", displayName: "Rocket", category: "UI", component: FaRocket },
  { name: "FaLightbulb", displayName: "Lightbulb", category: "UI", component: FaLightbulb },
  { name: "FaHeart", displayName: "Heart", category: "UI", component: FaHeart },
  { name: "FaStar", displayName: "Star", category: "UI", component: FaStar },
  { name: "FaFire", displayName: "Fire", category: "UI", component: FaFire },
  { name: "FaPalette", displayName: "Palette", category: "UI", component: FaPalette },
  { name: "FaCamera", displayName: "Camera", category: "UI", component: FaCamera },
  { name: "FaBell", displayName: "Bell", category: "UI", component: FaBell },
  { name: "FaFlag", displayName: "Flag", category: "UI", component: FaFlag },
  { name: "FaTag", displayName: "Tag", category: "UI", component: FaTag },
  { name: "FaTags", displayName: "Tags", category: "UI", component: FaTags },
  { name: "FaCheckCircle", displayName: "Check Circle", category: "UI", component: FaCheckCircle },
  { name: "FaClock", displayName: "Clock", category: "UI", component: FaClock },
  { name: "FaThumbsUp", displayName: "Thumbs Up", category: "UI", component: FaThumbsUp },
  { name: "FaThumbsDown", displayName: "Thumbs Down", category: "UI", component: FaThumbsDown },
  { name: "FaEye", displayName: "Eye", category: "UI", component: FaEye },
  { name: "FaEyeSlash", displayName: "Eye Slash", category: "UI", component: FaEyeSlash },
  { name: "FaUsers", displayName: "Users", category: "Social", component: FaUsers },
  { name: "FaUser", displayName: "User", category: "Social", component: FaUser },
  { name: "FaComment", displayName: "Comment", category: "Social", component: FaComment },
  { name: "FaComments", displayName: "Comments", category: "Social", component: FaComments },
  { name: "FaShare", displayName: "Share", category: "Social", component: FaShare },
  { name: "FaLink", displayName: "Link", category: "Social", component: FaLink },
  { name: "FaEnvelope", displayName: "Envelope", category: "Contact", component: FaEnvelope },
  { name: "FaPhone", displayName: "Phone", category: "Contact", component: FaPhone },
  { name: "FaMapMarkerAlt", displayName: "Map Marker", category: "Contact", component: FaMapMarkerAlt },
  { name: "FaGlobe", displayName: "Globe", category: "Contact", component: FaGlobe },
  { name: "FaGraduationCap", displayName: "Graduation Cap", category: "Education", component: FaGraduationCap },
  { name: "FaCalendarAlt", displayName: "Calendar", category: "Education", component: FaCalendarAlt },
  { name: "FaIdCard", displayName: "ID Card", category: "Education", component: FaIdCard },
  { name: "FaDesktop", displayName: "Desktop", category: "Devices", component: FaDesktop },
  { name: "FaLaptop", displayName: "Laptop", category: "Devices", component: FaLaptop },
  { name: "FaMobile", displayName: "Mobile", category: "Devices", component: FaMobile },
  { name: "FaHome", displayName: "Home", category: "Lifestyle", component: FaHome },
  { name: "FaCar", displayName: "Car", category: "Lifestyle", component: FaCar },
  { name: "FaPlane", displayName: "Plane", category: "Lifestyle", component: FaPlane },
  { name: "FaBicycle", displayName: "Bicycle", category: "Lifestyle", component: FaBicycle },
  { name: "FaCoffee", displayName: "Coffee", category: "Lifestyle", component: FaCoffee },
  { name: "FaPizzaSlice", displayName: "Pizza", category: "Lifestyle", component: FaPizzaSlice },
  { name: "FaUtensils", displayName: "Utensils", category: "Lifestyle", component: FaUtensils },
  { name: "FaMusic", displayName: "Music", category: "Lifestyle", component: FaMusic },
  { name: "FaGamepad", displayName: "Gamepad", category: "Lifestyle", component: FaGamepad },
  { name: "FaDownload", displayName: "Download", category: "Actions", component: FaDownload },
  { name: "FaUpload", displayName: "Upload", category: "Actions", component: FaUpload },
  { name: "SiTypescript", displayName: "TypeScript", category: "Brands", component: SiTypescript },
  { name: "SiJavascript", displayName: "JavaScript", category: "Brands", component: SiJavascript },
  { name: "SiReact", displayName: "React", category: "Brands", component: SiReact },
  { name: "SiNextdotjs", displayName: "Next.js", category: "Brands", component: SiNextdotjs },
  { name: "SiVuedotjs", displayName: "Vue.js", category: "Brands", component: SiVuedotjs },
  { name: "SiAngular", displayName: "Angular", category: "Brands", component: SiAngular },
  { name: "SiNodedotjs", displayName: "Node.js", category: "Brands", component: SiNodedotjs },
  { name: "SiPython", displayName: "Python", category: "Brands", component: SiPython },
  { name: "SiDjango", displayName: "Django", category: "Brands", component: SiDjango },
  { name: "SiFlask", displayName: "Flask", category: "Brands", component: SiFlask },
  { name: "SiFastapi", displayName: "FastAPI", category: "Brands", component: SiFastapi },
  { name: "SiExpress", displayName: "Express", category: "Brands", component: SiExpress },
  { name: "SiNestjs", displayName: "NestJS", category: "Brands", component: SiNestjs },
  { name: "SiHtml5", displayName: "HTML5", category: "Brands", component: SiHtml5 },
  { name: "SiCss3", displayName: "CSS3", category: "Brands", component: SiCss3 },
  { name: "SiTailwindcss", displayName: "Tailwind CSS", category: "Brands", component: SiTailwindcss },
  { name: "SiPostgresql", displayName: "PostgreSQL", category: "Brands", component: SiPostgresql },
  { name: "SiMongodb", displayName: "MongoDB", category: "Brands", component: SiMongodb },
  { name: "SiMysql", displayName: "MySQL", category: "Brands", component: SiMysql },
  { name: "SiRedis", displayName: "Redis", category: "Brands", component: SiRedis },
  { name: "SiGraphql", displayName: "GraphQL", category: "Brands", component: SiGraphql },
  { name: "SiDocker", displayName: "Docker", category: "Brands", component: SiDocker },
  { name: "SiKubernetes", displayName: "Kubernetes", category: "Brands", component: SiKubernetes },
  { name: "SiGithub", displayName: "GitHub", category: "Brands", component: SiGithub },
  { name: "SiGitlab", displayName: "GitLab", category: "Brands", component: SiGitlab },
  { name: "SiJenkins", displayName: "Jenkins", category: "Brands", component: SiJenkins },
  { name: "SiTerraform", displayName: "Terraform", category: "Brands", component: SiTerraform },
  { name: "SiAnsible", displayName: "Ansible", category: "Brands", component: SiAnsible },
  { name: "SiPrometheus", displayName: "Prometheus", category: "Brands", component: SiPrometheus },
  { name: "SiGrafana", displayName: "Grafana", category: "Brands", component: SiGrafana },
  { name: "SiElasticsearch", displayName: "Elasticsearch", category: "Brands", component: SiElasticsearch },
  { name: "SiNginx", displayName: "Nginx", category: "Brands", component: SiNginx },
  { name: "SiApache", displayName: "Apache", category: "Brands", component: SiApache },
  { name: "SiAmazon", displayName: "AWS", category: "Brands", component: SiAmazon },
  { name: "SiGooglecloud", displayName: "Google Cloud", category: "Brands", component: SiGooglecloud },
  { name: "SiLinux", displayName: "Linux", category: "Brands", component: SiLinux },
  { name: "SiUbuntu", displayName: "Ubuntu", category: "Brands", component: SiUbuntu },
  { name: "SiDebian", displayName: "Debian", category: "Brands", component: SiDebian },
  { name: "SiRedhat", displayName: "Red Hat", category: "Brands", component: SiRedhat },
  { name: "SiCentos", displayName: "CentOS", category: "Brands", component: SiCentos },
  { name: "SiAndroid", displayName: "Android", category: "Brands", component: SiAndroid },
  { name: "SiApple", displayName: "Apple", category: "Brands", component: SiApple },
  { name: "SiSlack", displayName: "Slack", category: "Brands", component: SiSlack },
  { name: "SiDiscord", displayName: "Discord", category: "Brands", component: SiDiscord },
  { name: "SiTrello", displayName: "Trello", category: "Brands", component: SiTrello },
  { name: "SiJira", displayName: "Jira", category: "Brands", component: SiJira },
  { name: "SiConfluence", displayName: "Confluence", category: "Brands", component: SiConfluence },
  { name: "SiNotion", displayName: "Notion", category: "Brands", component: SiNotion },
  { name: "SiFigma", displayName: "Figma", category: "Brands", component: SiFigma },
  { name: "SiSketch", displayName: "Sketch", category: "Brands", component: SiSketch },
];

export const iconMap: IconMapping = iconMetadata.reduce((acc, icon) => {
  acc[icon.name] = icon.component;
  return acc;
}, {} as IconMapping);

export const iconCategories = Array.from(new Set(iconMetadata.map(icon => icon.category))).sort();

export function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  return iconMap[iconName] || FaCode;
}

export function getIconsByCategory(category: string): IconMetadata[] {
  return iconMetadata.filter(icon => icon.category === category);
}

export function searchIcons(query: string): IconMetadata[] {
  const lowerQuery = query.toLowerCase();
  return iconMetadata.filter(icon =>
    icon.displayName.toLowerCase().includes(lowerQuery) ||
    icon.name.toLowerCase().includes(lowerQuery) ||
    icon.category.toLowerCase().includes(lowerQuery)
  );
}
