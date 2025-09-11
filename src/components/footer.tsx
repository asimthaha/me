import { Heart, Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Professional Footer Component
 * Features social links, navigation, and copyright information
 * Includes scroll-to-top functionality and premium glass styling
 */
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:contact@example.com", label: "Email" }
  ];

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#development-impact" }
  ];

  return (
    <footer className="relative bg-background border-t border-border">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      
      <div className="relative container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Developer Portfolio
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting exceptional digital experiences with modern technologies. 
              Passionate about clean code and innovative solutions.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted/50"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© 2024 Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Developer</span>
          </div>

          {/* Scroll to top button */}
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="group transition-all hover:bg-accent hover:border-accent hover:text-accent-foreground"
          >
            <ArrowUp className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
            Back to Top
          </Button>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_120%,hsl(var(--accent))_0%,transparent_50%)]" />
      </div>
    </footer>
  );
};

export default Footer;