// Animated SVG background for hero
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isMobile = isTouch || window.matchMedia('(max-width: 768px)').matches;
// Base lite heuristic
const baseLite = reduceMotion || isMobile || new URLSearchParams(location.search).has('lite') || document.documentElement.dataset.lite === '1';
// Derive effective mode from saved preference
const savedMode = localStorage.getItem('perfMode');
let isLite = baseLite;
if (savedMode === 'lite') isLite = true;
if (savedMode === 'full') isLite = false;
if (isLite) { document.body.classList.add('lite'); }
const svgNS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(svgNS, 'svg');
svg.classList.add('animated-svg');
svg.setAttribute('viewBox', '0 0 1440 320');
svg.innerHTML = `
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f59e42;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path id="wave" fill="url(#grad1)" fill-opacity="0.4" d="M0,160L60,170C120,180,240,200,360,197.3C480,195,600,149,720,133.3C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
</svg>`;
hero.appendChild(svg);

// Enhanced animated SVG wave with multiple frequencies
let wave = svg.querySelector('#wave');
let t = 0;
let lastWaveTs = 0;
function animateWave(ts = 0) {
  // throttle to ~30fps
  if (ts - lastWaveTs < 33) { requestAnimationFrame(animateWave); return; }
  lastWaveTs = ts;
  t += 0.010;
  const amplitude = 10; // even lower amplitude
  const freq1 = 0.009;
  const freq2 = 0.013;
  let d = 'M0,160';
  for (let x = 0; x <= 1440; x += 56) {
    let y = 160 + Math.sin((x * freq1) + t) * amplitude +
            Math.cos((x * freq2) + t * 1.2) * (amplitude * 0.25);
    d += `L${x},${y.toFixed(1)}`;
  }
  d += 'L1440,192L1440,320L0,320Z';
  wave.setAttribute('d', d);
  requestAnimationFrame(animateWave);
}
if (!isLite) { requestAnimationFrame(animateWave); }

// Enhanced parallax effect for hero content with smooth easing (desktop/full only)
const heroContent = document.querySelector('.hero-content');
const enableParallax = !isLite && !isMobile;
let ticking = false; let lastParTs = 0;

function updateParallax(ts = 0) {
  if (!enableParallax) return; // disabled on Lite/mobile
  // throttle to ~30fps
  if (ts - lastParTs < 33) { ticking = false; return; }
  lastParTs = ts;
  const scrollY = window.scrollY;
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;
  const heroHeight = heroEl.offsetHeight;
  const opacity = Math.max(0, 1 - scrollY / heroHeight);
  if (scrollY < heroHeight) {
    heroContent.style.transform = `translateY(${(scrollY * 0.22).toFixed(2)}px)`;
    heroContent.style.opacity = opacity;
  }
  ticking = false;
}

if (enableParallax) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// Scroll-triggered reveal for cards with light stagger
const cards = document.querySelectorAll('.card, .fancy-about, .fancy-timeline, .fancy-volunteering');
const observer = new window.IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const delay = Math.min(index * 40, 160); // shorter stagger
      setTimeout(() => { entry.target.classList.add('visible'); }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
cards.forEach(card => observer.observe(card));

// Performance toggle button
const perfBtn = document.getElementById('perf-toggle');
if (perfBtn) {
  const applyLabel = () => {
    const lite = document.body.classList.contains('lite');
    perfBtn.textContent = lite ? 'Lite' : 'Full';
    perfBtn.setAttribute('aria-pressed', lite ? 'true' : 'false');
  };
  applyLabel();
  perfBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nextLite = !document.body.classList.contains('lite');
    document.body.classList.toggle('lite', nextLite);
    localStorage.setItem('perfMode', nextLite ? 'lite' : 'full');
    applyLabel();
    // Force a tiny URL param change so GitHub Pages/cache applies the new mode reliably
    const url = new URL(location.href);
    url.searchParams.set('mode', nextLite ? 'lite' : 'full');
    location.href = url.toString();
  }, { passive: false });
}


// Enhanced smooth scroll for nav links with offset
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    
    // Only handle hash links
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
    if (target) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
      window.scrollTo({
          top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
        
        // Add active state to nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update URL without triggering scroll
        history.pushState(null, null, href);
      }
    }
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
let scrollTimeout;

function updateActiveNav() {
  const scrollY = window.pageYOffset;
  const navHeight = document.querySelector('nav').offsetHeight;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateActiveNav, 10);
}, { passive: true });
updateActiveNav(); // Initial call

// Enhanced custom animated cursor with smooth following
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
if (!isLite) { animateCursor(); } else { cursor.style.display = 'none'; }

document.querySelectorAll('a, button, .cta-btn, .exp-item, .vol-item, .proj-item, .timeline-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// Enhanced 3D tilt effect on cards with perspective
const tiltCards = document.querySelectorAll('.card, .exp-item, .vol-item, .proj-item');
if (!isLite) {
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const intensity = card.classList.contains('proj-item') ? 2 : 5; // even gentler tilt for projects
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;
      
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
} else {
  tiltCards.forEach(card => { card.style.transform = 'none'; });
}

// Particle background for hero
const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');
let particles = [];
let isScrolling = false; let scrollTimer = null;
window.addEventListener('scroll', () => {
  isScrolling = true;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { isScrolling = false; }, 120);
}, { passive: true });
const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
function resizeCanvas() {
  canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor(window.innerHeight * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

function createParticles() {
  particles = [];
  const density = 18;
  const count = Math.max(40, Math.floor((window.innerWidth / density) / DPR));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.6,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      alpha: Math.random() * 0.6 + 0.4,
      baseX: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height * 0.6,
      oscillation: Math.random() * Math.PI * 2
    });
  }
}
if (!isLite) {
  createParticles();
  window.addEventListener('resize', createParticles, { passive: true });
}

let particleFrame = 0;
function drawParticles() {
  if (isScrolling) { if (!document.hidden) requestAnimationFrame(drawParticles); return; }
  // skip every other frame for smoother perceived motion with less work
  if ((particleFrame++ & 1) === 1) { if (!document.hidden) requestAnimationFrame(drawParticles); return; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Connections disabled for performance
  // (kept simple particles only to eliminate jitter)

  
  // Draw particles
  for (let p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    
    // Glow effect
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
    gradient.addColorStop(0, 'rgba(245, 158, 66, 0.8)');
    gradient.addColorStop(1, 'rgba(245, 158, 66, 0)');
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Particle core
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#f59e42';
    ctx.shadowColor = '#f59e42';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height * 0.7) p.dy *= -1;
  }
  if (!document.hidden) { requestAnimationFrame(drawParticles); }
}
if (!isLite) { drawParticles(); }

// Animate skill bars when About section is in view
const skillBars = document.querySelectorAll('.skill-bar');
const animateSkills = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.classList.add('animated');
        bar.style.setProperty('--bar-width', width + '%');
        bar.style.setProperty('width', width + '%');
        bar.querySelector && bar.querySelector('::after');
        bar.style.setProperty('transition', 'width 1.2s cubic-bezier(.77,0,.18,1)');
        bar.style.width = width + '%';
        bar.style.background = 'linear-gradient(90deg, #f59e42, #1e3a8a)';
      });
      observer.disconnect();
    }
  });
};
const aboutSection = document.querySelector('.fancy-about');
if (aboutSection) {
  const skillsObserver = new IntersectionObserver(animateSkills, { threshold: 0.3 });
  skillsObserver.observe(aboutSection);
}

// Enhanced typewriter effect with cursor blink
const typewriterPhrases = [
  'Electronics & Communication Engineer',
  'Builder. Tinkerer. Leader.',
  'IEEE Volunteer & Tinkerhub Ambassador',
  'Creating with Curiosity & Impact.'
];
let twIndex = 0, twChar = 0, twDeleting = false;
const typewriter = document.getElementById('typewriter');

function typeWriterLoop() {
  if (!typewriter) return;
  const phrase = typewriterPhrases[twIndex];
  if (!twDeleting) {
    typewriter.textContent = phrase.substring(0, twChar + 1) + '|';
    twChar++;
    if (twChar === phrase.length) {
      twDeleting = true;
      setTimeout(() => {
        typewriter.textContent = phrase + '|';
        setTimeout(typeWriterLoop, 1500);
      }, 500);
      return;
    }
  } else {
    typewriter.textContent = phrase.substring(0, twChar - 1) + '|';
    twChar--;
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % typewriterPhrases.length;
      setTimeout(typeWriterLoop, 300);
      return;
    }
  }
  setTimeout(typeWriterLoop, twDeleting ? 30 : 60);
}

// Start typewriter after a short delay
setTimeout(typeWriterLoop, 800);

// Enhanced animated counters for hero stats with easing
function animateCounter(id, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  
  let start = 0;
  const startTime = Date.now();
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(start + (end - start) * eased);
    
    el.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = end;
    }
  }
  
  // Start animation when element is visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
  update();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  
  statsObserver.observe(el.closest('.hero-stats') || document.body);
}

// Initialize counters
setTimeout(() => {
  animateCounter('exp-count', 3, 1500);
  animateCounter('proj-count', 12, 1500);
  animateCounter('lead-count', 5, 1500);
}, 500);

// ============================================
// 🎮 EASTER EGGS & INTERACTIVE FEATURES 🎮
// ============================================

// Click explosion effect
let clickParticles = [];
let clickCanvas, clickCtx;
if (!isLite) {
  clickCanvas = document.createElement('canvas');
  clickCanvas.id = 'click-canvas';
  clickCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(clickCanvas);
  clickCtx = clickCanvas.getContext('2d');
  clickCanvas.width = window.innerWidth;
  clickCanvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    clickCanvas.width = window.innerWidth;
    clickCanvas.height = window.innerHeight;
  }, { passive: true });
}

function createClickExplosion(x, y, color = '#f59e42') {
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = Math.random() * 8 + 2;
    clickParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.02 + 0.02,
      size: Math.random() * 6 + 3,
      color: color
    });
  }
}

function animateClickParticles() {
  clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
  
  for (let i = clickParticles.length - 1; i >= 0; i--) {
    const p = clickParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= p.decay;
    p.size *= 0.98;
    
    if (p.life > 0) {
      clickCtx.save();
      clickCtx.globalAlpha = p.life;
      clickCtx.fillStyle = p.color;
      clickCtx.shadowBlur = 10;
      clickCtx.shadowColor = p.color;
      clickCtx.beginPath();
      clickCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      clickCtx.fill();
      clickCtx.restore();
    } else {
      clickParticles.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animateClickParticles);
}
if (!reduceMotion && !isMobile) { animateClickParticles(); }

// Click anywhere to create explosion
let clickCount = 0;
let lastClickTime = 0;

document.addEventListener('click', (e) => {
  if (isLite) return; // disable explosions in lite mode
  const currentTime = Date.now();
  const timeSinceLastClick = currentTime - lastClickTime;
  
  // Check for double click
  if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
    // Double click detected!
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        createClickExplosion(
          e.clientX + (Math.random() - 0.5) * 200,
          e.clientY + (Math.random() - 0.5) * 200,
          `hsl(${Math.random() * 360}, 70%, 60%)`
        );
      }, i * 10);
    }
    showEasterEgg('💥 MEGA EXPLOSION! 💥', 2000);
    lastClickTime = 0; // Reset to prevent triple clicks
    return;
  }
  
  lastClickTime = currentTime;
  
  const colors = ['#f59e42', '#1e3a8a', '#fb923c', '#3b5bdb', '#fff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  createClickExplosion(e.clientX, e.clientY, color);
  clickCount++;
  
  // Special effect every 10 clicks
  if (clickCount % 10 === 0) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createClickExplosion(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }, i * 100);
    }
  }
  
  // Special effect every 50 clicks
  if (clickCount === 50) {
    showEasterEgg('🎉 50 Clicks! You\'re persistent! 🎉');
  }
  
  // Special effect every 100 clicks
  if (clickCount === 100) {
    showEasterEgg('🔥 100 Clicks! You\'re on fire! 🔥');
    createConfetti();
  }
});

// Mouse trail effect
let trail = [];
const trailCanvas = document.createElement('canvas');
trailCanvas.id = 'trail-canvas';
trailCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
if (!reduceMotion && !isMobile) { document.body.appendChild(trailCanvas); }
const trailCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}, { passive: true });

let lastMouseX = 0, lastMouseY = 0;
document.addEventListener('mousemove', (e) => {
  if (isMobile) return;
  if (reduceMotion) return;
  trail.push({
    x: e.clientX,
    y: e.clientY,
    life: 1,
    size: Math.random() * 4 + 2
  });
  if (trail.length > 20) trail.shift();
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}, { passive: true });

function animateTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    t.life -= 0.05;
    
    if (t.life > 0) {
      trailCtx.save();
      trailCtx.globalAlpha = t.life * 0.5;
      const gradient = trailCtx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size);
      gradient.addColorStop(0, 'rgba(245, 158, 66, 0.8)');
      gradient.addColorStop(1, 'rgba(245, 158, 66, 0)');
      trailCtx.fillStyle = gradient;
      trailCtx.beginPath();
      trailCtx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      trailCtx.fill();
      trailCtx.restore();
    }
  }
  
  trail = trail.filter(t => t.life > 0);
  requestAnimationFrame(animateTrail);
}
if (!reduceMotion && !isMobile) { animateTrail(); }

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;
let konamiActivated = false;

document.addEventListener('keydown', (e) => {
  if (konamiActivated) return;
  
  if (e.code === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateKonamiCode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateKonamiCode() {
  konamiActivated = true;
  showEasterEgg('🎮 KONAMI CODE ACTIVATED! 🎮', 5000);
  
  // Rainbow mode!
  document.body.classList.add('rainbow-mode');
  
  // Create massive particle explosion
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createClickExplosion(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        `hsl(${Math.random() * 360}, 70%, 60%)`
      );
    }, i * 20);
  }
  
  // Make particles rainbow
  setInterval(() => {
    particles.forEach(p => {
      p.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    });
  }, 100);
  
  // Add confetti effect
  createConfetti();
}

// Confetti effect
function createConfetti() {
  const confettiCount = 150;
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        left: ${Math.random() * 100}%;
        top: -10px;
        z-index: 10000;
        pointer-events: none;
        border-radius: 2px;
        box-shadow: 0 0 10px currentColor;
      `;
      document.body.appendChild(confetti);
      
      const duration = Math.random() * 3000 + 2000;
      const x = (Math.random() - 0.5) * 200;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${x}px, ${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
      }).onfinish = () => confetti.remove();
    }, i * 20);
  }
}

// Easter egg notification system
function showEasterEgg(message, duration = 3000) {
  const notification = document.createElement('div');
  notification.className = 'easter-egg-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: linear-gradient(135deg, #f59e42, #fb923c);
    color: white;
    padding: 2rem 3rem;
    border-radius: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 10001;
    box-shadow: 0 10px 40px rgba(245, 158, 66, 0.5);
    text-align: center;
    pointer-events: none;
    font-family: 'Clash Display', sans-serif;
  `;
  document.body.appendChild(notification);
  
  notification.animate([
    { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.1) rotate(5deg)', opacity: 1, offset: 0.3 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1, offset: 0.7 },
    { transform: 'translate(-50%, -50%) scale(0.8) rotate(-5deg)', opacity: 0 }
  ], {
    duration: duration,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }).onfinish = () => notification.remove();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Press 'D' for disco mode
  if (e.key.toLowerCase() === 'd' && e.ctrlKey) {
    e.preventDefault();
    document.body.classList.toggle('disco-mode');
    showEasterEgg(document.body.classList.contains('disco-mode') ? '🕺 DISCO MODE ON! 🕺' : 'Disco mode off', 2000);
  }
  
  // Press 'P' to pause/resume particles
  if (e.key.toLowerCase() === 'p' && e.ctrlKey) {
    e.preventDefault();
    const paused = canvas.style.animationPlayState === 'paused';
    canvas.style.animationPlayState = paused ? 'running' : 'paused';
    showEasterEgg(paused ? 'Particles resumed!' : 'Particles paused!', 2000);
  }
  
  // Press 'R' for rainbow text
  if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
    e.preventDefault();
    document.body.classList.toggle('rainbow-text');
    showEasterEgg(document.body.classList.contains('rainbow-text') ? '🌈 Rainbow text ON! 🌈' : 'Rainbow text off', 2000);
  }
  
  // Press 'Space' to create explosion at center
  if (e.key === ' ' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    createClickExplosion(window.innerWidth / 2, window.innerHeight / 2, '#f59e42');
  }
  
  // Press '?' for help
  if (e.key === '?' && e.shiftKey) {
    showHelp();
  }
});

// Help modal - prevent multiple modals
let helpModalOpen = false;
let closeOnEscapeHandler = null;

function showHelp() {
  // Prevent multiple modals
  if (helpModalOpen) return;
  
  helpModalOpen = true;
  const help = document.createElement('div');
  help.className = 'help-modal';
  
  const closeModal = () => {
    help.remove();
    helpModalOpen = false;
    if (closeOnEscapeHandler) {
      document.removeEventListener('keydown', closeOnEscapeHandler);
      closeOnEscapeHandler = null;
    }
  };
  
  help.innerHTML = `
    <div style="background: rgba(10, 14, 39, 0.95); backdrop-filter: blur(20px); padding: 2rem; border-radius: 20px; max-width: 500px; border: 2px solid #f59e42;">
      <h2 style="color: #f59e42; margin-bottom: 1rem;">🎮 Keyboard Shortcuts</h2>
      <ul style="color: #e2e8f0; line-height: 2; list-style: none; padding: 0;">
        <li>🎯 <strong>Click anywhere</strong> - Create particle explosion</li>
        <li>⌨️ <strong>Ctrl + D</strong> - Toggle disco mode</li>
        <li>⌨️ <strong>Ctrl + P</strong> - Pause/resume particles</li>
        <li>⌨️ <strong>Ctrl + R</strong> - Toggle rainbow text</li>
        <li>⌨️ <strong>Space</strong> - Center explosion</li>
        <li>⌨️ <strong>↑↑↓↓←→←→BA</strong> - Konami code!</li>
        <li>⌨️ <strong>Shift + ?</strong> - Show this help</li>
      </ul>
      <button id="help-close-btn" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #f59e42; border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">Close</button>
    </div>
  `;
  help.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  `;
  document.body.appendChild(help);
  
  // Close button
  const closeBtn = help.querySelector('#help-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close on background click
  help.addEventListener('click', (e) => {
    if (e.target === help) {
      closeModal();
    }
  });
  
  // Close on Escape key
  closeOnEscapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', closeOnEscapeHandler);
}

// Interactive particle attraction on mouse
let mouseAttraction = false;
document.addEventListener('mousedown', () => mouseAttraction = true);
document.addEventListener('mouseup', () => mouseAttraction = false);

// Make particles react to mouse
function updateParticleAttraction() {
  if (mouseAttraction && particles.length > 0) {
    particles.forEach(p => {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150 && distance > 0) {
        const force = (150 - distance) / 150;
        p.dx += (dx / distance) * force * 0.5;
        p.dy += (dy / distance) * force * 0.5;
      }
    });
  }
  requestAnimationFrame(updateParticleAttraction);
}
updateParticleAttraction();

// Add more interactive features - shake on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const scrollDelta = Math.abs(window.scrollY - lastScrollY);
  if (scrollDelta > 50) {
    document.body.style.animation = 'none';
    setTimeout(() => {
      document.body.style.animation = 'shake 0.3s ease-in-out';
    }, 10);
  }
  lastScrollY = window.scrollY;
});

// Secret word easter eggs
let typedWord = '';
document.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    typedWord += e.key.toLowerCase();
    if (typedWord.length > 20) typedWord = typedWord.slice(-20);
    
    // Check for secret words
    if (typedWord.includes('hello')) {
      showEasterEgg('👋 Hello there! 👋', 2000);
      typedWord = '';
    }
    if (typedWord.includes('awesome')) {
      showEasterEgg('😎 You\'re awesome too! 😎', 2000);
      typedWord = '';
    }
    if (typedWord.includes('secret')) {
      showEasterEgg('🔐 Secret unlocked! 🔐', 2000);
      createConfetti();
      typedWord = '';
    }
    if (typedWord.includes('matrix')) {
      showEasterEgg('🟢 Welcome to the Matrix 🟢', 3000);
      document.body.classList.add('matrix-mode');
      typedWord = '';
    }
  }
});

// Add interactive hover effects to name
const bigTitle = document.querySelector('.big-title');
if (bigTitle) {
  bigTitle.addEventListener('mouseenter', () => {
    bigTitle.style.animation = 'none';
    setTimeout(() => {
      bigTitle.style.animation = 'pulse 0.5s ease-in-out';
    }, 10);
  });
  
  bigTitle.addEventListener('click', () => {
    createClickExplosion(
      bigTitle.getBoundingClientRect().left + bigTitle.offsetWidth / 2,
      bigTitle.getBoundingClientRect().top + bigTitle.offsetHeight / 2,
      '#f59e42'
    );
    showEasterEgg('👋 Hi! Thanks for clicking! 👋', 2000);
  });
}

// Add shake animation on title hover
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .rainbow-mode {
    animation: rainbow 3s linear infinite;
  }
  
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  .disco-mode {
    animation: disco 0.3s linear infinite !important;
  }
  
  .disco-mode * {
    animation: disco-colors 0.3s linear infinite !important;
  }
  
  @keyframes disco {
    0% { filter: hue-rotate(0deg) brightness(1.3) saturate(1.5); }
    25% { filter: hue-rotate(90deg) brightness(1.4) saturate(1.6); }
    50% { filter: hue-rotate(180deg) brightness(1.3) saturate(1.5); }
    75% { filter: hue-rotate(270deg) brightness(1.4) saturate(1.6); }
    100% { filter: hue-rotate(360deg) brightness(1.3) saturate(1.5); }
  }
  
  @keyframes disco-colors {
    0% { 
      filter: hue-rotate(0deg);
      transform: scale(1);
    }
    25% { 
      filter: hue-rotate(90deg);
      transform: scale(1.01);
    }
    50% { 
      filter: hue-rotate(180deg);
      transform: scale(1);
    }
    75% { 
      filter: hue-rotate(270deg);
      transform: scale(1.01);
    }
    100% { 
      filter: hue-rotate(360deg);
      transform: scale(1);
    }
  }
  
  .rainbow-text h1, .rainbow-text h2, .rainbow-text h3 {
    background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: rainbow-text 3s linear infinite;
    background-size: 200% 100%;
  }
  
  @keyframes rainbow-text {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  
  .matrix-mode {
    filter: hue-rotate(120deg) contrast(1.5);
  }
  
  .matrix-mode::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.03) 0px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
    z-index: 9999;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .big-title:hover {
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .big-title:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// ==========================
// Mobile-only easter eggs
// ==========================
if (isMobile) {
  // Triple-tap on hero to show a quick toast
  let tapTimes = [];
  const showToast = (msg) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => { t.classList.remove('visible'); t.addEventListener('transitionend', ()=> t.remove(), { once: true }); }, 1500);
  };
  const heroArea = document.querySelector('.hero-content') || document.body;
  heroArea.addEventListener('touchstart', () => {
    const now = Date.now();
    tapTimes.push(now);
    tapTimes = tapTimes.filter(t => now - t < 600);
    if (tapTimes.length >= 3) {
      showToast('🎉 Hello from mobile!');
      tapTimes = [];
    }
  }, { passive: true });

  // Long-press anywhere to show help hint
  let lpTimer = null;
  document.addEventListener('touchstart', () => {
    if (lpTimer) clearTimeout(lpTimer);
    lpTimer = setTimeout(() => showToast('Tip: Use the nav to jump sections'), 700);
  }, { passive: true });
  document.addEventListener('touchend', () => { if (lpTimer) clearTimeout(lpTimer); }, { passive: true });
  document.addEventListener('touchmove', () => { if (lpTimer) clearTimeout(lpTimer); }, { passive: true });
}

// Add floating emoji easter egg - click tech icons 5 times
let techIconClicks = {};
document.querySelectorAll('.tech-icons img').forEach((icon, index) => {
  if (isMobile) return; // skip heavy icon click effects on mobile
  techIconClicks[index] = 0;
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    techIconClicks[index]++;
    
    // Create explosion at icon
    const rect = icon.getBoundingClientRect();
    createClickExplosion(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      '#f59e42'
    );
    
    // After 5 clicks on same icon
    if (techIconClicks[index] === 5) {
      showEasterEgg(`🎯 You really like ${icon.alt}! 🎯`, 2000);
      techIconClicks[index] = 0;
      
      // Make icon spin
      icon.style.animation = 'spin 1s ease-in-out';
      setTimeout(() => {
        icon.style.animation = '';
      }, 1000);
    }
  });
});

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.3); }
    to { transform: rotate(360deg) scale(1); }
  }
  
  .tech-icons img {
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .tech-icons img:active {
    transform: scale(0.9);
  }
`;
document.head.appendChild(spinStyle);

// Add secret click pattern easter egg (click corners)
let cornerClicks = [];
function getCorners() {
  return [
    { x: 0, y: 0, name: 'top-left' },
    { x: window.innerWidth, y: 0, name: 'top-right' },
    { x: 0, y: window.innerHeight, name: 'bottom-left' },
    { x: window.innerWidth, y: window.innerHeight, name: 'bottom-right' }
  ];
}

document.addEventListener('click', (e) => {
  const clickX = e.clientX;
  const clickY = e.clientY;
  const corners = getCorners();
  
  corners.forEach((corner, index) => {
    const distance = Math.sqrt(
      Math.pow(clickX - corner.x, 2) + Math.pow(clickY - corner.y, 2)
    );
    
    if (distance < 50) {
      if (!cornerClicks.includes(index)) {
        cornerClicks.push(index);
        createClickExplosion(corner.x, corner.y, '#fff');
      }
      
      if (cornerClicks.length === 4) {
        showEasterEgg('🎊 All corners clicked! Secret unlocked! 🎊', 3000);
        createConfetti();
        cornerClicks = [];
      }
    }
  });
  
  // Reset if clicking elsewhere
  if (cornerClicks.length > 0) {
    let nearCorner = false;
    corners.forEach(corner => {
      const distance = Math.sqrt(
        Math.pow(clickX - corner.x, 2) + Math.pow(clickY - corner.y, 2)
      );
      if (distance < 50) nearCorner = true;
    });
    if (!nearCorner) {
      setTimeout(() => {
        if (cornerClicks.length < 4) cornerClicks = [];
      }, 2000);
    }
  }
});

window.addEventListener('resize', () => {
  cornerClicks = []; // Reset on resize
});

// Add scroll speed easter egg (separate from shake effect)
let scrollSpeedLastY = window.scrollY;
let scrollSpeedLastTime = Date.now();
window.addEventListener('scroll', () => {
  const now = Date.now();
  const timeDelta = now - scrollSpeedLastTime;
  if (timeDelta > 0) {
    const scrollSpeed = Math.abs(window.scrollY - scrollSpeedLastY) / timeDelta * 100;
    scrollSpeedLastTime = now;
    scrollSpeedLastY = window.scrollY;
    
    if (scrollSpeed > 5) {
      document.body.classList.add('fast-scroll');
      setTimeout(() => {
        document.body.classList.remove('fast-scroll');
      }, 500);
    }
  }
});

const fastScrollStyle = document.createElement('style');
fastScrollStyle.textContent = `
  .fast-scroll {
    filter: blur(1px) brightness(1.1);
  }
`;
document.head.appendChild(fastScrollStyle);

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create mailto link (since we don't have a backend)
    const subject = encodeURIComponent(`Portfolio Contact: Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:safarryyan@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showEasterEgg('📧 Opening your email client...', 2000);
    
    // Reset form
    contactForm.reset();
  });
}

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Create explosion at button
    const rect = scrollToTopBtn.getBoundingClientRect();
    createClickExplosion(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      '#f59e42'
    );
  });
}

// Ensure all external links open in new tab
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.hasAttribute('target')) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
}); 