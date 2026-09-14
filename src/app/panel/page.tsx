import { StatCard } from '@/components/ui/StatCard';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function PanelPage() {
  const session = await auth();
  
  // Simulated data fetching
  const stats = {
    rank: 'VIP+',
    balance: '12,500',
    playtime: '124 Saat',
    tickets: 1,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hoş geldin, {session?.user?.name || 'Oyuncu'}!</h1>
        <p className="text-[var(--text-secondary)] mt-1">Hesap özetiniz ve son aktiviteleriniz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Rütbe" value={stats.rank} icon={<div className="w-4 h-4 bg-purple-500 rounded-full" />} />
        <StatCard title="Bakiye" value={stats.balance} icon={<span className="text-yellow-500 font-bold">₺</span>} />
        <StatCard title="Oynama Süresi" value={stats.playtime} />
        <StatCard title="Açık Talepler" value={stats.tickets.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Son Satın Alımlar</h2>
          <div className="text-center text-[var(--text-secondary)] py-8">
            Henüz bir satın alım bulunmuyor.
            <div className="mt-4">
              <Link href="/market">
                <Button variant="outline" size="sm">Markete Git</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <Link href="/destek/yeni" className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors border border-transparent hover:border-emerald-500/20">
              <span className="font-medium">Yeni Destek Talebi Oluştur</span>
              <span>→</span>
            </Link>
            <Link href="/market" className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors border border-transparent hover:border-emerald-500/20">
              <span className="font-medium">Market Kategorilerini İncele</span>
              <span>→</span>
            </Link>
            <Link href="/kurallar" className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors border border-transparent hover:border-emerald-500/20">
              <span className="font-medium">Sunucu Kurallarını Oku</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
