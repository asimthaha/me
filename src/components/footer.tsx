import { useEffect, useState } from "react";
import { Heart, Github, Linkedin, Mail } from "lucide-react";
import { navItems, profileLinks, resourceLinks } from "@/lib/data";

/**
 * Premium Footer Component
 * Features wave separator, enhanced social links, and modern styling
 * Includes gradient effects, animations, and responsive design
 */
const Footer = () => {
  const [emailHref, setEmailHref] = useState("");

  useEffect(() => {
    const decodedEmail = atob(profileLinks.gmailEncoded);
    setEmailHref(`mailto:${decodedEmail}`);
  }, []);

  const StackOverflowIcon = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props} // Pass through any props like className
    >
      <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
    </svg>
  );

  const socialLinks = [
    {
      icon: Github,
      href: profileLinks.github,
      label: "GitHub",
      color: "hover:text-[#333] dark:hover:text-white",
    },
    {
      icon: Linkedin,
      href: profileLinks.linkedin,
      label: "LinkedIn",
      color: "hover:text-[#0A66C2]",
    },
    {
      icon: StackOverflowIcon,
      href: profileLinks.stackOverflow,
      label: "Stack Overflow",
      color: "hover:text-[#F48024]",
    },
    {
      icon: Mail,
      href: emailHref,
      label: "Email",
      color: "hover:text-[#EA4335]",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/20 border-t border-border overflow-hidden">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="relative container mx-auto px-6 py-16 md:py-20">
        {/* Main footer content */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand & Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                  Portfolio
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crafting exceptional digital experiences with modern
                technologies. Passionate about clean code and innovative
                solutions.
              </p>
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-primary">
                  Available for work
                </span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Navigation
              </h4>
              <nav className="flex flex-col space-y-3">
                {navItems.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-accent transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Resources
              </h4>
              <nav className="flex flex-col space-y-3">
                {resourceLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-accent transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social Links & Connect */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Connect
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent/50 transition-all duration-300 hover-lift ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Let's connect and create something amazing together
              </p>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-background px-4">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>by Developer</span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </footer>
  );
};

export default Footer;
