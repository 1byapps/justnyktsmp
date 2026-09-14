import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  initials?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showBorder?: boolean;
  className?: string;
}

export function Avatar({ src, initials, alt = 'Avatar', size = 'md', isOnline, showBorder, className }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-4 w-4 border-2'
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-[var(--bg-tertiary)]",
        sizes[size],
        showBorder && "border-2 border-[var(--bg-elevated)] ring-2 ring-[var(--border)]"
      )}>
        {src ? (
          <Image src={src} alt={alt} fill className="aspect-square h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-medium text-[var(--text-secondary)] uppercase">
            {initials?.slice(0, 2) || '?'}
          </span>
        )}
      </div>
      {isOnline !== undefined && (
        <span className={cn(
          "absolute bottom-0 right-0 rounded-full border-[var(--bg-elevated)]",
          isOnline ? "bg-emerald-500" : "bg-gray-500",
          statusSizes[size]
        )} />
      )}
    </div>
  );
}
