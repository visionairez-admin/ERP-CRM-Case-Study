import React from 'react';

export const Badge: React.FC<{ 
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
}> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10',
    warning: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10',
    danger: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/10',
    info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10',
    primary: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10',
    secondary: 'bg-slate-500/20 text-slate-300 border border-slate-500/40',
  };
  
  return <span className={`text-xs font-bold px-3 py-1.5 rounded-full inline-block ${variants[variant]}`}>{children}</span>;
};

export const Loader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-spin"></div>
      <div className="absolute inset-1 bg-slate-900 rounded-full"></div>
    </div>
  </div>
);

export const EmptyState: React.FC<{ message: string; icon?: React.ReactNode }> = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon ? (
      icon
    ) : (
      <div className="w-20 h-20 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-600/50">
        <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
    )}
    <p className="text-slate-400 font-medium">{message}</p>
  </div>
);
