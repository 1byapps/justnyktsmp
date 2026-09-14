'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Inbox } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T = unknown> extends React.HTMLAttributes<HTMLTableElement> {
  data?: T[];
  columns?: Column<T>[];
  striped?: boolean;
  onSort?: (key: keyof T) => void;
  emptyMessage?: string;
}

export function Table<T = unknown>({
  data,
  columns,
  striped,
  onSort,
  className,
  children,
  emptyMessage = 'Veri bulunamadı.',
  ...props
}: TableProps<T>) {
  if (data && columns) {
    if (data.length === 0) {
      return <EmptyState icon={<Inbox className="h-8 w-8 text-[var(--text-tertiary)]" />} title="Sonuç Yok" description={emptyMessage} />;
    }

    return (
      <div className="w-full overflow-auto">
        <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
          <thead className="[&_tr]:border-b [&_tr]:border-[var(--border)]">
            <tr className="border-b border-[var(--border)] transition-colors">
              {columns.map((col, i) => (
                <th key={i} className="h-12 px-4 text-left align-middle font-medium text-[var(--text-secondary)]">
                  {col.sortable && col.accessorKey ? (
                    <button onClick={() => onSort?.(col.accessorKey!)} className="flex items-center gap-1 hover:text-[var(--text-primary)]">
                      {col.header}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((item, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-tertiary)]/50",
                  striped && i % 2 === 0 && "bg-[var(--bg-tertiary)]/20"
                )}
              >
                {columns.map((col, j) => (
                  <td key={j} className="p-4 align-middle">
                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-[var(--border)]", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t border-[var(--border)] bg-[var(--bg-tertiary)] font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-tertiary)]/50 data-[state=selected]:bg-[var(--bg-elevated)]",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-[var(--text-secondary)] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";
