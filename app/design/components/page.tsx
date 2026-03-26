import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Components — Ryyan Safar',
  description: 'CRT UI component library by Ryyan Safar. Coming soon.',
};

const CURSOR_DEFAULT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Ccircle cx='11' cy='11' r='8.5' fill='none' stroke='%231b1c19' stroke-width='1.5'/%3E%3Ccircle cx='11' cy='11' r='2.5' fill='%231b1c19'/%3E%3C/svg%3E") 11 11, auto`;
const CURSOR_POINTER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Ccircle cx='11' cy='11' r='8.5' fill='%231b1c19'/%3E%3Ccircle cx='11' cy='11' r='3' fill='%23fbf9f4'/%3E%3C/svg%3E") 11 11, pointer`;

export default function ComponentsPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#fbf9f4',
      color: '#1b1c19',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      gap: '2rem',
      padding: '2rem',
      cursor: CURSOR_DEFAULT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Epilogue:wght@900&display=swap');
        .cs-back:hover { background: rgba(27,28,25,0.06); }
      `}</style>

      <p style={{ fontWeight: 700, fontSize: '0.5625rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(27,28,25,0.35)', margin: 0 }}>
        RYYAN SAFAR / COMPONENTS
      </p>

      <h1 style={{ fontFamily: 'Epilogue, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0, textAlign: 'center' }}>
        COMING<br />SOON
      </h1>

      <p style={{ fontSize: '0.75rem', color: 'rgba(27,28,25,0.45)', letterSpacing: '0.05em', margin: 0, textAlign: 'center', maxWidth: 320 }}>
        CRT UI primitives — phosphor glow, grain, glitch, scanlines. Copy-paste ready.
      </p>

      <Link href="/design" className="cs-back" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#1b1c19',
        textDecoration: 'none', border: '1px solid rgba(27,28,25,0.25)',
        padding: '0.5rem 1.25rem',
        transition: 'background 0.15s',
        cursor: CURSOR_POINTER,
      }}>← BACK TO DESIGN</Link>
    </div>
  );
}
