import { Metadata } from 'next';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Badge } from '@/components/ui/Badge';
import { Coins, Clock, Target, Skull, Trophy, Star, Shield, Pickaxe, Fish, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} Profili | JustNyktSMP`,
  };
}

export default function PlayerProfilePage({ params }: { params: { username: string } }) {
  // Mock data
  const player = {
    username: params.username,
    rank: 'VIP+',
    clan: 'ELITE',
    status: 'online', // 'online' | 'offline'
    firstJoin: '12 Ocak 2025',
    lastSeen: 'Şimdi',
    stats: {
      balance: 154200,
      playtime: '142s 30dk',
      kills: 450,
      deaths: 120,
      kd: 3.75,
      level: 45,
      quests: 128,
      blocksBroken: 245000,
      fishCaught: 450
    }
  };

  const statCards = [
    { label: 'Bakiye', value: `$${player.stats.balance.toLocaleString()}`, icon: Coins, color: 'text-yellow-500' },
    { label: 'Oynama Süresi', value: player.stats.playtime, icon: Clock, color: 'text-blue-500' },
    { label: 'Öldürme', value: player.stats.kills, icon: Target, color: 'text-red-500' },
    { label: 'Ölüm', value: player.stats.deaths, icon: Skull, color: 'text-gray-400' },
    { label: 'K/D Oranı', value: player.stats.kd, icon: Activity, color: 'text-emerald-500' },
    { label: 'Seviye', value: player.stats.level, icon: Star, color: 'text-purple-500' },
    { label: 'Tamamlanan Görev', value: player.stats.quests, icon: Trophy, color: 'text-amber-500' },
    { label: 'Kırılan Blok', value: player.stats.blocksBroken.toLocaleString(), icon: Pickaxe, color: 'text-slate-400' },
    { label: 'Tutulan Balık', value: player.stats.fishCaught, icon: Fish, color: 'text-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            {/* Background flourish */}
            <Activity size={200} />
          </div>

          <div className="flex-shrink-0 relative z-10">
            <MinecraftAvatar username={player.username} size={128} className="rounded-xl shadow-lg border-4 border-[var(--bg-secondary)]" />
          </div>
          
          <div className="flex-grow text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-bold font-exo text-[var(--text-primary)]">{player.username}</h1>
              <div className="flex gap-2 justify-center">
                <Badge className="bg-purple-500 text-white border-none">{player.rank}</Badge>
                {player.clan && (
                  <Link href={`/klanlar/${player.clan.toLowerCase()}`}>
                    <Badge variant="outline" className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer border-[var(--border)]">
                      [{player.clan}]
                    </Badge>
                  </Link>
                )}
                {player.status === 'online' ? (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/10">Çevrimiçi</Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-500 text-gray-500 bg-gray-500/10">Çevrimdışı</Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-secondary)] justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Katılım: {player.firstJoin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Son Görülme: {player.lastSeen}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-6">İstatistikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 flex flex-col hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <stat.icon size={18} className={stat.color} />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Achievements Placeholder */}
        <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-6">Başarımlar (Yakında)</h2>
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 text-center border-dashed">
          <Trophy size={48} className="mx-auto text-[var(--text-tertiary)] mb-4" />
          <p className="text-[var(--text-secondary)]">Başarım sistemi şu anda geliştirme aşamasındadır.</p>
        </div>

      </div>
    </div>
  );
}
