import { useEffect, useRef, useState } from "react";
import { Code, Users, Award, Briefcase } from "lucide-react";

const AboutMeSection = () => {
  return (
    <section className="relative min-h-screen bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Professional Introduction */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-heading text-foreground mb-6">
            Alex Thompson
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Full-stack developer crafting exceptional digital experiences with
            modern technologies and a commitment to clean, scalable solutions.
          </p>
        </div>

        {/* Minimal Stats - Only 4 key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Code, value: "5+", label: "Years Experience" },
            { icon: Briefcase, value: "50+", label: "Projects Completed" },
            { icon: Users, value: "25+", label: "Happy Clients" },
            { icon: Award, value: "15+", label: "Technologies" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-colors">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-heading text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Professional Timeline */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading text-foreground text-center mb-12">
            Professional Journey
          </h2>

          <div className="space-y-8">
            {[
              {
                year: "2024",
                title: "Senior Full-Stack Developer",
                company: "Tech Innovations Inc.",
                description:
                  "Leading development of scalable web applications using React, Node.js, and cloud infrastructure.",
              },
              {
                year: "2022",
                title: "Full-Stack Developer",
                company: "Digital Solutions Ltd.",
                description:
                  "Developed and maintained multiple client projects with focus on performance and user experience.",
              },
              {
                year: "2020",
                title: "Frontend Developer",
                company: "Creative Web Studio",
                description:
                  "Specialized in modern JavaScript frameworks and responsive design implementations.",
              },
              {
                year: "2019",
                title: "Junior Developer",
                company: "Startup Tech Corp",
                description:
                  "Started career building interactive web experiences and learning full-stack development.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-8 group">
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  {index < 3 && (
                    <div className="w-0.5 h-16 bg-border mt-4"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-accent text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-accent font-medium mb-2">{item.company}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to collaborate on your next project?
          </p>
          <button className="btn-border-expand bg-accent text-accent-foreground px-8 py-3 rounded-lg font-medium hover-scale">
            Let's Connect
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
