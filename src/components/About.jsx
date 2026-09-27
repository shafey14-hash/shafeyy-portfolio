import { useLayoutEffect, useRef } from "react";
import { Brain, Eye, Server } from "lucide-react";
import { gsap } from "../lib/gsap";
import { site } from "../data/site";
import TechMarquee from "./TechMarquee";

const SKILLS = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    desc: "ML models, LLM-powered agents and automation systems that solve real business problems — end to end.",
    chips: ["Python", "Machine Learning", "AI Agents"],
  },
  {
    icon: Eye,
    title: "Computer Vision",
    desc: "Real-time vision systems that see, track and understand — from gesture recognition to detection pipelines.",
    chips: ["OpenCV", "MediaPipe", "Real-time ML"],
  },
  {
    icon: Server,
    title: "Full-Stack Development",
    desc: "Complete web platforms — robust APIs, clean reactive UIs and reliable databases in production.",
    chips: ["Node.js", "Express", "MySQL", "React"],
  },
];

export default function About() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-heading",
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
        ".about-intro",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-intro", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".skill-card",
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".skills-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="about-heading">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
            01 — About
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Engineering intelligence,
            <br />
            <span className="text-gradient">shipping products.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="about-intro">
            <p className="text-lg leading-relaxed text-white/75">
              I'm <span className="font-semibold text-white">Shafey</span> — an{" "}
              {site.role} based in {site.location}. I build intelligent systems
              that live in the real world: an AI receptionist answering calls at
              a dental clinic, a computer-vision model reading sign language in
              real time, and full-stack platforms serving real customers.
            </p>
            <p className="mt-6 leading-relaxed text-white/55">
              My work sits at the intersection of machine learning and practical
              software engineering — taking models out of notebooks and into
              production, with Node.js, Express and MySQL on the back of
              interfaces people actually enjoy using.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["AI / ML", "Computer Vision", "Node.js", "Express", "MySQL", "React"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="skills-grid flex flex-col gap-5">
            {SKILLS.map((skill) => (
              <div
                key={skill.title}
                className="skill-card glass group rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-accent/10 p-3 text-accent transition-transform duration-300 group-hover:scale-110">
                    <skill.icon size={24} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {skill.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {skill.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skill.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-accent/90"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TechMarquee />
    </section>
  );
}
