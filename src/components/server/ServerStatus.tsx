'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { CopyButton } from '../common/CopyButton';

interface ServerStatusProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ServerStatus({ variant = 'compact', className }: ServerStatusProps) {
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState({
    online: true,
    players: { online: 0, max: 100 },
    version: '1.21.4 (Tüm Sürümler)',
    ip: 'schmidt-scanners.tun.ply.gg',
  });

  React.useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch('/api/server/status');
        const data = await res.json();
        if (data.success && data.data) {
          setStatus({
            online: data.data.online,
            players: data.data.players || { online: 0, max: 100 },
            version: data.data.version || '1.21.4 (Tüm Sürümler)',
            ip: data.data.ip || 'schmidt-scanners.tun.ply.gg',
          });
        }
      } catch {
        /* fallback */
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  if (variant === 'compact') {
    if (loading) return <Skeleton className="h-8 w-28 rounded-md" />;
    return (
      <div className={cn("flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5", className)}>
        <span className="relative flex h-2.5 w-2.5">
          {status.online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>}
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", status.online ? "bg-emerald-500" : "bg-red-500")}></span>
        </span>
        <span className="text-xs font-medium text-[var(--text-primary)]">
          {status.online ? `${status.players.online}/${status.players.max}` : 'Çevrimdışı'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Exo_2'] font-semibold text-lg text-[var(--text-primary)]">Sunucu Durumu</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {status.online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={cn("relative inline-flex h-3 w-3 rounded-full", status.online ? "bg-emerald-500" : "bg-red-500")}></span>
          </span>
          <span className={cn("text-sm font-medium", status.online ? "text-emerald-500" : "text-red-500")}>
            {status.online ? 'Çevrimiçi' : 'Çevrimdışı'}
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[var(--text-secondary)]">Sunucu Adresi (IP)</span>
            <div className="flex items-center justify-between rounded-md bg-[var(--bg-tertiary)] p-3 border border-[var(--border)]">
              <span className="font-mono text-emerald-400 font-medium text-sm truncate mr-2">{status.ip}</span>
              <CopyButton value={status.ip} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-secondary)]">Aktif Oyuncu</span>
              <span className="text-lg font-semibold text-[var(--text-primary)]">{status.players.online} <span className="text-sm text-[var(--text-tertiary)] font-normal">/ {status.players.max}</span></span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-secondary)]">Sürüm</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{status.version}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
