'use client';
import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/Toast';

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const { addToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      addToast({ type: 'success', title: 'Kopyalandı!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast({ type: 'error', title: 'Kopyalama başarısız' });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]", className)}
      title="Kopyala"
      {...props}
    >
      <span className="sr-only">Kopyala</span>
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
