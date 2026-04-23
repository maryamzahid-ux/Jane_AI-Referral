import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm shadow-primary/10',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive/10 text-destructive border border-destructive/20 font-bold',
    success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold',
    warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold',
    info: 'bg-sky-500/10 text-sky-600 border border-sky-500/20 font-bold',
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-tight",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("bg-card text-card-foreground rounded-[1.5rem] border shadow-card transition-all", className)}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }> = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95',
    ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
    outline: 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm active:scale-95',
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-6 py-2.5",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
