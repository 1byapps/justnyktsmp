import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from './Skeleton';

export interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon | React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ label, title, value, change, icon, isLoading, className }: StatCardProps) {
  const displayLabel = label || title || '';

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="h-4 w-4 text-[var(--text-secondary)]" />;
  };

  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{displayLabel}</p>
        {icon && (
          <div className="rounded-md bg-[var(--bg-tertiary)] p-2">
            {renderIcon()}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{value}</h3>
        )}
      </div>
      {change && !isLoading && (
        <div className="mt-2 flex items-center text-sm">
          {change.trend === 'up' && <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />}
          {change.trend === 'down' && <TrendingDown className="mr-1 h-4 w-4 text-red-500" />}
          <span className={cn(
            "font-medium",
            change.trend === 'up' && "text-emerald-500",
            change.trend === 'down' && "text-red-500",
            change.trend === 'neutral' && "text-[var(--text-secondary)]"
          )}>
            {change.value}
          </span>
          <span className="ml-1 text-[var(--text-tertiary)]">geçen aya göre</span>
        </div>
      )}
    </div>
  );
}
