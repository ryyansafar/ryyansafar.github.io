'use client';

import { useEffect, useRef } from 'react';

export default function DesignCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Position state — start off-screen to avoid (0,0) flash
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId = 0;

    // ── Tick: dot follows exactly, ring lerps behind ───────────────────────
    const tick = () => {
      // Lerp factor 0.1 → nice ~400ms lag at 60fps
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;

      dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Mouse position ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);

    // ── Hover states via class delegation ────────────────────────────────
    const setMode = (mode: 'default' | 'view' | 'btn') => {
      ring.classList.toggle('dc-ring--view', mode === 'view');
      ring.classList.toggle('dc-ring--btn',  mode === 'btn');
      dot.classList.toggle('dc-dot--hidden',  mode !== 'default');
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.project-card'))   setMode('view');
      else if (t.closest('a, button')) setMode('btn');
      else                              setMode('default');
    };

    // ── Press feedback: dot scales up, ring tightens ──────────────────────
    const onDown = () => {
      dot.classList.add('dc-dot--press');
      ring.classList.add('dc-ring--press');
    };
    const onUp = () => {
      dot.classList.remove('dc-dot--press');
      ring.classList.remove('dc-ring--press');
    };

    // ── Visibility when entering / leaving the page ───────────────────────
    const onLeave = () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity  = '';
      ring.style.opacity = '';
    };

    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="dc-dot"  aria-hidden="true" />
      <div ref={ringRef} className="dc-ring" aria-hidden="true">
        <span className="dc-ring-label">VIEW</span>
      </div>
    </>
  );
}
