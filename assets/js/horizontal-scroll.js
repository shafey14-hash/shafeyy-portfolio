/* ============================================================
   horizontal-scroll.js — performs the actual horizontal slide
   whenever scroll-controller.js requests a panel change. This
   file doesn't decide WHEN to move (that's scroll-controller.js's
   job) — it only knows HOW to move.

   Additionally, this file owns the PROJECT CARD GALLERY that lives
   inside the projects panel (.h-panel--projects). When
   scroll-controller.js dispatches `projects:cardscroll`, this file
   moves the .proj-gallery-track smoothly using GSAP and updates
   the dot pagination. It exposes state via window.__projGallery so
   scroll-controller.js can query how many cards remain.

   Reports back with `horizontal:transitionend` when the outer
   panel slide finishes, which is what re-enables input in
   scroll-controller.js.
============================================================ */
(function () {
  "use strict";

  const track = document.querySelector(".horizontal-track");
  const panels = Array.from(document.querySelectorAll(".h-panel"));
  if (!track || !panels.length) return;

  const reduceMotion = window.SITE && window.SITE.reduceMotion;
  if (reduceMotion) return; // panels stack normally — nothing to slide

  /* ============================================================
     OUTER PANEL SLIDING (unchanged logic)
  ============================================================ */
  function xFor(index) {
    return -index * window.innerWidth;
  }

  window.addEventListener("horizontal:panelchange", (e) => {
    const { index, direction } = e.detail;

    if (window.gsap) {
      gsap.to(track, {
        x: xFor(index),
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => window.dispatchEvent(new CustomEvent("horizontal:transitionend")),
      });
    } else {
      track.style.transform = `translate3d(${xFor(index)}px,0,0)`;
      window.dispatchEvent(new CustomEvent("horizontal:transitionend"));
    }

    panels.forEach((p, i) => p.classList.toggle("is-active", i === index));

    // land the incoming panel's text at its top (scrolling forward) or
    // bottom (scrolling backward), so continued scrolling reads naturally
    const enteringCopy = panels[index].querySelector(".panel-copy");
    if (enteringCopy) {
      enteringCopy.scrollTop =
        direction === "forward" ? 0 : Math.max(0, enteringCopy.scrollHeight - enteringCopy.clientHeight);
    }
  });

  // keep the active panel correctly positioned through resizes/rotation
  window.addEventListener("resize", () => {
    const activeEl = document.querySelector(".h-panel.is-active") || panels[0];
    const index = panels.indexOf(activeEl);
    const x = xFor(Math.max(0, index));
    if (window.gsap) gsap.set(track, { x });
    else track.style.transform = `translate3d(${x}px,0,0)`;

    // also refresh the card gallery on resize
    refreshGallery();
  });

  /* ============================================================
     PROJECT CARD GALLERY
  ============================================================ */
  const projTrack = document.getElementById("projTrack");
  const projDotsContainer = document.getElementById("projDots");

  if (!projTrack) return;

  const cards = Array.from(projTrack.querySelectorAll(".proj-card"));
  const TOTAL_CARDS = cards.length; // 5

  // How many cards are visible simultaneously (responsive)
  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 1100) return 2;
    return 3;
  }

  // Maximum card index we can scroll to (index of left-most visible card)
  function maxCardIndex() {
    return Math.max(0, TOTAL_CARDS - visibleCount());
  }

  let activeCard = 0;       // index of left-most visible card
  let cardTransitioning = false;

  // Expose state so scroll-controller.js can query it
  window.__projGallery = {
    get activeCard() { return activeCard; },
    get cardCount() { return TOTAL_CARDS; },
    get visibleCards() { return visibleCount(); },
  };

  /* ---- Dot pagination ---- */
  // We show one dot per "step" (number of times user can scroll forward)
  // = maxCardIndex + 1 positions (0 … maxCardIndex)
  function buildDots() {
    if (!projDotsContainer) return;
    const steps = maxCardIndex() + 1;
    projDotsContainer.innerHTML = "";
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement("span");
      dot.className = "proj-dot" + (i === activeCard ? " proj-dot--active" : "");
      projDotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!projDotsContainer) return;
    const dots = projDotsContainer.querySelectorAll(".proj-dot");
    dots.forEach((d, i) => d.classList.toggle("proj-dot--active", i === activeCard));
  }

  /* ---- Compute x offset for a given card index ---- */
  function cardXFor(index) {
    if (!cards.length) return 0;
    // Cards use CSS flex with a gap. We read the actual card width + gap from DOM.
    const wrap = projTrack.parentElement; // .proj-gallery-wrap
    if (!wrap) return 0;
    const wrapW = wrap.clientWidth;
    const gap = parseFloat(getComputedStyle(projTrack).gap) || 20;
    const vis = visibleCount();
    // Each card width = (wrapW - (vis-1)*gap) / vis
    const cardW = (wrapW - (vis - 1) * gap) / vis;
    return -(index * (cardW + gap));
  }

  /* ---- Move to a specific card index ---- */
  function goToCard(index, animate) {
    index = Math.max(0, Math.min(maxCardIndex(), index));
    activeCard = index;
    const x = cardXFor(index);

    if (animate !== false && window.gsap) {
      cardTransitioning = true;
      gsap.to(projTrack, {
        x,
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => { cardTransitioning = false; },
      });
    } else {
      if (window.gsap) gsap.set(projTrack, { x });
      else projTrack.style.transform = `translate3d(${x}px,0,0)`;
      cardTransitioning = false;
    }

    updateDots();
  }

  /* ---- Accumulate scroll deltas and step cards ---- */
  // We use an accumulator so that many small wheel ticks add up to one
  // card step, while one large swipe also results in one step.
  const DELTA_THRESHOLD = 80; // accumulated delta needed to advance one card
  let deltaAccum = 0;
  let accumTimer = null;

  function resetAccum() {
    deltaAccum = 0;
    if (accumTimer) { clearTimeout(accumTimer); accumTimer = null; }
  }

  window.addEventListener("projects:cardscroll", (e) => {
    if (cardTransitioning) return;
    const { dir, magnitude } = e.detail;

    deltaAccum += magnitude * dir;

    // Auto-reset accumulator if user pauses for 300ms (prevents ghost advances)
    if (accumTimer) clearTimeout(accumTimer);
    accumTimer = setTimeout(resetAccum, 300);

    if (deltaAccum >= DELTA_THRESHOLD) {
      resetAccum();
      if (activeCard < maxCardIndex()) goToCard(activeCard + 1);
    } else if (deltaAccum <= -DELTA_THRESHOLD) {
      resetAccum();
      if (activeCard > 0) goToCard(activeCard - 1);
    }
  });

  /* ---- Jump to a specific card (used by scroll-controller for
     bidirectional entry when switching panels) ---- */
  window.addEventListener("projects:cardset", (e) => {
    const idx = e.detail.cardIndex;
    goToCard(idx, false); // no animation — instant reset
  });

  /* ---- Initialise + keep refreshed on resize ---- */
  function refreshGallery() {
    buildDots();
    // Clamp activeCard to new maxCardIndex in case viewport got wider
    activeCard = Math.min(activeCard, maxCardIndex());
    goToCard(activeCard, false);
  }

  // Run after layout is painted so clientWidth is accurate
  requestAnimationFrame(() => {
    refreshGallery();
  });

  // Also refresh once fonts/assets have loaded (more accurate card widths)
  window.addEventListener("load", () => refreshGallery());
})();
