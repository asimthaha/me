import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, CheckCircle, Users, Zap, Star } from "lucide-react";

export const CollaborationSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        message: "",
      });
    }, 3000);
  };

  const collaborationPoints = [
    {
      icon: Users,
      title: "Collaborative Partnership",
      description:
        "I work closely with clients as true partners, ensuring your vision guides every decision.",
    },
    {
      icon: Zap,
      title: "Agile Development",
      description:
        "Flexible, iterative approach with regular updates and transparent communication throughout the project.",
    },
    {
      icon: Star,
      title: "Quality Focus",
      description:
        "Committed to delivering exceptional results that exceed expectations and drive real business value.",
    },
  ];

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Message Sent Successfully!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for reaching out. I'll review your message and get back to
            you within 24 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-accent text-accent-foreground hover-scale"
          >
            Send Another Message
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 px-6 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-heading text-foreground mb-6">
            Let's Collaborate
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to bring your digital vision to life? Let's discuss how we can
            work together to create something exceptional.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Collaboration Points */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading text-foreground mb-8">
              Why Work With Me?
            </h3>

            {collaborationPoints.map((point, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <point.icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-heading text-foreground mb-2">
                    {point.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Contact Info */}
            <div className="mt-12 p-6 bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl">
              <h4 className="text-lg font-heading text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Get in Touch
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 hello@alexthompson.dev</p>
                <p>📱 Available for new projects</p>
                <p>⏰ Response within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl p-8">
            <h3 className="text-2xl font-heading text-foreground mb-6">
              Start a Conversation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 bg-background border-border/20 focus:border-accent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 bg-background border-border/20 focus:border-accent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="company"
                  className="text-sm font-medium text-foreground"
                >
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 bg-background border-border/20 focus:border-accent"
                  placeholder="Your company (optional)"
                />
              </div>

              <div>
                <Label
                  htmlFor="projectType"
                  className="text-sm font-medium text-foreground"
                >
                  Project Type
                </Label>
                <Input
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="mt-1 bg-background border-border/20 focus:border-accent"
                  placeholder="Web app, mobile app, consulting, etc."
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="mt-1 bg-background border-border/20 focus:border-accent resize-none"
                  placeholder="Tell me about your project, goals, and timeline..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground hover-scale btn-border-expand"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
