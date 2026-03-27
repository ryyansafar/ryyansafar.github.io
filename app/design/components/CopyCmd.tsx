'use client';
import { useState } from 'react';

const CURSOR_CODE = `// spring-cursor.js — drop into any project, zero dependencies
(function () {
  const el = document.createElement('div');
  el.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;' +
    'will-change:transform;transform-origin:0 0;display:none;';
  el.innerHTML = \`<svg width="24" height="30" viewBox="0 0 24 30" fill="none">
    <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
      fill="rgba(0,0,0,0.5)" transform="translate(1.5,1.5)"/>
    <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
      fill="white"/>
  </svg>\`;
  document.body.appendChild(el);

  // Add cursor:none to hide default cursor
  const style = document.createElement('style');
  style.textContent = '@media(hover:hover)and(pointer:fine){body,body *{cursor:none!important}}';
  document.head.appendChild(style);

  let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0;
  let sc = 1, st = 1, sv = 0, lt = performance.now();
  const PS = 240, PD = 27, SS = 330, SD = 30;

  window.addEventListener('mousemove', e => {
    el.style.display = 'block'; mx = e.clientX; my = e.clientY;
  });
  window.addEventListener('touchstart', () => el.style.display = 'none', { passive: true });
  document.addEventListener('mousedown', () => st = 0.65);
  document.addEventListener('mouseup', () => st = 1);

  (function tick() {
    const now = performance.now(), dt = Math.min((now - lt) / 1000, 0.033); lt = now;
    vx += ((mx - x) * PS - vx * PD) * dt; vy += ((my - y) * PS - vy * PD) * dt;
    x += vx * dt; y += vy * dt;
    sv += ((st - sc) * SS - sv * SD) * dt; sc += sv * dt;
    el.style.transform = \`translate(\${x}px,\${y}px) scale(\${sc})\`;
    requestAnimationFrame(tick);
  })();
})();`;

export function CopyCmd({ command }: { command: string }) {
  const [cmdCopied, setCmdCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCmd = async () => {
    await navigator.clipboard.writeText(command);
    setCmdCopied(true);
    setTimeout(() => setCmdCopied(false), 2000);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(CURSOR_CODE);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <>
      {/* Terminal block */}
      <div style={{
        background: '#1b1c19',
        borderRadius: '10px',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8125rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 'auto', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', lineHeight: '10px' }}>terminal</span>
        </div>

        {/* Command line */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6em', alignItems: 'center', color: '#fbf9f4' }}>
            <span style={{ color: '#a8e060', userSelect: 'none' }}>$</span>
            <span style={{ color: 'rgba(251,249,244,0.85)', letterSpacing: '0.01em' }}>{command}</span>
          </div>
          <button
            onClick={copyCmd}
            style={{
              background: cmdCopied ? 'rgba(168,224,96,0.15)' : 'rgba(255,255,255,0.07)',
              border: '1px solid',
              borderColor: cmdCopied ? 'rgba(168,224,96,0.4)' : 'rgba(255,255,255,0.12)',
              borderRadius: '5px',
              color: cmdCopied ? '#a8e060' : 'rgba(255,255,255,0.55)',
              fontSize: '0.6875rem',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.05em',
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {cmdCopied ? '✓ copied' : 'copy'}
          </button>
        </div>
      </div>

      {/* Copy implementation button */}
      <button
        onClick={copyCode}
        style={{
          marginTop: '0.75rem',
          background: codeCopied ? 'rgba(27,28,25,0.06)' : 'transparent',
          border: '1px solid',
          borderColor: codeCopied ? 'rgba(27,28,25,0.25)' : 'rgba(27,28,25,0.18)',
          borderRadius: '6px',
          padding: '0.5rem 1.1rem',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '0.625rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: codeCopied ? '#1b1c19' : 'rgba(27,28,25,0.55)',
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4em',
        }}
      >
        {codeCopied ? '✓ implementation copied' : '{ } copy implementation'}
      </button>
    </>
  );
}
