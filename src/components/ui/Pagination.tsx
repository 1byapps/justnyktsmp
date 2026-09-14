'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('...');
    }
  }

  return (
    <nav className={cn("mx-auto flex w-full justify-center", className)} aria-label="pagination">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="gap-1 pl-2.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Önceki</span>
          </Button>
        </li>
        
        {pages.map((page, i) => (
          <li key={i}>
            {page === '...' ? (
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-[var(--text-secondary)]" />
              </span>
            ) : (
              <Button
                variant={currentPage === page ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => onPageChange?.(page as number)}
                className={cn(
                  "w-9 h-9 p-0",
                  currentPage === page && "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                )}
              >
                {page}
              </Button>
            )}
          </li>
        ))}

        <li>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-1 pr-2.5"
          >
            <span className="hidden sm:inline">Sonraki</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
