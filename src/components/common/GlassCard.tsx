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
  const lightVariants = {
    default: 'bg-white border-slate-200/90 shadow-md shadow-slate-200/60 text-slate-900',
    emerald: 'bg-emerald-50/90 border-emerald-200 shadow-md shadow-emerald-100 text-emerald-950',
    coral: 'bg-rose-50/90 border-rose-200 shadow-md shadow-rose-100 text-rose-950',
    amber: 'bg-amber-50/90 border-amber-200 shadow-md shadow-amber-100 text-amber-950',
    indigo: 'bg-indigo-50/90 border-indigo-200 shadow-md shadow-indigo-100 text-indigo-950',
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'border rounded-3xl p-5 transition-all duration-300 relative overflow-hidden',
          lightVariants[variant],
          onClick && 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
          className
        )
      )}
    >
      {children}
    </div>
  );
};
