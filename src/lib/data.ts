import {
  Home,
  User,
  Code2,
  Mail,
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

export const themes: ThemeType[] = [
  "light",
  "dark",
  "ares",
  "dune",
  "terra",
  "enterprise",
];
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  href?: string;
}

// Navigation items for desktop and mobile
export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, type: "page", href: "/" },
  { id: "about", label: "About", icon: User, type: "page", href: "/about" },
  {
    id: "projects",
    label: "Projects",
    icon: Code2,
    type: "page",
    href: "/projects",
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
    type: "page",
    href: "/services",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    type: "page",
    href: "/contacts",
  },
  // Add external links here too, if you want
  // { id: "blog", label: "Blog", icon: Rss, type: "external", href: "https://my-blog.com" }
];

// Personal/Professional Information
export interface PersonalInfo {
  name: string;
  shortName?: string;
  title: string;
  jobTitle?: string;
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
  name: "Asim Thaha Azeez",
  shortName: "asim thaha",
  title: "Full-Stack Developer & Creative Technologist",
  jobTitle: "Associate Software Engineer",
  location: "Remote / Global",
  email: "asim.thahaazeez@gmail.com",
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
    "Built production-ready web applications",
    "Consistently achieve 90+ Lighthouse scores",
    "Specialized in React and Python ecosystems",
    "Expert in modern tooling and best practices",
  ],
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: "expert", yearsOfExperience: 1 },
      { name: "JavaScript", level: "expert", yearsOfExperience: 1 },
      { name: "TypeScript", level: "advanced", yearsOfExperience: 1 },
      { name: "HTML5", level: "expert", yearsOfExperience: 1 },
      { name: "CSS3", level: "expert", yearsOfExperience: 1 },
      { name: "Tailwind", level: "advanced", yearsOfExperience: 1 },
      { name: "Bootstrap", level: "expert", yearsOfExperience: 1 },
      { name: "jQuery", level: "intermediate", yearsOfExperience: 1 },
      { name: "R-Native", level: "beginner", yearsOfExperience: 1 },
      { name: "Angular", level: "beginner", yearsOfExperience: 1 },
    ],
  },
  {
    title: "Backend",
    skills: [
      // Languages
      { name: "Python", level: "advanced", yearsOfExperience: 1 },
      { name: "Node.js", level: "intermediate", yearsOfExperience: 1 },
      { name: "C#", level: "advanced", yearsOfExperience: 1 },
      { name: "Java", level: "intermediate", yearsOfExperience: 1 },
      { name: "PHP", level: "beginner", yearsOfExperience: 1 },

      // Frameworks & APIs
      { name: "Django", level: "advanced", yearsOfExperience: 1 },
      { name: ".NET Core", level: "advanced", yearsOfExperience: 1 },
      { name: "FastAPI", level: "intermediate", yearsOfExperience: 1 },
      { name: "Streamlit", level: "intermediate", yearsOfExperience: 1 },
      { name: "REST APIs", level: "expert", yearsOfExperience: 1 },

      // Databases
      { name: "PostgreSQL", level: "advanced", yearsOfExperience: 1 },
      { name: "MySQL", level: "advanced", yearsOfExperience: 1 },
      { name: "SQLite", level: "advanced", yearsOfExperience: 1 },
      { name: "MongoDB", level: "intermediate", yearsOfExperience: 1 },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Git", level: "expert", yearsOfExperience: 1 },
      { name: "GitHub", level: "expert", yearsOfExperience: 1 },
      { name: "Docker", level: "beginner", yearsOfExperience: 1 },
      { name: "AWS", level: "beginner", yearsOfExperience: 1 },
      { name: "Azure", level: "beginner", yearsOfExperience: 1 },
      { name: "Vite", level: "advanced", yearsOfExperience: 1 },
      { name: "Windows", level: "expert", yearsOfExperience: 8 },
      { name: "Ubuntu", level: "advanced", yearsOfExperience: 2 },
    ],
  },
  {
    title: "Other Skills",
    skills: [
      { name: "AI Chatbot  ", level: "advanced", yearsOfExperience: 1 },
      { name: "RPA", level: "beginner", yearsOfExperience: 2 },
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
      "Strategic guidance on architecture, technology choices, and development best practices execution support.",
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
  // --- Work Experience ---
  {
    id: "exp-1",
    title: "Junior Software Engineer",
    company: "Fingent",
    location: "Kochi, Kerala, India",
    period: { start: "Apr 2025", end: "Present" },
    type: "work",
    description: [
      "Developing and maintaining software solutions in a full-time engineering role.",
    ],
    technologies: ["React.js", "Node.js"],
    highlights: ["Promoted from Trainee to Junior Software Engineer."],
  },
  {
    id: "exp-2",
    title: "Software Engineering Trainee",
    company: "Fingent",
    location: "Kochi, Kerala, India",
    period: { start: "Oct 2024", end: "Apr 2025" },
    type: "work",
    description: [
      "Underwent intensive training in full-stack development methodologies and enterprise-level software practices.",
    ],
    technologies: ["React.js", "Laravel"],
    highlights: [], // Added missing required field
  },
  {
    id: "exp-3",
    title: "Full Stack Intern",
    company: "Fingent",
    location: "Kochi, Kerala, India",
    period: { start: "Jul 2024", end: "Oct 2024" },
    type: "work",
    description: [
      "Contributed to web development projects, gaining hands-on experience in both frontend and backend systems.",
    ],
    technologies: [
      "HTML5",
      "CSS",
      "JavaScript",
      "PHP",
      "MySQL",
      "jQuery",
      "Git",
    ],
    highlights: [], // Added missing required field
  },
  {
    id: "exp-4",
    title: "R&D Intern",
    company: "QF Innovate",
    location: "Kochi, Kerala, India",
    period: { start: "Dec 2023", end: "Mar 2024" },
    type: "work",
    description: [
      "Focused on research and development, experimenting with new technologies for mobile and web applications.",
    ],
    technologies: [
      "React Native",
      "Bootstrap",
      "Streamlit",
      "AI",
      "Python",
      "Git",
    ],
    highlights: [], // Added missing required field
  },
  {
    id: "exp-5",
    title: "Cloud and Devops Intern",
    company: "ipsr solutions ltd",
    location: "Kottayam, Kerala, India",
    period: { start: "Nov 2022", end: "Jan 2023" },
    type: "work",
    description: [
      "Gained foundational experience in cloud computing principles, DevOps methodologies, and AWS services.",
    ],
    technologies: ["Cloud Computing", "Amazon Web Services (AWS)"],
    highlights: [], // Added missing required field
  },
  // --- Education ---
  {
    id: "edu-1",
    title: "Master of Computer Applications - MCA",
    company: "Marian College, Kuttikanam",
    location: "Peermade, Kerala, India",
    period: { start: "Jul 2022", end: "Mar 2024" },
    type: "education",
    description: [
      "Developed a full-stack e-commerce platform using React and Django.",
      "Implemented a machine learning model using Python and TensorFlow to predict sales trends.",
      "Designed and optimized a relational database using SQL for efficient data storage and retrieval.",
    ],
    technologies: [
      "React",
      "Django",
      "Python",
      "TensorFlow",
      "SQL",
      "Machine Learning",
    ],
    highlights: ["Grade: A", "MARIAN SILVER BAND AWARD - S3 (Nov 2023)"],
  },
  {
    id: "edu-2",
    title: "Bsc Geology",
    company: "Mahatma Gandhi University, Kottayam",
    location: "Kottayam, Kerala, India",
    period: { start: "2018", end: "2021" },
    type: "education",
    description: [
      "Undergraduate degree providing a strong foundation in analytical and research skills.",
    ],
    technologies: ["Robotic Process Automation (RPA)", "Programming Languages"],
    highlights: [
      "Learned RPA fundamentals",
      "Gained broad programming language exposure",
    ],
  },
  // --- Certifications ---
  {
    id: "cert-1",
    title: "edX Verified Certificate for Introduction to Jenkins",
    company: "edX",
    location: "Online",
    period: { start: "Sep 2024", end: "Sep 2024" },
    type: "certification",
    description: ["Learned to set up and use Jenkins for CI/CD pipelines."],
    technologies: ["Jenkins", "CI/CD", "DevOps"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-2",
    title: "R&D Internship Certificate",
    company: "QF Innovate",
    location: "Online",
    period: { start: "Mar 2024", end: "Mar 2024" },
    type: "certification",
    description: ["Completed internship focused on R&D for AI applications."],
    technologies: ["Streamlit", "Artificial Intelligence (AI)"],
    highlights: ["Streamlit", "Artificial Intelligence (AI)"],
  },
  {
    id: "cert-3",
    title: "Introduction to Web Development with HTML5, CSS3, and JavaScript",
    company: "edX",
    location: "Online",
    period: { start: "Jan 2024", end: "Jan 2024" },
    type: "certification",
    description: [
      "Verified certificate for core web development technologies.",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-4",
    title: "Python for Data Science",
    company: "NPTEL",
    location: "Online",
    period: { start: "Oct 2023", end: "Oct 2023" },
    type: "certification",
    description: ["Covered Python libraries and techniques for data analysis."],
    technologies: ["Python", "Data Science"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-5",
    title: "edX Verified Certificate for Introduction to DevOps and SRE",
    company: "The Linux Foundation",
    location: "Online",
    period: { start: "Sep 2023", end: "Sep 2023" },
    type: "certification",
    description: [
      "Fundamentals of DevOps and Site Reliability Engineering practices.",
    ],
    technologies: ["DevOps", "SRE"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-6",
    title: "edX Verified Certificate for AI Applications with Watson",
    company: "IBM",
    location: "Online",
    period: { start: "Aug 2023", end: "Aug 2023" },
    type: "certification",
    description: [
      "Learned to build and deploy AI applications using IBM Watson.",
    ],
    technologies: ["Chatbot Development", "IBM Watson", "AI"],
    highlights: ["Chatbot Development"],
  },
  {
    id: "cert-7",
    title: "The Art of Prompt Engineering",
    company: "IBM",
    location: "Online",
    period: { start: "Jul 2023", end: "Jul 2023" },
    type: "certification",
    description: [
      "Course on effective prompt design for generative AI models.",
    ],
    technologies: ["Prompt Engineering", "Generative AI"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-8",
    title: "edX Verified Certificate for AI Chatbots without Programming",
    company: "IBM",
    location: "Online",
    period: { start: "Jul 2023", end: "Jul 2023" },
    type: "certification",
    description: ["Focused on no-code solutions for building chatbots."],
    technologies: ["Chatbot Development"],
    highlights: ["Chatbot Development"],
  },
  {
    id: "cert-9",
    title: "edX Verified Certificate for Data Science: Visualization",
    company: "Harvard University",
    location: "Online",
    period: { start: "Jul 2023", end: "Jul 2023" },
    type: "certification",
    description: ["Course on principles of data visualization."],
    technologies: ["Data Visualization", "Data Science"],
    highlights: ["Analytical Skills"],
  },
  {
    id: "cert-10",
    title: "edX Verified Certificate for Deep Learning Fundamentals with Keras",
    company: "IBM iX",
    location: "Online",
    period: { start: "Jul 2023", end: "Jul 2023" },
    type: "certification",
    description: ["Introduction to deep learning concepts using Keras."],
    technologies: ["Deep Learning", "Keras", "Python"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-11",
    title: "edX Verified Certificate for Python Basics for Data Science",
    company: "IBM",
    location: "Online",
    period: { start: "Jul 2023", end: "Jul 2023" },
    type: "certification",
    description: ["Fundamental Python programming skills for data science."],
    technologies: ["Python", "Data Science"],
    highlights: ["Analytical Skills", "Data Science"],
  },
  {
    id: "cert-12",
    title: "Deep Learning with Tensorflow",
    company: "TensorFlow Certificate Program",
    location: "Online",
    period: { start: "Jan 2023", end: "Jan 2023" },
    type: "certification",
    description: ["Hands-on training with the TensorFlow framework."],
    technologies: ["Deep Learning", "TensorFlow"],
    highlights: [], // Added missing required field
  },
  {
    id: "cert-13",
    title: "ReactJS",
    company: "Internshala Trainings",
    location: "Online",
    period: { start: "Jan 2023", end: "Jan 2023" },
    type: "certification",
    description: [
      "Training program focused on front-end development with React.",
    ],
    technologies: ["React", "Front-End Development"],
    highlights: ["Front-End Development", "Front-End Design"],
  },
  {
    id: "cert-14",
    title: "edX Verified Certificate for AWS Cloud Technical Essentials",
    company: "Amazon Web Services (AWS)",
    location: "Online",
    period: { start: "Dec 2022", end: "Dec 2022" },
    type: "certification",
    description: ["Covered core AWS services, pricing, and architecture."],
    technologies: ["Amazon Web Services (AWS)"],
    highlights: ["Amazon Web Services (AWS)", "Research Skills"],
  },
  {
    id: "cert-15",
    title: "Red Hat Certified System Administrator (RHCSA)",
    company: "Red Hat",
    location: "Online",
    period: { start: "Oct 2022", end: "Oct 2022" },
    type: "certification",
    description: [
      "Proves skills in system administration across a wide range of environments.",
    ],
    technologies: ["Linux System Administration", "Red Hat"],
    highlights: ["Analytical Skills", "Programming Languages"],
  },
  {
    id: "cert-16",
    title: "Full Stack Development",
    company: "Avodha",
    location: "Online",
    period: { start: "Dec 2021", end: "Dec 2021" },
    type: "certification",
    description: [
      "Comprehensive training in front-end and back-end technologies.",
    ],
    technologies: [
      "Front-End Development",
      "CSS",
      "HTML5",
      "JavaScript",
      "PHP",
      "MySQL",
      "Bootstrap",
      "jQuery",
    ],
    highlights: [
      "Front-End Development",
      "Cascading Style Sheets (CSS)",
      "HTML5",
      "JavaScript",
      "PHP",
      "MySQL",
    ],
  },
];

export const profileLinks = {
  portfolio: "https://yourportfolio.com",
  linkedin: "https://www.linkedin.com/in/asimthaha/",
  github: "https://github.com/asimthaha",
  stackOverflow: "https://stackoverflow.com/users/16229133/asim-thaha-azeez",
  gmailEncoded: "YXNpbS50aGFoYWF6ZWV6QGdtYWlsLmNvbQ==",
};

export const resourceLinks = [
  { name: "Documentation", href: "#" },
  { name: "Blog", href: "#" },
  { name: "FAQ", href: "#" },
  { name: "Support", href: "#" },
];
