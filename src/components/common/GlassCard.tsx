import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  const variantStyles = {
    default: 'bg-[#131C2E]/80 border-white/10 shadow-xl shadow-black/40',
    emerald: 'bg-emerald-950/40 border-emerald-500/30 shadow-lg shadow-emerald-950/50',
    coral: 'bg-rose-950/40 border-rose-500/30 shadow-lg shadow-rose-950/50',
    amber: 'bg-amber-950/40 border-amber-500/30 shadow-lg shadow-amber-950/50',
    indigo: 'bg-indigo-950/40 border-indigo-500/30 shadow-lg shadow-indigo-950/50',
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'backdrop-blur-xl border rounded-3xl p-5 transition-all duration-300 relative overflow-hidden',
          variantStyles[variant],
          onClick && 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
          className
        )
      )}
    >
      {/* Subtle glass reflection highlight */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      {children}
    </div>
  );
};
