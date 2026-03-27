'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { usePageTransition } from './TransitionProvider';

export interface BubbleMenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor: string; textColor: string };
}

interface BubbleMenuProps {
  logo?: ReactNode;
  items: BubbleMenuItem[];
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

export default function BubbleMenu({
  logo,
  items,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#0d0d0d',
  menuContentColor = '#f0f0f0',
  animationEase = 'back.out(1.5)',
  animationDuration = 0.45,
  staggerDelay = 0.08,
}: BubbleMenuProps) {
  const { navigateTo } = usePageTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Animate bubbles in/out with GSAP (CSS controls overlay visibility)
  useEffect(() => {
    const bubbles = (bubblesRef.current as HTMLElement[]).filter(Boolean);
    const labels  = (labelRefs.current  as HTMLElement[]).filter(Boolean);
    if (!bubbles.length) return;

    if (isMenuOpen) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels,  { y: 20, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay;
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) {
          tl.to(labels[i], {
            y: 0, autoAlpha: 1,
            duration: animationDuration * 0.85,
            ease: 'power3.out',
          }, `-=${animationDuration * 0.85}`);
        }
      });
    } else {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels,  { y: 20, autoAlpha: 0, duration: 0.18, ease: 'power3.in' });
      gsap.to(bubbles, {
        scale: 0, duration: 0.18, ease: 'power3.in',
        stagger: { amount: 0.08, from: 'end' },
      });
    }
  }, [isMenuOpen, animationEase, animationDuration, staggerDelay]);

  // Scroll-lock while menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        .bm-bar {
          position: fixed;
          top: calc(1.25rem + env(safe-area-inset-top, 0px));
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          pointer-events: none;
          z-index: 1002;
        }
        .bm-bubble {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          will-change: transform;
        }
        .bm-logo-bubble {
          height: 46px;
          padding: 0 1.25rem;
          gap: 0.5rem;
          min-width: 70px;
        }
        .bm-toggle-bubble {
          width: 46px;
          height: 46px;
          flex-direction: column;
          gap: 5px;
          border: none;
          cursor: pointer;
          outline: none;
        }
        .bm-toggle-bubble:active { transform: scale(0.93); }
        .bm-line {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 1px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          transform-origin: center;
          pointer-events: none;
        }

        /* Overlay */
        .bm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 5, 0.97);
          z-index: 1000;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem 3rem;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: none;
          pointer-events: none;
        }
        .bm-overlay.bm-overlay--open {
          display: flex;
          pointer-events: auto;
        }

        /* Pill list */
        .bm-pill-list {
          list-style: none;
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .bm-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          border-radius: 9999px;
          text-decoration: none;
          padding: 1.1rem 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.1rem, 4.5vw, 1.6rem);
          font-weight: 600;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          will-change: transform;
          transition: background 0.25s ease, color 0.25s ease, transform 0.15s ease;
        }
        .bm-pill:active { transform: scale(0.96); }

        .bm-pill-label {
          display: inline-block;
          height: 1.2em;
          line-height: 1.2;
          will-change: transform, opacity;
        }

        /* Only show on mobile */
        .bm-mobile-only {
          display: flex;
        }
        @media (min-width: 769px) {
          .bm-mobile-only { display: none !important; }
          .bm-bar { display: none !important; }
          .bm-overlay { display: none !important; }
          .bm-overlay.bm-overlay--open { display: none !important; }
        }
      `}</style>

      {/* ── Top bar: logo + toggle ── */}
      <nav className="bm-bar bm-mobile-only" aria-label="Mobile navigation">
        <div className="bm-bubble bm-logo-bubble" style={{ background: menuBg }}>
          {logo}
        </div>

        <button
          className="bm-bubble bm-toggle-bubble"
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-expanded={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="bm-line" style={{
            background: menuContentColor,
            transform: isMenuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none',
          }} />
          <span className="bm-line" style={{
            background: menuContentColor,
            transform: isMenuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* ── Full-screen overlay — always in DOM, CSS class controls visibility ── */}
      <div
        ref={overlayRef}
        className={`bm-overlay${isMenuOpen ? ' bm-overlay--open' : ''}`}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
          <ul className="bm-pill-list" role="menu">
            {items.map((item, idx) => (
              <li key={idx} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  aria-label={item.ariaLabel || item.label}
                  className="bm-pill"
                  ref={el => { bubblesRef.current[idx] = el; }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick();
                    if (item.href.startsWith('#') && item.href.length > 1) {
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigateTo(item.href);
                    }
                  }}
                  style={{
                    background: menuBg,
                    color: menuContentColor,
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget;
                    t.style.background = item.hoverStyles?.bgColor ?? '#FFDD00';
                    t.style.color      = item.hoverStyles?.textColor ?? '#050505';
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget;
                    t.style.background = menuBg;
                    t.style.color      = menuContentColor;
                  }}
                >
                  <span
                    className="bm-pill-label"
                    ref={el => { labelRefs.current[idx] = el; }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
    </>
  );
}
