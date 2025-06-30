// Animated SVG background for hero
const hero = document.querySelector('.hero');
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

// Animate SVG wave
let wave = svg.querySelector('#wave');
let t = 0;
function animateWave() {
  t += 0.02;
  const amplitude = 20;
  const freq = 0.015;
  let d = 'M0,160';
  for (let x = 0; x <= 1440; x += 60) {
    let y = 160 + Math.sin((x * freq) + t) * amplitude;
    d += `L${x},${y.toFixed(1)}`;
  }
  d += 'L1440,192L1440,320L0,320Z';
  wave.setAttribute('d', d);
  requestAnimationFrame(animateWave);
}
animateWave();

// Parallax effect for hero content
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
});

// Scroll-triggered reveal for cards
const cards = document.querySelectorAll('.card');
const observer = new window.IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
cards.forEach(card => observer.observe(card));

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: 'smooth'
      });
    }
  });
});

// Custom animated cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .cta-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// 3D tilt effect on cards
const tiltCards = document.querySelectorAll('.card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * 2; // -1 to 1
    const ry = ((x / rect.width) - 0.5) * 2; // -1 to 1
    card.style.setProperty('--rx', rx.toFixed(2));
    card.style.setProperty('--ry', ry.toFixed(2));
    card.classList.add('tilt');
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('tilt');
    card.style.setProperty('--rx', 0);
    card.style.setProperty('--ry', 0);
  });
});

// Particle background for hero
const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = [];
  const count = Math.floor(window.innerWidth / 12);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.6,
      r: Math.random() * 2.5 + 1.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.3
    });
  }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#f59e42';
    ctx.shadowColor = '#1e3a8a';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height * 0.7) p.dy *= -1;
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

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

// Typewriter effect for hero tagline
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
    typewriter.textContent = phrase.substring(0, twChar + 1);
    twChar++;
    if (twChar === phrase.length) {
      twDeleting = true;
      setTimeout(typeWriterLoop, 1200);
      return;
    }
  } else {
    typewriter.textContent = phrase.substring(0, twChar - 1);
    twChar--;
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % typewriterPhrases.length;
    }
  }
  setTimeout(typeWriterLoop, twDeleting ? 40 : 80);
}
typeWriterLoop();

// Animated counters for hero stats
function animateCounter(id, end, duration) {
  const el = document.getElementById(id);
  let start = 0;
  const step = Math.ceil(end / (duration / 20));
  function update() {
    start += step;
    if (start > end) start = end;
    el.textContent = start;
    if (start < end) setTimeout(update, 20);
  }
  update();
}
animateCounter('exp-count', 3, 1200);
animateCounter('proj-count', 12, 1200);
animateCounter('lead-count', 5, 1200); 