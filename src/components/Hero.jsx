import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { FRAME_COUNT, frameUrl } from "../lib/frames";

const NAME = "SHAFEY".split("");

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const indicatorRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const c2d = canvas.getContext("2d");
    const images = new Array(FRAME_COUNT);
    let progress = 0;
    let revealed = false;
    let indicatorShown = false;

    const drawCover = (img, zoom) => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      c2d.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const render = () => {
      const idx = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      drawCover(img, 1.14 - 0.14 * progress);
    };

    const setIndicator = (show) => {
      if (indicatorShown === show) return;
      indicatorShown = show;
      gsap.to(indicatorRef.current, {
        opacity: show ? 1 : 0,
        y: show ? 0 : 10,
        duration: 0.5,
        overwrite: true,
      });
    };

    const fitCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      render();
    };

    const ctx = gsap.context(() => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (i === 0 && !revealed) {
            revealed = true;
            render();
            gsap.to(canvas, { opacity: 1, duration: 1.2, ease: "power2.out" });
          } else {
            render();
          }
        };
        img.src = frameUrl(i);
        images[i] = img;
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress = self.progress;
          render();
          setIndicator(progress < 0.04);
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      tl.to(contentRef.current, { yPercent: -35, opacity: 0, ease: "none", duration: 0.5 }, 0).to(
        stageRef.current,
        { opacity: 0, ease: "none", duration: 0.15 },
        0.85
      );

      gsap.set(".hero-letter", { yPercent: 120 });
      gsap.set([".hero-line", ".hero-sub"], { opacity: 0, y: 26 });
      gsap.set(indicatorRef.current, { opacity: 0 });

      const intro = gsap.timeline({ delay: 0.25 });
      intro
        .to(".hero-letter", { yPercent: 0, duration: 1.1, stagger: 0.055, ease: "power4.out" })
        .to(".hero-line", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.55")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.45")
        .call(() => setIndicator(true), null, "-=0.2");

      window.addEventListener("resize", fitCanvas);
    }, sectionRef);

    fitCanvas();

    return () => {
      window.removeEventListener("resize", fitCanvas);
      ctx.revert();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative h-[280vh]">
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{ opacity: 0 }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-0 z-10 flex select-none flex-col items-center justify-center px-6 text-center"
        >
          <h1 className="font-display font-bold leading-none tracking-tight">
            {NAME.map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <span className="hero-letter text-gradient inline-block text-[clamp(3.8rem,15vw,11.5rem)]">
                  {letter}
                </span>
              </span>
            ))}
          </h1>
          <div className="hero-line mt-6 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <p className="hero-sub mt-6 text-[clamp(0.75rem,2vw,1.05rem)] font-medium uppercase tracking-[0.4em] text-white/75">
            AI Engineer — Full-Stack Developer
          </p>
        </div>

        <div
          ref={indicatorRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/60">
            Scroll
          </span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/35 p-1.5">
            <div className="scroll-dot h-2 w-1 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
