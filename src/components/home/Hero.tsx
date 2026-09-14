"use client";

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Hero() {
  const [status, setStatus] = useState<{ online: boolean; players: number; maxPlayers: number; version: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for API fetch
    const fetchStatus = async () => {
      try {
        // Mock data
        setTimeout(() => {
          setStatus({
            online: true,
            players: 128,
            maxPlayers: 500,
            version: 'Minecraft 1.21.x'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
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
        <h1 className="heading-xl font-exo mb-6 tracking-tight">
          <span className="text-white">Just</span>
          <span className="text-emerald-500">Nykt</span>
          <span className="text-[var(--text-secondary)]">SMP</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed">
          Topluluğun şekillendirdiği, rekabetin ve hayatta kalmanın bir araya geldiği modern SMP deneyimi.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full max-w-md justify-center">
          <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
            <Link href="/kurallar">Sunucuya Katıl</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-[var(--border)]" asChild>
            <Link href="https://discord.gg/justnyktsmp" target="_blank" rel="noopener noreferrer">
              Discord'a Katıl
            </Link>
          </Button>
        </div>

        {/* Server Status Widget */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 md:gap-8 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="text-sm font-medium">
              {loading ? <Skeleton className="h-5 w-24" /> : <span className="text-[var(--text-primary)]">{status?.players} / {status?.maxPlayers} Oyuncu</span>}
            </div>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">
              {loading ? <Skeleton className="h-5 w-24" /> : status?.version}
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-primary)]">play.justnyktsmp.net</span>
            <CopyButton value="play.justnyktsmp.net" />
          </div>
        </div>
      </div>
    </section>
  );
}
