'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface DesignNavProps {
  onBackToMain: () => void;
}

export default function DesignNav({ onBackToMain }: DesignNavProps) {
  return (
    <motion.nav
      className="design-nav-pill"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Design portfolio navigation"
    >
      {/* RS circle monogram — logo / back button */}
      <button
        onClick={onBackToMain}
        className="pill-logo"
        aria-label="Back to main portfolio"
      >
        <span className="pill-logo-mark" aria-hidden>RS</span>
        <span className="pill-logo-label">Design</span>
      </button>

      {/* Nav links */}
      <div className="pill-links">
        <Link href="/design/components" className="pill-link">
          Components
        </Link>
        <a
          href="https://github.com/ryyansafar"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-link"
        >
          GitHub ↗
        </a>
      </div>
    </motion.nav>
  );
}
