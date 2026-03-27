'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpringCursorProps {
  className?: string;
  stiffness?: number;
  damping?: number;
  scaleStiffness?: number;
  scaleDamping?: number;
}

/**
 * SpringCursor
 * Spring-physics macOS cursor with velocity-based motion blur and hover scale.
 * Drop-in for shadcn-style projects.
 */
export default function SpringCursor({
  className,
  stiffness = 240,
  damping = 27,
  scaleStiffness = 330,
  scaleDamping = 30,
}: SpringCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  // Ref avoids re-registering listeners when isVisible changes
  const isVisibleRef = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness, damping });
  const springY = useSpring(mouseY, { stiffness, damping });

  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: scaleStiffness, damping: scaleDamping });

  const blurX = useMotionValue(0);
  const blurY = useMotionValue(0);
  const stdDeviation = useTransform([blurX, blurY], ([x, y]: number[]) => `${x} ${y}`);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisibleRef.current) { isVisibleRef.current = true; setIsVisible(true); }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const vx = mouseX.getVelocity();
      const vy = mouseY.getVelocity();
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 20) {
        const a = Math.atan2(vy, vx);
        const amt = Math.min(speed * 0.005, 2.8);
        blurX.set(Math.abs(Math.cos(a)) * amt);
        blurY.set(Math.abs(Math.sin(a)) * amt);
      } else { blurX.set(0); blurY.set(0); }
    };

    const handlePointerDown = () => scale.set(0.65);
    const handlePointerUp   = () => scale.set(1);
    const handleMouseOver   = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) scale.set(1.3);
    };
    const handleMouseOut    = (e: MouseEvent) => {
      if (!(e.relatedTarget as HTMLElement | null)?.closest('a, button')) scale.set(1);
    };
    const handleTouchStart  = () => { isVisibleRef.current = false; setIsVisible(false); };

    window.addEventListener('pointermove',  handlePointerMove, { capture: true, passive: true });
    window.addEventListener('pointerdown',  handlePointerDown, { capture: true, passive: true });
    window.addEventListener('pointerup',    handlePointerUp,   { capture: true, passive: true });
    document.addEventListener('mouseover',  handleMouseOver);
    document.addEventListener('mouseout',   handleMouseOut);
    window.addEventListener('touchstart',   handleTouchStart, { passive: true });

    const style = document.createElement('style');
    style.textContent = '@media(hover:hover)and(pointer:fine){html,body,body *{cursor:none!important}}';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('pointermove',  handlePointerMove, { capture: true });
      window.removeEventListener('pointerdown',  handlePointerDown, { capture: true });
      window.removeEventListener('pointerup',    handlePointerUp,   { capture: true });
      document.removeEventListener('mouseover',  handleMouseOver);
      document.removeEventListener('mouseout',   handleMouseOut);
      window.removeEventListener('touchstart',   handleTouchStart);
      // Optional chain guards against rare cases where head lost the element
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseX, mouseY, scale, blurX, blurY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn('fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform', className)}
      style={{ x: springX, y: springY, scale: springScale }}
    >
      {/* Unique filter ID — avoids collision with other SVG filters on the page */}
      <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
        <defs>
          <filter id="sc-motion-blur" x="-150%" y="-150%" width="400%" height="400%">
            <motion.feGaussianBlur
              // @ts-ignore — Framer Motion animates SVG attribute
              stdDeviation={stdDeviation}
              in="SourceGraphic"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#sc-motion-blur)">
          {/* Drop shadow */}
          <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
            fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)" />
          {/* Cursor — stroke ensures visibility on both dark and light backgrounds */}
          <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
            fill="white" stroke="rgba(0,0,0,0.55)" strokeWidth={1} strokeLinejoin="round" />
        </g>
      </svg>
    </motion.div>
  );
}
