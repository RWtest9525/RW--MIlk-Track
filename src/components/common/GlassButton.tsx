import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-2 text-xs rounded-xl font-medium gap-1.5',
    md: 'px-4 py-3 text-sm rounded-2xl font-semibold gap-2',
    lg: 'px-6 py-4 text-base rounded-2xl font-bold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 border border-cyan-300/30',
    secondary:
      'bg-slate-800/80 text-slate-100 hover:bg-slate-700/80 border border-slate-700/60 shadow-md',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 border border-emerald-400/30',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:from-rose-500 hover:to-red-400 shadow-lg shadow-rose-600/30 border border-rose-400/30',
    outline:
      'bg-transparent text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-white/5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
