// --- Core State ---
const config = {
  liteMode: localStorage.getItem('perfMode') === 'lite',
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.matchMedia('(max-width: 768px)').matches,
  isTouch: window.matchMedia('(pointer: coarse)').matches
};

if (config.liteMode) document.body.classList.add('lite-mode');

// --- Email Copy ---
const emailBtn = document.getElementById('email-copy-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const email = 'safarryyan@gmail.com';

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(showCopyFeedback).catch(() => fallbackCopy(email));
    } else {
      fallbackCopy(email);
    }
  });

  function showCopyFeedback() {
    emailBtn.classList.add('copied');
    setTimeout(() => emailBtn.classList.remove('copied'), 2000);
  }

  function fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      if (document.execCommand('copy')) showCopyFeedback();
    } catch (_) {}
    document.body.removeChild(el);
  }
}

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    }
  });
});

// --- Custom Cursor (spring physics + macOS arrow) ---
(function() {
  // Create on <body> directly — never inside React's DOM tree so it survives reconciliation
  let el = document.getElementById('custom-cursor');
  if (!el) {
    el = document.createElement('div');
    el.id = 'custom-cursor';
    document.body.appendChild(el);
  }
  el.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:10001;will-change:transform;transform-origin:0 0;display:none;';

  // White arrow — overflow="visible" prevents shadow clipping outside SVG bounds
  el.innerHTML = `<svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
    <defs>
      <filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%" color-interpolation-filters="sRGB">
        <feGaussianBlur id="cur-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cur-mb)">
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/>
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="white" stroke="black" stroke-width="1.2" stroke-linejoin="round"/>
    </g>
  </svg>`;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let x = mx, y = my, vx = 0, vy = 0;
  let scaleCur = 1, scaleTarget = 1, scaleVel = 0;
  // Hover blur spring — springs up when over interactibles, back to 0 otherwise
  let hbc = 0, hbt = 0, hbv = 0;
  const HB_MAX = 1.2, HB_STIFF = 180, HB_DAMP = 22;
  let lastTime = performance.now();
  let raf;

  const POS_STIFF = 240, POS_DAMP = 27;
  const SCL_STIFF = 330, SCL_DAMP = 30;

  const onMove = (e) => {
    if (el.style.display === 'none') el.style.display = 'block';
    mx = e.clientX; my = e.clientY;
  };
  const onTouch = () => { el.style.display = 'none'; };

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) { scaleTarget = 1.3; hbt = HB_MAX; }
  });
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget?.closest('a, button')) { scaleTarget = 1; hbt = 0; }
  });

  document.addEventListener('mousedown', () => { scaleTarget = 0.65; });
  document.addEventListener('mouseup',   () => { scaleTarget = 1; });

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchstart', onTouch, { passive: true });

  // Click ripple
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top  = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  });

  const tick = () => {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;

    const ax = (mx - x) * POS_STIFF - vx * POS_DAMP;
    const ay = (my - y) * POS_STIFF - vy * POS_DAMP;
    vx += ax * dt; vy += ay * dt;
    x  += vx * dt; y  += vy * dt;

    const sa = (scaleTarget - scaleCur) * SCL_STIFF - scaleVel * SCL_DAMP;
    scaleVel += sa * dt;
    scaleCur += scaleVel * dt;

    // Hover blur spring
    hbv += ((hbt - hbc) * HB_STIFF - hbv * HB_DAMP) * dt;
    hbc += hbv * dt;
    if (hbc < 0) hbc = 0;

    el.style.transform = `translate(${x}px,${y}px) scale(${scaleCur})`;

    // Motion blur (velocity-based, directional) + hover blur (uniform) combined
    const speed = Math.sqrt(vx * vx + vy * vy);
    const blurEl = el.querySelector('#cur-blur');
    if (blurEl) {
      const motionAmt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
      const angle = motionAmt > 0 ? Math.atan2(vy, vx) : 0;
      const bx = Math.abs(Math.cos(angle)) * motionAmt + hbc;
      const by = Math.abs(Math.sin(angle)) * motionAmt + hbc;
      if (bx > 0.05 || by > 0.05) {
        blurEl.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`);
      } else {
        blurEl.setAttribute('stdDeviation', '0 0');
      }
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
})();

// --- Card Tilt ---
if (!config.isTouch && !config.liteMode && !config.reduceMotion) {
  document.querySelectorAll('.project-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// --- Konami Code → Mini Game ---
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
let lastKeyTime = 0;

document.addEventListener('keydown', (e) => {
  const now = Date.now();
  if (now - lastKeyTime > 2000) konamiIndex = 0;
  lastKeyTime = now;

  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateMiniGame();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateMiniGame() {
  createExplosion(window.innerWidth / 2, window.innerHeight / 2);
  window.dispatchEvent(new CustomEvent('miniGameUnlocked'));
  window.openGameModal = openGameModal;
}

// --- Snake Game ---
const gameModal = document.getElementById('game-modal');
const canvas = document.getElementById('game-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scoreElement = document.getElementById('game-score');
const startBtn = document.getElementById('start-game-btn');
const closeGameBtn = gameModal ? gameModal.querySelector('.close-modal') : null;

let gameInterval;
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
const gridSize = 20;
const tileCount = 20;

function openGameModal() {
  if (!gameModal) return;
  gameModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  resetGame();
}

function closeGame() {
  if (!gameModal) return;
  gameModal.classList.remove('active');
  document.body.style.overflow = '';
  clearInterval(gameInterval);
}

if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);
if (startBtn) startBtn.addEventListener('click', startGame);

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  direction = 'right';
  score = 0;
  if (scoreElement) scoreElement.innerText = score;
  if (ctx) {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
  }
}

function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  resetGame();
  gameInterval = setInterval(gameLoop, 100);
  window.addEventListener('keydown', changeDirection);
  startBtn.style.display = 'none';
}

function changeDirection(e) {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  switch (e.key) {
    case 'ArrowUp':    if (direction !== 'down')  direction = 'up';    break;
    case 'ArrowDown':  if (direction !== 'up')    direction = 'down';  break;
    case 'ArrowLeft':  if (direction !== 'right') direction = 'left';  break;
    case 'ArrowRight': if (direction !== 'left')  direction = 'right'; break;
  }
}

function gameLoop() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':    head.y--; break;
    case 'down':  head.y++; break;
    case 'left':  head.x--; break;
    case 'right': head.x++; break;
  }

  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  if (snake.some(s => s.x === head.x && s.y === head.y)) { gameOver(); return; }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    if (scoreElement) scoreElement.innerText = score;
    placeFood();
    createExplosion(
      head.x * gridSize + canvas.getBoundingClientRect().left,
      head.y * gridSize + canvas.getBoundingClientRect().top
    );
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const ratio = i / snake.length;
    ctx.fillStyle = i === 0 ? '#fff' : `hsl(72, 100%, ${50 - ratio * 30}%)`;
    ctx.shadowBlur = i === 0 ? 30 : 12;
    ctx.shadowColor = i === 0 ? '#fff' : '#ccff00';
    const x = seg.x * gridSize + 1, y = seg.y * gridSize + 1, sz = gridSize - 2;
    ctx.beginPath();
    ctx.roundRect(x, y, sz, sz, 3);
    ctx.fill();
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.arc(x + sz / 2, y + sz / 2, sz / 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  });
}

function drawFood() {
  const pulse = Math.sin(Date.now() * 0.005) * 5;
  ctx.fillStyle = '#00f0ff';
  ctx.shadowBlur = 20 + pulse;
  ctx.shadowColor = '#00f0ff';
  const x = food.x * gridSize + 4, y = food.y * gridSize + 4, sz = gridSize - 8;
  ctx.fillRect(x, y, sz, sz);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2 - pulse / 4, y - 2 - pulse / 4, sz + 4 + pulse / 2, sz + 4 + pulse / 2);
  ctx.shadowBlur = 0;
}

function placeFood() {
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  if (snake.some(s => s.x === food.x && s.y === food.y)) placeFood();
}

function gameOver() {
  clearInterval(gameInterval);
  if (ctx) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (startBtn) {
    startBtn.style.display = 'block';
    startBtn.innerText = `REBOOT_SEQUENCE / SCORE: ${score}`;
  }
}

// --- Particle Explosion ---
function createExplosion(x, y) {
  const colors = ['#ff0055', '#00eaff', '#ffffff'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('explosion-particle');
    const size = Math.random() * 5 + 2;
    const dx = (Math.random() - 0.5) * 200;
    const dy = (Math.random() - 0.5) * 200;
    const delay = Math.random() * 200;
    Object.assign(p.style, {
      width: `${size}px`, height: `${size}px`,
      background: colors[Math.floor(Math.random() * 3)],
      position: 'fixed', left: `${x}px`, top: `${y}px`,
      borderRadius: '50%', pointerEvents: 'none', zIndex: '9999'
    });
    document.body.appendChild(p);
    p.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 520}deg)`, opacity: 0 }
    ], { duration: 1000 + Math.random() * 1000, easing: 'cubic-bezier(0,.9,.57,1)', delay });
    setTimeout(() => p.remove(), 2000 + delay);
  }
}
