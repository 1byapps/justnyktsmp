"use client";

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Hero() {
  const [status, setStatus] = useState<{ online: boolean; players: { online: number; max: number }; version: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/server/status');
        const data = await res.json();
        if (data.success && data.data) {
          setStatus(data.data);
        }
      } catch {
        /* fallback */
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <section className="relative w-full overflow-hidden hero-bg bg-[var(--bg-primary)] py-24 md:py-32 flex flex-col items-center justify-center">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Normal SMP &bull; 1.8 - 1.21.x (Java & Bedrock Destekli)
        </div>

        <h1 className="heading-xl font-exo mb-6 tracking-tight">
          <span className="text-white">Just</span>
          <span className="text-emerald-500">Nykt</span>
          <span className="text-[var(--text-secondary)]">SMP</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed">
          Sade, adil ve topluluk odaklı modern hayatta kalma deneyimi. Abartısız sistemler, 4 mevsim döngüsü, dengeli meslekler ve kesintisiz Normal SMP keyfi.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full max-w-md justify-center">
          <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-900/30" asChild>
            <Link href="/sunucu">Nasıl Katılırım?</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-[var(--border)] hover:border-emerald-500/40" asChild>
            <Link href="/kurallar">
              Sunucu Kuralları
            </Link>
          </Button>
        </div>

        {/* Server Status Widget */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 md:gap-8 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status?.online ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500"}`} />
            <div className="text-sm font-medium">
              {loading ? (
                <Skeleton className="h-5 w-24" />
              ) : status?.online ? (
                <span className="text-[var(--text-primary)]">
                  {status.players ? `${status.players.online} / ${status.players.max} Oyuncu` : "Çevrimiçi"}
                </span>
              ) : (
                <span className="text-red-400 font-medium">Çevrimdışı</span>
              )}
            </div>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">
              {loading ? <Skeleton className="h-5 w-24" /> : "1.8 - 1.21.x (Java & Bedrock)"}
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-medium text-[var(--accent-primary)]">schmidt-scanners.tun.ply.gg:64110</span>
            <CopyButton value="schmidt-scanners.tun.ply.gg:64110" />
          </div>
        </div>
      </div>
    </section>
  );
}
