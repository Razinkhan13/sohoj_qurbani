import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  'aria-label': ariaLabel,
}) => (
  <motion.div
    whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    aria-label={ariaLabel}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    className={`bg-white rounded-3xl shadow-sm border border-emerald-100/60 overflow-hidden backdrop-blur-sm transition-all duration-300 ${
      onClick
        ? 'cursor-pointer hover:shadow-xl hover:border-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400'
        : ''
    } ${className}`}
  >
    {children}
  </motion.div>
);
