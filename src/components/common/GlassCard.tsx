import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'emerald' | 'coral' | 'amber' | 'indigo';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const { theme } = useTheme();

  const darkVariants = {
    default: 'bg-[#131C2E]/85 border-white/10 shadow-xl shadow-black/50 text-slate-100',
    emerald: 'bg-emerald-950/40 border-emerald-500/30 shadow-lg shadow-emerald-950/50 text-emerald-100',
    coral: 'bg-rose-950/40 border-rose-500/30 shadow-lg shadow-rose-950/50 text-rose-100',
    amber: 'bg-amber-950/40 border-amber-500/30 shadow-lg shadow-amber-950/50 text-amber-100',
    indigo: 'bg-indigo-950/40 border-indigo-500/30 shadow-lg shadow-indigo-950/50 text-indigo-100',
  };

  const lightVariants = {
    default: 'bg-white/90 border-slate-200/90 shadow-xl shadow-slate-200/60 text-slate-900',
    emerald: 'bg-emerald-50/90 border-emerald-200 shadow-md shadow-emerald-100 text-emerald-950',
    coral: 'bg-rose-50/90 border-rose-200 shadow-md shadow-rose-100 text-rose-950',
    amber: 'bg-amber-50/90 border-amber-200 shadow-md shadow-amber-100 text-amber-950',
    indigo: 'bg-indigo-50/90 border-indigo-200 shadow-md shadow-indigo-100 text-indigo-950',
  };

  const currentVariants = theme === 'dark' ? darkVariants : lightVariants;

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'backdrop-blur-xl border rounded-3xl p-5 transition-all duration-300 relative overflow-hidden',
          currentVariants[variant],
          onClick && 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
          className
        )
      )}
    >
      {/* Subtle glass light reflection */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-2xl pointer-events-none ${theme === 'dark' ? 'bg-white/5' : 'bg-cyan-500/10'}`} />
      {children}
    </div>
  );
};
