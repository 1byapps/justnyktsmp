import { Metadata } from 'next';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Search, Shield, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';

export const metadata: Metadata = {
  title: 'Klanlar | JustNyktSMP',
};

// Mock data
const mockClans = Array.from({ length: 12 }).map((_, i) => ({
  name: `Clan ${i + 1}`,
  tag: `TAG${i + 1}`,
  owner: `Owner_${i + 1}`,
  members: Math.floor(Math.random() * 20) + 5,
  level: Math.floor(Math.random() * 10) + 1,
  score: Math.floor(Math.random() * 10000),
  rank: i + 1,
})).sort((a, b) => b.score - a.score);

export default function ClansPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-2">Klan Sıralaması</h1>
            <p className="text-[var(--text-secondary)]">Sunucunun en güçlü klanları ve istatistikleri.</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <Input 
              type="text" 
              placeholder="Klan veya TAG ara..." 
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border)]"
            />
          </div>
        </div>

        {/* Top 3 Podium Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 hidden sm:grid">
            {/* 2nd Place */}
            <div className="bg-[var(--bg-elevated)] border-2 border-gray-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-6 shadow-sm">
                <div className="w-16 h-16 bg-gray-400/20 text-gray-400 rounded-full flex items-center justify-center font-bold text-xl mb-4">#2</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">[{mockClans[1]?.tag}] {mockClans[1]?.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">Skor: {mockClans[1]?.score.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]"><Users size={14}/> {mockClans[1]?.members} Üye</div>
            </div>
            {/* 1st Place */}
            <div className="bg-[var(--bg-elevated)] border-2 border-yellow-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative z-10">
                <div className="absolute -top-4 text-yellow-500"><Trophy size={32} /></div>
                <div className="w-20 h-20 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center font-bold text-3xl mb-4">#1</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">[{mockClans[0]?.tag}] {mockClans[0]?.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">Skor: {mockClans[0]?.score.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]"><Users size={14}/> {mockClans[0]?.members} Üye</div>
            </div>
            {/* 3rd Place */}
            <div className="bg-[var(--bg-elevated)] border-2 border-amber-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-10 shadow-sm">
                <div className="w-16 h-16 bg-amber-700/20 text-amber-700 rounded-full flex items-center justify-center font-bold text-xl mb-4">#3</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">[{mockClans[2]?.tag}] {mockClans[2]?.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">Skor: {mockClans[2]?.score.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]"><Users size={14}/> {mockClans[2]?.members} Üye</div>
            </div>
        </div>

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
                {mockClans.map((clan, i) => (
                  <TableRow key={clan.name} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <TableCell className="text-center font-bold text-[var(--text-secondary)]">{i + 1}</TableCell>
                    <TableCell>
                      <Link href={`/klanlar/${clan.tag.toLowerCase()}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-emerald-500 transition-colors">
                            <Shield size={16} />
                        </div>
                        <div>
                            <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">{clan.name}</span>
                            <span className="text-sm text-[var(--text-tertiary)] ml-2">[{clan.tag}]</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/oyuncu/${clan.owner}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                        <MinecraftAvatar username={clan.owner} size={24} />
                        <span className="text-sm text-[var(--text-secondary)]">{clan.owner}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center font-medium text-[var(--text-primary)]">{clan.level}</TableCell>
                    <TableCell className="text-center text-[var(--text-secondary)]">{clan.members}</TableCell>
                    <TableCell className="text-right font-medium text-[var(--text-primary)]">{clan.score.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t border-[var(--border)] flex justify-center bg-[var(--bg-secondary)]">
            <Pagination currentPage={1} totalPages={3} />
          </div>
        </div>

      </div>
    </div>
  );
}
