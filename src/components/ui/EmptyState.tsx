'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) {
      return <Inbox className="h-6 w-6 text-[var(--text-secondary)]" />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="h-6 w-6 text-[var(--text-secondary)]" />;
  };

  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/50 py-12 px-4 text-center", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-elevated)] mb-4">
        {renderIcon()}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-sm">{description}</p>
      {action && (
        <div className="mt-6">
          <Button href={action.href} onClick={action.onClick} variant="primary" size="sm">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
