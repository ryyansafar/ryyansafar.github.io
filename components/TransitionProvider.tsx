'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';

// ─── Config ──────────────────────────────────────────────────────────────────
const N = 7;           // number of horizontal strips
const STRIP = '#0d0d0d'; // strip colour (slightly off-black → subtle edges)
const ACCENT = '#ccff00';

// Module-level: false on every hard refresh, true after first boot.
let hasBootedModule = false;

// ─── Context ──────────────────────────────────────────────────────────────────
interface TransitionContextProps { navigateTo: (href: string) => void; }
const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export const usePageTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used within TransitionProvider');
  return ctx;
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const stripH = `${(100 / N).toFixed(4)}%`;

// Slide strips off to the right, bottom→top stagger, then run onDone
function revealStrips(
  strips: (HTMLDivElement | null)[],
  onDone?: () => void
) {
  const tl = gsap.timeline({ onComplete: onDone });
  tl.to([...strips].reverse(), {
    xPercent: 105,
    duration: 0.72,
    ease: 'expo.inOut',
    stagger: 0.07,
  });
  return tl;
}

// Slide strips in from the left, top→bottom stagger, covering the screen
function coverStrips(
  strips: (HTMLDivElement | null)[],
  onDone?: () => void
) {
  gsap.set(strips, { xPercent: -105 });
  const tl = gsap.timeline({ onComplete: onDone });
  tl.to(strips, {
    xPercent: 0,
    duration: 0.55,
    ease: 'power3.inOut',
    stagger: 0.055,
  });
  return tl;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);
  const [hasBooted, setHasBooted] = useState(hasBootedModule);

  const stripsRef = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const counterRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(!hasBootedModule);

  // ── 1. Bootup sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    if (hasBootedModule) return; // already booted this session — skip

    // Make sure content is invisible while preloader runs
    gsap.set(contentRef.current, { opacity: 0 });

    let n = 0;
    const interval = setInterval(() => {
      n = Math.min(100, n + Math.floor(Math.random() * 9) + 4);
      if (counterRef.current) counterRef.current.textContent = `${n}%`;

      if (n >= 100) {
        clearInterval(interval);
        setTimeout(runReveal, 280);
      }
    }, 85);

    function runReveal() {
      const master = gsap.timeline({
        onComplete: () => {
          hasBootedModule = true;
          isFirstMount.current = false;
          setHasBooted(true);
        },
      });

      // Step 1 — counter + label slide up and out
      master.to([counterRef.current, subtitleRef.current], {
        opacity: 0,
        y: -44,
        duration: 0.42,
        ease: 'power2.in',
        stagger: 0.055,
      });

      // Step 2 — strips peel off (bottom strip first)
      master.add(
        revealStrips(stripsRef.current),
        '-=0.1'
      );

      // Step 3 — content fades in, overlapping strip exit
      // No Y-transform: applying transform on contentRef would trap fixed children (nav, cursor)
      master.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.68, ease: 'power3.out' },
        '-=0.52'
      );
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. navigateTo — animated exit then push ─────────────────────────────────
  const navigateTo = (href: string) => {
    if (href === pathname || isPending || !hasBootedModule) return;
    setIsPending(true);

    const master = gsap.timeline({
      onComplete: () => router.push(href),
    });

    // Fade out content
    master.to(contentRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0);

    // Strips sweep in from the left
    master.add(coverStrips(stripsRef.current), 0.05);
  };

  // ── 3. Reveal after route change ────────────────────────────────────────────
  useEffect(() => {
    if (isFirstMount.current) return; // preloader handled first reveal

    gsap.killTweensOf(stripsRef.current);
    gsap.killTweensOf(contentRef.current);

    // Strips should be covering the screen already (from coverStrips in navigateTo)
    // For regular <Link> navigations there's no cover — set them now
    gsap.set(stripsRef.current, { xPercent: 0 });
    gsap.set(contentRef.current, { opacity: 0 });

    const master = gsap.timeline({ onComplete: () => setIsPending(false) });

    // Strips peel off
    master.add(revealStrips(stripsRef.current));

    // Content fades in
    master.to(
      contentRef.current,
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.48'
    );

    return () => { master.kill(); };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigateTo }}>

      {/* ── Horizontal transition strips (always in DOM) ── */}
      {Array.from({ length: N }, (_, i) => (
        <div
          key={i}
          ref={el => { stripsRef.current[i] = el; }}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: 0,
            top: `${(i / N) * 100}%`,
            width: '100%',
            height: stripH,
            backgroundColor: STRIP,
            zIndex: 9990,
            willChange: 'transform',
          }}
        />
      ))}

      {/* ── Preloader text (removed after boot) ── */}
      {!hasBooted && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            gap: '1.25rem',
          }}
        >
          <div
            ref={counterRef}
            suppressHydrationWarning
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(5.5rem, 20vw, 11rem)',
              fontWeight: 700,
              color: ACCENT,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textShadow: `0 0 80px ${ACCENT}44`,
            }}
          >
            0%
          </div>
          <div
            ref={subtitleRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
              fontWeight: 500,
              color: 'rgba(240,240,240,0.3)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          >
            Ryyan Safar — Portfolio
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div ref={contentRef}>
        {children}
      </div>

    </TransitionContext.Provider>
  );
};
