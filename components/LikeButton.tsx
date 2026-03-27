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
      // Only update if the newCount is actually different from our optimistic guess
      // This prevents the "jumping" if many people are liking at once
      if (newCount !== (prevLikes + 1)) {
        setLikes(newCount);
      }
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
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        color: hasLiked ? '#FF3E00' : 'rgba(255, 255, 255, 0.4)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 700,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'none',
        position: 'relative',
        boxShadow: hasLiked ? '0 0 15px rgba(255, 62, 0, 0.2)' : 'none',
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
          strokeWidth="2.5"
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
              color: '#FF5F57',
              fontSize: '0.65rem',
              fontWeight: 700,
              zIndex: 10,
            }}
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
