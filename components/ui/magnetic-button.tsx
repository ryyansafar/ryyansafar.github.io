'use client';

import * as React from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  intensity?: number; // How "magnetic" it is (multiplier)
  range?: number;     // Pixel range to trigger the magnet
}

/**
 * MagneticButton
 * A premium magnetic interaction primitive for buttons and links.
 * Uses Radix UI Slot for "AsChild" compatibility and Framer Motion for physics.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, asChild = false, intensity = 0.45, range = 60, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    // Position motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth return
    const springX = useSpring(x, { stiffness: 180, damping: 20 });
    const springY = useSpring(y, { stiffness: 180, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const diffX = clientX - centerX;
      const diffY = clientY - centerY;
      
      // Calculate distance to determine if we should pull
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
      
      if (distance < range) {
        x.set(diffX * intensity);
        y.set(diffY * intensity);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="inline-block"
      >
        <Comp
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
      </motion.div>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
