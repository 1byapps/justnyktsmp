"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={40} />
      </div>
      <h1 className="heading-lg font-exo text-[var(--text-primary)] mb-4">Bir Hata Oluştu</h1>
      <p className="text-[var(--text-secondary)] max-w-md mb-8">
        İsteğinizi işlerken beklenmedik bir sorunla karşılaştık. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <RotateCcw size={18} className="mr-2" /> Tekrar Dene
        </Button>
        <Button asChild variant="outline" className="border-[var(--border)]">
          <Link href="/">
            <Home size={18} className="mr-2" /> Ana Sayfa
          </Link>
        </Button>
      </div>
    </div>
  );
}
