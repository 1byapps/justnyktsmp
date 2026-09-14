'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MinecraftAvatarProps {
  username: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  hoverScale?: boolean;
}

export function MinecraftAvatar({ username, size = 'md', className, hoverScale }: MinecraftAvatarProps) {
  const [error, setError] = React.useState(false);

  const sizes: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  const px = typeof size === 'number' ? size : (sizes[size] || 48);
  const url = `https://mc-heads.net/avatar/${username}/${px}`;

  return (
    <div 
      className={cn(
        "relative inline-block overflow-hidden rounded bg-[var(--bg-tertiary)]",
        hoverScale && "transition-transform hover:scale-105",
        className
      )}
      style={{ width: px, height: px }}
    >
      {!error ? (
        <Image
          src={url}
          alt={`${username} Minecraft Avatar`}
          fill
          unoptimized
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-elevated)] font-bold text-[var(--text-secondary)] text-[10px]">
          {username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
