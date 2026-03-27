'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePageTransition } from '@/components/TransitionProvider';

function GalleryCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // Hide the global script.js cursor — gallery has its own
    const mainCursor = document.getElementById('custom-cursor');
    if (mainCursor) mainCursor.style.display = 'none';

    el.style.display = 'none';

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let x = mx, y = my, vx = 0, vy = 0;
    let scaleCur = 1, scaleTarget = 1, scaleVel = 0;
    let hbc = 0, hbt = 0, hbv = 0;
    const HB_MAX = 1.2, HB_STIFF = 180, HB_DAMP = 22;
    let lastTime = performance.now();
    let raf: number;

    const POS_STIFF = 240, POS_DAMP = 27;
    const SCL_STIFF = 330, SCL_DAMP = 30;

    const onMove = (e: MouseEvent) => {
      if (el.style.display === 'none') el.style.display = 'block';
      mx = e.clientX; my = e.clientY;
    };
    const onTouch = () => { el.style.display = 'none'; };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) { scaleTarget = 1.3; hbt = HB_MAX; }
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('a, button')) { scaleTarget = 1; hbt = 0; }
    };
    const onDown = () => { scaleTarget = 0.65; };
    const onUp   = () => { scaleTarget = 1; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchstart', onTouch, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const ax = (mx - x) * POS_STIFF - vx * POS_DAMP;
      const ay = (my - y) * POS_STIFF - vy * POS_DAMP;
      vx += ax * dt; vy += ay * dt;
      x  += vx * dt; y  += vy * dt;

      const sa = (scaleTarget - scaleCur) * SCL_STIFF - scaleVel * SCL_DAMP;
      scaleVel += sa * dt;
      scaleCur += scaleVel * dt;

      // Hover blur spring
      hbv += ((hbt - hbc) * HB_STIFF - hbv * HB_DAMP) * dt;
      hbc += hbv * dt;
      if (hbc < 0) hbc = 0;

      el.style.transform = `translate(${x}px,${y}px) scale(${scaleCur})`;

      // Motion blur (directional) + hover blur (uniform) combined
      const speed = Math.sqrt(vx * vx + vy * vy);
      const blurEl = el.querySelector<SVGFEGaussianBlurElement>('#gl-blur');
      if (blurEl) {
        const motionAmt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
        const angle = motionAmt > 0 ? Math.atan2(vy, vx) : 0;
        const bx = Math.abs(Math.cos(angle)) * motionAmt + hbc;
        const by = Math.abs(Math.sin(angle)) * motionAmt + hbc;
        blurEl.setAttribute('stdDeviation',
          bx > 0.05 || by > 0.05 ? `${bx.toFixed(2)} ${by.toFixed(2)}` : '0 0');
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouch);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
      // Restore global cursor when leaving gallery
      const mc = document.getElementById('custom-cursor');
      if (mc) mc.style.display = '';
    };
  }, []);

  return (
    <div ref={cursorRef} className="gl-cursor-wrapper" style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9999,
      pointerEvents: 'none', willChange: 'transform',
      transformOrigin: '0 0',
    }}>
      <svg width="22" height="28" viewBox="0 0 22 28" overflow="visible" fill="none">
        <defs>
          <filter id="gl-mb" x="-150%" y="-150%" width="400%" height="400%" colorInterpolationFilters="sRGB">
            <feGaussianBlur id="gl-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#gl-mb)">
          <path d="M1 1 L1 23 L6 18 L10.5 26 L13.5 24.5 L9 17 L16.5 17 Z"
            fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M2.5 3.5 L2.5 20.5 L6.2 16.5 L10.8 24.2 L12 23.6 L7.5 16 L14.5 16 Z" fill="white" />
        </g>
      </svg>
    </div>
  );
}

const P = [
  {
    id: '01',
    title: 'RYYAN_SAFAR.SITE',
    category: 'PORTFOLIO / ENGINEERING',
    description:
      'Main engineering portfolio. Three.js particle field, GSAP scroll animations, Lenis smooth scroll, Lanyard card physics.',
    tech: ['Three.js', 'GSAP', 'Next.js 16', 'Lenis'],
    url: 'https://ryyansafar.site',
    year: 'EST. 2026',
  },
  {
    id: '02',
    title: 'HELP_ME_SURVIVE_COLLEGE',
    category: 'UTILITY / WEB APP',
    description:
      'ESE grade planner, attendance tracker, CGPA calculator for KTU students. No login, no ads, terminal-dark aesthetic.',
    tech: ['Next.js', 'TypeScript', 'No-auth', 'KTU'],
    url: 'https://lifesaver.ryyansafar.site',
    year: 'EST. 2026',
  },
  {
    id: '03',
    title: 'TEAMAPT.IN',
    category: 'COMPANY WEBSITE',
    description:
      'Designed and shipped the company website for TeamApt — layout, branding, and deployment. Flask REST backend, MySQL.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Multi-page'],
    url: 'https://teamapt.in',
    year: 'EST. 2026',
  },
  {
    id: '04',
    title: 'TINKERSPACE_3D_QUEUE',
    category: 'COMMUNITY TOOL',
    description:
      'Community 3D printer queue management for TinkerSpace makerspace. Approval workflow, email notifications, live status.',
    tech: ['Next.js', 'VercelBlob', 'Vercel', 'Firebase'],
    url: 'https://tinkerspace-3d-printing-queue.vercel.app',
    year: 'EST. 2026',
  },
  {
    id: '05',
    title: 'WALLPAPERS_GALLERY',
    category: 'CREATIVE / WALLPAPERS',
    description:
      'Custom digital wallpaper gallery. Acid green geometry on obsidian — mobile lock screens, desktop covers, and ultrawide screensavers. All free to download.',
    tech: ['Next.js', 'Vercel', 'Space Grotesk', 'Barrio'],
    url: 'https://wallpapers.ryyansafar.site',
    year: 'EST. 2026',
  },
  {
    id: '06',
    title: 'LITERATURE_CLOCK',
    category: 'HARDWARE / WEB SIMULATION',
    description:
      'Browser simulation of a 191×278 electromagnetic flip-disc display — 53,098 discs showing a literary quote for every minute of the day. Includes ESP32 firmware for the physical installation.',
    tech: ['Vanilla JS', 'HTML/CSS', 'ESP32', 'GitHub Pages'],
    url: 'https://litclock.ryyansafar.site',
    year: 'EST. 2026',
  },
  {
    id: '07',
    title: 'SMOKE_RYYANSAFAR_SITE',
    category: 'RESTAURANT / WEB DESIGN',
    description:
      'Design showcase for a fictional smokehouse restaurant — menu presentation, catering services, and table reservations. Built to explore food brand web design.',
    tech: ['Next.js', 'Oswald', 'Plus Jakarta Sans', 'Custom CSS'],
    url: 'https://smoke.ryyansafar.site',
    year: 'EST. 2026',
  },
] as const;

function LiveIframe({ url, title }: { url: string; title: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // rootMargin: preload when within 1 viewport-width away horizontally
    // (catches the next panel before the user scrolls to it)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 100% 0px 100%' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={sentinelRef} style={{ position: 'absolute', inset: 0 }}>
      {loaded ? (
        <iframe
          src={url}
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '200%', height: '200%',
            transform: 'scale(0.5)', transformOrigin: 'top left',
            border: 'none', pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem', letterSpacing: '0.14em', color: 'rgba(128,128,128,0.3)', textTransform: 'uppercase' }}>LOADING…</span>
        </div>
      )}
    </div>
  );
}

function Tag({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
      padding: '2px 8px',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '0.5625rem',
      letterSpacing: '0.08em',
      color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(27,28,25,0.5)',
      textTransform: 'uppercase',
    }}>{label}</span>
  );
}


export default function GalleryPage() {
  const { navigateTo } = usePageTransition();
  const rootRef        = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Convert vertical wheel scroll to horizontal scroll (only in horizontal mode)
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (root.scrollWidth > root.clientWidth + 10) {
          e.preventDefault();
          root.scrollLeft += e.deltaY;
        }
      }
    };

    // Drive progress bar via direct DOM — no re-renders
    const onScroll = () => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const max = root.scrollWidth - root.clientWidth;
      const p   = max > 0 ? root.scrollLeft / max : 0;
      bar.style.width = `${Math.max(4, p * 100)}%`;
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barrio&family=Epilogue:wght@700;900&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;500;700&family=Work+Sans:wght@400;600&display=swap');

        .gl-root, .gl-root * { cursor: none !important; }

        .gl-root {
          background: #fbf9f4;
          color: #1b1c19;
          font-family: 'Work Sans', sans-serif;
          overflow-y: hidden;
          overflow-x: auto;
          scrollbar-width: none;
          height: 100dvh;
        }
        .gl-root::-webkit-scrollbar { display: none; }

        .gl-track {
          display: flex;
          width: 800vw;
          height: 100vh;
        }

        .gl-panel {
          width: 100vw;
          height: 100vh;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .gl-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
        }

        .gl-open-btn {
          display: inline-block;
          background: #1b1c19;
          color: #fbf9f4;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: background 0.15s;
        }
        .gl-open-btn:hover { background: #715c00; }

        .gl-open-btn-green {
          display: inline-block;
          background: #a8e060;
          color: #0d0f0a;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .gl-open-btn-green:hover { opacity: 0.8; }

        .gl-open-btn-gold {
          display: inline-block;
          background: #000;
          color: #f7c533;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .gl-open-btn-gold:hover { opacity: 0.75; }

        /* Panel 3 bento border */
        .gl-bento-card {
          border-right: 1px solid rgba(27,28,25,0.1);
          padding: 1.5rem 1.75rem;
        }
        .gl-bento-card:last-child { border-right: none; }

        /* Arrow visibility */
        .gl-arrow-mobile { display: none; }

        /* Floating nav chips */
        .gl-nav-chip {
          display: inline-block;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.5625rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1b1c19;
          text-decoration: none;
          background: rgba(251,249,244,0.88);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(27,28,25,0.1);
          padding: 0.3rem 0.65rem;
          pointer-events: auto;
          transition: background 0.15s, color 0.15s;
        }
        .gl-nav-chip:hover {
          background: #1b1c19;
          color: #fbf9f4;
        }

        /* ═══════════════════════════════════════════════════════
           PANEL 0 — baked element positions (desktop)
           ═══════════════════════════════════════════════════════ */
        .gl-p0-poster-wrap  { transform: translate(69px, 96px); width: 664px; }
        .gl-p0-sticky-wrap  { transform: translate(-392px, -134px); }
        .gl-p0-label-wrap   { transform: translate(-170px, 45px); }
        .gl-p0-arrowd-wrap  { transform: translate(377px, -300px) rotate(30deg); }
        .gl-p0-arrowm-wrap  { display: none; }

        /* ═══════════════════════════════════════════════════════
           MOBILE — vertical scroll, stacked columns
           ═══════════════════════════════════════════════════════ */
        @media (max-width: 768px) {

          /* Switch from horizontal to vertical */
          .gl-root {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .gl-track {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
          }
          .gl-panel {
            width: 100% !important;
            height: auto !important;
            min-height: 100svh !important;
          }

          /* Compact fixed header — restore bg on mobile for readability */
          .gl-header {
            padding: 0.875rem 1.25rem !important;
            background: rgba(251,249,244,0.93) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            backdrop-filter: blur(10px) !important;
            pointer-events: auto !important;
            border-bottom: 1px solid rgba(27,28,25,0.06) !important;
          }
          .gl-header nav { gap: 0.4rem !important; }

          /* Hide desktop-only chrome */
          .gl-progress-dots,
          .gl-scroll-hint { display: none !important; }

          /* Swap arrows on mobile */
          .gl-arrow-desktop { display: none !important; }
          .gl-arrow-mobile {
            display: block !important;
            align-self: center !important;
            margin-right: 0 !important;
            margin-top: 1.25rem !important;
          }

          /* Panel 0 — intro */
          .gl-p0-inner {
            padding: 0 1.25rem !important;
            align-items: center !important;
          }
          .gl-intro-box {
            padding: 2rem 2.5rem !important;
            width: calc(100% - 1rem) !important;
            margin-left: 0.75rem !important;
            box-sizing: border-box !important;
            transform: rotate(-1deg) !important;
          }
          .gl-intro-title { font-size: clamp(3.5rem, 13vw, 6rem) !important; }

          /* Panels 1 & 4 — two-col → single-col */
          .gl-panel-split { flex-direction: column !important; }
          .gl-panel-split > div:first-child { flex-direction: column !important; }
          .gl-split-left {
            flex: unset !important;
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.08) !important;
            padding: 5.5rem 1.25rem 2rem !important;
          }
          .gl-split-right {
            flex: unset !important;
            width: 100% !important;
            padding: 1.5rem 1.25rem 2rem !important;
          }
          /* Polaroid slightly smaller, less rotation */
          .gl-polaroid {
            transform: rotate(1deg) scale(0.88) !important;
            transform-origin: top center !important;
          }

          /* Panel 2 — dark terminal */
          .gl-p2 { padding: 5.5rem 1.25rem 2rem !important; }
          .gl-content-row {
            flex-direction: column !important;
            gap: 1.25rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-browser-window {
            flex: unset !important;
            height: 260px !important;
          }
          .gl-meta-col {
            flex: unset !important;
            width: 100% !important;
            align-self: auto !important;
          }

          /* Panel 3 — editorial bento */
          .gl-teamapt-preview {
            flex: unset !important;
            height: 260px !important;
          }
          .gl-bento-row {
            flex-direction: column !important;
            flex: unset !important;
          }
          .gl-bento-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.1) !important;
            padding: 0.875rem 1.25rem !important;
            flex: unset !important;
            width: 100% !important;
          }
          .gl-bento-card:last-child { border-bottom: none !important; }

          /* Open buttons — full-width on mobile */
          .gl-open-btn,
          .gl-open-btn-green,
          .gl-open-btn-gold {
            display: block !important;
            text-align: center !important;
          }

          /* Last-panel footer — stack on mobile */
          .gl-panel-footer {
            flex-direction: column !important;
            gap: 0.75rem !important;
            align-items: flex-start !important;
            padding: 1rem 1.25rem 2rem !important;
          }

          /* Panel 0 — mobile position overrides */
          .gl-p0-poster-wrap  { transform: translate(0, 0) rotate(2deg) !important; width: unset !important; }
          .gl-p0-sticky-wrap  { transform: translate(116px, 23px) !important; }
          .gl-p0-label-wrap   { transform: translate(-22px, -1px) rotate(-9deg) !important; }
          .gl-p0-arrowd-wrap  { display: none !important; }
          .gl-p0-arrowm-wrap  { display: block !important; }

          /* Panel 4 (Wallpapers) — stacked like Panel 2 */
          .gl-p-walls { padding: 5.5rem 1.25rem 2rem !important; }
          .gl-walls-content-row {
            flex-direction: column !important;
            gap: 1.25rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-walls-browser { flex: unset !important; height: 260px !important; }
          .gl-walls-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 5 (Smoke) iframe wrap — taller on mobile */
          .gl-smoke-iframe-wrap {
            width: 100% !important;
            padding-bottom: 100% !important;
          }

          /* Panel 6 (LitClock) iframe wrap — taller on mobile */
          .gl-litclock-iframe-wrap {
            width: 100% !important;
            padding-bottom: 90% !important;
          }
        }

        /* ── LANDSCAPE MOBILE ───────────────────────────────────────────
           Targets phones held sideways (short viewport height, moderate width).
           Keeps the vertical-scroll layout from portrait mode but compacts
           panels so they don't need full 100svh to be readable.
        ─────────────────────────────────────────────────────────────── */
        @media (max-height: 500px) and (orientation: landscape) {

          /* Vertical scroll (same as portrait) */
          .gl-root {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .gl-track {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
          }
          .gl-panel {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            padding-top: 4rem !important;
            padding-bottom: 2rem !important;
          }

          /* Compact header */
          .gl-header {
            padding: 0.5rem 1rem !important;
            background: rgba(251,249,244,0.93) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            backdrop-filter: blur(10px) !important;
            pointer-events: auto !important;
            border-bottom: 1px solid rgba(27,28,25,0.06) !important;
          }
          .gl-header nav { gap: 0.3rem !important; }
          .gl-nav-chip { padding: 0.25rem 0.6rem !important; font-size: 0.6rem !important; }

          /* Hide desktop chrome */
          .gl-progress-dots,
          .gl-scroll-hint { display: none !important; }
          .gl-arrow-desktop { display: none !important; }
          .gl-arrow-mobile {
            display: block !important;
            align-self: center !important;
            margin-top: 0.75rem !important;
          }

          /* Panel 0 intro — compact */
          .gl-p0-inner {
            padding: 0 1rem !important;
            align-items: center !important;
          }
          .gl-intro-box {
            padding: 1.25rem 1.75rem !important;
            width: calc(100% - 1rem) !important;
            box-sizing: border-box !important;
            transform: rotate(-1deg) !important;
          }
          .gl-intro-title { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          .gl-p0-poster-wrap  { transform: translate(0, 0) rotate(2deg) !important; width: unset !important; }
          .gl-p0-sticky-wrap  { display: none !important; }
          .gl-p0-label-wrap   { transform: translate(-22px, -1px) rotate(-9deg) !important; }
          .gl-p0-arrowd-wrap  { display: none !important; }
          .gl-p0-arrowm-wrap  { display: block !important; }

          /* Panels 1 & 4 — two-col → single-col */
          .gl-panel-split { flex-direction: column !important; }
          .gl-panel-split > div:first-child { flex-direction: column !important; }
          .gl-split-left {
            flex: unset !important;
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.08) !important;
            padding: 1rem !important;
          }
          .gl-split-right {
            flex: unset !important;
            width: 100% !important;
            padding: 1rem !important;
          }
          .gl-polaroid { transform: rotate(1deg) scale(0.8) !important; transform-origin: top center !important; }

          /* Panel 2 — dark terminal */
          .gl-p2 { padding: 1rem !important; }
          .gl-content-row {
            flex-direction: column !important;
            gap: 1rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-browser-window { flex: unset !important; height: 200px !important; }
          .gl-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 3 — bento */
          .gl-teamapt-preview { flex: unset !important; height: 200px !important; }
          .gl-bento-row { flex-direction: column !important; flex: unset !important; }
          .gl-bento-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.1) !important;
            padding: 0.75rem 1rem !important;
            flex: unset !important;
            width: 100% !important;
          }
          .gl-bento-card:last-child { border-bottom: none !important; }

          /* Buttons */
          .gl-open-btn,
          .gl-open-btn-green,
          .gl-open-btn-gold {
            display: block !important;
            text-align: center !important;
          }

          /* Last panel footer */
          .gl-panel-footer {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: flex-start !important;
            padding: 0.75rem 1rem 1.5rem !important;
          }

          /* Panel 4 (Wallpapers) — stacked like Panel 2 */
          .gl-p-walls { padding: 1rem !important; }
          .gl-walls-content-row {
            flex-direction: column !important;
            gap: 1rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-walls-browser { flex: unset !important; height: 200px !important; }
          .gl-walls-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 5 (Smoke) iframe wrap */
          .gl-smoke-iframe-wrap {
            width: 100% !important;
            padding-bottom: 70% !important;
          }

          /* Panel 6 (LitClock) iframe wrap */
          .gl-litclock-iframe-wrap {
            width: 100% !important;
            padding-bottom: 70% !important;
          }
        }
      `}</style>


      <GalleryCursor />
      <div className="gl-root" ref={rootRef}>
        <div className="gl-grain" style={{ position: 'fixed', inset: 0, zIndex: 100 }} />

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header className="gl-header" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '1.5rem 2.5rem',
          pointerEvents: 'none',
        }}>
          <Link href="/archive/gallery" style={{
            fontFamily: 'Barrio, cursive', fontSize: '1.25rem',
            textTransform: 'uppercase', letterSpacing: '-0.02em',
            background: '#715c00', color: '#fff',
            padding: '0.15rem 0.85rem', transform: 'rotate(-2deg)',
            display: 'inline-block', boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
            textDecoration: 'none',
            pointerEvents: 'auto',
          }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>DESIGN</Link>

          <nav style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', pointerEvents: 'auto' }}>
            <Link 
              href="/" 
              className="gl-nav-chip"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
            >← MAIN</Link>
            <Link href="/design/components" className="gl-nav-chip" onClick={(e) => { e.preventDefault(); navigateTo('/design/components'); }}>COMPONENTS</Link>
            <a href="https://wallpapers.ryyansafar.site" target="_blank" rel="noopener noreferrer" className="gl-nav-chip">WALLPAPERS ↗</a>
          </nav>
        </header>

        {/* footer moved into Panel 4 — see below */}

        {/* ── SCROLL INDICATOR ───────────────────────────────────────── */}
        <div className="gl-scroll-hint" style={{
          position: 'fixed', bottom: '1.75rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '0.875rem',
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
            fontWeight: 700, letterSpacing: '0.3em',
            color: 'rgba(27,28,25,0.25)', textTransform: 'uppercase',
          }}>SCROLL</span>
          <div style={{ width: '10rem', height: '2px', background: 'rgba(27,28,25,0.1)', position: 'relative' }}>
            <div ref={progressBarRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '0%', background: '#1b1c19' }} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PANELS
        ══════════════════════════════════════════════════════════════ */}
        <main className="gl-track">

          {/* ── PANEL 0: INTRO ──────────────────────────────────────── */}
          <section className="gl-panel" style={{ background: '#fbf9f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Barrio, cursive', fontSize: '22vw',
              color: 'rgba(27,28,25,0.04)', userSelect: 'none',
              pointerEvents: 'none', letterSpacing: '-0.02em',
            }}>WEB</div>

            <div className="gl-p0-inner" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 3rem' }}>
              <div className="gl-p0-label-wrap" style={{ marginBottom: '2rem' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.625rem',
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(27,28,25,0.4)',
                }}>// STUFF I SHIPPED WHEN I SHOULD'VE BEEN STUDYING</span>
              </div>

              <div className="gl-p0-poster-wrap">
                <div className="gl-intro-box" style={{
                  background: '#1b1c19', padding: '2.5rem 3rem',
                  transform: 'rotate(-1.5deg)',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
                }}>
                  <h1 className="gl-intro-title" style={{
                    fontFamily: 'Barrio, cursive', fontSize: 'clamp(4rem, 10vw, 8rem)',
                    lineHeight: 0.9, color: '#f7c533', margin: 0, letterSpacing: '-0.01em',
                  }}>
                    I ALSO<br />LIKE<br />MAKING<br />WEBSITES
                  </h1>
                </div>
              </div>

              {/* Sticky note — scrapbook label */}
              <div className="gl-p0-sticky-wrap" style={{ alignSelf: 'flex-start', marginTop: '0.75rem', marginLeft: '0.5rem', marginBottom: '-1.25rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  background: '#feda5c', padding: '0.2rem 0.75rem',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem',
                  fontWeight: 700, letterSpacing: '0.12em', color: '#715c00',
                  transform: 'rotate(6deg)',
                  boxShadow: '1px 2px 5px rgba(0,0,0,0.13)',
                }}>SHIPPED_BY: RYYAN // UNHINGED BUILDER</div>
              </div>

              {/* Desktop arrow — points right for horizontal scroll */}
              <div className="gl-p0-arrowd-wrap" style={{ marginTop: '2.5rem', alignSelf: 'flex-end', marginRight: '-2rem', position: 'relative', zIndex: 2 }}>
                <div className="gl-arrow-desktop" style={{ opacity: 0.32 }}>
                  <svg width="260" height="195" viewBox="0 0 200 150" fill="none">
                    <path d="M10 140C40 100 160 140 190 10M190 10L170 20M190 10L180 30"
                      stroke="#1b1c19" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              {/* Mobile arrow — points down for vertical scroll */}
              <div className="gl-p0-arrowm-wrap" style={{ alignSelf: 'center' }}>
                <div className="gl-arrow-mobile" style={{ opacity: 0.32 }}>
                  <svg width="130" height="190" viewBox="0 0 120 165" fill="none">
                    <path d="M60 10C20 55 100 90 60 155M60 155L46 136M60 155L73 133"
                      stroke="#1b1c19" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{
              position: 'absolute', bottom: '4rem', left: '4rem',
              fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
              fontSize: '6rem', color: 'rgba(27,28,25,0.06)', lineHeight: 1,
              userSelect: 'none',
            }}>07</div>
          </section>

          {/* ── PANEL 1: RYYAN_SAFAR.SITE — Magazine / Polaroid ────── */}
          {/* Style: Left = editorial text stack, Right = rotating polaroid frame */}
          <section className="gl-panel gl-panel-split" style={{ background: '#f5f3ee', display: 'flex' }}>

            {/* Left column */}
            <div className="gl-split-left" style={{
              flex: '0 0 42%', display: 'flex', flexDirection: 'column',
              padding: '7rem 3rem 3rem',
              borderRight: '1px solid rgba(27,28,25,0.07)',
              position: 'relative',
            }}>
              {/* Ghost number */}
              <div style={{
                position: 'absolute', bottom: '-1rem', right: '-1.5rem',
                fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                fontSize: '20vw', lineHeight: 1,
                color: 'rgba(27,28,25,0.05)', userSelect: 'none', pointerEvents: 'none',
              }}>01</div>

              {/* Category + stamp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem',
                  fontWeight: 700, letterSpacing: '0.15em', color: '#715c00',
                  textTransform: 'uppercase',
                }}>PORTFOLIO / ENGINEERING</span>
                <span style={{
                  background: '#f7c533', color: '#3e2e00',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: '0.5rem', letterSpacing: '0.1em', padding: '2px 8px',
                  transform: 'rotate(2deg)', display: 'inline-block',
                }}>PORTFOLIO_01</span>
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 0.9,
                letterSpacing: '-0.03em', textTransform: 'uppercase',
                color: '#1b1c19', marginTop: '2.5rem', marginBottom: '1.25rem',
              }}>
                RYYAN_<br />SAFAR<br />.SITE
              </h2>

              <p style={{
                fontFamily: "'Work Sans', sans-serif", fontSize: '0.8125rem',
                color: 'rgba(27,28,25,0.55)', lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}>{P[0].description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2.5rem' }}>
                {P[0].tech.map(t => <Tag key={t} label={t} />)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(27,28,25,0.3)', textTransform: 'uppercase', marginBottom: 2 }}>YEAR</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#1b1c19' }}>{P[0].year}</div>
                </div>
                <a href={P[0].url} target="_blank" rel="noopener noreferrer" className="gl-open-btn">OPEN [+]</a>
              </div>
            </div>

            {/* Right column: Polaroid */}
            <div className="gl-split-right" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4rem 3rem', background: '#f5f3ee', position: 'relative',
            }}>
              {/* Decorative circle */}
              <div style={{
                position: 'absolute', right: '-10vw', top: '50%',
                transform: 'translateY(-50%)',
                width: '55vw', height: '55vw',
                borderRadius: '50%',
                border: '1px solid rgba(27,28,25,0.06)',
                pointerEvents: 'none',
              }} />

              {/* Polaroid card */}
              <div className="gl-polaroid" style={{ position: 'relative', transform: 'rotate(2.5deg)', zIndex: 10 }}>
                {/* Tape */}
                <div style={{
                  position: 'absolute', top: -13, left: '50%',
                  transform: 'translateX(-50%) rotate(-1.5deg)',
                  width: 72, height: 22,
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  zIndex: 20,
                }} />
                <div style={{
                  background: '#fff', padding: '0.875rem 0.875rem 4rem',
                  boxShadow: '4px 8px 30px rgba(0,0,0,0.14)',
                  width: 'clamp(300px, 44vw, 580px)',
                }}>
                  {/* Iframe */}
                  <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingBottom: '75%' }}>
                    <LiveIframe url={P[0].url} title={P[0].title} />
                  </div>
                  {/* Caption */}
                  <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
                      fontWeight: 700, letterSpacing: '0.12em',
                      color: 'rgba(27,28,25,0.35)', textTransform: 'uppercase',
                    }}>LIVE PREVIEW // 01</span>
                  </div>
                </div>
                {/* LIVE badge */}
                <div style={{
                  position: 'absolute', top: '3rem', right: '-1rem',
                  background: '#1b1c19', color: '#fbf9f4',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
                  fontWeight: 700, letterSpacing: '0.12em', padding: '3px 8px',
                  zIndex: 30,
                }}>● LIVE</div>
              </div>

              {/* Click overlay on right side */}
              <a href={P[0].url} target="_blank" rel="noopener noreferrer"
                style={{ position: 'absolute', inset: 0, zIndex: 5 }}
                aria-label="Open ryyansafar.site" />
            </div>

            <div style={{
              position: 'absolute', bottom: '2.5rem', left: '3rem',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
              fontWeight: 700, letterSpacing: '0.2em',
              color: 'rgba(27,28,25,0.2)', textTransform: 'uppercase',
            }}>01 / 07</div>
          </section>

          {/* ── PANEL 2: HELP_ME_SURVIVE_COLLEGE — Terminal Dark ────── */}
          {/* Style: dark bg, browser window mockup, green-tinted type */}
          <section className="gl-panel gl-p2" style={{ background: '#0d0f0a', display: 'flex', flexDirection: 'column', padding: '7rem 3rem 3rem' }}>
            {/* Ghost watermark */}
            <div style={{
              position: 'absolute', right: '-3rem', top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
              fontSize: '28vw', lineHeight: 1,
              color: 'rgba(255,255,255,0.02)', userSelect: 'none', pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>TOOL</div>

            {/* Top header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem',
                fontWeight: 700, letterSpacing: '0.15em',
                color: 'rgba(168,224,96,0.4)', textTransform: 'uppercase',
              }}>// ENTRY_02</span>
              <span style={{
                background: '#1a1f14',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
                fontWeight: 700, letterSpacing: '0.1em',
                color: 'rgba(168,224,96,0.35)', textTransform: 'uppercase',
                padding: '2px 10px',
              }}>UTILITY / WEB APP</span>
            </div>

            {/* Big terminal title */}
            <h2 style={{
              fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
              fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1,
              letterSpacing: '-0.02em', textTransform: 'uppercase',
              color: '#a8e060', marginBottom: '2rem',
            }}>
              $ HELP_ME_<br />SURVIVE_<br />COLLEGE
            </h2>

            {/* Content row: browser window + meta */}
            <div className="gl-content-row" style={{ display: 'flex', gap: '3rem', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
              {/* Browser window mockup */}
              <div className="gl-browser-window" style={{
                flex: 1, border: '1px solid #2a3020',
                background: '#111', position: 'relative',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}>
                {/* Title bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#1a1f14', padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #2a3020', flexShrink: 0,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
                    letterSpacing: '0.08em', color: 'rgba(168,224,96,0.3)',
                    marginLeft: '0.5rem',
                  }}>lifesaver.ryyansafar.site</span>
                  <div style={{
                    marginLeft: 'auto',
                    background: '#a8e060', color: '#0d0f0a',
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem',
                    fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px',
                  }}>● LIVE</div>
                </div>
                {/* Iframe area */}
                <div style={{ position: 'relative', overflow: 'hidden', flex: 1 }}>
                  <LiveIframe url={P[1].url} title={P[1].title} />
                  {/* Scanline overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
                  }} />
                  <a href={P[1].url} target="_blank" rel="noopener noreferrer"
                    style={{ position: 'absolute', inset: 0, zIndex: 10 }}
                    aria-label="Open lifesaver.ryyansafar.site" />
                </div>
              </div>

              {/* Right meta */}
              <div className="gl-meta-col" style={{
                flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '1.25rem',
                paddingTop: '0.25rem', alignSelf: 'flex-start',
              }}>
                <p style={{
                  fontFamily: "'Work Sans', sans-serif", fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, maxWidth: '28ch',
                }}>{P[1].description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {P[1].tech.map(t => <Tag key={t} label={t} dark />)}
                </div>

                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 2 }}>YEAR</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#a8e060' }}>EST. 2026</div>
                </div>

                <a href={P[1].url} target="_blank" rel="noopener noreferrer" className="gl-open-btn-green">OPEN [+]</a>
              </div>
            </div>

            <div style={{
              position: 'absolute', bottom: '2.5rem', left: '4rem',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
              fontWeight: 700, letterSpacing: '0.2em',
              color: 'rgba(168,224,96,0.2)', textTransform: 'uppercase',
            }}>02 / 07</div>
          </section>

          {/* ── PANEL 3: TEAMAPT.IN — Editorial Bento ───────────────── */}
          {/* Style: iframe fills top ~58%, bottom is a horizontal bento card strip */}
          <section className="gl-panel" style={{ background: '#f5f3ee', display: 'flex', flexDirection: 'column' }}>
            {/* TOP: iframe strip */}
            <div className="gl-teamapt-preview" style={{
              flex: '0 0 58%', position: 'relative', overflow: 'hidden',
              borderBottom: '2px solid #1b1c19',
              backgroundColor: '#d8d4c9',
              backgroundImage: 'radial-gradient(circle, rgba(27,28,25,0.14) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}>
              {/* Floating browser window */}
              <div style={{
                position: 'absolute', top: '1.25rem', left: '1.5rem', right: '1.5rem', bottom: 0,
                borderRadius: '10px 10px 0 0', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)',
                border: '1px solid rgba(27,28,25,0.3)', borderBottom: 'none',
              }}>
                {/* Address bar */}
                <div style={{
                  position: 'relative', zIndex: 10,
                  background: '#1b1c19', height: '2.75rem',
                  display: 'flex', alignItems: 'center', padding: '0 1.25rem',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
                  </div>
                  <div style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 4,
                    padding: '0.2rem 0.75rem', marginLeft: '0.75rem',
                  }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>teamapt.in</span>
                  </div>
                  <div style={{
                    background: '#f7c533', color: '#3e2e00',
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem',
                    fontWeight: 700, letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 2,
                  }}>● LIVE</div>
                </div>

                {/* Iframe below the bar */}
                <div style={{ position: 'absolute', top: '2.75rem', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                  <LiveIframe url={P[2].url} title={P[2].title} />
                </div>
                <a href={P[2].url} target="_blank" rel="noopener noreferrer"
                  style={{ position: 'absolute', top: '2.75rem', left: 0, right: 0, bottom: 0, zIndex: 20 }}
                  aria-label="Open teamapt.in" />
              </div>
            </div>

            {/* BOTTOM: bento meta cards */}
            <div className="gl-bento-row" style={{ flex: 1, display: 'flex', background: '#fbf9f4', borderTop: '2px solid #1b1c19' }}>
              {/* Card 1: ID + category */}
              <div className="gl-bento-card" style={{ flex: '0 0 18%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{
                  fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                  fontSize: 'clamp(2.5rem,5vw,4.5rem)', lineHeight: 1,
                  color: 'rgba(27,28,25,0.08)',
                }}>03</div>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
                  fontWeight: 700, letterSpacing: '0.15em', color: '#715c00',
                  textTransform: 'uppercase',
                }}>COMPANY<br />WEBSITE</span>
              </div>

              {/* Card 2: Title + desc */}
              <div className="gl-bento-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                <h2 style={{
                  fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                  fontSize: 'clamp(1rem, 2vw, 1.75rem)', lineHeight: 1,
                  letterSpacing: '-0.02em', textTransform: 'uppercase',
                  color: '#1b1c19', margin: 0,
                }}>TEAMAPT.IN</h2>
                <p style={{
                  fontFamily: "'Work Sans', sans-serif", fontSize: '0.75rem',
                  color: 'rgba(27,28,25,0.5)', lineHeight: 1.65,
                  maxWidth: '38ch', margin: 0,
                }}>{P[2].description}</p>
              </div>

              {/* Card 3: Tech stack */}
              <div className="gl-bento-card" style={{ flex: '0 0 22%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(27,28,25,0.3)', textTransform: 'uppercase' }}>STACK</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {P[2].tech.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>

              {/* Card 4: Year + CTA */}
              <div className="gl-bento-card" style={{ flex: '0 0 16%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(27,28,25,0.3)', textTransform: 'uppercase', marginBottom: 4 }}>YEAR</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#1b1c19' }}>{P[2].year}</div>
                </div>
                <a href={P[2].url} target="_blank" rel="noopener noreferrer" className="gl-open-btn">OPEN [+]</a>
              </div>
            </div>

            <div style={{
              position: 'absolute', bottom: '1rem', left: '1.75rem',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem',
              fontWeight: 700, letterSpacing: '0.2em',
              color: 'rgba(27,28,25,0.2)', textTransform: 'uppercase',
            }}>03 / 07</div>
          </section>

          {/* ── PANEL 4: WALLPAPERS.RYYANSAFAR.SITE — Dark Gallery ─── */}
          {/* Style: dark terminal-esque, browser window + meta col (same pattern as Panel 2) */}
          <section className="gl-panel gl-p-walls" style={{ background: '#07070f', display: 'flex', flexDirection: 'column', padding: '7rem 3rem 3rem', position: 'relative' }}>

            {/* Ghost watermark */}
            <div style={{ position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: '28vw', lineHeight: 1, color: 'rgba(255,255,255,0.02)', userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>WALLS</div>

            {/* Top header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(180,255,90,0.4)', textTransform: 'uppercase' }}>// ENTRY_04</span>
              <span style={{ background: '#0d1208', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(180,255,90,0.35)', textTransform: 'uppercase', padding: '2px 10px' }}>CREATIVE / WALLPAPERS</span>
            </div>

            {/* Big title */}
            <h2 style={{ fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#b4ff5a', marginBottom: '2rem' }}>
              $ WALLPAPERS_<br />GALLERY
            </h2>

            {/* Content row: browser window left + meta right */}
            <div className="gl-walls-content-row" style={{ display: 'flex', gap: '3rem', alignItems: 'stretch', flex: 1, minHeight: 0 }}>

              {/* Browser window mockup */}
              <div className="gl-walls-browser" style={{ flex: 1, border: '1px solid rgba(180,255,90,0.1)', background: '#0a0a14', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Title bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d1208', padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(180,255,90,0.08)', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.08em', color: 'rgba(180,255,90,0.3)', marginLeft: '0.5rem' }}>wallpapers.ryyansafar.site</span>
                  <div style={{ marginLeft: 'auto', background: '#b4ff5a', color: '#07070f', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px' }}>● LIVE</div>
                </div>
                {/* Iframe area */}
                <div style={{ position: 'relative', overflow: 'hidden', flex: 1 }}>
                  <LiveIframe url={P[4].url} title={P[4].title} />
                  <a href={P[4].url} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', inset: 0, zIndex: 10 }} aria-label="Open wallpapers.ryyansafar.site" />
                </div>
              </div>

              {/* Right meta col */}
              <div className="gl-walls-meta-col" style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '0.25rem', alignSelf: 'flex-start' }}>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, maxWidth: '28ch' }}>{P[4].description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {P[4].tech.map(t => <Tag key={t} label={t} dark />)}
                </div>

                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 2 }}>YEAR</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#b4ff5a' }}>EST. 2026</div>
                </div>

                <a href={P[4].url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#b4ff5a', color: '#07070f', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', textDecoration: 'none', transition: 'opacity 0.15s' }}>OPEN [+]</a>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2.5rem', left: '4rem', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(180,255,90,0.2)', textTransform: 'uppercase' }}>04 / 07</div>
          </section>

          {/* ── PANEL 5: SMOKE.RYYANSAFAR.SITE — Warm Ember ─────────── */}
          {/* Style: warm parchment two-col, editorial left, iframe in dark frame right */}
          <section className="gl-panel gl-panel-split" style={{ background: '#f5ede3', display: 'flex' }}>

            {/* Left: editorial text */}
            <div className="gl-split-left" style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', padding: '7rem 3rem 3rem', borderRight: '1px solid rgba(60,20,5,0.1)', position: 'relative' }}>

              {/* Ghost number */}
              <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: '20vw', lineHeight: 1, color: 'rgba(60,20,5,0.04)', userSelect: 'none', pointerEvents: 'none' }}>05</div>

              {/* Category + stamp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.15em', color: '#c04b0c', textTransform: 'uppercase' }}>RESTAURANT / WEB DESIGN</span>
                <span style={{ background: '#c04b0c', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.1em', padding: '2px 8px', transform: 'rotate(2deg)', display: 'inline-block' }}>SMOKE_05</span>
              </div>

              {/* Title */}
              <h2 style={{ fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 0.9, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#2a1206', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
                THE<br />SMOKE<br />HOUSE
              </h2>

              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.8125rem', color: 'rgba(42,18,6,0.55)', lineHeight: 1.75, marginBottom: '1.5rem' }}>{P[6].description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2.5rem' }}>
                {P[6].tech.map(t => <Tag key={t} label={t} />)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(42,18,6,0.3)', textTransform: 'uppercase', marginBottom: 2 }}>YEAR</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#2a1206' }}>EST. 2026</div>
                </div>
                <a href={P[6].url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#c04b0c', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', textDecoration: 'none', transition: 'opacity 0.15s' }}>OPEN [+]</a>
              </div>
            </div>

            {/* Right: iframe in warm dark frame */}
            <div className="gl-split-right" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2.5rem', background: '#ede1d3', position: 'relative' }}>
              {/* Dot grid pattern */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(42,18,6,0.12) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

              {/* Frame */}
              <div style={{ position: 'relative', zIndex: 10, transform: 'rotate(1.5deg)', boxShadow: '6px 6px 0 rgba(42,18,6,0.2)' }}>
                <div style={{ border: '6px solid #2a1206', background: '#2a1206' }}>
                  {/* Address bar */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.75rem', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', flex: 1, textAlign: 'center' }}>smoke.ryyansafar.site</span>
                    <span style={{ background: '#c04b0c', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.1em', padding: '1px 6px' }}>● LIVE</span>
                  </div>
                  {/* Iframe */}
                  <div className="gl-smoke-iframe-wrap" style={{ position: 'relative', overflow: 'hidden', width: 'clamp(260px, 38vw, 500px)', paddingBottom: '90%' }}>
                    <LiveIframe url={P[6].url} title={P[6].title} />
                  </div>
                </div>
                <a href={P[6].url} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', inset: 0, zIndex: 10 }} aria-label="Open smoke.ryyansafar.site" />
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2.5rem', left: '3rem', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(42,18,6,0.2)', textTransform: 'uppercase' }}>05 / 07</div>
          </section>

          {/* ── PANEL 6: LITERATURE CLOCK — Dark Phosphor ────────────── */}
          {/* Style: dark bg, monochrome disc-grid aesthetic, hardware bezel iframe */}
          <section className="gl-panel gl-panel-split" style={{ background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

              {/* Left: content */}
              <div className="gl-split-left" style={{
                flex: '0 0 46%', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '7rem 3rem 3rem',
                position: 'relative', zIndex: 10,
                borderRight: '1px solid rgba(59,130,246,0.12)',
              }}>
                {/* Ghost number */}
                <div style={{
                  position: 'absolute', bottom: '-2rem', left: '-1rem',
                  fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                  fontSize: '22vw', lineHeight: 1,
                  color: 'rgba(59,130,246,0.04)', userSelect: 'none', pointerEvents: 'none',
                }}>06</div>

                {/* Category chip */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem',
                  fontWeight: 500, letterSpacing: '0.15em',
                  color: '#3b82f6', textTransform: 'uppercase',
                  marginBottom: '1.5rem', display: 'block',
                }}>HARDWARE / WEB SIMULATION</span>

                {/* Specs line */}
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em',
                  marginBottom: '1.75rem', borderLeft: '2px solid #3b82f6',
                  paddingLeft: '0.75rem',
                }}>
                  191 × 278 DISCS // 53,098 TOTAL
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                  fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 0.9,
                  letterSpacing: '-0.03em', textTransform: 'uppercase',
                  color: '#fff', marginBottom: '1.25rem',
                }}>
                  LITERATURE<br />CLOCK<br /><span style={{ color: '#3b82f6' }}>PRO</span>
                </h2>

                <p style={{
                  fontFamily: "'Work Sans', sans-serif", fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}>{P[5].description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2.5rem' }}>
                  {P[5].tech.map(t => <Tag key={t} label={t} />)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 2 }}>YEAR</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>EST. 2026</div>
                  </div>
                  <a href={P[5].url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', textDecoration: 'none', transition: 'opacity 0.15s' }}>OPEN [+]</a>
                </div>
              </div>

              {/* Right: iframe in hardware bezel */}
              <div className="gl-split-right" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 2.5rem', background: '#0a0a0a', position: 'relative' }}>
                {/* Dot grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.07) 1px, transparent 1px)', backgroundSize: '18px 18px', pointerEvents: 'none' }} />

                {/* Hardware bezel */}
                <div style={{ position: 'relative', zIndex: 10, boxShadow: '0 0 40px rgba(59,130,246,0.12), 4px 4px 0 rgba(59,130,246,0.25)' }}>
                  <div style={{ border: '6px solid #1a1a2e', background: '#1a1a2e' }}>
                    {/* Address bar */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.75rem', gap: '0.4rem', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', flex: 1, textAlign: 'center' }}>litclock.ryyansafar.site</span>
                      <span style={{ background: '#3b82f6', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.1em', padding: '1px 6px' }}>● LIVE</span>
                    </div>
                    {/* Iframe */}
                    <div className="gl-litclock-iframe-wrap" style={{ position: 'relative', overflow: 'hidden', width: 'clamp(260px, 38vw, 500px)', paddingBottom: '90%' }}>
                      <LiveIframe url={P[5].url} title={P[5].title} />
                    </div>
                  </div>
                  <a href={P[5].url} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', inset: 0, zIndex: 10 }} aria-label="Open litclock.ryyansafar.site" />
                </div>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2.5rem', left: '3rem', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(59,130,246,0.2)', textTransform: 'uppercase' }}>06 / 07</div>
          </section>

          {/* ── PANEL 7: TINKERSPACE — Gold Bold ────────────────────── */}
          {/* Style: full gold bg, huge Barrio text left, stamp-framed iframe right */}
          <section className="gl-panel gl-panel-split" style={{ background: '#f7c533', display: 'flex', flexDirection: 'column' }}>

            {/* Top row: left text + right iframe */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

            {/* Left: Big Barrio text + meta */}
            <div className="gl-split-left" style={{
              flex: '0 0 50%', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', padding: '7rem 3rem 3rem',
              position: 'relative', zIndex: 10,
            }}>
              {/* Ghost number */}
              <div style={{
                position: 'absolute', bottom: '-3rem', left: '-2rem',
                fontFamily: 'Epilogue, sans-serif', fontWeight: 900,
                fontSize: '28vw', lineHeight: 1,
                color: 'rgba(0,0,0,0.05)', userSelect: 'none', pointerEvents: 'none',
              }}>07</div>

              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem',
                fontWeight: 700, letterSpacing: '0.15em',
                color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase',
                marginBottom: '1.5rem', display: 'block',
              }}>COMMUNITY TOOL / {P[3].year}</span>

              <h2 style={{
                fontFamily: 'Barrio, cursive',
                fontSize: 'clamp(3.5rem, 7.5vw, 7rem)', lineHeight: 0.88,
                color: '#000', letterSpacing: '-0.01em',
                marginBottom: '2rem',
              }}>
                3D_PRINTER<br />QUEUE
              </h2>

              <p style={{
                fontFamily: "'Work Sans', sans-serif", fontSize: '0.8125rem',
                color: 'rgba(0,0,0,0.5)', lineHeight: 1.75,
                marginBottom: '1.75rem',
              }}>{P[3].description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
                {P[3].tech.map(t => (
                  <span key={t} style={{
                    display: 'inline-block',
                    border: '1px solid rgba(0,0,0,0.3)',
                    padding: '2px 8px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.5625rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(0,0,0,0.5)',
                    textTransform: 'uppercase',
                  }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  border: '2px solid #000',
                  padding: '0.2rem 0.75rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.5rem',
                  letterSpacing: '0.12em', color: '#000',
                  transform: 'rotate(-2deg)',
                }}>TOOL_07</div>
                <a href={P[3].url} target="_blank" rel="noopener noreferrer" className="gl-open-btn-gold">OPEN [+]</a>
              </div>
            </div>

            {/* Right: Stamp-framed iframe */}
            <div className="gl-split-right" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4rem 2.5rem', position: 'relative',
            }}>
              {/* Decorative corner ticks */}
              <div style={{ position: 'absolute', top: '5.5rem', right: '3.5rem', width: 24, height: 24, borderTop: '3px solid rgba(0,0,0,0.2)', borderRight: '3px solid rgba(0,0,0,0.2)' }} />
              <div style={{ position: 'absolute', bottom: '3.5rem', left: '0rem', width: 24, height: 24, borderBottom: '3px solid rgba(0,0,0,0.2)', borderLeft: '3px solid rgba(0,0,0,0.2)' }} />

              {/* Stamp frame */}
              <div style={{
                position: 'relative',
                transform: 'rotate(-3deg)',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
              }}>
                {/* Thick black border = stamp */}
                <div style={{ border: '8px solid #000', background: '#000' }}>
                  {/* Iframe container */}
                  <div style={{
                    position: 'relative', overflow: 'hidden',
                    width: 'clamp(280px, 38vw, 500px)',
                    paddingBottom: '110%',
                  }}>
                    <LiveIframe url={P[3].url} title={P[3].title} />
                  </div>
                </div>
                {/* Caption strip */}
                <div style={{
                  background: '#000', padding: '0.4rem 1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: '0.5rem', letterSpacing: '0.12em',
                    color: 'rgba(247,197,51,0.5)', textTransform: 'uppercase',
                  }}>PHY_TOOL_07</span>
                  <span style={{
                    background: '#f7c533', color: '#000',
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.45rem',
                    fontWeight: 700, letterSpacing: '0.1em', padding: '1px 6px',
                  }}>● LIVE</span>
                </div>

                {/* Click overlay */}
                <a href={P[3].url} target="_blank" rel="noopener noreferrer"
                  style={{ position: 'absolute', inset: 0, zIndex: 10 }}
                  aria-label="Open Tinkerspace 3D Queue" />
              </div>
            </div>

            </div>{/* /top row */}

            {/* ── FOOTER — below both columns ─────────────────────── */}
            <div className="gl-panel-footer" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '0.75rem',
              padding: '1rem 3rem 1.5rem',
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '0.5625rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)',
              }}>
                BUILT THIS MYSELF / DON'T ASK HOW LONG IT TOOK / STILL NO BUGS (PROBABLY)
              </span>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="https://github.com/ryyansafar" target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem',
                  letterSpacing: '0.12em', color: 'rgba(0,0,0,0.45)',
                  textDecoration: 'underline', textDecorationColor: '#715c00',
                }}>GITHUB</a>
                <a href="mailto:safarryyan@gmail.com" style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem',
                  letterSpacing: '0.12em', color: 'rgba(0,0,0,0.45)', textDecoration: 'none',
                }}>CONTACT</a>
                <a href="https://razorpay.me/@ryyansafar" target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem',
                  letterSpacing: '0.12em', color: 'rgba(0,0,0,0.45)',
                  textDecoration: 'underline', textDecorationColor: '#f7c533',
                }}>BUY ME A CHAI</a>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
