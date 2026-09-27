import Lenis from "lenis";

let lenis = null;

export function initLenis() {
  if (!lenis) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
  }
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToId(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
