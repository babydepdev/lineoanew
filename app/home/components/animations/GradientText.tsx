'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.span>
  );
}