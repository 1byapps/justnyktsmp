import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Shield, Users, Star, Trophy, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clan = await prisma.clan.findFirst({
    where: {
      OR: [
        { slug },
        { tag: { equals: slug, mode: 'insensitive' } },
        { name: { equals: slug, mode: 'insensitive' } },
      ],
    },
    select: { name: true, tag: true },
  });

  return {
    title: clan ? `[${clan.tag}] ${clan.name} | JustNyktSMP` : 'Klan | JustNyktSMP',
  };
}

export default async function ClanProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const clan = await prisma.clan.findFirst({
    where: {
      OR: [
        { slug },
        { tag: { equals: slug, mode: 'insensitive' } },
        { name: { equals: slug, mode: 'insensitive' } },
      ],
    },
    include: {
      members: {
        include: {
          player: true,
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  });

  if (!clan) {
    notFound();
  }

  const roleLabels: Record<string, string> = {
    OWNER: 'Lider',
    OFFICER: 'Yönetici',
    MEMBER: 'Üye',
  };

  const roleColors: Record<string, string> = {
    OWNER: 'text-red-400 bg-red-500/10 border-red-500/20',
    OFFICER: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    MEMBER: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/klanlar"
          className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Klan Sıralamasına Dön
        </Link>

        {/* Clan Header Card */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-emerald-500">
            <Shield size={250} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 w-28 h-28 bg-[var(--bg-secondary)] border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
              <Shield size={56} />
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3 justify-center md:justify-start">
                <h1 className="text-3xl md:text-4xl font-bold font-exo text-[var(--text-primary)]">
                  {clan.name}
                </h1>
                <Badge className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-lg px-3 py-1 font-mono">
                  [{clan.tag}]
                </Badge>
              </div>

              <p className="text-[var(--text-secondary)] mb-6 max-w-2xl text-sm leading-relaxed">
                {clan.description || 'Bu klan için henüz bir açıklama girilmemiş.'}
              </p>

              {/* Clan Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                    <Star size={13} className="text-yellow-400" /> Seviye
                  </div>
                  <div className="text-xl font-bold text-[var(--text-primary)]">{clan.level}</div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                    <Trophy size={13} className="text-emerald-400" /> Skor
                  </div>
                  <div className="text-xl font-bold text-emerald-400">{clan.score.toLocaleString()}</div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                    <Users size={13} className="text-blue-400" /> Üyeler
                  </div>
                  <div className="text-xl font-bold text-[var(--text-primary)]">
                    {clan.members.length} / 15
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                    <Target size={13} className="text-amber-400" /> Kasa
                  </div>
                  <div className="text-xl font-bold text-yellow-500">
                    ₺{clan.balance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clan Members List */}
        <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-4">
          Klan Üyeleri ({clan.members.length})
        </h2>
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm mb-12">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--bg-secondary)]">
                <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-secondary)]">Oyuncu</TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Rol</TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Katılım Tarihi</TableHead>
                  <TableHead className="text-right text-[var(--text-secondary)]">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clan.members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  >
                    <TableCell>
                      <Link
                        href={`/oyuncu/${member.player.username}`}
                        className="flex items-center gap-3 hover:text-emerald-400 transition-colors group"
                      >
                        <MinecraftAvatar username={member.player.username} size={32} />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                            {member.player.username}
                          </div>
                          {member.player.rankName && (
                            <span className="text-[10px] text-[var(--text-tertiary)]">
                              {member.player.rankName}
                            </span>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[member.role] || roleColors.MEMBER}>
                        {roleLabels[member.role] || 'Üye'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[var(--text-secondary)] text-sm">
                      {new Date(member.joinedAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.player.isOnline ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Çevrimiçi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Çevrimdışı
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
