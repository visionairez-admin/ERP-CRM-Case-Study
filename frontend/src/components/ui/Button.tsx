import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow hover:from-indigo-500 hover:to-purple-500 hover:shadow-glow-lg disabled:opacity-50 focus-visible:ring-indigo-500',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 disabled:opacity-50 focus-visible:ring-slate-500',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 focus-visible:ring-red-500',
    success:
      'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-glow-emerald hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 focus-visible:ring-emerald-500',
    warning:
      'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 focus-visible:ring-amber-500',
    outline:
      'border-2 border-indigo-500/60 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 disabled:opacity-50 focus-visible:ring-indigo-500',
    ghost:
      'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 disabled:opacity-50 focus-visible:ring-slate-500',
  };

  const sizes: Record<string, string> = {
    xs: 'px-2.5 h-7 text-xs',
    sm: 'px-3 h-8 text-sm',
    md: 'px-4 h-10 text-sm',
    lg: 'px-5 h-12 text-base',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      )}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
