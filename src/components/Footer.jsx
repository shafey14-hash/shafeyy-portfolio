import { ArrowUp } from "lucide-react";
import { scrollToId } from "../lib/smooth";
import { site } from "../data/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/50 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-white/45">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="text-sm text-white/35">
          Built with React, Three.js & GSAP
        </p>
        <button
          onClick={() => scrollToId("#home")}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 transition-all duration-300 hover:border-accent/50 hover:text-accent"
        >
          Back to top
          <ArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
