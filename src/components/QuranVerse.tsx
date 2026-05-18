import React from 'react';
import { motion } from 'motion/react';

interface Props {
  arabic: string;
  translation: string;
  reference: string;
  variant?: 'dark' | 'light' | 'amber';
  className?: string;
}

export const QuranVerse: React.FC<Props> = ({
  arabic,
  translation,
  reference,
  variant = 'dark',
  className = '',
}) => {
  const styles = {
    dark: {
      wrap: 'bg-emerald-900/60 border-emerald-700/40',
      arabic: 'text-amber-300',
      divider: 'bg-emerald-700/50',
      translation: 'text-emerald-200/90',
      ref: 'text-amber-400/80',
    },
    light: {
      wrap: 'bg-emerald-50 border-emerald-200/60',
      arabic: 'text-emerald-800',
      divider: 'bg-emerald-200',
      translation: 'text-emerald-700',
      ref: 'text-emerald-500',
    },
    amber: {
      wrap: 'bg-amber-50 border-amber-200/60',
      arabic: 'text-emerald-900',
      divider: 'bg-amber-300/60',
      translation: 'text-amber-900/80',
      ref: 'text-amber-600',
    },
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl px-6 py-5 text-center ${styles.wrap} ${className}`}
    >
      <p
        className={`text-xl md:text-2xl font-bold leading-[2.2] mb-3 ${styles.arabic}`}
        dir="rtl"
        lang="ar"
      >
        {arabic}
      </p>
      <div className={`h-px w-16 mx-auto mb-3 ${styles.divider}`} />
      <p className={`text-sm font-medium leading-relaxed mb-2 ${styles.translation}`}>
        "{translation}"
      </p>
      <span className={`text-xs font-bold uppercase tracking-widest ${styles.ref}`}>
        — {reference}
      </span>
    </motion.div>
  );
};
