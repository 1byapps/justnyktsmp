'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-[1px] border-l-transparent border-r-transparent border-b-transparent border-t-[var(--bg-elevated)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-l-transparent border-r-transparent border-t-transparent border-b-[var(--bg-elevated)]',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-t-transparent border-b-transparent border-r-transparent border-l-[var(--bg-elevated)]',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-[1px] border-t-transparent border-b-transparent border-l-transparent border-r-[var(--bg-elevated)]',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 whitespace-nowrap rounded-md bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-[var(--text-primary)] shadow-md border border-[var(--border)] animate-in fade-in zoom-in-95 duration-100",
          positions[position]
        )}>
          {content}
          <div className={cn("absolute h-0 w-0 border-4", arrows[position])} />
        </div>
      )}
    </div>
  );
}
