'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
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
 * A high-performance, spring-physics cursor with velocity-based motion blur.
 * Designed to be a drop-in primitive for shadcn-style systems.
 */
export default function SpringCursor({
  className,
  stiffness = 240,
  damping = 27,
  scaleStiffness = 330,
  scaleDamping = 30,
}: SpringCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Motion values for position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth movement
  const springX = useSpring(mouseX, { stiffness, damping });
  const springY = useSpring(mouseY, { stiffness, damping });
  
  // Motion values for scale
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: scaleStiffness, damping: scaleDamping });
  
  // Motion values for blur (velocity-based)
  const blurX = useMotionValue(0);
  const blurY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Calculate velocity for blur
      const vx = mouseX.getVelocity();
      const vy = mouseY.getVelocity();
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      if (speed > 20) {
        const angle = Math.atan2(vy, vx);
        const amount = Math.min(speed * 0.005, 2.8);
        blurX.set(Math.abs(Math.cos(angle)) * amount);
        blurY.set(Math.abs(Math.sin(angle)) * amount);
      } else {
        blurX.set(0);
        blurY.set(0);
      }
    };

    const handleMouseDown = () => scale.set(0.65);
    const handleMouseUp = () => scale.set(1);
    const handleTouchStart = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);

    // Hide original cursor
    const style = document.createElement('style');
    style.innerHTML = '@media(hover:hover)and(pointer:fine){body,body *{cursor:none!important}}';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      document.head.removeChild(style);
    };
  }, [isVisible, mouseX, mouseY, scale, blurX, blurY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn("fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform", className)}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
      }}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
        <defs>
          <filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%">
            <motion.feGaussianBlur 
              stdDeviation="0 0" 
              style={{
                // @ts-ignore - motion values in SVG attributes
                stdDeviation: `${blurX.get()} ${blurY.get()}`
              }}
              in="SourceGraphic" 
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#cur-mb)">
          <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/>
          <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z" fill="white"/>
        </g>
      </svg>
    </motion.div>
  );
}
