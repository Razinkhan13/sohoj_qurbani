import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
    onClick={onClick}
    className={`bg-white rounded-3xl shadow-sm border border-emerald-100/60 overflow-hidden backdrop-blur-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-emerald-300' : ''} ${className}`}
  >
    {children}
  </motion.div>
);
