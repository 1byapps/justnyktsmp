import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Shield, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';

export const metadata: Metadata = {
  title: 'Klanlar & Sıralama | JustNyktSMP',
  description: 'JustNyktSMP sunucusunun en güçlü klanları, liderleri ve istatistikleri.',
};

export default async function ClansPage() {
  const clans = await prisma.clan.findMany({
    orderBy: { score: 'desc' },
    include: {
      members: {
        include: {
          player: {
            select: { username: true, isOnline: true },
          },
        },
      },
      _count: {
        select: { members: true },
      },
    },
    take: 50,
  });

  const formattedClans = clans.map((c, i) => {
    const ownerMember = c.members.find((m) => m.role === 'OWNER') || c.members[0];
    return {
      rank: i + 1,
      id: c.id,
      name: c.name,
      tag: c.tag,
      slug: c.slug,
      level: c.level,
      score: c.score,
      balance: c.balance,
      memberCount: c._count.members,
      ownerUsername: ownerMember?.player.username || 'Bilinmiyor',
    };
  });

  const top1 = formattedClans[0];
  const top2 = formattedClans[1];
  const top3 = formattedClans[2];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              Klan Sistemi
            </div>
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-2">Klan Sıralaması</h1>
            <p className="text-[var(--text-secondary)]">Sunucunun en güçlü klanları, liderleri ve puan durumu.</p>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {formattedClans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* 2nd Place */}
            {top2 ? (
              <Link href={`/klanlar/${top2.slug}`} className="group">
                <div className="bg-[var(--bg-elevated)] border-2 border-gray-400/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-6 shadow-sm group-hover:border-gray-400 transition-all">
                  <div className="w-14 h-14 bg-gray-400/20 text-gray-300 rounded-full flex items-center justify-center font-bold text-xl mb-3">
                    #2
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 font-exo group-hover:text-emerald-400 transition-colors">
                    [{top2.tag}] {top2.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">Lider: {top2.ownerUsername}</p>
                  <p className="text-sm font-semibold text-emerald-400 mb-3">Skor: {top2.score.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Users size={14} /> {top2.memberCount} Üye &bull; Seviye {top2.level}
                  </div>
                </div>
              </Link>
            ) : <div />}

            {/* 1st Place */}
            {top1 && (
              <Link href={`/klanlar/${top1.slug}`} className="group">
                <div className="bg-[var(--bg-elevated)] border-2 border-yellow-500/50 rounded-2xl p-7 flex flex-col items-center justify-center text-center shadow-lg relative group-hover:border-yellow-400 transition-all">
                  <div className="absolute -top-4 text-yellow-500">
                    <Trophy size={32} />
                  </div>
                  <div className="w-18 h-18 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center font-bold text-3xl mb-3">
                    #1
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1 font-exo group-hover:text-yellow-400 transition-colors">
                    [{top1.tag}] {top1.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">Lider: {top1.ownerUsername}</p>
                  <p className="text-base font-bold text-yellow-400 mb-3">Skor: {top1.score.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Users size={14} /> {top1.memberCount} Üye &bull; Seviye {top1.level}
                  </div>
                </div>
              </Link>
            )}

            {/* 3rd Place */}
            {top3 ? (
              <Link href={`/klanlar/${top3.slug}`} className="group">
                <div className="bg-[var(--bg-elevated)] border-2 border-amber-700/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-10 shadow-sm group-hover:border-amber-600 transition-all">
                  <div className="w-14 h-14 bg-amber-700/20 text-amber-500 rounded-full flex items-center justify-center font-bold text-xl mb-3">
                    #3
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 font-exo group-hover:text-emerald-400 transition-colors">
                    [{top3.tag}] {top3.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">Lider: {top3.ownerUsername}</p>
                  <p className="text-sm font-semibold text-emerald-400 mb-3">Skor: {top3.score.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Users size={14} /> {top3.memberCount} Üye &bull; Seviye {top3.level}
                  </div>
                </div>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Clans Table */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--bg-secondary)]">
                <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                  <TableHead className="w-16 text-center text-[var(--text-secondary)]">#</TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Klan (TAG)</TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Lider</TableHead>
                  <TableHead className="text-center text-[var(--text-secondary)]">Seviye</TableHead>
                  <TableHead className="text-center text-[var(--text-secondary)]">Üyeler</TableHead>
                  <TableHead className="text-right text-[var(--text-secondary)]">Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedClans.map((clan) => (
                  <TableRow
                    key={clan.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  >
                    <TableCell className="text-center font-bold text-[var(--text-secondary)]">
                      {clan.rank === 1 ? (
                        <span className="text-yellow-500 font-bold">1</span>
                      ) : clan.rank === 2 ? (
                        <span className="text-gray-400 font-bold">2</span>
                      ) : clan.rank === 3 ? (
                        <span className="text-amber-600 font-bold">3</span>
                      ) : (
                        clan.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/klanlar/${clan.slug}`} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-emerald-500 border border-[var(--border)] group-hover:bg-emerald-500/10 transition-colors">
                          <Shield size={18} />
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                            {clan.name}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 ml-2 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            [{clan.tag}]
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/oyuncu/${clan.ownerUsername}`}
                        className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                      >
                        <MinecraftAvatar username={clan.ownerUsername} size={24} />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          {clan.ownerUsername}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[var(--text-primary)]">
                      {clan.level}
                    </TableCell>
                    <TableCell className="text-center text-[var(--text-secondary)]">
                      {clan.memberCount}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-400">
                      {clan.score.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {formattedClans.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)]">Henüz kayıtlı bir klan bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
