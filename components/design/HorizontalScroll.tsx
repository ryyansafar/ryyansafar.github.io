'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProjectCard, { Project } from './ProjectCard';

interface HorizontalScrollProps {
  projects: Project[];
  onProgressChange?: (p: number) => void;
  onBackToMain: () => void;
}

export default function HorizontalScroll({
  projects,
  onProgressChange,
  onBackToMain,
}: HorizontalScrollProps) {
  const wrapperRef       = useRef<HTMLDivElement>(null);
  const trackRef         = useRef<HTMLDivElement>(null);
  const progressRef      = useRef<HTMLDivElement>(null);
  // Reference to the live ScrollTrigger instance — used by scrollToCard
  const stRef            = useRef<any>(null);
  const cleanupRef       = useRef<(() => void) | null>(null);
  const cardsRef         = useRef<HTMLElement[]>([]);
  const lastCardCheckRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    let cancelled = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // On mobile: skip the GSAP pin/horizontal-scroll entirely.
      // CSS handles the vertical stack layout.
      if (window.innerWidth <= 768) {
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-card'));
        cardsRef.current = cards;
        gsap.set(cards, { opacity: 0, y: 24 });
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.2 });
        return;
      }

      const ctx = gsap.context(() => {
        // Entrance animation for cards
        const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-card'));
        cardsRef.current = cards;
        gsap.set(cards, { opacity: 0, y: 24 });
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          stagger: 0.1, delay: 0.2,
        });

        // ── Horizontal scroll via GSAP pin ────────────────────────────────
        // pin: true makes GSAP apply position:fixed to the wrapper while
        // scrolling — this is immune to ancestor overflow:hidden breaking
        // position:sticky (which was the previous bug).
        // GSAP also auto-creates a spacer div with the correct scroll height.
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
        });

        stRef.current = ScrollTrigger.create({
          animation: tween,
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Drive progress bar via direct DOM — zero re-renders
            if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;
            onProgressChange?.(p);

            // Throttle active-card detection to ~20 fps
            const now = performance.now();
            if (now - lastCardCheckRef.current < 50) return;
            lastCardCheckRef.current = now;

            if (!cardsRef.current.length) return;
            const cx = window.innerWidth / 2;
            let closest = 0, minDist = Infinity;
            cardsRef.current.forEach((card, i) => {
              const r = card.getBoundingClientRect();
              const d = Math.abs(r.left + r.width / 2 - cx);
              if (d < minDist) { minDist = d; closest = i; }
            });
            setActiveIndex(closest);
          },
        });
      }, wrapper);

      // Re-measure after Fontshare fonts settle (async CDN load)
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      cleanupRef.current = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Jump-scroll so card `idx` centres in the viewport.
  // Uses st.start (GSAP's recorded pin start scroll-y) + linear progress.
  const scrollToCard = useCallback((idx: number) => {
    const track = trackRef.current;
    const st    = stRef.current;
    if (!track || !st) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-card'));
    const target = cards[idx];
    if (!target) return;

    const totalScroll = track.scrollWidth - window.innerWidth;
    if (totalScroll <= 0) return;

    const centreOffset = target.offsetLeft - window.innerWidth / 2 + target.offsetWidth / 2;
    const progress = Math.max(0, Math.min(1, centreOffset / totalScroll));

    // st.start is the page-scroll-y where the pin begins
    window.scrollTo({ top: st.start + progress * totalScroll, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Progress bar — DOM-driven, no React re-renders */}
      <div ref={progressRef} className="scroll-progress-bar" aria-hidden="true" />

      {/* wrapperRef is the GSAP pin target — becomes position:fixed while active */}
      <div ref={wrapperRef} className="horizontal-scroll-wrapper">

        {/* Top label bar */}
        <div className="hs-terminal-header">
          <span>Selected Work</span>
          <span>{new Date().getFullYear()} — Design &amp; Frontend</span>
        </div>

        {/* Card track — GSAP translates this horizontally */}
        <div ref={trackRef} className="horizontal-scroll-track">

          {/* Intro panel */}
          <div className="scroll-section-intro">
            <div className="section-label">Selected Work —</div>
            <div className="section-poster" aria-hidden>
              <div className="section-poster-rule" />
              <div className="section-poster-text">
                <span>RYYAN</span>
                <span>SAFAR</span>
              </div>
            </div>
            <p className="section-sub">
              Engineering · Design · Motion<br />
              Hover to explore.
            </p>
          </div>

          {/* Project cards */}
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isActive={i === activeIndex}
            />
          ))}

          {/* End panel */}
          <div className="design-footer-panel">
            <div className="design-footer-label">RS / Portfolio</div>
            <div className="footer-code-craft" aria-label="Code slash Craft">
              <span className="fcc-word fcc-code">CODE</span>
              <span className="fcc-sep">/</span>
              <span className="fcc-word fcc-craft">CRAFT</span>
            </div>
            <button
              className="design-footer-back-btn"
              onClick={onBackToMain}
              aria-label="Go back to main portfolio"
            >
              ← Main Portfolio
            </button>
            <div className="design-footer-links">
              <div className="design-footer-link-line">
                <a href="https://github.com/ryyansafar" target="_blank" rel="noopener noreferrer">
                  github.com/ryyansafar
                </a>
              </div>
              <div className="design-footer-link-line">
                <a href="mailto:safarryyan@gmail.com">safarryyan@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom HUD — tick indicator */}
        <div className="hs-bottom-hud">
          <span className="hs-hud-label">Selected Work</span>

          <div className="hs-indicator-track" role="tablist" aria-label="Project navigation">
            {projects.map((project, i) => (
              <button
                key={project.id}
                role="tab"
                className={`hs-indicator-item${i === activeIndex ? ' hs-indicator-item--active' : ''}`}
                onClick={() => scrollToCard(i)}
                aria-selected={i === activeIndex}
                aria-label={`${project.title} — project ${i + 1}`}
              >
                <div className="hs-indicator-tick" />
                <span className="hs-indicator-num">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <span className="hs-hud-label">Scroll ⟶</span>
        </div>

      </div>
    </>
  );
}
