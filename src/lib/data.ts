import { Home, User, Code2, Mail, FileText } from "lucide-react";
import { ThemeType } from "./themes";

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl: string;
  codeUrl: string;
  caseStudyUrl?: string | null;
  category: "frontend" | "fullstack" | "webgl" | "ai";
  featured?: boolean;
}

// Skill data structure
export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Three.js Portfolio Experience",
    description:
      "Immersive 3D portfolio with WebGL shaders, particle systems, and interactive scenes built with Three.js and React Three Fiber.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    techStack: ["Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "webgl",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Design System",
    description:
      "Intelligent design system that generates component variants using machine learning and automated testing.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    techStack: ["React", "TensorFlow.js", "Node.js", "Storybook", "Jest"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "ai",
    featured: true,
  },
  {
    id: 3,
    title: "Real-time Collaboration Platform",
    description:
      "Full-stack application with WebSocket connections, live cursors, and collaborative editing features.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    techStack: ["Next.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "fullstack",
  },
  {
    id: 4,
    title: "Interactive Data Visualization",
    description:
      "Dynamic dashboard with D3.js charts, real-time data streams, and responsive animations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    techStack: ["D3.js", "React", "WebSockets", "Chart.js", "Tailwind"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#",
    category: "frontend",
  },
  {
    id: 5,
    title: "WebGL Particle Engine",
    description:
      "High-performance particle system with GPU computation, physics simulation, and interactive controls.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    techStack: ["WebGL", "Three.js", "GPU.js", "Canvas API", "ES6"],
    demoUrl: "#",
    codeUrl: "#",
    category: "webgl",
  },
  {
    id: 6,
    title: "E-commerce Microservices",
    description:
      "Scalable microservices architecture with containerization, API gateway, and automated deployment.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    techStack: ["Node.js", "Docker", "Kubernetes", "MongoDB", "GraphQL"],
    demoUrl: "#",
    codeUrl: "#",
    category: "fullstack",
  },
];

export const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
];

export const themes: ThemeType[] = ["light", "dark", "netflix", "ey", "github"];

export // Navigation items for desktop and mobile
const navItems = [
  { id: "home", label: "Home", icon: Home, type: "section" },
  { id: "about", label: "About", icon: User, type: "section" },
  { id: "projects", label: "Projects", icon: Code2, type: "page" },
  { id: "contact", label: "Contact", icon: Mail, type: "section" },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    type: "external",
    href: "/resume.pdf",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: "expert", yearsOfExperience: 5 },
      { name: "TypeScript", level: "advanced", yearsOfExperience: 4 },
      { name: "JavaScript", level: "expert", yearsOfExperience: 6 },
      { name: "HTML5", level: "expert", yearsOfExperience: 8 },
      { name: "CSS3", level: "expert", yearsOfExperience: 8 },
      { name: "Tailwind", level: "advanced", yearsOfExperience: 3 },
      { name: "Next.js", level: "advanced", yearsOfExperience: 3 },
      { name: "Vue.js", level: "intermediate", yearsOfExperience: 2 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: "advanced", yearsOfExperience: 4 },
      { name: "Express", level: "advanced", yearsOfExperience: 4 },
      { name: "Python", level: "intermediate", yearsOfExperience: 3 },
      { name: "PostgreSQL", level: "advanced", yearsOfExperience: 3 },
      { name: "MongoDB", level: "intermediate", yearsOfExperience: 2 },
      { name: "Redis", level: "intermediate", yearsOfExperience: 2 },
      { name: "GraphQL", level: "intermediate", yearsOfExperience: 2 },
      { name: "REST APIs", level: "expert", yearsOfExperience: 5 },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Git", level: "expert", yearsOfExperience: 6 },
      { name: "Docker", level: "advanced", yearsOfExperience: 3 },
      { name: "AWS", level: "intermediate", yearsOfExperience: 2 },
      { name: "Vercel", level: "advanced", yearsOfExperience: 3 },
      { name: "Netlify", level: "intermediate", yearsOfExperience: 2 },
      { name: "GitHub", level: "intermediate", yearsOfExperience: 2 },
      { name: "Webpack", level: "intermediate", yearsOfExperience: 3 },
      { name: "Vite", level: "advanced", yearsOfExperience: 2 },
    ],
  },
  {
    title: "Testing & Quality",
    skills: [
      { name: "Jest", level: "advanced", yearsOfExperience: 3 },
      { name: "Cypress", level: "intermediate", yearsOfExperience: 2 },
      { name: "Testing", level: "advanced", yearsOfExperience: 3 },
      { name: "ESLint", level: "advanced", yearsOfExperience: 4 },
      { name: "Prettier", level: "expert", yearsOfExperience: 4 },
      { name: "Figma", level: "intermediate", yearsOfExperience: 3 },
      { name: "Storybook", level: "intermediate", yearsOfExperience: 2 },
      { name: "Lighthouse", level: "advanced", yearsOfExperience: 3 },
    ],
  },
];
