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
    sm: 'px-3.5 py-2 text-xs rounded-xl font-bold gap-1.5',
    md: 'px-5 py-3 text-xs rounded-2xl font-extrabold gap-2',
    lg: 'px-6 py-3.5 text-sm rounded-2xl font-black gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#06B6D4] text-white hover:brightness-110 shadow-lg shadow-cyan-500/30 border border-cyan-300/40',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:brightness-110 shadow-lg shadow-emerald-600/30 border border-emerald-400/30',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:brightness-110 shadow-lg shadow-rose-600/30 border border-rose-400/30',
    outline:
      'bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800',
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
