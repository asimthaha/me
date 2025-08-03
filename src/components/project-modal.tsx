import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, FileText, X } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl: string;
  codeUrl: string;
  caseStudyUrl?: string | null;
  category: 'frontend' | 'fullstack' | 'webgl' | 'ai';
  featured?: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Enhanced Project Modal with detailed project information
 * Features glassmorphism design and smooth animations
 */
export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-foreground">
                {project.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="capitalize">
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
            </div>
          </div>
          
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        {/* Project Image */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-sm bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Project Highlights</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Responsive design across all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Modern UI/UX principles applied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Performance optimized</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Accessibility compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Cross-browser compatibility</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>SEO optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/20">
          <Button
            size="lg"
            className="flex-1"
            asChild
          >
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Live Demo
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            asChild
          >
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View Source Code
            </a>
          </Button>
          {project.caseStudyUrl && (
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              asChild
            >
              <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="w-5 h-5 mr-2" />
                Case Study
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};