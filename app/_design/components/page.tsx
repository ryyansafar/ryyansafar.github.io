import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Components — [RS_DESIGN]',
  description: 'CRT UI component library by Ryyan Safar. Copy-paste ready React components.',
};

// ── Component demos ────────────────────────────────────────────────────────
const CRT_TEXT_CODE = `// CRT phosphor-glow text
<span style={{
  fontFamily: 'JetBrains Mono, monospace',
  color: '#00ff41',
  textShadow:
    '0 0 8px rgba(0,255,65,0.9), 0 0 20px rgba(0,255,65,0.5)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}}>
  [RS_DESIGN]
</span>`;

const GLITCH_BTN_CODE = `// Glitch hover button
<button className="glitch-btn">
  Execute [→]
</button>

/* CSS */
.glitch-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: none;
  border: 1px solid rgba(0,255,65,0.5);
  color: #00ff41;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  position: relative;
}
.glitch-btn:hover {
  background: rgba(0,255,65,0.08);
  box-shadow: 0 0 12px rgba(0,255,65,0.2);
}`;

const SCANLINES_CODE = `// Scanlines overlay
<div className="crt-scanlines" aria-hidden="true" />

/* CSS */
.crt-scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9997;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,255,65,0.022) 0px,
    rgba(0,255,65,0.022) 1px,
    transparent 1px,
    transparent 3px
  );
  animation: scanlines-scroll 10s linear infinite;
}`;

const VIGNETTE_CODE = `// CRT vignette
<div className="crt-vignette" aria-hidden="true" />

/* CSS */
.crt-vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 0%, transparent 42%,
    rgba(0,0,0,0.12) 68%,
    rgba(0,0,0,0.5) 100%
  );
}`;

const CHROMATIC_CODE = `// Chromatic aberration text
<div className="chromatic" data-text="ERROR">
  ERROR
</div>

/* CSS */
.chromatic::before,
.chromatic::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  mix-blend-mode: screen;
}
.chromatic::before {
  color: rgba(255,0,64,0.8);
  transform: translate(3px, 1px);
}
.chromatic::after {
  color: rgba(0,255,255,0.8);
  transform: translate(-3px, -1px);
}`;

const GRAIN_CODE = `// Canvas grain overlay (React)
'use client';
import { useEffect, useRef } from 'react';

export function GrainOverlay({ intensity = 0.06 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 256; canvas.height = 256;
    const draw = () => {
      const img = ctx.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = Math.random() * 255;
        img.data[i] = img.data[i+1] = img.data[i+2] = n;
        img.data[i+3] = intensity * 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    const id = setInterval(draw, 100);
    return () => clearInterval(id);
  }, [intensity]);
  return (
    <canvas ref={ref} style={{
      position:'fixed', inset:0,
      width:'100%', height:'100%',
      pointerEvents:'none',
      mixBlendMode:'screen',
      opacity: intensity,
      imageRendering:'pixelated',
    }} />
  );
}`;

const HUD_CODE = `// HUD corner decoration (cybercore)
<div style={{ position:'relative', padding:'1rem' }}>
  {/* Corners */}
  {['tl','tr','bl','br'].map(pos => (
    <div key={pos} style={{
      position:'absolute',
      width:14, height:14,
      ...(pos.includes('t') ? {top:0} : {bottom:0}),
      ...(pos.includes('l') ? {left:0} : {right:0}),
      borderTop: pos.includes('t') ? '1px solid #00ff41' : 'none',
      borderBottom: pos.includes('b') ? '1px solid #00ff41' : 'none',
      borderLeft: pos.includes('l') ? '1px solid #00ff41' : 'none',
      borderRight: pos.includes('r') ? '1px solid #00ff41' : 'none',
      opacity: 0.5,
    }} />
  ))}
  {children}
</div>`;

const PS2_GRAIN_CODE = `// PS2 color noise grain (error mode)
function generatePS2Grain(ctx, intensity) {
  const img = ctx.createImageData(512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const shift = Math.random();
    img.data[i]   = shift > 0.7 ? 220 : Math.random() * 160; // R
    img.data[i+1] = shift > 0.5 ? 0   : Math.random() * 80;  // G
    img.data[i+2] = shift > 0.8 ? 220 : Math.random() * 120; // B
    img.data[i+3] = intensity * 255 * 0.45;
  }
  ctx.putImageData(img, 0, 0);
}`;

const components = [
  {
    title: 'CRT Phosphor Text',
    desc: 'Glowing green text mimicking phosphor CRT display output.',
    preview: 'crt-text',
    code: CRT_TEXT_CODE,
  },
  {
    title: 'Glitch Button',
    desc: 'Terminal-style button with CRT green border and hover glow.',
    preview: 'glitch-btn',
    code: GLITCH_BTN_CODE,
  },
  {
    title: 'Scanlines Overlay',
    desc: 'Fixed overlay replicating CRT horizontal scan line interference.',
    preview: 'scanlines',
    code: SCANLINES_CODE,
  },
  {
    title: 'CRT Vignette',
    desc: 'Radial gradient darkening at screen edges — classic CRT glass effect.',
    preview: 'vignette',
    code: VIGNETTE_CODE,
  },
  {
    title: 'Chromatic Aberration',
    desc: 'RGB channel split text effect inspired by PS2 error screens.',
    preview: 'chromatic',
    code: CHROMATIC_CODE,
  },
  {
    title: 'Canvas Grain Overlay',
    desc: 'Animated film grain via Canvas API — 10fps, screen blend mode.',
    preview: 'grain',
    code: GRAIN_CODE,
  },
  {
    title: 'HUD Corner Marks',
    desc: 'Cybercore bounding-box corner indicators for project cards.',
    preview: 'hud',
    code: HUD_CODE,
  },
  {
    title: 'PS2 Color Noise',
    desc: 'RGB corruption grain inspired by PlayStation 2 disc read errors.',
    preview: 'ps2-grain',
    code: PS2_GRAIN_CODE,
  },
];

function PreviewDemo({ type }: { type: string }) {
  switch (type) {
    case 'crt-text':
      return (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#00ff41',
            textShadow: '0 0 8px rgba(0,255,65,0.9), 0 0 20px rgba(0,255,65,0.5)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '1.1rem',
          }}
        >
          [RS_DESIGN]
        </span>
      );

    case 'glitch-btn':
      return (
        <button className="demo-glitch-btn" type="button">
          Execute [→]
        </button>
      );

    case 'scanlines':
      return (
        <div className="demo-scanlines-box">
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: 'rgba(0,255,65,0.6)',
              letterSpacing: '0.1em',
              zIndex: 1,
            }}
          >
            SCAN_OK
          </span>
        </div>
      );

    case 'vignette':
      return (
        <div
          style={{
            width: 120,
            height: 80,
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </div>
      );

    case 'chromatic':
      return (
        <div style={{ position: 'relative', fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
          <span style={{ position: 'relative', zIndex: 1 }}>ERROR</span>
          <span style={{ position: 'absolute', top: 0, left: 0, color: 'rgba(255,0,64,0.8)', transform: 'translate(3px,1px)', mixBlendMode: 'screen' }}>ERROR</span>
          <span style={{ position: 'absolute', top: 0, left: 0, color: 'rgba(0,255,255,0.8)', transform: 'translate(-3px,-1px)', mixBlendMode: 'screen' }}>ERROR</span>
        </div>
      );

    case 'grain':
      return (
        <div
          style={{
            width: 120,
            height: 80,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      );

    case 'hud':
      return (
        <div
          style={{
            position: 'relative',
            width: 100,
            height: 70,
            background: '#070707',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map((p) => (
            <div
              key={p}
              style={{
                position: 'absolute',
                width: 12,
                height: 12,
                ...(p.includes('t') ? { top: 4 } : { bottom: 4 }),
                ...(p.includes('l') ? { left: 4 } : { right: 4 }),
                borderTop: p.includes('t') ? '1px solid #00ff41' : 'none',
                borderBottom: p.includes('b') ? '1px solid #00ff41' : 'none',
                borderLeft: p.includes('l') ? '1px solid #00ff41' : 'none',
                borderRight: p.includes('r') ? '1px solid #00ff41' : 'none',
                opacity: 0.6,
              }}
            />
          ))}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.55rem',
              color: 'rgba(0,255,65,0.4)',
              letterSpacing: '0.15em',
            }}
          >
            CAM 01
          </span>
        </div>
      );

    case 'ps2-grain':
      return (
        <div
          style={{
            width: 120,
            height: 80,
            background: '#0d0000',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,0,64,0.2)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,0,0,0.05) 0px, rgba(255,0,0,0.05) 2px, transparent 2px, transparent 4px)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              color: 'rgba(255,0,64,0.7)',
              letterSpacing: '0.1em',
              textShadow: '0 0 6px rgba(255,0,64,0.8)',
            }}
          >
            ERR_PS2
          </span>
        </div>
      );

    default:
      return null;
  }
}

export default function ComponentsPage() {
  return (
    <div className="comps-page">
      <header className="comps-header">
        <span className="comps-header-title">Ryyan's CRT Components</span>
        <Link href="/design" className="comps-back">
          ← Back to Portfolio
        </Link>
      </header>

      <main className="comps-main">
        <div className="comps-intro">
          <h2>Design Components</h2>
          <p>
            CRT-aesthetic UI primitives. Canvas grain, phosphor glow, chromatic aberration,
            PS2 error effects, and cybercore HUD elements. Copy-paste ready.
          </p>
          <pre className="comps-install-block">
            {`# Install as standalone package (coming soon)
npm install @ryyansafar/crt-components
# or
bun add @ryyansafar/crt-components`}
          </pre>
        </div>

        <div className="comps-grid">
          {components.map((comp) => (
            <div key={comp.title} className="comp-card">
              <div className="comp-card-preview">
                <PreviewDemo type={comp.preview} />
              </div>
              <div className="comp-card-info">
                <div className="comp-card-title">{comp.title}</div>
                <div className="comp-card-desc">{comp.desc}</div>
                <pre className="comp-card-code">{comp.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
