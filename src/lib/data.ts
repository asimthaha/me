import {
  Home,
  User,
  Code2,
  Mail,
  FileText,
  Briefcase,
  Wrench,
  Zap,
  Users,
  Palette,
} from "lucide-react";
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

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  href?: string;
}

// Navigation items for desktop and mobile
export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, type: "page" },
  { id: "about", label: "About", icon: User, type: "page" },
  { id: "projects", label: "Projects", icon: Code2, type: "page" },
  { id: "services", label: "Services", icon: Briefcase, type: "page" },
  { id: "contact", label: "Contact", icon: Mail, type: "page" },
];

// Personal/Professional Information
export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  yearsOfExperience: number;
  specializations: string[];
  availability: {
    status: "available" | "limited" | "unavailable";
    nextAvailable: string;
    preferredProjectTypes: string[];
  };
  workPhilosophy: string[];
  achievements: string[];
}

export const personalInfo: PersonalInfo = {
  name: "John Doe",
  title: "Full-Stack Developer & Creative Technologist",
  location: "Remote / Global",
  email: "contact@johndoe.dev",
  bio: "Passionate full-stack developer specializing in creating immersive web experiences with modern technologies. I combine technical expertise with creative problem-solving to build scalable, user-centric applications.",
  yearsOfExperience: 1,
  specializations: [
    "React & TypeScript Development",
    "WebGL & Three.js Experiences",
    "Full-Stack Web Applications",
    "Performance Optimization",
    "UI/UX Implementation",
  ],
  availability: {
    status: "available",
    nextAvailable: "Immediately",
    preferredProjectTypes: [
      "Web Applications",
      "Interactive Experiences",
      "E-commerce Platforms",
      "SaaS Products",
    ],
  },
  workPhilosophy: [
    "Clean, maintainable code is non-negotiable",
    "User experience drives every technical decision",
    "Performance optimization from day one",
    "Continuous learning and adaptation",
  ],
  achievements: [
    "Built 6+ production-ready web applications",
    "Consistently achieve 90+ Lighthouse scores",
    "Specialized in React and TypeScript ecosystems",
    "Expert in modern frontend tooling and best practices",
  ],
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: "expert", yearsOfExperience: 1 },
      { name: "TypeScript", level: "advanced", yearsOfExperience: 1 },
      { name: "JavaScript", level: "expert", yearsOfExperience: 1 },
      { name: "HTML5", level: "expert", yearsOfExperience: 1 },
      { name: "CSS3", level: "expert", yearsOfExperience: 1 },
      { name: "Tailwind", level: "advanced", yearsOfExperience: 1 },
      { name: "Next.js", level: "advanced", yearsOfExperience: 1 },
      { name: "Vue.js", level: "intermediate", yearsOfExperience: 1 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: "advanced", yearsOfExperience: 1 },
      { name: "Express", level: "advanced", yearsOfExperience: 1 },
      { name: "Python", level: "intermediate", yearsOfExperience: 1 },
      { name: "PostgreSQL", level: "advanced", yearsOfExperience: 1 },
      { name: "MongoDB", level: "intermediate", yearsOfExperience: 1 },
      { name: "Redis", level: "intermediate", yearsOfExperience: 1 },
      { name: "GraphQL", level: "intermediate", yearsOfExperience: 1 },
      { name: "REST APIs", level: "expert", yearsOfExperience: 1 },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Git", level: "expert", yearsOfExperience: 1 },
      { name: "Docker", level: "advanced", yearsOfExperience: 1 },
      { name: "AWS", level: "intermediate", yearsOfExperience: 1 },
      { name: "Vercel", level: "advanced", yearsOfExperience: 1 },
      { name: "Netlify", level: "intermediate", yearsOfExperience: 1 },
      { name: "GitHub", level: "intermediate", yearsOfExperience: 1 },
      { name: "Webpack", level: "intermediate", yearsOfExperience: 1 },
      { name: "Vite", level: "advanced", yearsOfExperience: 1 },
    ],
  },
  {
    title: "Testing & Quality",
    skills: [
      { name: "Jest", level: "advanced", yearsOfExperience: 1 },
      { name: "Cypress", level: "intermediate", yearsOfExperience: 1 },
      { name: "Testing", level: "advanced", yearsOfExperience: 1 },
      { name: "ESLint", level: "advanced", yearsOfExperience: 1 },
      { name: "Prettier", level: "expert", yearsOfExperience: 1 },
      { name: "Figma", level: "intermediate", yearsOfExperience: 1 },
      { name: "Storybook", level: "intermediate", yearsOfExperience: 1 },
      { name: "Lighthouse", level: "advanced", yearsOfExperience: 1 },
    ],
  },
];

//services page
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  duration: string;
  startingPrice: string;
  popular?: boolean;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Custom web applications built with modern frameworks and best practices for performance and scalability.",
    icon: Code2,
    features: [
      "React/TypeScript Development",
      "Responsive Design",
      "API Integration",
      "Performance Optimization",
      "SEO Implementation",
    ],
    duration: "2-8 weeks",
    startingPrice: "Contact for quote",
    popular: true,
  },
  {
    id: 2,
    title: "UI/UX Design",
    description:
      "I design user-centered solutions that create intuitive interfaces. My goal is to deliver exceptional user experiences.",
    icon: Palette,
    features: [
      "User Research & Testing",
      "Wireframing & Prototyping",
      "Design Systems",
      "Accessibility Compliance",
      "Mobile-First Design",
    ],
    duration: "1-4 weeks",
    startingPrice: "Contact for quote",
  },
  {
    id: 3,
    title: "Technical Consulting",
    description:
      "Strategic guidance on architecture, technology choices, and development best practices.",
    icon: Users,
    features: [
      "Architecture Planning",
      "Technology Assessment",
      "Code Reviews",
      "Performance Audits",
      "Team Training",
    ],
    duration: "Ongoing",
    startingPrice: "Contact for quote",
  },
  {
    id: 4,
    title: "Performance Optimization",
    description:
      "Comprehensive analysis and optimization of web applications for speed, accessibility, and SEO.",
    icon: Zap,
    features: [
      "Lighthouse Audits",
      "Core Web Vitals",
      "Bundle Optimization",
      "Image & Asset Optimization",
      "Caching Strategies",
    ],
    duration: "1-2 weeks",
    startingPrice: "Contact for quote",
  },
  {
    id: 5,
    title: "Maintenance & Support",
    description:
      "Ongoing support, updates, and maintenance for existing web applications and websites.",
    icon: Wrench,
    features: [
      "Bug Fixes & Updates",
      "Security Monitoring",
      "Content Management",
      "Performance Monitoring",
      "24/7 Support",
    ],
    duration: "Monthly retainer",
    startingPrice: "Contact for quote",
  },
];

// Experience Tree data structure
export interface ExperienceNode {
  id: string;
  title: string;
  company: string;
  location: string;
  period: {
    start: string;
    end: string | "Present";
  };
  type: "work" | "education" | "milestone" | "certification";
  description: string[];
  technologies: string[];
  highlights: string[];
  metrics?: string[];
}

export const experienceNodes: ExperienceNode[] = [
  {
    id: "exp-1",
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Remote",
    period: { start: "Jan 2023", end: "Present" },
    type: "work",
    description: [
      "Lead frontend architecture for SaaS platform serving 10k+ users",
      "Implemented micro-frontend architecture reducing load time by 40%",
      "Mentored team of 4 junior developers on React best practices",
    ],
    technologies: ["React", "TypeScript", "Next.js", "Tailwind", "GraphQL"],
    highlights: [
      "Achieved 95+ Lighthouse score across all pages",
      "Reduced bundle size by 60% through optimization",
      "Implemented real-time collaboration features",
    ],
    metrics: ["40% performance improvement", "10k+ users", "60% bundle reduction"],
  },
  {
    id: "exp-2",
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    period: { start: "Jun 2021", end: "Dec 2022" },
    type: "work",
    description: [
      "Built e-commerce platform from scratch using MERN stack",
      "Designed and implemented RESTful APIs serving 5k requests/day",
      "Integrated payment systems and third-party APIs",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    highlights: [
      "Launched MVP in 3 months",
      "Scaled to handle 100k monthly active users",
      "Reduced server costs by 35% through optimization",
    ],
    metrics: ["3-month MVP", "100k MAU", "35% cost reduction"],
  },
  {
    id: "exp-3",
    title: "Frontend Developer",
    company: "Digital Agency Inc",
    location: "New York, NY",
    period: { start: "Jan 2020", end: "May 2021" },
    type: "work",
    description: [
      "Developed responsive websites for 15+ clients",
      "Collaborated with designers to implement pixel-perfect UIs",
      "Optimized web performance and accessibility",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Vue.js", "Webpack"],
    highlights: [
      "Delivered 15+ client projects on time",
      "Achieved WCAG AA accessibility compliance",
      "Improved avg. page load by 50%",
    ],
    metrics: ["15+ projects", "50% faster load", "WCAG AA"],
  },
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect",
    company: "Amazon Web Services",
    location: "Online",
    period: { start: "Mar 2022", end: "Mar 2022" },
    type: "certification",
    description: [
      "Professional-level certification in cloud architecture",
      "Demonstrated expertise in designing distributed systems",
    ],
    technologies: ["AWS", "Cloud Architecture", "DevOps"],
    highlights: ["Industry-recognized certification"],
  },
  {
    id: "edu-1",
    title: "B.S. Computer Science",
    company: "State University",
    location: "California, USA",
    period: { start: "Sep 2016", end: "May 2020" },
    type: "education",
    description: [
      "Focus on Software Engineering and Web Development",
      "GPA: 3.8/4.0, Dean's List all semesters",
    ],
    technologies: ["Java", "Python", "C++", "Data Structures", "Algorithms"],
    highlights: [
      "Graduated with honors",
      "Led capstone project team",
      "Published research on web performance",
    ],
  },
  {
    id: "milestone-1",
    title: "Open Source Contribution Milestone",
    company: "GitHub Community",
    location: "Global",
    period: { start: "Ongoing", end: "Present" },
    type: "milestone",
    description: [
      "Active contributor to React ecosystem projects",
      "500+ GitHub contributions in 2023",
    ],
    technologies: ["React", "TypeScript", "Open Source"],
    highlights: [
      "Contributed to 10+ projects",
      "2k+ total GitHub stars",
      "Active in developer community",
    ],
  },
];
