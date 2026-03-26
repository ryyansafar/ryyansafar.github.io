'use client';

import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroLine {
  text: string;
  font: 'display' | 'serif';
  indent: string;
  size: string;
}

// Swiss poster grid — alternating indent creates visual tension
const LINES: HeroLine[] = [
  { text: 'Ryyan',      font: 'display', indent: '0vw',  size: 'clamp(5.5rem, 16vw, 14rem)' },
  { text: 'also',       font: 'serif',   indent: '24vw', size: 'clamp(2.5rem, 6vw, 5rem)'   },
  { text: 'freelances', font: 'display', indent: '5vw',  size: 'clamp(4rem, 13vw, 11rem)'   },
  { text: '& does',     font: 'serif',   indent: '30vw', size: 'clamp(2rem, 5vw, 4.2rem)'   },
  { text: 'web work.',  font: 'display', indent: '2vw',  size: 'clamp(4.5rem, 14vw, 12rem)' },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const lineVariant: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%', opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const metaVariant: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.75 } },
};

export default function FisheyeHero() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="fh-root" aria-label="Hero">

      {/* Minimal corner marks */}
      <div className="hero-hud-tl" aria-hidden />
      <div className="hero-hud-tr" aria-hidden />
      <div className="hero-hud-bl" aria-hidden />
      <div className="hero-hud-br" aria-hidden />

      {/* Top-left label */}
      <motion.div
        className="fh-tag"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        RS / Design
      </motion.div>

      {/* Top-right label */}
      <motion.div
        className="fh-status"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Available 2026
      </motion.div>

      {/* FREELANCE — vertical right-edge strip, Swiss poster accent */}
      <motion.div
        className="fh-freelance-strip"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <span className="fh-freelance-text">FREELANCE</span>
      </motion.div>

      {/* ── Main headline — type as the visual ── */}
      <motion.div
        className="fh-headline"
        variants={container}
        initial="hidden"
        animate="visible"
        aria-label="Ryyan also freelances and does web work"
      >
        {LINES.map((line) => (
          <div
            key={line.text}
            className="fh-line-wrap"
            aria-hidden
            style={{ marginLeft: line.indent }}
          >
            <motion.span
              className="fh-line"
              variants={shouldReduce ? undefined : lineVariant}
              style={{
                fontSize: line.size,
                fontFamily: line.font === 'serif'
                  ? 'var(--font-serif)'
                  : 'var(--font-display)',
                fontStyle:     line.font === 'serif' ? 'italic' : 'normal',
                fontWeight:    line.font === 'serif' ? 400      : 700,
                letterSpacing: line.font === 'serif' ? '-0.02em' : '-0.045em',
                opacity:       line.font === 'serif' ? 0.62 : 1,
              }}
            >
              {line.text}
            </motion.span>
          </div>
        ))}
      </motion.div>

      {/* Thin rule separating headline from meta */}
      <div className="fh-divider" aria-hidden />

      {/* Meta row */}
      <motion.div
        className="fh-meta"
        variants={metaVariant}
        initial="hidden"
        animate="visible"
      >
        <span>Frontend · Design · Motion</span>
        <div className="fh-scroll-hint" aria-label="Scroll to explore">
          <span className="fh-scroll-arrow">↓</span>
          <span>Scroll to explore</span>
        </div>
      </motion.div>

    </section>
  );
}
