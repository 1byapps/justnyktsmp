'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ServerStatus } from '../server/ServerStatus';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
}

export function MobileNav({ isOpen, onClose, links, isLoggedIn }: MobileNavProps) {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />
      <div className="relative z-50 w-3/4 max-w-sm h-full bg-[var(--bg-elevated)] border-l border-[var(--border)] shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="font-['Exo_2'] font-bold text-lg">Menü</span>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 border-b border-[var(--border)]">
          <ServerStatus variant="compact" />
        </div>
        <div className="p-2 flex flex-col gap-1 overflow-y-auto">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-md text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
