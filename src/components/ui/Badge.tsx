import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emerald' | 'purple' | 'blue' | 'amber' | 'red' | 'gray' | 'outline' | 'default';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ className, variant = 'gray', size = 'sm', dot, children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[var(--accent-primary-muted)] text-[var(--accent-primary)] border border-[var(--border-accent)]',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    gray: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border)]',
    outline: 'border border-[var(--border)] bg-transparent text-[var(--text-secondary)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return (
    <div className={cn("inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant] || variants.gray, sizes[size], className)} {...props}>
      {dot && (
        <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
          'bg-emerald-500': variant === 'emerald' || variant === 'default',
          'bg-purple-500': variant === 'purple',
          'bg-blue-500': variant === 'blue',
          'bg-amber-500': variant === 'amber',
          'bg-red-500': variant === 'red',
          'bg-[var(--text-secondary)]': variant === 'gray' || variant === 'outline',
        })} />
      )}
      {children}
    </div>
  );
}
