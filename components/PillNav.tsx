'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { usePageTransition } from './TransitionProvider';
import './PillNav.css';

interface NavItem {
  label: string | ReactNode;
  href: string;
  ariaLabel?: string;
}

interface PillNavProps {
  logo?: ReactNode | string;
  logoAlt?: string;
  logoHref?: string;
  items: NavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref,
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = 'rgba(10, 10, 10, 0.8)',
  pillColor = '#ccff00',
  hoveredPillTextColor = '#050505',
  pillTextColor = '#ffffff',
  onMobileMenuClick,
  initialLoadAnimation = true,
}: PillNavProps) => {
  const { navigateTo } = usePageTransition();
  // Mini Game unlock state
  const [miniGameUnlocked, setMiniGameUnlocked] = useState(false);

  useEffect(() => {
    const handleMiniGameUnlock = () => setMiniGameUnlocked(true);
    window.addEventListener('miniGameUnlocked', handleMiniGameUnlock);
    return () => window.removeEventListener('miniGameUnlocked', handleMiniGameUnlock);
  }, []);

  // Compute final items list
  const finalItems = miniGameUnlocked 
    ? [...items, { label: 'Mini Game', href: '#game-modal', ariaLabel: 'Play Mini Game' }]
    : items;

  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const prevNavLengthRef = useRef(finalItems.length);

  // Layout effect — re-runs whenever navItems changes (hover circles need re-init for new items)
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }

    return () => window.removeEventListener('resize', onResize);
  }, [finalItems, ease]);

  // Initial load animation — runs once on mount
  useEffect(() => {
    if (!initialLoadAnimation) return;
    const lg = logoRef.current;
    const navItemsEl = navItemsRef.current;
    if (lg) {
      gsap.set(lg, { scale: 0 });
      gsap.to(lg, { scale: 1, duration: 0.6, ease });
    }
    if (navItemsEl) {
      gsap.set(navItemsEl, { width: 0, overflow: 'hidden' });
      gsap.to(navItemsEl, { width: 'auto', duration: 0.6, ease });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bounce-expand animation when a new nav item is unlocked (e.g. Konami code)
  useEffect(() => {
    if (finalItems.length <= prevNavLengthRef.current) {
      prevNavLengthRef.current = finalItems.length;
      return;
    }
    prevNavLengthRef.current = finalItems.length;
    const newIndex = finalItems.length - 1;
    requestAnimationFrame(() => {
      // Bounce the new pill item in
      const newCircle = circleRefs.current[newIndex];
      const newPill = newCircle?.parentElement; // <a> or <Link>
      const newLi = newPill?.parentElement;     // <li>
      if (newLi) {
        gsap.from(newLi, { scaleX: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', transformOrigin: 'left center' });
      }
      // Also pulse the nav container to give the "expand" feel
      const navEl = navItemsRef.current?.closest('.pill-nav') as HTMLElement | null;
      if (navEl) {
        gsap.fromTo(navEl, { scale: 1 }, { scale: 1.04, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 });
      }
    });
  }, [finalItems.length]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: 'power2.inOut' });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: 'power2.inOut' });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base' as any]: baseColor,
    ['--pill-bg' as any]: pillColor,
    ['--hover-text' as any]: hoveredPillTextColor,
    ['--pill-text' as any]: resolvedPillTextColor
  };

  const renderLogo = () => {
    if (typeof logo === 'string') {
      return <img src={logo} alt={logoAlt} ref={logoImgRef} />;
    }
    return logo;
  };

  return (
    <div className={`pill-nav-container ${className}`}>
      <nav className="pill-nav" aria-label="Primary" style={cssVars}>
        {logoHref && isRouterLink(logoHref) ? (
          <Link
            className="pill-logo"
            href={logoHref}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={(el) => { logoRef.current = el as HTMLAnchorElement | null; }}
            onClick={(e) => { e.preventDefault(); navigateTo(logoHref); }}
          >
            {renderLogo()}
          </Link>
        ) : (
          <a
            className="pill-logo"
            href={logoHref ?? items?.[0]?.href ?? '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={(el) => { logoRef.current = el as HTMLAnchorElement | null; }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {renderLogo()}
          </a>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {finalItems.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                {isRouterLink(item.href) ? (
                  <Link
                    role="menuitem"
                    href={item.href}
                    className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || (typeof item.label === 'string' ? item.label : undefined)}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={(e) => {
                      if (typeof item.label === 'string' && item.label === 'Mini Game' && typeof window !== 'undefined' && (window as any).openGameModal) {
                        e.preventDefault();
                        (window as any).openGameModal();
                        return;
                      }
                      e.preventDefault();
                      navigateTo(item.href);
                    }}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <a
                    role="menuitem"
                    href={item.href}
                    className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || (typeof item.label === 'string' ? item.label : undefined)}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={(e) => {
                      if (typeof item.label === 'string' && item.label === 'Mini Game' && typeof window !== 'undefined' && (window as any).openGameModal) {
                        e.preventDefault();
                        (window as any).openGameModal();
                        return;
                      }
                      if (item.href.startsWith('#') && item.href.length > 1) {
                        e.preventDefault();
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {finalItems.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              {isRouterLink(item.href) ? (
                <Link
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || (typeof item.label === 'string' ? item.label : undefined)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigateTo(item.href);
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || (typeof item.label === 'string' ? item.label : undefined)}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (typeof item.label === 'string' && item.label === 'Mini Game' && typeof window !== 'undefined' && (window as any).openGameModal) {
                      e.preventDefault();
                      (window as any).openGameModal();
                      return;
                    }
                    if (item.href.startsWith('#') && item.href.length > 1) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
