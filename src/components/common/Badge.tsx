import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'delivered' | 'missed' | 'custom' | 'paid' | 'unpaid' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'delivered',
  size = 'md',
  dot = true,
}) => {
  const variantStyles = {
    delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    missed: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    custom: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    paid: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    unpaid: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    info: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  };

  const dotColors = {
    delivered: 'bg-emerald-400',
    missed: 'bg-rose-400',
    custom: 'bg-amber-400',
    paid: 'bg-cyan-400',
    unpaid: 'bg-purple-400',
    info: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-medium gap-1 border',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold gap-1.5 border',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center tracking-wide uppercase',
          sizeStyles[size],
          variantStyles[variant]
        )
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
