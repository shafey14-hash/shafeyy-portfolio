import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

/*
 * HORIZONTAL SCROLL GALLERY
 * ─────────────────────────
 * GSAP ScrollTrigger pin + translateX scrub tween.
 * Lenis already drives ScrollTrigger via the ticker set up in App.jsx,
 * so we just let ScrollTrigger do the pinning — no need to stop/start Lenis.
 *
 * Layout math:
 *   visible cards on desktop = 3, tablet = 2, mobile = 1
 *   The strip (trackRef) is as wide as all cards + gaps.
 *   We tween x: 0 → -(hiddenCards * (cardW + gap))  while the section is pinned.
 *   pin scroll distance = that same number of pixels so wheel speed feels 1:1.
 */

const GAP = 24; // gap-6 → 1.5 rem = 24 px (matches Tailwind gap-6 at 16px base)

function getVisible() {
  const vw = window.innerWidth;
  if (vw >= 1024) return 3;
  if (vw >= 640)  return 2;
  return 1;
}

export default function Projects() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const wrapperRef = useRef(null); // overflow:hidden clip area
  const trackRef   = useRef(null); // the sliding strip

  useLayoutEffect(() => {
    /* ── 1. heading reveal (plain scroll-triggered fade) ── */
    const headCtx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    });

    /* ── 2. horizontal gallery ── */
    let horizCtx;

    const buildHoriz = () => {
      horizCtx?.revert();

      /* reduced-motion: bail out */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const visible = getVisible();
      const total   = projects.length; // 5
      const hidden  = total - visible; // cards that need to scroll into view

      /* inner clip-area width (px) — this is "one screen worth" of cards */
      const wrapperW = wrapperRef.current.offsetWidth;

      /* card width so exactly `visible` cards + gaps fill the wrapper */
      const cardW = (wrapperW - GAP * (visible - 1)) / visible;

      /* total strip width */
      const stripW = total * cardW + (total - 1) * GAP;

      /* distance the strip travels */
      const travel = hidden * (cardW + GAP);

      /* size all card wrappers */
      const cardWrps = trackRef.current.querySelectorAll(".proj-card-wrap");
      cardWrps.forEach((el) => {
        el.style.width    = `${cardW}px`;
        el.style.minWidth = `${cardW}px`;
        el.style.flexShrink = "0";
      });
      trackRef.current.style.width = `${stripW}px`;

      horizCtx = gsap.context(() => {
        /* main tween: slide the strip */
        gsap.fromTo(
          trackRef.current,
          { x: 0 },
          {
            x: -travel,
            ease: "none",
            scrollTrigger: {
              id: "projects-horiz",
              trigger: sectionRef.current,
              pin: true,
              anticipatePin: 1,
              scrub: 1.2,
              start: "top top",
              /* scroll distance = travel so 1 px of scroll = 1 px of card movement */
              end: () => `+=${travel}`,
              invalidateOnRefresh: true,
            },
          }
        );

        /* per-card fade-in stagger — fires as each card first enters the wrapper */
        cardWrps.forEach((wrap, i) => {
          gsap.fromTo(
            wrap,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                /* only run once on the way in */
                toggleActions: "play none none none",
              },
              delay: i * 0.09,
            }
          );
        });
      });
    };

    buildHoriz();
    ScrollTrigger.refresh();

    /* rebuild on resize (debounced 200 ms) */
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildHoriz();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      headCtx.revert();
      horizCtx?.revert();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      /* Enough top padding so the heading is visible before the pin engages */
      className="relative overflow-visible py-20 md:py-28"
    >
      {/* ── Section heading ── */}
      <div
        ref={headingRef}
        className="projects-heading mx-auto max-w-6xl px-6 pb-12"
      >
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
          02 — Projects
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
          Selected <span className="text-gradient">work.</span>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-white/55">
          Real systems built for real users — from an AI receptionist handling
          live clinic calls to a computer-vision model reading sign language in
          real time.
        </p>
      </div>

      {/* ── Horizontal gallery ── */}
      {/*
        wrapperRef clips the sliding strip.
        px-6 gives left-edge alignment matching the heading.
        overflow-hidden is essential — no scrollbar, no overflow clipping issues.
      */}
      <div
        ref={wrapperRef}
        className="overflow-hidden px-6"
      >
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
        >
          {projects.map((project, i) => (
            <div key={project.id} className="proj-card-wrap">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
