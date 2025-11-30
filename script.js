/**
 * Ryyan Safar Portfolio - v8.0
 * "Super Duper Awesome" Edition
 */

// --- Preloader Logic ---
const preloader = document.getElementById('preloader');
const counter = document.querySelector('.counter');

if (preloader) {
  let count = 0;
  const updateCounter = () => {
    count += Math.floor(Math.random() * 10) + 1;
    if (count > 100) count = 100;

    counter.textContent = count + '%';

    if (count < 100) {
      setTimeout(updateCounter, Math.random() * 200);
    } else {
      // Animation complete
      setTimeout(() => {
        counter.style.opacity = '0';
        counter.style.transition = 'opacity 0.5s ease';

        preloader.querySelector('.curtain').style.transform = 'scaleY(0)';
        preloader.querySelector('.curtain').style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';

        setTimeout(() => {
          preloader.style.display = 'none';
          // Trigger hero animations here if needed
        }, 800);
      }, 500);
    }
  };

  updateCounter();
}

// --- Core State & Config ---
const config = {
  liteMode: localStorage.getItem('perfMode') === 'lite',
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.matchMedia('(max-width: 768px)').matches
};

// Toggle Lite Mode
const toggleLiteMode = () => {
  config.liteMode = !config.liteMode;
  localStorage.setItem('perfMode', config.liteMode ? 'lite' : 'full');
  document.body.classList.toggle('lite-mode', config.liteMode);
  updatePerfButton();

  // Reload if needed to stop/start heavy canvas loops cleanly
  if (confirm('Reload page to apply performance changes?')) {
    window.location.reload();
  }
};

const updatePerfButton = () => {
  const btn = document.getElementById('theme-toggle'); // Using theme-toggle as perf toggle for now or separate
  // If we had a specific button for this:
  // btn.textContent = config.liteMode ? '⚡ Lite' : '🚀 Full';
};

// Apply initial state
if (config.liteMode) document.body.classList.add('lite-mode');

// --- Email Copy Functionality ---
const emailBtn = document.getElementById('email-copy-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const email = 'safarryyan@gmail.com';

    // Try using the Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showCopyFeedback();
      }).catch(err => {
        console.error('Clipboard API failed: ', err);
        fallbackCopyTextToClipboard(email);
      });
    } else {
      // Fallback for non-secure contexts or older browsers
      fallbackCopyTextToClipboard(email);
    }
  });

  function showCopyFeedback() {
    emailBtn.classList.add('copied');
    setTimeout(() => {
      emailBtn.classList.remove('copied');
    }, 2000);
  }

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopyFeedback();
      } else {
        console.error('Fallback copy failed.');
      }
    } catch (err) {
      console.error('Fallback copy error: ', err);
    }

    document.body.removeChild(textArea);
  }
}

// --- Navigation & Scroll ---
const nav = document.querySelector('.glass-nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Sticky Nav & Active Link
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Nav transparency toggle
  if (scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active Link Highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});

// --- Hero Glitch Effect (Scramble) ---
const scrambleElements = document.querySelectorAll('.scramble-text');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

scrambleElements.forEach(element => {
  element.dataset.value = element.innerText;

  element.onmouseover = event => {
    let iterations = 0;
    const interval = setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return event.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iterations >= event.target.dataset.value.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);
  };
});

// --- Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Only animate once
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Fluid Custom Cursor & Click Effect ---
if (!config.isMobile) {
  const cursor = document.getElementById('custom-cursor');

  // Cursor State
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Lerp factor (0.1 = slow/smooth, 0.5 = fast)
  const lerp = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Click Ripple
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
  });

  // Hover States
  const interactables = document.querySelectorAll('a, button, .project-card, .timeline-item');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Animation Loop
  const animateCursor = () => {
    // Smooth follow
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  };

  animateCursor();
}

// --- Tilt Effect for Cards ---
if (!config.isMobile && !config.liteMode && !config.reduceMotion) {
  const cards = document.querySelectorAll('.project-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// --- Typewriter Effect for Bio ---
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
  const phrases = [
    "Electronics & Communication Engineer",
    "Creative Developer",
    "Tech Enthusiast"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before new phrase
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing
  setTimeout(type, 1000);
}

// --- Konami Code & Mini Game ---
// --- Konami Code & Mini Game ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let lastKeyTime = 0;

document.addEventListener('keydown', (e) => {
  const currentTime = Date.now();

  // Reset if too much time has passed (2 seconds)
  if (currentTime - lastKeyTime > 2000) {
    konamiIndex = 0;
  }

  lastKeyTime = currentTime;

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
  const navItem = document.getElementById('minigame-nav-item');
  const navbar = document.querySelector('.navbar');

  if (navItem && navbar) {
    // Play sound or visual effect
    createExplosion(window.innerWidth / 2, window.innerHeight / 2);

    // Expand Navbar
    navbar.classList.add('nav-expanded');

    // Reveal Link
    navItem.style.display = 'block';
    setTimeout(() => {
      navItem.style.opacity = '1';
      navItem.style.transform = 'translateX(0)';
    }, 100);

    // Add click listener
    document.getElementById('minigame-link').addEventListener('click', (e) => {
      e.preventDefault();
      openGameModal();
    });
  }
}

// --- Neon Snake Game ---
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
const tileCount = 20; // 400px / 20px

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
  // Prevent scrolling if game is active
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  switch (e.key) {
    case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
    case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
    case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
    case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
  }
}

function gameLoop() {
  let head = { ...snake[0] };

  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // Wrap walls
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  // Self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.innerText = score;
    placeFood();
    createExplosion(head.x * gridSize + canvas.getBoundingClientRect().left, head.y * gridSize + canvas.getBoundingClientRect().top);
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  // Clear with slight fade for trail effect
  ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    // Head is white, body is accent color
    ctx.fillStyle = index === 0 ? '#fff' : 'var(--accent-color)';
    if (index !== 0) ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

    // Neon Glow
    ctx.shadowBlur = index === 0 ? 20 : 10;
    ctx.shadowColor = ctx.fillStyle;

    // Rounded segments
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    const size = gridSize - 2;
    const radius = 4;

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.fill();

    ctx.shadowBlur = 0; // Reset
  });
}

function drawFood() {
  ctx.fillStyle = '#ff0055';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ff0055';
  ctx.beginPath();
  ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  // Don't place on snake
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Score: ${score}`);
  startBtn.style.display = 'block';
  startBtn.innerText = 'Play Again';
}

function activatePartyMode() {
  alert('🎉 KONAMI CODE ACTIVATED! Party Mode ON! 🎉');
  document.body.style.animation = 'rainbow 5s infinite';

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// --- Theme/Lite Toggle Handler ---
const themeToggleBtn = document.getElementById('theme-toggle'); // Assuming this ID from HTML
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // For now, this just toggles Lite mode as per previous design, 
    // or we could make it a light/dark toggle. 
    // Given the "Dark Premium" goal, let's make it a Lite Mode toggle for performance.
    toggleLiteMode();
  });
}

// Help modal - prevent multiple modals
let helpModalOpen = false;
let closeOnEscapeHandler = null;

function showHelp() {
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

// --- Global Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
  // Press 'Space' to create explosion at center
  if (e.key === ' ' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    // Assuming createClickExplosion is defined elsewhere or will be added
    // createClickExplosion(window.innerWidth / 2, window.innerHeight / 2, '#f59e42');
    console.log("Spacebar pressed - Center explosion (function not defined in this snippet)");
  }

  // Press 'V' for Void Mode
  if (e.key.toLowerCase() === 'v' && !e.target.matches('input, textarea')) {
    document.body.classList.toggle('void-mode');
    // Assuming showEasterEgg is defined elsewhere or will be added
    // showEasterEgg(document.body.classList.contains('void-mode') ? '⚫ ENTERING THE VOID ⚫' : '⚪ Exiting the Void ⚪', 2000);
    console.log("V key pressed - Toggle Void Mode (function not defined in this snippet)");
  }

  // Press '?' for help
  if (e.key === '?' && e.shiftKey) {
    showHelp();
  }
});

// --- Physics Skills Cloud ---
const initSkillsPhysics = () => {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = document.getElementById('skills-canvas-container');

  let width, height;

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resize);
  resize();

  // Skills List
  const skills = [
    "ROS 2", "Verilog", "Python", "C++", "Embedded C",
    "Raspberry Pi", "ESP32", "Arduino", "TensorFlow",
    "OpenCV", "Flask", "MySQL", "Linux", "PCB Design",
    "Robotics", "Automation", "Git", "MATLAB"
  ];

  // Physics Config
  const bodies = [];
  const friction = 0.98;
  const gravity = 0.2;
  const bounce = 0.7;

  class Body {
    constructor(text, x, y) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.radius = 40 + Math.random() * 20; // Varied sizes
      this.color = '#1a1a1a';
      this.textColor = '#ffffff';
      this.isDragging = false;
    }

    update() {
      if (this.isDragging) return;

      this.vy += gravity;
      this.vx *= friction;
      this.vy *= friction;

      this.x += this.vx;
      this.y += this.vy;

      // Wall Collisions
      if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -bounce;
      } else if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -bounce;
      }

      if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy *= -bounce;
      } else if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy *= -bounce;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = this.textColor;
      ctx.font = '14px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  // Initialize Bodies
  skills.forEach(skill => {
    bodies.push(new Body(skill, Math.random() * width, Math.random() * height / 2));
  });

  // Interaction
  let draggedBody = null;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    bodies.forEach(body => {
      const dx = mouseX - body.x;
      const dy = mouseY - body.y;
      if (Math.sqrt(dx * dx + dy * dy) < body.radius) {
        draggedBody = body;
        body.isDragging = true;

        // Custom Cursor Grabbing State
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.classList.add('grabbing');
      }
    });
  });

  window.addEventListener('mousemove', (e) => {
    if (draggedBody) {
      const rect = canvas.getBoundingClientRect();
      draggedBody.x = e.clientX - rect.left;
      draggedBody.y = e.clientY - rect.top;
      draggedBody.vx = (e.movementX) * 0.5; // Add throw velocity
      draggedBody.vy = (e.movementY) * 0.5;
    }
  });

  window.addEventListener('mouseup', () => {
    if (draggedBody) {
      draggedBody.isDragging = false;
      draggedBody = null;

      // Reset Cursor
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.classList.remove('grabbing');
    }
  });

  // Animation Loop
  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    // Collision between bodies (Simple)
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const b1 = bodies[i];
        const b2 = bodies[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const tx = b1.x + Math.cos(angle) * minDist;
          const ty = b1.y + Math.sin(angle) * minDist;

          const ax = (tx - b2.x) * 0.05; // Spring force
          const ay = (ty - b2.y) * 0.05;

          b1.vx -= ax;
          b1.vy -= ay;
          b2.vx += ax;
          b2.vy += ay;
        }
      }
    }

    bodies.forEach(body => {
      body.update();
      body.draw();
    });

    requestAnimationFrame(loop);
  };

  loop();
};

// Start Physics when DOM is ready
document.addEventListener('DOMContentLoaded', initSkillsPhysics);

// --- Particle Explosion Effect ---
function createExplosion(x, y) {
  const particleCount = 30;
  const colors = ['#ff0055', '#00eaff', '#ffffff'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('explosion-particle');
    document.body.appendChild(particle);

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';

    const destinationX = (Math.random() - 0.5) * 200;
    const destinationY = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 520;
    const delay = Math.random() * 200;

    particle.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 1000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      delay: delay
    });

    setTimeout(() => {
      particle.remove();
    }, 2000 + delay);
  }
}

