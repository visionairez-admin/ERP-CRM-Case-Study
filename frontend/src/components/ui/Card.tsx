import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl shadow-slate-900/20',
    primary: 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg border border-indigo-500/20 shadow-2xl shadow-indigo-900/20',
    success: 'bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-lg border border-emerald-500/20 shadow-2xl shadow-emerald-900/20',
    warning: 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-lg border border-amber-500/20 shadow-2xl shadow-amber-900/20',
    danger: 'bg-gradient-to-br from-red-900/30 to-rose-900/30 backdrop-blur-lg border border-red-500/20 shadow-2xl shadow-red-900/20',
  };
  
  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-4 ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-slate-300 space-y-3">{children}</div>
);
