'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import LikeButton from '@/components/LikeButton';

/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const DEFAULTS = { posStiff: 240, posDamp: 27, sclStiff: 330, sclDamp: 30, hoverBlur: 1.2 };
const TAGS = ['vanilla-js', 'no-deps', 'spring-physics', 'cursor'];

/* ─────────────────────────────────────────────────────────
   Noise Overlay — constants
───────────────────────────────────────────────────────── */
const NOISE_DEFAULTS = { opacity: 0.12, grain: 1, speed: 1 };
const NOISE_TAGS = ['vanilla-js', 'no-deps', 'canvas', 'texture', 'film-grain'];

const NOISE_CODE = `// noise-overlay.js — drop into any project, zero dependencies
(function () {
  const OPACITY = 0.12;       // canvas opacity 0–1
  const GRAIN   = 1;          // pixel block size (1 = per-px, 2 = 2×2 blocks, etc.)
  const SPEED   = 1;          // refresh every N frames (1 = every frame, 2 = slower)
  const BLEND   = 'overlay';  // CSS mix-blend-mode: overlay | screen | soft-light | multiply

  const main = document.createElement('canvas');
  main.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9998;' +
    'opacity:' + OPACITY + ';mix-blend-mode:' + BLEND + ';';
  document.body.appendChild(main);

  const mctx = main.getContext('2d');
  if (!mctx) return;
  mctx.imageSmoothingEnabled = false;

  const small = document.createElement('canvas');
  const sctx  = small.getContext('2d');
  if (!sctx) return;

  let mw = 0, mh = 0, img = null, frame = 0;

  function resize() {
    mw = main.width  = window.innerWidth;
    mh = main.height = window.innerHeight;
    small.width  = Math.ceil(mw / GRAIN);
    small.height = Math.ceil(mh / GRAIN);
    img = sctx.createImageData(small.width, small.height);
  }

  function tick() {
    frame++;
    if (frame % SPEED === 0 && img) {
      const d = img.data;
      let i = d.length;
      while (i > 0) {
        const v = (Math.random() * 256) | 0;
        d[--i] = 255; d[--i] = v; d[--i] = v; d[--i] = v;
      }
      sctx.putImageData(img, 0, 0);
      mctx.clearRect(0, 0, mw, mh);
      mctx.drawImage(small, 0, 0, mw, mh);
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(tick);
})();`;

const NOISE_USAGE: Record<string, string> = {
  html: `<!-- Drop before </body> -->
<script src="noise-overlay.js"></script>

<!-- Edit OPACITY, GRAIN, SPEED, BLEND at the top of the file -->`,

  nextjs: `// 1. Copy noise-overlay.js → /public/noise-overlay.js
// 2. app/layout.tsx:
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/noise-overlay.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}`,

  react: `// Copy noise-overlay.tsx into your components:
import NoiseOverlay from '@/components/noise-overlay';

export default function App() {
  return (
    <>
      <YourContent />
      <NoiseOverlay
        opacity={0.12}
        grain={1}
        speed={1}
        blend="overlay"
      />
    </>
  );
}`,
};

const CURSOR_CODE = `// spring-cursor.js — drop into any project, zero dependencies
(function () {
  const el = document.createElement('div');
  el.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;' +
    'will-change:transform;transform-origin:0 0;display:none;';
  el.innerHTML = \`<svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
    <defs>
      <filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur id="cur-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cur-mb)">
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/>
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="white" stroke="rgba(0,0,0,0.55)" stroke-width="1" stroke-linejoin="round"/>
    </g>
  </svg>\`;
  document.body.appendChild(el);

  const style = document.createElement('style');
  style.textContent = '@media(hover:hover)and(pointer:fine){body,body *{cursor:none!important}}';
  document.head.appendChild(style);

  let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0;
  let sc = 1, st = 1, sv = 0, lt = performance.now();
  let hbc = 0, hbt = 0, hbv = 0;
  const PS = 240, PD = 27, SS = 330, SD = 30, HB_MAX = 1.2, HB_STIFF = 180, HB_DAMP = 22;

  window.addEventListener('pointermove', e => {
    el.style.display = 'block'; mx = e.clientX; my = e.clientY;
  }, { capture: true, passive: true });
  window.addEventListener('touchstart', () => el.style.display = 'none', { passive: true });
  document.addEventListener('pointerdown', () => st = 0.65, { capture: true, passive: true });
  document.addEventListener('pointerup',   () => st = 1,    { capture: true, passive: true });
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) { st = 1.3; hbt = HB_MAX; }
  });
  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget?.closest('a, button')) { st = 1; hbt = 0; }
  });

  (function tick() {
    const now = performance.now(), dt = Math.min((now - lt) / 1000, 0.033); lt = now;
    vx += ((mx - x) * PS - vx * PD) * dt; vy += ((my - y) * PS - vy * PD) * dt;
    x += vx * dt; y += vy * dt;
    sv += ((st - sc) * SS - sv * SD) * dt; sc += sv * dt;
    hbv += ((hbt - hbc) * HB_STIFF - hbv * HB_DAMP) * dt;
    hbc += hbv * dt; if (hbc < 0) hbc = 0;
    el.style.transform = \`translate(\${x}px,\${y}px) scale(\${sc})\`;
    const speed = Math.sqrt(vx*vx+vy*vy);
    const blurEl = el.querySelector('#cur-blur');
    if (blurEl) {
      const motionAmt = speed > 20 ? Math.min(speed*0.005, 2.8) : 0;
      const a = motionAmt > 0 ? Math.atan2(vy,vx) : 0;
      const bx = Math.abs(Math.cos(a))*motionAmt + hbc;
      const by = Math.abs(Math.sin(a))*motionAmt + hbc;
      blurEl.setAttribute('stdDeviation',
        bx > 0.05 || by > 0.05 ? \`\${bx.toFixed(2)} \${by.toFixed(2)}\` : '0 0');
    }
    requestAnimationFrame(tick);
  })();
})();`;

/* ─────────────────────────────────────────────────────────
   Code snippets (Usage + Examples)
───────────────────────────────────────────────────────── */
const USAGE: Record<string, string> = {
  html: `<!-- Drop before </body> -->
<script src="spring-cursor.js"></script>

<!-- Or paste implementation inline -->
<script>
  /* spring-cursor code here */
</script>`,

  nextjs: `// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="/spring-cursor.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}`,

  react: `// index.html (Vite / CRA)
<script src="/spring-cursor.js"></script>

// Or dynamically in main.tsx:
useEffect(() => {
  const s = document.createElement('script');
  s.src = '/spring-cursor.js';
  document.body.appendChild(s);
  return () => document.body.removeChild(s);
}, []);`,
};

const EXAMPLES: Record<string, { label: string; code: string }> = {
  basic: {
    label: 'Basic HTML',
    code: `<!DOCTYPE html>
<html>
  <body>
    <h1>Hello World</h1>
    <a href="#">A link</a>
    <button>A button</button>

    <!-- cursor auto-initialises, hides on touch -->
    <script src="spring-cursor.js"></script>
  </body>
</html>`,
  },
  nextjs: {
    label: 'Next.js App',
    code: `// 1. Copy spring-cursor.js → /public/spring-cursor.js
// 2. app/layout.tsx:

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="/spring-cursor.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
// Works with App Router and Pages Router.`,
  },
  params: {
    label: 'Custom Physics',
    code: `// Edit these constants in spring-cursor.js:

const PS = 120;     // position stiffness — lower = more lag
const PD = 15;      // position damping   — lower = bouncier
const SS = 200;     // scale stiffness    — click snap speed
const SD = 20;      // scale damping      — click snap smooth
const HB_MAX = 1.2; // hover blur max     — on buttons/links

// Presets:
// Floaty:  PS=80,  PD=12, SS=150, SD=15
// Default: PS=240, PD=27, SS=330, SD=30
// Snappy:  PS=500, PD=45, SS=600, SD=50`,
  },
};

/* ─────────────────────────────────────────────────────────
   CopyButton
───────────────────────────────────────────────────────── */
function CopyButton({ text, label = 'copy', copiedLabel = '✓ copied' }: {
  text: string; label?: string; copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: copied ? 'rgba(168,224,96,0.15)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${copied ? 'rgba(168,224,96,0.4)' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 5, color: copied ? '#a8e060' : 'rgba(255,255,255,0.55)',
      fontSize: '0.6875rem', fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.05em', padding: '4px 10px', whiteSpace: 'nowrap',
      cursor: 'none', flexShrink: 0, transition: 'all 0.2s',
    }}>
      {copied ? copiedLabel : label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   CursorPreview — CSS-animated, non-interactive
───────────────────────────────────────────────────────── */
function CursorPreview() {
  return (
    <div style={{
      position: 'relative', width: 200, height: 158, flexShrink: 0,
      background: '#0e0f0d', borderRadius: 10, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <style>{`
        @keyframes cur-preview {
          0%   { transform: translate(14px, 86px) scale(1); }
          10%  { transform: translate(82px, 36px) scale(1); }
          18%  { transform: translate(105px, 22px) scale(1.1); }
          26%  { transform: translate(106px, 23px) scale(0.65); }
          34%  { transform: translate(105px, 22px) scale(1); }
          48%  { transform: translate(32px, 108px) scale(1); }
          56%  { transform: translate(148px, 82px) scale(1.1); }
          64%  { transform: translate(148px, 83px) scale(0.65); }
          72%  { transform: translate(148px, 82px) scale(1); }
          88%  { transform: translate(18px, 54px) scale(1); }
          100% { transform: translate(14px, 86px) scale(1); }
        }
        .cur-preview-el { animation: cur-preview 5s ease-in-out infinite; transform-origin: 0 0; }
      `}</style>

      {/* Simulated UI elements */}
      <div style={{ position: 'absolute', top: 17, left: 88, width: 56, height: 18, background: 'rgba(247,197,51,0.1)', border: '1px solid rgba(247,197,51,0.25)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', top: 76, left: 130, width: 48, height: 18, background: 'rgba(168,224,96,0.08)', border: '1px solid rgba(168,224,96,0.2)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', top: 52, left: 16, width: 64, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 60, left: 16, width: 44, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 68, left: 16, width: 52, height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 1 }} />

      {/* Animated cursor */}
      <div className="cur-preview-el" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <svg width="20" height="26" viewBox="0 0 22 28" overflow="visible" fill="none">
          <path d="M2 2 L2 22 L6.5 17.5 L11 25.5 L13.5 24 L9 16.5 L16 16.5 Z"
            fill="rgba(0,0,0,0.35)" transform="translate(1.5,1.5)" />
          <path d="M2 2 L2 22 L6.5 17.5 L11 25.5 L13.5 24 L9 16.5 L16 16.5 Z"
            fill="white" stroke="rgba(0,0,0,0.5)" strokeWidth={1} strokeLinejoin="round" />
        </svg>
      </div>

      {/* Corner label */}
      <div style={{
        position: 'absolute', bottom: 8, right: 10,
        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem',
        letterSpacing: '0.1em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
      }}>preview</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NoisePreview — live animated film-grain preview
───────────────────────────────────────────────────────── */
function NoisePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const W = 200, H = 158;
    const img = ctx.createImageData(W, H);

    const tick = () => {
      const d = img.data;
      let i = d.length;
      while (i > 0) { const v = (Math.random() * 256) | 0; d[--i] = 255; d[--i] = v; d[--i] = v; d[--i] = v; }
      ctx.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ position: 'relative', width: 200, height: 158, flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Styled background to show the blend effect */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #0e1a14 0%, #0e0e1a 55%, #1a0e14 100%)' }} />
      <div style={{ position: 'absolute', top: 22, left: 14, width: 72, height: 10, background: 'rgba(168,224,96,0.45)', borderRadius: 2 }} />
      <div style={{ position: 'absolute', top: 42, left: 14, right: 14, height: 2, background: 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 50, left: 14, width: '65%', height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 58, left: 14, width: '80%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', bottom: 20, left: 14, right: 14, height: 28, background: 'rgba(247,197,51,0.15)', border: '1px solid rgba(247,197,51,0.25)', borderRadius: 5 }} />
      {/* Noise canvas blended over background */}
      <canvas ref={canvasRef} width={200} height={158} style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>live</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NoiseDemoBox — interactive demo canvas for modal
───────────────────────────────────────────────────────── */
function NoiseDemoBox({ params, blend }: { params: typeof NOISE_DEFAULTS; blend: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const lastGrain = useRef(params.grain);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mctx = canvas.getContext('2d');
    if (!mctx) return;
    mctx.imageSmoothingEnabled = false;
    const CW = canvas.width, CH = canvas.height;

    const small = document.createElement('canvas');
    const sctx = small.getContext('2d');
    if (!sctx) return;
    let img: ImageData;

    const initGrain = (g: number) => {
      small.width  = Math.ceil(CW / g);
      small.height = Math.ceil(CH / g);
      img = sctx.createImageData(small.width, small.height);
    };
    initGrain(paramsRef.current.grain);
    lastGrain.current = paramsRef.current.grain;

    const tick = () => {
      frameRef.current++;
      const p = paramsRef.current;
      if (p.grain !== lastGrain.current) { initGrain(p.grain); lastGrain.current = p.grain; }
      if (frameRef.current % p.speed === 0) {
        const d = img.data;
        let i = d.length;
        while (i > 0) { const v = (Math.random() * 256) | 0; d[--i] = 255; d[--i] = v; d[--i] = v; d[--i] = v; }
        sctx.putImageData(img, 0, 0);
        mctx.clearRect(0, 0, CW, CH);
        mctx.drawImage(small, 0, 0, CW, CH);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ position: 'relative', height: 270, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0e1a14 0%, #0e0e1a 55%, #1a0e14 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', marginBottom: '0.35rem' }}>
            Film Grain
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em' }}>
            noise-overlay · canvas API
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ padding: '0.4rem 1.1rem', background: 'rgba(168,224,96,0.12)', border: '1px solid rgba(168,224,96,0.28)', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(168,224,96,0.75)' }}>texture</div>
          <div style={{ padding: '0.4rem 1.1rem', background: 'rgba(247,197,51,0.10)', border: '1px solid rgba(247,197,51,0.22)', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(247,197,51,0.75)' }}>grain</div>
          <div style={{ padding: '0.4rem 1.1rem', background: 'rgba(192,75,12,0.10)', border: '1px solid rgba(192,75,12,0.22)', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(192,75,12,0.75)' }}>depth</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={270}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: blend as React.CSSProperties['mixBlendMode'], opacity: params.opacity }}
      />
      <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>interactive</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Slider
───────────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step, onChange, hint }: {
  label: string; value: number; min: number; max: number;
  step: number; onChange: (v: number) => void; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(27,28,25,0.45)', letterSpacing: '0.06em' }}>
          {label}{hint && <span style={{ fontSize: '0.5625rem', color: 'rgba(27,28,25,0.25)', marginLeft: '0.4em' }}>{hint}</span>}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: '#1b1c19' }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value ?? 0}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', appearance: 'none', WebkitAppearance: 'none',
          height: 3, borderRadius: 2, outline: 'none', cursor: 'none',
          background: `linear-gradient(to right, #1b1c19 ${pct}%, rgba(27,28,25,0.15) ${pct}%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CursorDemoBox — interactive
───────────────────────────────────────────────────────── */
function CursorDemoBox({ physicsRef }: { physicsRef: React.RefObject<typeof DEFAULTS> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ mx: 160, my: 100, x: 160, y: 100, vx: 0, vy: 0, sc: 1, st: 1, sv: 0, hbc: 0, hbt: 0, hbv: 0, lt: 0 });

  useEffect(() => {
    const box = boxRef.current;
    const cur = curRef.current;
    if (!box || !cur) return;

    const s = stateRef.current;
    s.lt = performance.now();

    const HB_STIFF = 180, HB_DAMP = 22;

    const onEnter = () => {
      const main = document.getElementById('custom-cursor');
      if (main) main.style.opacity = '0';
    };
    const onLeave = () => {
      cur.style.display = 'none';
      s.hbt = 0;
      const main = document.getElementById('custom-cursor');
      if (main) main.style.opacity = '1';
    };
    const onMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      s.mx = e.clientX - rect.left;
      s.my = e.clientY - rect.top;
      if (cur.style.display === 'none') {
        s.x = s.mx; s.y = s.my;
        cur.style.display = 'block';
      }
      const target = e.target as HTMLElement;
      s.hbt = target.closest('a, button') ? physicsRef.current.hoverBlur : 0;
    };
    const onDown = () => { s.st = 0.65; };
    const onUp = () => { s.st = 1; };

    box.addEventListener('pointerenter', onEnter);
    box.addEventListener('pointerleave', onLeave);
    box.addEventListener('pointermove', onMove, { capture: true, passive: true });
    box.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    box.addEventListener('pointerup', onUp, { capture: true, passive: true });

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - s.lt) / 1000, 0.033);
      s.lt = now;
      const p = physicsRef.current;
      s.vx += ((s.mx - s.x) * p.posStiff - s.vx * p.posDamp) * dt;
      s.vy += ((s.my - s.y) * p.posStiff - s.vy * p.posDamp) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.sv += ((s.st - s.sc) * p.sclStiff - s.sv * p.sclDamp) * dt;
      s.sc += s.sv * dt;
      s.hbv += ((s.hbt - s.hbc) * HB_STIFF - s.hbv * HB_DAMP) * dt;
      s.hbc += s.hbv * dt;
      if (s.hbc < 0) s.hbc = 0;

      cur.style.transform = `translate(${s.x}px,${s.y}px) scale(${s.sc})`;

      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const blurEl = cur.querySelector<SVGFEGaussianBlurElement>('#demo-blur');
      if (blurEl) {
        const motionAmt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
        const angle = motionAmt > 0 ? Math.atan2(s.vy, s.vx) : 0;
        const bx = Math.abs(Math.cos(angle)) * motionAmt + s.hbc;
        const by = Math.abs(Math.sin(angle)) * motionAmt + s.hbc;
        blurEl.setAttribute('stdDeviation',
          bx > 0.05 || by > 0.05 ? `${bx.toFixed(2)} ${by.toFixed(2)}` : '0 0');
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      box.removeEventListener('pointerenter', onEnter);
      box.removeEventListener('pointerleave', onLeave);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerdown', onDown);
      box.removeEventListener('pointerup', onUp);
      const main = document.getElementById('custom-cursor');
      if (main) main.style.opacity = '1';
    };
  }, []);

  return (
    <div ref={boxRef} style={{
      position: 'relative', overflow: 'hidden', background: '#0e0f0d',
      borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)',
      height: 300, cursor: 'none', userSelect: 'none',
    }}>
      {/* Demo cursor */}
      <div ref={curRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', display: 'none', zIndex: 10, transformOrigin: '0 0' }}>
        <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
          <defs>
            <filter id="demo-mb" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur id="demo-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <g filter="url(#demo-mb)">
            <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/>
            <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="white" stroke="rgba(0,0,0,0.6)" strokeWidth={1} strokeLinejoin="round"/>
          </g>
        </svg>
      </div>

      {/* Corner label */}
      <div style={{ position: 'absolute', top: 13, left: 15, zIndex: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
        interactive
      </div>

      {/* Demo content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
          <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(247,197,51,0.12)', border: '1px solid rgba(247,197,51,0.3)', color: '#f7c533', borderRadius: 6, padding: '0.45rem 1rem', cursor: 'none' }}>hover me</button>
          <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(168,224,96,0.1)', border: '1px solid rgba(168,224,96,0.25)', color: '#a8e060', borderRadius: 6, padding: '0.45rem 1rem', cursor: 'none' }}>click me</button>
          <a href="#" onClick={e => e.preventDefault()} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.12)', cursor: 'none' }}>link.tsx</a>
        </div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.6875rem', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.06em', textAlign: 'center', margin: 0 }}>
          move fast — watch the blur trail
        </p>
      </div>

      {/* Grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <defs><pattern id="dg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.022)" strokeWidth="1"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dg)"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DocTabs — with framework / example switchers
───────────────────────────────────────────────────────── */
function DocTabs({ command }: { command: string }) {
  const [mainTab, setMainTab] = useState<'install' | 'usage' | 'examples'>('install');
  const [framework, setFramework] = useState<'html' | 'nextjs' | 'react'>('html');
  const [example, setExample] = useState<'basic' | 'nextjs' | 'params'>('basic');

  const mainTabStyle = (active: boolean) => ({
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
    fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    padding: '0.4rem 0.9rem', border: 'none', cursor: 'none',
    borderRadius: '5px 5px 0 0',
    background: active ? '#fff' : 'transparent',
    color: active ? '#1b1c19' : 'rgba(27,28,25,0.38)',
    borderBottom: active ? '1px solid #fff' : '1px solid transparent',
    transition: 'all 0.15s',
  });

  const subBtnStyle = (active: boolean) => ({
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem',
    letterSpacing: '0.04em', padding: '0.3rem 0.75rem',
    border: `1px solid ${active ? 'rgba(27,28,25,0.35)' : 'rgba(27,28,25,0.1)'}`,
    borderRadius: 5, cursor: 'none',
    background: active ? '#1b1c19' : 'transparent',
    color: active ? '#fbf9f4' : 'rgba(27,28,25,0.4)',
    transition: 'all 0.15s',
  });

  const CodeBlock = ({ code }: { code: string }) => (
    <div style={{ background: '#1b1c19', borderRadius: 8, padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 11, right: 11 }}>
        <CopyButton text={code} />
      </div>
      <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(251,249,244,0.8)', lineHeight: 1.7, margin: 0, overflowX: 'auto', paddingRight: '3.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {code}
      </pre>
    </div>
  );

  return (
    <div style={{ marginTop: '1.75rem' }}>
      {/* Main tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(27,28,25,0.1)' }}>
        {(['install', 'usage', 'examples'] as const).map(t => (
          <button key={t} onClick={() => setMainTab(t)} style={mainTabStyle(mainTab === t)}>
            {t === 'install' ? 'Installation' : t === 'usage' ? 'Usage' : 'Examples'}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid rgba(27,28,25,0.1)', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: '1.5rem', background: 'rgba(27,28,25,0.015)' }}>

        {/* ── Installation ── */}
        {mainTab === 'install' && (
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(27,28,25,0.5)', marginBottom: '1rem', lineHeight: 1.6 }}>
              CLI coming soon — for now, copy the implementation directly into your project.
            </p>
            {/* Terminal */}
            <div style={{ background: '#1b1c19', borderRadius: 10, overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', gap: 6, padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 'auto', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', lineHeight: '9px' }}>terminal</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.6em', alignItems: 'center' }}>
                  <span style={{ color: '#a8e060', userSelect: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' }}>$</span>
                  <span style={{ color: 'rgba(251,249,244,0.85)', letterSpacing: '0.01em', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' }}>{command}</span>
                </div>
                <CopyButton text={command} />
              </div>
            </div>
            {/* Copy code button */}
            <CopyButton
              text={CURSOR_CODE}
              label="{ } copy implementation"
              copiedLabel="✓ copied"
            />
          </div>
        )}

        {/* ── Usage ── */}
        {mainTab === 'usage' && (
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(27,28,25,0.5)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Works in any HTML project. Auto-hides on touch devices. No build step required.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['html', 'nextjs', 'react'] as const).map(f => (
                <button key={f} onClick={() => setFramework(f)} style={subBtnStyle(framework === f)}>
                  {f === 'html' ? 'HTML' : f === 'nextjs' ? 'Next.js' : 'React / Vite'}
                </button>
              ))}
            </div>
            <CodeBlock code={USAGE[framework]} />
          </div>
        )}

        {/* ── Examples ── */}
        {mainTab === 'examples' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['basic', 'nextjs', 'params'] as const).map(e => (
                <button key={e} onClick={() => setExample(e)} style={subBtnStyle(example === e)}>
                  {EXAMPLES[e].label}
                </button>
              ))}
            </div>
            <CodeBlock code={EXAMPLES[example].code} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NoiseDocTabs
───────────────────────────────────────────────────────── */
function NoiseDocTabs() {
  const [tab, setTab] = useState<'install' | 'usage'>('install');
  const [framework, setFramework] = useState<'html' | 'nextjs' | 'react'>('html');

  const tabStyle = (active: boolean) => ({
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
    fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    padding: '0.4rem 0.9rem', border: 'none', cursor: 'none',
    borderRadius: '5px 5px 0 0',
    background: active ? '#fff' : 'transparent',
    color: active ? '#1b1c19' : 'rgba(27,28,25,0.38)',
    borderBottom: active ? '1px solid #fff' : '1px solid transparent',
    transition: 'all 0.15s',
  });

  const subBtnStyle = (active: boolean) => ({
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem',
    letterSpacing: '0.04em', padding: '0.3rem 0.75rem',
    border: `1px solid ${active ? 'rgba(27,28,25,0.35)' : 'rgba(27,28,25,0.1)'}`,
    borderRadius: 5, cursor: 'none',
    background: active ? '#1b1c19' : 'transparent',
    color: active ? '#fbf9f4' : 'rgba(27,28,25,0.4)',
    transition: 'all 0.15s',
  });

  const CodeBlock = ({ code }: { code: string }) => (
    <div style={{ background: '#1b1c19', borderRadius: 8, padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 11, right: 11 }}><CopyButton text={code} /></div>
      <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(251,249,244,0.8)', lineHeight: 1.7, margin: 0, overflowX: 'auto', paddingRight: '3.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{code}</pre>
    </div>
  );

  return (
    <div style={{ marginTop: '1.75rem' }}>
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(27,28,25,0.1)' }}>
        {(['install', 'usage'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
            {t === 'install' ? 'Installation' : 'Usage'}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid rgba(27,28,25,0.1)', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: '1.5rem', background: 'rgba(27,28,25,0.015)' }}>
        {tab === 'install' && (
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(27,28,25,0.5)', marginBottom: '1rem', lineHeight: 1.6 }}>
              CLI coming soon — for now, copy the implementation directly into your project.
            </p>
            <div style={{ background: '#1b1c19', borderRadius: 10, overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: 6, padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 'auto', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', lineHeight: '9px' }}>terminal</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.6em', alignItems: 'center' }}>
                  <span style={{ color: '#a8e060', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' }}>$</span>
                  <span style={{ color: 'rgba(251,249,244,0.85)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' }}>npx ryyan-ui add noise-overlay</span>
                </div>
                <CopyButton text="npx ryyan-ui add noise-overlay" />
              </div>
            </div>
            <CopyButton text={NOISE_CODE} label="{ } copy implementation" copiedLabel="✓ copied" />
          </div>
        )}
        {tab === 'usage' && (
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(27,28,25,0.5)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Works in any HTML project. Edit the four constants at the top to customise.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['html', 'nextjs', 'react'] as const).map(f => (
                <button key={f} onClick={() => setFramework(f)} style={subBtnStyle(framework === f)}>
                  {f === 'html' ? 'HTML' : f === 'nextjs' ? 'Next.js' : 'React / Vite'}
                </button>
              ))}
            </div>
            <CodeBlock code={NOISE_USAGE[framework]} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NoiseDemoModal
───────────────────────────────────────────────────────── */
function NoiseDemoModal({ onClose, params, blend, setBlend, update, reset }: {
  onClose: () => void;
  params: typeof NOISE_DEFAULTS;
  blend: string;
  setBlend: (b: string) => void;
  update: (key: keyof typeof NOISE_DEFAULTS, val: number) => void;
  reset: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(27,28,25,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', animation: 'modal-bd 0.22s ease' }} />
      {/* Panel */}
      <div style={{ position: 'relative', background: '#fbf9f4', borderRadius: 18, width: '100%', maxWidth: 920, maxHeight: '90vh', overflow: 'auto', animation: 'modal-panel 0.32s cubic-bezier(0.34,1.28,0.64,1)', boxShadow: '0 32px 80px rgba(27,28,25,0.22), 0 0 0 1px rgba(27,28,25,0.07)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 1.75rem', borderBottom: '1px solid rgba(27,28,25,0.08)', position: 'sticky', top: 0, zIndex: 5, background: 'rgba(251,249,244,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.9375rem', color: '#1b1c19' }}>noise-overlay</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.35)', background: 'rgba(27,28,25,0.05)', border: '1px solid rgba(27,28,25,0.1)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em' }}>v1.0.0</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.25)', marginLeft: '0.25rem' }}>· interactive demo</span>
          </div>
          <button className="modal-close" onClick={onClose} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', lineHeight: 1, color: 'rgba(27,28,25,0.4)', background: 'rgba(27,28,25,0.04)', border: '1px solid rgba(27,28,25,0.1)', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', transition: 'all 0.15s', flexShrink: 0 }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.75rem 1.75rem 2.5rem' }}>
          <div className="cc-demo-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(200px, 300px)', gap: '1.5rem', alignItems: 'start', marginBottom: '1.75rem' }}>
            <NoiseDemoBox params={params} blend={blend} />
            {/* Controls */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.38)' }}>Parameters</span>
                <button onClick={reset} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', letterSpacing: '0.06em', color: 'rgba(27,28,25,0.3)', background: 'transparent', border: '1px solid rgba(27,28,25,0.12)', borderRadius: 4, padding: '2px 7px', cursor: 'none' }}>reset</button>
              </div>
              <Slider label="OPACITY" hint="canvas opacity" value={params.opacity} min={0} max={0.5} step={0.01} onChange={v => update('opacity', v)} />
              <Slider label="GRAIN" hint="pixel block size" value={params.grain} min={1} max={8} step={1} onChange={v => update('grain', v)} />
              <Slider label="SPEED" hint="refresh interval" value={params.speed} min={1} max={8} step={1} onChange={v => update('speed', v)} />
              {/* Blend mode */}
              <div style={{ marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(27,28,25,0.45)', letterSpacing: '0.06em' }}>BLEND_MODE</span>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {(['overlay', 'screen', 'soft-light', 'multiply'] as const).map(m => (
                    <button key={m} onClick={() => setBlend(m)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', letterSpacing: '0.04em', padding: '3px 8px', border: `1px solid ${blend === m ? 'rgba(27,28,25,0.4)' : 'rgba(27,28,25,0.12)'}`, borderRadius: 4, cursor: 'none', background: blend === m ? '#1b1c19' : 'transparent', color: blend === m ? '#fbf9f4' : 'rgba(27,28,25,0.4)', transition: 'all 0.15s' }}>{m}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(27,28,25,0.03)', borderRadius: 7, border: '1px solid rgba(27,28,25,0.07)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.32)', lineHeight: 1.65, margin: 0 }}>
                  overlay → classic film grain<br />
                  screen → light, airy texture<br />
                  multiply → dark, grungy feel<br />
                  grain 1 → finest · 8 → chunky
                </p>
              </div>
            </div>
          </div>
          <NoiseDocTabs />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DemoModal — full-screen overlay popup
───────────────────────────────────────────────────────── */
function DemoModal({ onClose, params, physicsRef, update, reset }: {
  onClose: () => void;
  params: typeof DEFAULTS;
  physicsRef: React.RefObject<typeof DEFAULTS>;
  update: (key: keyof typeof DEFAULTS, val: number) => void;
  reset: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <style>{`
        @keyframes modal-bd   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modal-panel { from { opacity: 0; transform: scale(0.96) translateY(18px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        .modal-close:hover { background: rgba(27,28,25,0.1) !important; border-color: rgba(27,28,25,0.25) !important; color: #1b1c19 !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(27,28,25,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', animation: 'modal-bd 0.22s ease' }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', background: '#fbf9f4',
        borderRadius: 18, width: '100%', maxWidth: 920,
        maxHeight: '90vh', overflow: 'auto',
        animation: 'modal-panel 0.32s cubic-bezier(0.34,1.28,0.64,1)',
        boxShadow: '0 32px 80px rgba(27,28,25,0.22), 0 0 0 1px rgba(27,28,25,0.07)',
      }}>

        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.1rem 1.75rem', borderBottom: '1px solid rgba(27,28,25,0.08)',
          position: 'sticky', top: 0, zIndex: 5,
          background: 'rgba(251,249,244,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.9375rem', color: '#1b1c19' }}>
              cursor-spring
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.35)', background: 'rgba(27,28,25,0.05)', border: '1px solid rgba(27,28,25,0.1)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em' }}>
              v1.0.0
            </span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.25)', marginLeft: '0.25rem' }}>
              · interactive demo
            </span>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', lineHeight: 1,
              color: 'rgba(27,28,25,0.4)', background: 'rgba(27,28,25,0.04)',
              border: '1px solid rgba(27,28,25,0.1)', borderRadius: 8,
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', transition: 'all 0.15s', flexShrink: 0,
            }}
          >×</button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '1.75rem 1.75rem 2.5rem' }}>
          <div className="cc-demo-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(200px, 300px)', gap: '1.5rem', alignItems: 'start', marginBottom: '1.75rem' }}>

            {/* Interactive preview */}
            <CursorDemoBox physicsRef={physicsRef} />

            {/* Parameters */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.38)' }}>
                  Parameters
                </span>
                <button onClick={reset} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', letterSpacing: '0.06em', color: 'rgba(27,28,25,0.3)', background: 'transparent', border: '1px solid rgba(27,28,25,0.12)', borderRadius: 4, padding: '2px 7px', cursor: 'none' }}>
                  reset
                </button>
              </div>

              <Slider label="POS_STIFF" hint="stiffness" value={params.posStiff} min={30} max={600} step={10} onChange={v => update('posStiff', v)} />
              <Slider label="POS_DAMP" hint="damping" value={params.posDamp} min={5} max={60} step={1} onChange={v => update('posDamp', v)} />
              <Slider label="SCL_STIFF" hint="click snap" value={params.sclStiff} min={50} max={800} step={10} onChange={v => update('sclStiff', v)} />
              <Slider label="SCL_DAMP" hint="snap smooth" value={params.sclDamp} min={5} max={80} step={1} onChange={v => update('sclDamp', v)} />
              <Slider label="HOVER_BLUR" hint="on interactibles" value={params.hoverBlur} min={0} max={3} step={0.1} onChange={v => update('hoverBlur', v)} />

              <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: 'rgba(27,28,25,0.03)', borderRadius: 7, border: '1px solid rgba(27,28,25,0.07)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.32)', lineHeight: 1.65, margin: 0 }}>
                  Low stiff + low damp → floaty<br />
                  High stiff + high damp → snappy<br />
                  Low damp → bouncy overshoot<br />
                  Hover blur 0 → no glow · 3 → strong
                </p>
              </div>
            </div>
          </div>

          {/* Documentation tabs */}
          <DocTabs command="npx ryyan-ui add cursor-spring" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ComponentCard
───────────────────────────────────────────────────────── */
function ComponentCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [params, setParams] = useState(DEFAULTS);
  const physicsRef = useRef({ ...DEFAULTS });

  const update = useCallback((key: keyof typeof DEFAULTS, val: number) => {
    setParams(p => ({ ...p, [key]: val }));
    physicsRef.current[key] = val;
  }, []);

  const reset = useCallback(() => {
    setParams(DEFAULTS);
    physicsRef.current = { ...DEFAULTS };
  }, []);

  return (
    <>
      <div style={{ border: '1px solid rgba(27,28,25,0.1)', borderRadius: 14, background: '#fff', overflow: 'hidden', boxShadow: '0 2px 16px rgba(27,28,25,0.05)' }}>

        {/* ── Card header — always visible ── */}
        <div style={{ padding: '1.75rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Animated preview */}
          <CursorPreview />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '1.0625rem', letterSpacing: '-0.01em', margin: 0 }}>
                cursor-spring
              </h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.35)', background: 'rgba(27,28,25,0.05)', border: '1px solid rgba(27,28,25,0.1)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em' }}>
                v1.0.0
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'rgba(27,28,25,0.5)', lineHeight: 1.65, maxWidth: 420, margin: '0 0 0.875rem' }}>
              Spring-physics macOS arrow cursor with velocity-based motion blur. Scales on hover &amp; click. Auto-hides on touch. Drop one script into any project.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
              {TAGS.map(tag => (
                <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', color: 'rgba(27,28,25,0.38)', background: 'rgba(27,28,25,0.04)', border: '1px solid rgba(27,28,25,0.08)', borderRadius: 4, padding: '2px 7px' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  background: '#1b1c19', color: '#fbf9f4',
                  border: '1px solid transparent', borderRadius: 6,
                  padding: '0.45rem 1rem', cursor: 'none', transition: 'all 0.2s',
                }}
              >
                → try it live
              </button>

              <a
                href="https://github.com/ryyansafar/Ryyan-components"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(27,28,25,0.45)', textDecoration: 'none',
                  border: '1px solid rgba(27,28,25,0.14)', borderRadius: 6,
                  padding: '0.45rem 1rem', cursor: 'none', transition: 'all 0.15s',
                  display: 'inline-flex', alignItems: 'center', gap: '0.3em',
                }}
              >
                GitHub ↗
              </a>

              <div style={{ marginLeft: 'auto' }}>
                <LikeButton componentId="cursor-spring" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal rendered outside the card's overflow:hidden */}
      {modalOpen && (
        <DemoModal
          onClose={() => setModalOpen(false)}
          params={params}
          physicsRef={physicsRef}
          update={update}
          reset={reset}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   NoiseCard
───────────────────────────────────────────────────────── */
function NoiseCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [params, setParams] = useState(NOISE_DEFAULTS);
  const [blend, setBlend] = useState('overlay');

  const update = useCallback((key: keyof typeof NOISE_DEFAULTS, val: number) => {
    setParams(p => ({ ...p, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    setParams(NOISE_DEFAULTS);
    setBlend('overlay');
  }, []);

  return (
    <>
      <div style={{ border: '1px solid rgba(27,28,25,0.1)', borderRadius: 14, background: '#fff', overflow: 'hidden', boxShadow: '0 2px 16px rgba(27,28,25,0.05)' }}>
        <div style={{ padding: '1.75rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <NoisePreview />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '1.0625rem', letterSpacing: '-0.01em', margin: 0 }}>
                noise-overlay
              </h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: 'rgba(27,28,25,0.35)', background: 'rgba(27,28,25,0.05)', border: '1px solid rgba(27,28,25,0.1)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em' }}>
                v1.0.0
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(27,28,25,0.5)', lineHeight: 1.65, maxWidth: 420, margin: '0 0 0.875rem' }}>
              Film-grain noise rendered on a fixed canvas. Configurable opacity, grain size, speed, and blend mode. Adds tactile cinematic texture to any UI. Zero dependencies.
            </p>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
              {NOISE_TAGS.map(tag => (
                <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', color: 'rgba(27,28,25,0.38)', background: 'rgba(27,28,25,0.04)', border: '1px solid rgba(27,28,25,0.08)', borderRadius: 4, padding: '2px 7px' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: '#1b1c19', color: '#fbf9f4', border: '1px solid transparent', borderRadius: 6, padding: '0.45rem 1rem', cursor: 'none', transition: 'all 0.2s' }}
              >
                → try it live
              </button>
              <a
                href="https://github.com/ryyansafar/Ryyan-components"
                target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.45)', textDecoration: 'none', border: '1px solid rgba(27,28,25,0.14)', borderRadius: 6, padding: '0.45rem 1rem', cursor: 'none', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '0.3em' }}
              >
                GitHub ↗
              </a>
              <div style={{ marginLeft: 'auto' }}>
                <LikeButton componentId="noise-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <NoiseDemoModal
          onClose={() => setModalOpen(false)}
          params={params}
          blend={blend}
          setBlend={setBlend}
          update={update}
          reset={reset}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ComponentsClient — main export
───────────────────────────────────────────────────────── */
export function ComponentsClient() {
  return (
    <div style={{ minHeight: '100dvh', background: '#fbf9f4', color: '#1b1c19', fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;600;700&family=Epilogue:wght@900&display=swap');
        .cc-back:hover { background: rgba(27,28,25,0.06) !important; border-color: rgba(27,28,25,0.35) !important; }
        input[type=range] { display: block; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%;
          background: #1b1c19; cursor: none; margin-top: -5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.18);
        }
        input[type=range]::-moz-range-thumb {
          width: 13px; height: 13px; border-radius: 50%;
          background: #1b1c19; cursor: none; border: none;
        }
        @media (max-width: 680px) {
          .cc-demo-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cc-hero-pad    { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .cc-header-pad  { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .cc-main-pad    { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .cc-footer-pad  { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className="cc-header-pad" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.5rem',
        padding: '1.25rem 2.5rem', borderBottom: '1px solid rgba(27,28,25,0.08)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(251,249,244,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.35)' }}>
          RYYAN SAFAR / COMPONENTS
        </span>
        <Link href="/design" className="cc-back" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.5625rem',
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.55)',
          textDecoration: 'none', border: '1px solid rgba(27,28,25,0.18)',
          borderRadius: 5, padding: '0.375rem 0.875rem',
        }}>← DESIGN</Link>
      </header>

      {/* ── HERO ── */}
      <section className="cc-hero-pad" style={{ padding: '4rem 2.5rem 2.5rem', maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.3)', marginBottom: '1rem' }}>
          v0.1.0 · early access
        </p>
        <h1 style={{ fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.03em', margin: '0 0 1.5rem' }}>
          COMPO<br />NENTS
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55em', color: '#f7c533', marginLeft: '0.08em', animation: 'blink 1.1s step-end infinite' }}>_</span>
        </h1>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(27,28,25,0.5)', maxWidth: 400, lineHeight: 1.65, margin: 0 }}>
          Drop-in UI primitives. Copy-paste ready. Zero dependencies. Built in public.
        </p>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 2.5rem' }}>
        <div style={{ height: 1, background: 'rgba(27,28,25,0.08)' }} />
      </div>

      {/* ── COMPONENT LIST ── */}
      <main className="cc-main-pad" style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 2.5rem 6rem' }}>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(27,28,25,0.25)', letterSpacing: '0.08em', marginBottom: '1rem' }}>01 ——</p>

        <ComponentCard />

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'rgba(27,28,25,0.25)', letterSpacing: '0.08em', margin: '2.5rem 0 1rem' }}>02 ——</p>

        <NoiseCard />

        {/* More coming soon */}
        <div style={{ marginTop: '2rem', padding: '1.75rem', border: '1px dashed rgba(27,28,25,0.12)', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(27,28,25,0.28)', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>
            more components on the way
          </p>
          <a href="https://github.com/ryyansafar/Ryyan-components" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.35)', textDecoration: 'none' }}>
            star the repo to follow along ↗
          </a>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="cc-footer-pad" style={{ borderTop: '1px solid rgba(27,28,25,0.08)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.25)' }}>
          RYYAN SAFAR / COMPONENTS
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="https://razorpay.me/@ryyansafar"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.5625rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.35em',
              color: '#fbf9f4', background: '#1b1c19',
              border: '1px solid rgba(27,28,25,0.8)', borderRadius: 6,
              padding: '0.4rem 0.9rem', cursor: 'none',
            }}
          >
            ☕ support
          </a>
          <Link href="/" style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.25)', textDecoration: 'none' }}>
            MAIN PORTFOLIO ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
