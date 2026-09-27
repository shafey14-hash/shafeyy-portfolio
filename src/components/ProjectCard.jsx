import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/gsap";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const floatTween = gsap.to(innerRef.current, {
      y: -9,
      duration: 2.4 + index * 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      if (fine) {
        gsap.to(card, {
          rotateY: (px - 0.5) * 14,
          rotateX: -(py - 0.5) * 14,
          scale: 1.02,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 900,
        });
      }
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
      });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      floatTween.kill();
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="project-card glass group relative flex min-h-[430px] flex-col overflow-hidden rounded-2xl p-7 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="project-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ background: `${project.accent}26` }}
      />

      <div ref={innerRef} className="relative flex h-full flex-col">
        <span
          className="font-display text-6xl font-bold leading-none opacity-15 transition-opacity duration-500 group-hover:opacity-30"
          style={{ color: project.accent }}
        >
          {project.id}
        </span>

        <div className="mt-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: project.accent }}
          >
            {project.client}
          </p>
          <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-white">
            {project.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            {project.description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-white/80 transition-colors duration-300 hover:text-accent"
        >
          View Project
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </article>
  );
}
