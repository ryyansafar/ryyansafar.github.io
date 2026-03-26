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

// --- Custom Cursor ---
if (!config.isTouch) {
  const cursor = document.getElementById('custom-cursor');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  const lerp = 0.15;
  let cursorVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorVisible && cursor) {
      cursorVisible = true;
      cursor.style.opacity = '1';
    }
  });

  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  });

  if (cursor) {
    document.querySelectorAll('a, button, .project-card, .timeline-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;
    if (cursor) {
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}

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
