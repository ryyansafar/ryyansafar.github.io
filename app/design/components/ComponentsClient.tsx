'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import LikeButton from '@/components/LikeButton';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { cn } from '@/lib/utils';

/* 
   Registry Data
   This is the Source of Truth for redistribution.
*/

const CURSOR_VANILLA = `(function () {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;will-change:transform;transform-origin:0 0;display:none;';
  el.innerHTML = \`<svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
    <defs><filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur id="cur-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <g filter="url(#cur-mb)"><path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/><path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="white"/></g>
  </svg>\`;
  document.body.appendChild(el);
  const style = document.createElement('style');
  style.textContent = '@media(hover:hover)and(pointer:fine){body,body *{cursor:none!important}}';
  document.head.appendChild(style);
  let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0, sc = 1, st = 1, sv = 0, lt = performance.now();
  const PS = 240, PD = 27, SS = 330, SD = 30;
  window.addEventListener('mousemove', e => { el.style.display = 'block'; mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => st = 0.65);
  document.addEventListener('mouseup', () => st = 1);
  (function tick() {
    const now = performance.now(), dt = Math.min((now - lt) / 1000, 0.033); lt = now;
    vx += ((mx - x) * PS - vx * PD) * dt; vy += ((my - y) * PS - vy * PD) * dt;
    x += vx * dt; y += vy * dt;
    sv += ((st - sc) * SS - sv * SD) * dt; sc += sv * dt;
    el.style.transform = \`translate(\${x}px,\${y}px) scale(\${sc})\`;
    const speed = Math.sqrt(vx*vx+vy*vy);
    const blurEl = el.querySelector('#cur-blur');
    if (blurEl && speed > 20) {
      const a = Math.atan2(vy,vx), amt = Math.min(speed*0.005,2.8);
      blurEl.setAttribute('stdDeviation', \`\${(Math.abs(Math.cos(a))*amt).toFixed(2)} \${(Math.abs(Math.sin(a))*amt).toFixed(2)}\`);
    } else if (blurEl) blurEl.setAttribute('stdDeviation','0 0');
    requestAnimationFrame(tick);
  })();
})();`;

const CURSOR_REACT = `'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SpringCursor({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 240, damping: 27 });
  const springY = useSpring(mouseY, { stiffness: 240, damping: 27 });
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 330, damping: 30 });
  const blurX = useMotionValue(0);
  const blurY = useMotionValue(0);
  const stdDev = useTransform([blurX, blurY], ([x, y]) => \`\${x} \${y}\`);

  useEffect(() => {
    const onMove = (e) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX); mouseY.set(e.clientY);
      const vx = mouseX.getVelocity(), vy = mouseY.getVelocity();
      const speed = Math.sqrt(vx*vx + vy*vy);
      if (speed > 20) {
        const a = Math.atan2(vy, vx), amt = Math.min(speed * 0.005, 2.8);
        blurX.set(Math.abs(Math.cos(a)) * amt); blurY.set(Math.abs(Math.sin(a)) * amt);
      } else { blurX.set(0); blurY.set(0); }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', () => scale.set(0.65));
    window.addEventListener('mouseup', () => scale.set(1));
    return () => { window.removeEventListener('mousemove', onMove); };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn("fixed top-0 left-0 pointer-events-none z-[9999]", className)}
      style={{ x: springX, y: springY, scale: springScale }}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible">
        <defs><filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%"><motion.feGaussianBlur stdDeviation={stdDev} in="SourceGraphic" /></filter></defs>
        <g filter="url(#cur-mb)">
          <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/><path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="white"/></g>
      </svg>
    </motion.div>
  );
}`;

const MAGNETIC_REACT = `'use client';
import * as React from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export const Magnetic = React.forwardRef(({ className, asChild = false, intensity = 0.45, range = 60, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 20 });
  const springY = useSpring(y, { stiffness: 180, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const diffX = clientX - (left + width / 2);
    const diffY = clientY - (top + height / 2);
    if (Math.sqrt(diffX ** 2 + diffY ** 2) < range) {
      x.set(diffX * intensity); y.set(diffY * intensity);
    } else { x.set(0); y.set(0); }
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Comp
        ref={ref}
        className={cn("relative inline-flex items-center justify-center transition-colors focus-visible:outline-none", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        {...props}
      />
    </motion.div>
  );
});
Magnetic.displayName = "Magnetic";`;

interface Primitive {
  id: string;
  name: string;
  version: string;
  description: string;
  tags: string[];
  github: string;
  vanillaCode?: string;
  reactCode: string;
  dependencies: string[];
  preview: React.ReactNode;
  interactivePreview?: React.ReactNode;
}

const PRIMITIVES: Primitive[] = [
  {
    id: 'cursor-spring',
    name: 'cursor-spring',
    version: '1.0.0',
    description: 'Spring-physics macOS arrow cursor with velocity-based motion blur. Scales on hover & click. Auto-hides on touch.',
    tags: ['vanilla-js', 'framer-motion', 'spring-physics', 'shadcn-ready'],
    github: 'https://github.com/ryyansafar/Ryyan-components',
    vanillaCode: CURSOR_VANILLA,
    reactCode: CURSOR_REACT,
    dependencies: ['framer-motion', 'clsx', 'tailwind-merge'],
    preview: <CursorStaticPreview />,
    interactivePreview: <CursorDemoBox />,
  },
  {
    id: 'magnetic-button',
    name: 'magnetic-button',
    version: '1.0.0',
    description: 'Premium magnetic interaction primitive for buttons and links. Uses Radix UI Slot for AsChild compatibility.',
    tags: ['radix-ui', 'framer-motion', 'shadcn-ready', 'magnetic'],
    github: 'https://github.com/ryyansafar/Ryyan-components',
    reactCode: MAGNETIC_REACT,
    dependencies: ['framer-motion', '@radix-ui/react-slot', 'clsx', 'tailwind-merge'],
    preview: <MagneticStaticPreview />,
    interactivePreview: <MagneticDemoBox />,
  }
];

function CursorStaticPreview() {
  return (
    <div className="relative w-[200px] h-[158px] bg-[#0e0f0d] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
      <motion.div
        animate={{ x: [ -20, 20, -20 ], y: [ -10, 10, -10 ] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="26" viewBox="0 0 22 28" overflow="visible" fill="none">
          <path d="M2 2 L2 22 L6.5 17.5 L11 25.5 L13.5 24 L9 16.5 L16 16.5 Z" fill="white" />
        </svg>
      </motion.div>
      <div className="absolute bottom-2 right-3 font-mono text-[10px] uppercase text-white/20 tracking-widest">cursor</div>
    </div>
  );
}

function MagneticStaticPreview() {
  return (
    <div className="relative w-[200px] h-[158px] bg-[#0e0f0d] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#f7c533] animate-pulse" />
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[10px] uppercase text-white/20 tracking-widest">magnetic</div>
    </div>
  );
}

function CursorDemoBox() {
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
  
      const PS = 240, PD = 27, SS = 330, SD = 30;
  
      const onEnter = () => {
        const main = document.getElementById('custom-cursor');
        if (main) main.style.opacity = '0';
      };
      const onLeave = () => {
        cur.style.display = 'none';
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
      };
  
      box.addEventListener('mouseenter', onEnter);
      box.addEventListener('mouseleave', onLeave);
      box.addEventListener('mousemove', onMove);
      box.addEventListener('mousedown', () => s.st = 0.65);
      box.addEventListener('mouseup', () => s.st = 1);
  
      const tick = () => {
        const now = performance.now();
        const dt = Math.min((now - s.lt) / 1000, 0.033);
        s.lt = now;
        s.vx += ((s.mx - s.x) * PS - s.vx * PD) * dt;
        s.vy += ((s.my - s.y) * PS - s.vy * PD) * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.sv += ((s.st - s.sc) * SS - s.sv * SD) * dt;
        s.sc += s.sv * dt;
  
        cur.style.transform = \`translate(\${s.x}px,\${s.y}px) scale(\${s.sc})\`;
  
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const blurEl = cur.querySelector<SVGFEGaussianBlurElement>('#demo-blur');
        if (blurEl) {
          const amt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
          const a = amt > 0 ? Math.atan2(s.vy, s.vx) : 0;
          const bx = Math.abs(Math.cos(a)) * amt;
          const by = Math.abs(Math.sin(a)) * amt;
          blurEl.setAttribute('stdDeviation', \`\${bx.toFixed(2)} \${by.toFixed(2)}\`);
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
  
      return () => {
        cancelAnimationFrame(animRef.current);
        box.removeEventListener('mouseenter', onEnter);
        box.removeEventListener('mouseleave', onLeave);
        box.removeEventListener('mousemove', onMove);
        const main = document.getElementById('custom-cursor');
        if (main) main.style.opacity = '1';
      };
    }, []);
  
    return (
      <div ref={boxRef} className="relative h-[320px] bg-[#0e0f0d] rounded-xl border border-white/10 overflow-hidden cursor-none select-none">
        <div ref={curRef} className="absolute top-0 left-0 pointer-events-none hidden z-10 origin-top-left">
          <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
            <defs><filter id="demo-mb" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur id="demo-blur" stdDeviation="0 0" in="SourceGraphic" /></filter></defs>
            <g filter="url(#demo-mb)">
              <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/><path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="white"/></g>
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white/20 tracking-widest uppercase">interactive zone</div>
      </div>
    );
}

function MagneticDemoBox() {
  return (
    <div className="relative h-[320px] bg-[#0e0f0d] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center gap-6">
      <MagneticButton className="px-8 py-3 bg-white text-black font-bold rounded-full text-xs uppercase tracking-wider">
        Magnetic Center
      </MagneticButton>
      <MagneticButton className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
        <div className="w-2 h-2 rounded-full bg-[#f7c533]" />
      </MagneticButton>
    </div>
  );
}

function CopyButton({ text, label = 'copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className={cn(
      "px-3 py-1 rounded text-[11px] font-mono transition-all border",
      copied ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
    )}>
      {copied ? '✓ copied' : label}
    </button>
  );
}

function DocTabs({ primitive }: { primitive: Primitive }) {
  const [tab, setTab] = useState<'install' | 'usage'>('install');
  const [format, setFormat] = useState<'react' | 'vanilla'>(primitive.vanillaCode ? 'vanilla' : 'react');

  return (
    <div className="mt-6">
      <div className="flex gap-1 border-b border-black/10">
        <button onClick={() => setTab('install')} className={cn("px-4 py-2 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all", tab === 'install' ? "border-black text-black" : "border-transparent text-black/40")}>Installation</button>
        <button onClick={() => setTab('usage')} className={cn("px-4 py-2 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all", tab === 'usage' ? "border-black text-black" : "border-transparent text-black/40")}>Usage</button>
      </div>

      <div className="py-6">
        {tab === 'install' && (
          <div className="space-y-4">
            <div className="flex gap-2">
                <button onClick={() => setFormat('react')} className={cn("px-3 py-1 rounded text-[10px] font-mono border transition-all", format === 'react' ? "bg-black text-white" : "bg-transparent text-black/40 border-black/10")}>React / Shadcn</button>
                {primitive.vanillaCode && (
                  <button onClick={() => setFormat('vanilla')} className={cn("px-3 py-1 rounded text-[10px] font-mono border transition-all", format === 'vanilla' ? "bg-black text-white" : "bg-transparent text-black/40 border-black/10")}>Vanilla JS</button>
                )}
            </div>
            
            <div className="bg-[#0e0f0d] rounded-xl overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">terminal</span>
                <CopyButton text={\`npx ryyan-ui add \${primitive.id}\`} />
              </div>
              <div className="p-5 font-mono text-xs flex items-center gap-3">
                <span className="text-green-400">$</span>
                <span className="text-white/80">npx ryyan-ui add {primitive.id}</span>
              </div>
            </div>

            <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl space-y-2">
               <h4 className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Dependencies</h4>
               <p className="text-xs text-black/60 font-mono">npm install {primitive.dependencies.join(' ')}</p>
            </div>
          </div>
        )}

        {tab === 'usage' && (
          <div className="bg-[#0e0f0d] rounded-xl overflow-hidden relative">
             <div className="absolute top-3 right-3 z-10">
                <CopyButton text={format === 'react' ? primitive.reactCode : primitive.vanillaCode || ''} />
             </div>
             <pre className="p-6 text-[12px] font-mono text-white/80 overflow-auto max-h-[400px]">
                {format === 'react' ? primitive.reactCode : primitive.vanillaCode}
             </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({ primitive }: { primitive: Primitive }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="p-8 flex gap-8 items-start flex-wrap md:flex-nowrap">
        {primitive.preview}
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight">{primitive.name}</h2>
              <span className="px-2 py-0.5 bg-black/5 rounded text-[10px] font-mono text-black/40">{primitive.version}</span>
            </div>
            <LikeButton componentId={primitive.id} />
          </div>

          <p className="text-sm text-black/50 leading-relaxed max-w-lg">{primitive.description}</p>

          <div className="flex gap-2 flex-wrap">
            {primitive.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-black/[0.03] border border-black/5 rounded text-[9px] font-mono text-black/40 uppercase tracking-wider">{tag}</span>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setExpanded(!expanded)} className={cn("px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", expanded ? "bg-black/5 text-black" : "bg-black text-white hover:scale-105 active:scale-95")}>
              {expanded ? '↑ Close' : '→ Interact'}
            </button>
            <a href={primitive.github} target="_blank" className="px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all">GitHub ↗</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-black/5 overflow-hidden">
             <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {primitive.interactivePreview}
                  <div className="p-6 bg-black/[0.02] rounded-xl border border-black/5 flex flex-col justify-center">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-4">Implementation Notes</h3>
                     <p className="text-xs text-black/50 leading-loose">
                       This primitive is designed to be Shadcn-compatible. It uses individual Framer Motion hooks for physics and Radix primitives (like Slot) for clean DOM inheritance. Perfect for redistribution.
                     </p>
                  </div>
               </div>
               <DocTabs primitive={primitive} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ComponentsClient() {
  return (
    <div className="min-h-screen bg-[#fbf9f4] text-black selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Epilogue:wght@900&display=swap');
      `}</style>
      
      <header className="sticky top-0 z-50 bg-[#fbf9f4]/80 backdrop-blur-xl border-b border-black/5 px-8 py-5 flex justify-between items-center">
         <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/30">Ryyan Safar / Registry</span>
         <Link href="/design" className="px-4 py-1.5 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">← Back</Link>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-20">
         <section className="mb-20 space-y-6">
            <div className="inline-flex px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">v0.2.0 · Stable</div>
            <h1 className="text-7xl md:text-9xl font-black font-['Epilogue'] tracking-tighter leading-[0.85] uppercase">
              Tech<br />Primit<span className="text-yellow-500">_</span>ives
            </h1>
            <p className="text-lg text-black/40 max-w-xl font-medium leading-relaxed">
              Highly performance-optimized UI foundations. Built with Framer Motion and Radix UI. Copy-paste ready for the modern web.
            </p>
         </section>

         <div className="space-y-12">
            {PRIMITIVES.map((primitive, idx) => (
              <div key={primitive.id} className="space-y-4">
                <span className="font-mono text-[10px] text-black/20 uppercase tracking-[0.2em]">0{idx + 1} ———</span>
                <ComponentCard primitive={primitive} />
              </div>
            ))}
         </div>

         <footer className="mt-32 pt-20 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
               <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">Built in public by Ryyan Safar</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">© 2026 All Rights Reserved</p>
            </div>
            <div className="flex gap-12">
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-50 transition-opacity">Twitter</a>
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-50 transition-opacity">GitHub</a>
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-50 transition-opacity">LinkedIn</a>
            </div>
         </footer>
      </main>
    </div>
  );
}
