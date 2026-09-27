import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".project-card",
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="projects-heading">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
            02 — Projects
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Selected <span className="text-gradient">work.</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-white/55">
            Real systems built for real users — from an AI receptionist handling
            live clinic calls to a computer-vision model reading sign language
            in real time.
          </p>
        </div>

        <div className="projects-grid mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
