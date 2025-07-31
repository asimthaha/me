import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Github, FileText } from 'lucide-react';

/**
 * Projects Section - Retro Gaming Inspired Developer Portfolio
 * Features CRO-optimized project cards with pixelated aesthetics
 */

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack marketplace with real-time inventory and payment processing",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative workspace with drag-and-drop interface and team analytics",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    techStack: ["TypeScript", "React", "Firebase", "Tailwind"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: null
  },
  {
    id: 3,
    title: "AI Chat Interface",
    description: "Real-time messaging platform with natural language processing",
    image: "https://images.unsplash.com/photo-1487058792275-0ad449287219",
    techStack: ["Python", "FastAPI", "OpenAI", "WebSocket"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#"
  },
  {
    id: 4,
    title: "Data Visualization Dashboard",
    description: "Interactive analytics platform for business intelligence insights",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    techStack: ["React", "D3.js", "Node.js", "MongoDB"],
    demoUrl: "#",
    codeUrl: "#",
    caseStudyUrl: "#"
  }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  return (
    <article 
      className="reveal-on-scroll pixelated-border bg-card hover:bg-accent/5 transition-smooth group"
      style={{ 
        opacity: 0, 
        transform: 'translateY(20px)',
        transitionDelay: `${index * 100}ms`
      }}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img 
          src={project.image}
          alt={`${project.title} preview`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
          loading="lazy"
        />
        <div className="scanlines opacity-30"></div>
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="pixelated-border-button font-retro text-xs"
            asChild
          >
            <a href={project.demoUrl} aria-label={`View ${project.title} demo`}>
              <ExternalLink className="w-3 h-3" />
              DEMO
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="pixelated-border-button font-retro text-xs"
            asChild
          >
            <a href={project.codeUrl} aria-label={`View ${project.title} source code`}>
              <Github className="w-3 h-3" />
              CODE
            </a>
          </Button>
          {project.caseStudyUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="pixelated-border-button font-retro text-xs"
              asChild
            >
              <a href={project.caseStudyUrl} aria-label={`Read ${project.title} case study`}>
                <FileText className="w-3 h-3" />
                CASE
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-retro text-lg text-foreground group-hover:text-accent transition-smooth">
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge 
              key={tech}
              variant="outline"
              className="font-retro text-xs pixelated-border-button"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="hero"
            size="sm"
            className="font-retro text-xs flex-1"
            asChild
          >
            <a href={project.demoUrl}>
              <ExternalLink className="w-3 h-3" />
              PLAY DEMO
            </a>
          </Button>
          <Button
            variant="hero-secondary"
            size="sm"
            className="font-retro text-xs"
            asChild
          >
            <a href={project.codeUrl}>
              <Github className="w-3 h-3" />
              VIEW CODE
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal-on-scroll');
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-reveal');
              }, index * 100);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-background relative"
      aria-labelledby="projects-title"
    >
      {/* Background Scanlines */}
      <div className="scanlines opacity-20"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 
            id="projects-title"
            className="reveal-on-scroll font-retro text-4xl md:text-5xl text-foreground"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            🕹️ MISSIONS COMPLETED
          </h2>
          <p 
            className="reveal-on-scroll font-body text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '100ms' }}
          >
            From prototypes to production—these builds leveled me up.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index + 2} 
            />
          ))}
        </div>

        {/* Experience Progress Panel */}
        <div 
          className="reveal-on-scroll pixelated-border bg-card p-8 mb-12 relative"
          style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '600ms' }}
        >
          {/* Panel Title */}
          <div className="absolute -top-3 left-6 bg-background px-3">
            <span className="font-retro text-sm text-muted-foreground">[ DEV STATS ]</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="font-retro text-xs text-muted-foreground">// PROJECTS SHIPPED:</span>
                <p className="font-body text-foreground">25+ applications in production</p>
              </div>
              <div>
                <span className="font-retro text-xs text-muted-foreground">// CLIENTS HAPPY:</span>
                <p className="font-body text-foreground">100% satisfaction rate</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-retro text-xs text-muted-foreground">// LOADING:</span>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-retro">PORTFOLIO.EXE</span>
                    <span className="font-body">95%</span>
                  </div>
                  <Progress value={95} className="retro-progress h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="reveal-on-scroll text-center"
          style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '700ms' }}
        >
          <p className="font-body text-lg text-muted-foreground mb-6">
            Ready to start your next project?
          </p>
          <Button 
            variant="hero" 
            size="hero"
            className="font-retro pixelated-border-button"
          >
            &gt; VIEW ALL PROJECTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;