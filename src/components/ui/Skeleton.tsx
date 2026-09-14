import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rectangle';
}

export function Skeleton({ className, variant = 'rectangle', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--bg-tertiary)]",
        {
          'rounded-md h-4 w-full': variant === 'text',
          'rounded-full': variant === 'circle',
          'rounded-lg': variant === 'rectangle',
        },
        className
      )}
      {...props}
    />
  );
}
