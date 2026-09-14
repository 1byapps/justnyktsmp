'use client';
import * as React from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

export function SearchModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-md border border-[var(--border)] w-48 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Ara...</span>
        <kbd className="ml-auto text-[10px] bg-[var(--bg-elevated)] px-1.5 rounded border border-[var(--border)] font-sans">Ctrl K</kbd>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <div className="flex flex-col gap-4 p-2">
          <Input 
            autoFocus
            leftIcon={<Search className="h-4 w-4" />}
            placeholder="Ne arıyorsunuz? (Oyuncu, Wiki, Haber...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-transparent bg-transparent text-lg focus-visible:ring-0 focus-visible:border-transparent px-0 h-12"
          />
          <div className="h-[1px] bg-[var(--border)] w-full" />
          <div className="min-h-[200px] text-sm text-[var(--text-secondary)] flex flex-col items-center justify-center">
            {query.length === 0 ? (
              <p>Aramaya başlamak için yazın...</p>
            ) : (
              <p>"{query}" için sonuç bulunamadı.</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
