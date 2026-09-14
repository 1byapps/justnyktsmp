import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Badge } from '@/components/ui/Badge';
import { Coins, Clock, Target, Skull, Trophy, Star, Pickaxe, Fish, Activity, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} Oyuncu Profili | JustNyktSMP`,
    description: `${username} adlı oyuncunun JustNyktSMP üzerindeki istatistikleri, rütbesi ve klanı.`,
  };
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const player = await prisma.minecraftPlayer.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
    include: {
      clanMember: {
        include: {
          clan: true,
        },
      },
    },
  });

  if (!player) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-20">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-10 shadow-sm">
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-3">Oyuncu Bulunamadı</h1>
            <p className="text-[var(--text-secondary)] mb-6 text-sm">
              <strong className="text-white font-mono">{username}</strong> adında bir oyuncu henüz JustNyktSMP sunucusuna giriş yapmamış olabilir.
            </p>
            <Link
              href="/siralama"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Sıralamaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hours = Math.floor(player.playtimeMinutes / 60);
  const mins = player.playtimeMinutes % 60;
  const playtimeStr = `${hours}s ${mins}d`;

  const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toString();

  const statCards = [
    { label: 'Bakiye', value: `₺${player.balance.toLocaleString()}`, icon: Coins, color: 'text-yellow-400' },
    { label: 'Oynama Süresi', value: playtimeStr, icon: Clock, color: 'text-blue-400' },
    { label: 'Öldürme', value: player.kills.toLocaleString(), icon: Target, color: 'text-red-400' },
    { label: 'Ölüm', value: player.deaths.toLocaleString(), icon: Skull, color: 'text-gray-400' },
    { label: 'K/D Oranı', value: kd, icon: Activity, color: 'text-emerald-400' },
    { label: 'Seviye', value: player.level.toString(), icon: Star, color: 'text-purple-400' },
    { label: 'Tamamlanan Görev', value: player.questsCompleted.toString(), icon: Trophy, color: 'text-amber-400' },
    { label: 'Kırılan Blok', value: Number(player.blocksBroken).toLocaleString(), icon: Pickaxe, color: 'text-slate-300' },
    { label: 'Tutulan Balık', value: player.fishCaught.toLocaleString(), icon: Fish, color: 'text-cyan-400' },
  ];

  const clan = player.clanMember?.clan;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/siralama"
          className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Sıralamaya Dön
        </Link>

        {/* Header Section */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
          <div className="flex-shrink-0 relative z-10">
            <MinecraftAvatar
              username={player.username}
              size={120}
              className="rounded-2xl shadow-xl border-4 border-[var(--bg-secondary)]"
            />
          </div>

          <div className="flex-grow text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-bold font-exo text-[var(--text-primary)]">
                {player.username}
              </h1>
              <div className="flex gap-2 justify-center flex-wrap">
                {player.rankName && (
                  <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    {player.rankName}
                  </Badge>
                )}
                {clan && (
                  <Link href={`/klanlar/${clan.slug}`}>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors font-mono">
                      [{clan.tag}] {clan.name}
                    </Badge>
                  </Link>
                )}
                {player.isOnline ? (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-400 bg-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> Çevrimiçi
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-600/10">
                    Çevrimdışı
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)] justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--text-tertiary)]" />
                <span>
                  İlk Katılım:{' '}
                  {new Date(player.firstJoinAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--text-tertiary)]" />
                <span>
                  Son Görülme:{' '}
                  {new Date(player.lastSeenAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-4">İstatistikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-12">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 flex flex-col hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <stat.icon size={18} className={stat.color} />
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)] font-exo">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
