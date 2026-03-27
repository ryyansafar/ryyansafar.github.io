'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLikes, toggleLike } from '@/app/actions/like';

/**
 * LikeButton Component
 * 
 * An interactive, magnetic like button designed for the component gallery.
 * Features:
 * - Optimistic UI updates for snappy feedback.
 * - Per-component independent counting.
 * - Framer Motion animations (scale, pulse, particles).
 * - Persistence via Firebase Firestore.
 * 
 * @param {string} componentId - Unique identifier for the component being liked.
 */
export default function LikeButton({ componentId }: { componentId: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    getLikes(componentId).then(setLikes);
    const liked = localStorage.getItem(`liked-${componentId}`);
    if (liked) setHasLiked(true);
  }, [componentId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking || likes === null) return;
    
    const newHasLiked = !hasLiked;
    const oldLikes = likes;
    
    // Optimistic UI
    setHasLiked(newHasLiked);
    setLikes(prev => (prev !== null ? Math.max(0, prev + (newHasLiked ? 1 : -1)) : prev));
    setIsLiking(true);

    try {
      const newCount = await toggleLike(componentId, newHasLiked);
      setLikes(newCount);
      
      if (newHasLiked) {
        localStorage.setItem(`liked-${componentId}`, 'true');
      } else {
        localStorage.removeItem(`liked-${componentId}`);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLikes(oldLikes); // Rollback
      setHasLiked(!newHasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      whileHover={{ 
        scale: 1.04, 
        backgroundColor: 'rgba(255, 62, 0, 0.12)',
        borderColor: 'rgba(255, 62, 0, 0.3)' 
      }}
      whileTap={{ scale: 0.92 }}
      className="like-btn-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.85rem',
        background: hasLiked ? 'rgba(255, 62, 0, 0.12)' : 'rgba(27, 28, 25, 0.08)',
        border: `1px solid ${hasLiked ? 'rgba(255, 62, 0, 0.4)' : 'rgba(27, 28, 25, 0.25)'}`,
        borderRadius: '6px',
        color: hasLiked ? '#FF3E00' : 'rgba(27, 28, 25, 0.85)', // Maximum contrast on white
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 800, // Extra bold for visibility
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'none',
        position: 'relative',
        boxShadow: hasLiked ? '0 0 16px rgba(255, 62, 0, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      <motion.span
        animate={hasLiked ? { 
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.45, ease: "backOut" }}
        style={{ display: 'inline-flex' }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={hasLiked ? '#FF3E00' : 'none'}
          stroke={hasLiked ? '#FF3E00' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            filter: hasLiked ? 'drop-shadow(0 0 4px rgba(255, 62, 0, 0.6))' : 'none'
          }}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.span>
      
      <span style={{ 
        color: hasLiked ? '#FF3E00' : 'inherit',
        textShadow: hasLiked ? '0 0 8px rgba(255, 62, 0, 0.4)' : 'none'
      }}>
        {likes === null ? '...' : likes}
      </span>

      <AnimatePresence>
        {isLiking && (
          <motion.span
            initial={{ y: 0, x: '-50%', opacity: 0, scale: 0.5 }}
            animate={{ y: -30, x: '-50%', opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              pointerEvents: 'none',
              color: hasLiked ? '#FF5F57' : 'rgba(27, 28, 25, 0.4)',
              fontSize: '0.65rem',
              fontWeight: 700,
              zIndex: 10,
            }}
          >
            {hasLiked ? '+1' : '-1'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
