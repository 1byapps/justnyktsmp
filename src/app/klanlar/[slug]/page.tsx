import { Metadata } from 'next';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Shield, Users, Star, Trophy, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug.toUpperCase()} Klanı | JustNyktSMP`,
  };
}

export default function ClanProfilePage({ params }: { params: { slug: string } }) {
  // Mock data
  const clan = {
    name: 'Elite Warriors',
    tag: params.slug.toUpperCase(),
    description: 'Sunucunun en köklü ve güçlü klanlarından biri. Sadece davet ile üye alımı yapılmaktadır.',
    level: 8,
    score: 14500,
    balance: 2500000,
    created: '15 Mart 2025',
    members: [
      { username: 'OwnerPlayer', role: 'Lider', joined: '15 Mart 2025', status: 'online' },
      { username: 'OfficerOne', role: 'Yönetici', joined: '20 Mart 2025', status: 'offline' },
      { username: 'OfficerTwo', role: 'Yönetici', joined: '01 Nisan 2025', status: 'online' },
      { username: 'MemberOne', role: 'Üye', joined: '10 Mayıs 2025', status: 'offline' },
      { username: 'MemberTwo', role: 'Üye', joined: '12 Haziran 2025', status: 'online' },
    ]
  };

  const roleColors: Record<string, string> = {
    'Lider': 'text-red-500 bg-red-500/10 border-red-500/20',
    'Yönetici': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Üye': 'text-gray-400 bg-gray-500/10 border-gray-500/20'
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/klanlar" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Klan Sıralamasına Dön
        </Link>

        {/* Header Section */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Shield size={250} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 w-32 h-32 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--text-tertiary)] shadow-inner">
                <Shield size={64} />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3 justify-center md:justify-start">
                <h1 className="text-3xl md:text-4xl font-bold font-exo text-[var(--text-primary)]">{clan.name}</h1>
                <Badge className="bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] text-lg px-3 py-1">[{clan.tag}]</Badge>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-6 max-w-2xl">{clan.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                        <Star size={12}/> Seviye
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">{clan.level}</div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                        <Trophy size={12}/> Skor
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">{clan.score.toLocaleString()}</div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                        <Users size={12}/> Üyeler
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">{clan.members.length} / 15</div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs mb-1 uppercase tracking-wider font-semibold">
                        <Target size={12}/> Kasa
                    </div>
                    <div className="text-xl font-bold text-yellow-500">${(clan.balance/1000).toFixed(1)}k</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-6">Klan Üyeleri</h2>
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
                  <TableRow key={member.username} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <TableCell>
                      <Link href={`/oyuncu/${member.username}`} className="flex items-center gap-3 hover:text-emerald-400 transition-colors">
                        <MinecraftAvatar username={member.username} size={32} />
                        <span className="font-medium text-[var(--text-primary)]">{member.username}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={roleColors[member.role]}>{member.role}</Badge>
                    </TableCell>
                    <TableCell className="text-[var(--text-secondary)] text-sm">{member.joined}</TableCell>
                    <TableCell className="text-right">
                        {member.status === 'online' ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Çevrimiçi
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-gray-500"></span> Çevrimdışı
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
