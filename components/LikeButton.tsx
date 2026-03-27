'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLikes, incrementLike } from '@/app/actions/like';

export default function LikeButton({ componentId }: { componentId: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const count = await getLikes(componentId);
      setLikes(count);
    };
    fetchLikes();
  }, [componentId]);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    setHasLiked(true);
    
    // Optimistic UI
    const prevLikes = likes || 0;
    setLikes(prevLikes + 1);

    try {
      const newCount = await incrementLike(componentId);
      setLikes(newCount);
    } catch (error) {
      console.error('Failed to like:', error);
      setLikes(prevLikes); // Rollback
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="like-btn-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.8rem 1.5rem',
        background: 'rgba(255, 221, 0, 0.05)',
        border: '1px solid rgba(255, 221, 0, 0.2)',
        borderRadius: '100px',
        color: '#FFDD00',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        cursor: 'none', // Follow custom cursor rule
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.span
        animate={hasLiked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.4 }}
        style={{ display: 'inline-block' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={hasLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </motion.span>
      
      <span style={{ minWidth: '1.5rem', textAlign: 'left' }}>
        {likes === null ? '...' : likes}
      </span>

      <AnimatePresence>
        {isLiking && (
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -40, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="like-particle"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              pointerEvents: 'none',
              color: '#FFDD00',
              fontSize: '0.7rem',
            }}
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>

      <style jsx>{`
        .like-btn-container:hover {
          background: rgba(255, 221, 0, 0.1) !important;
          border-color: rgba(255, 221, 0, 0.5) !important;
          box-shadow: 0 0 20px rgba(255, 221, 0, 0.15);
        }
      `}</style>
    </motion.button>
  );
}
