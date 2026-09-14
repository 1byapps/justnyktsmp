'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-2 w-56 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100",
          align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
        )}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                const element = child as React.ReactElement<{ onClick?: (...args: unknown[]) => void }>;
                return React.cloneElement(element, {
                  onClick: (...args: unknown[]) => {
                    element.props?.onClick?.(...args);
                    setIsOpen(false);
                  }
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, icon, className }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors",
        className
      )}
      role="menuitem"
    >
      {icon && <span className="mr-3 h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn("my-1 border-t border-[var(--border)]", className)} role="separator" />;
}
