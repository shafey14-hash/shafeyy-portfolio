import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "./lib/gsap";
import { initLenis, destroyLenis } from "./lib/smooth";
import { scrollState } from "./lib/scrollState";
import SceneCanvas from "./components/scene/SceneCanvas";
import Navbar from "./components/Navbar";
import ProgressBar from "./components/ProgressBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useLayoutEffect(() => {
    const lenis = initLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        },
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
      gsap.ticker.remove(tick);
      destroyLenis();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />
      <ProgressBar />
      <SceneCanvas />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
