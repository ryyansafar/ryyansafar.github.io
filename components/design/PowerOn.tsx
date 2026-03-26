'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PowerOnProps {
  onComplete: () => void;
}

type Stage = 'black' | 'line' | 'expand' | 'flash' | 'content' | 'done';

export default function PowerOn({ onComplete }: PowerOnProps) {
  const [stage, setStage] = useState<Stage>('black');
  const doneRef = useRef(false);

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setStage('done');
    onComplete();
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.push(t);
      return t;
    };

    schedule(() => setStage('line'),    300);
    schedule(() => setStage('expand'),  800);
    schedule(() => setStage('flash'),  1400);
    schedule(() => setStage('content'),1700);
    schedule(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setStage('done');
        onComplete();
      }
    }, 3200);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <>
          <motion.div
            className="power-on-overlay"
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          >
            {/* Bright horizontal line */}
            {(stage === 'line' || stage === 'expand' || stage === 'flash') && (
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  background: 'linear-gradient(90deg, transparent 0%, #ffffff 30%, #ffffff 70%, transparent 100%)',
                  transformOrigin: 'center',
                }}
                initial={{ height: 2, translateY: '-50%' }}
                animate={{
                  height: stage === 'expand' || stage === 'flash' ? '100vh' : 2,
                  opacity: stage === 'flash' ? [1, 0.6, 1, 0.4, 1] : 1,
                }}
                transition={{
                  height: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.4, times: [0, 0.2, 0.4, 0.7, 1] },
                }}
              />
            )}

            {/* Static noise flash overlay */}
            {stage === 'content' && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                  mixBlendMode: 'screen',
                }}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </motion.div>

          <button
            className="power-on-skip"
            onClick={skip}
            aria-label="Skip intro animation"
          >
            Skip [→]
          </button>
        </>
      )}
    </AnimatePresence>
  );
}


/* ─── Power Off component ─── */
interface PowerOffProps {
  onComplete: () => void;
}

export function PowerOff({ onComplete }: PowerOffProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 900);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="power-off-overlay">
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#000' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transformOrigin: 'center',
          background: 'linear-gradient(90deg, transparent 0%, #fff 30%, #fff 70%, transparent 100%)',
        }}
        initial={{ height: '100vh', translateY: '-50%', opacity: 1 }}
        animate={{ height: 2, opacity: [1, 1, 0] }}
        transition={{
          height: { delay: 0.1, duration: 0.45, ease: [0.7, 0, 1, 1] },
          opacity: { delay: 0.55, duration: 0.2 },
        }}
      />
    </div>
  );
}
