"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Search } from 'lucide-react';
import Link from 'next/link';

const categories = ['Para', 'Oynama Süresi', 'Öldürme', 'Ölüm', 'K/D', 'Görev', 'Seviye', 'Klan', 'Blok Kırma', 'Balık Tutma'];

// Mock data
const mockData = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 1,
  username: `Player_${i + 1}`,
  value: Math.floor(Math.random() * 1000000),
  clan: i % 3 === 0 ? 'ELITE' : i % 5 === 0 ? 'NOVA' : null,
}));

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('Para');
  const [search, setSearch] = useState('');

  const filteredData = mockData.filter(d => d.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-2">Sıralama</h1>
            <p className="text-[var(--text-secondary)]">Sunucunun en iyileri burada listelenir.</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <Input 
              type="text" 
              placeholder="Oyuncu ara..." 
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories (Horizontal Scrollable) */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--bg-secondary)]">
                <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                  <TableHead className="w-16 text-center text-[var(--text-secondary)]">#</TableHead>
                  <TableHead className="w-20"></TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Oyuncu</TableHead>
                  <TableHead className="text-[var(--text-secondary)]">Klan</TableHead>
                  <TableHead className="text-right text-[var(--text-secondary)]">Değer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.username} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <TableCell className="text-center font-bold">
                      {row.rank === 1 ? <span className="text-yellow-500 text-lg">1</span> :
                       row.rank === 2 ? <span className="text-gray-400 text-lg">2</span> :
                       row.rank === 3 ? <span className="text-amber-700 text-lg">3</span> :
                       <span className="text-[var(--text-secondary)]">{row.rank}</span>}
                    </TableCell>
                    <TableCell>
                      <MinecraftAvatar username={row.username} size={32} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/oyuncu/${row.username}`} className="font-medium text-[var(--text-primary)] hover:text-emerald-400 transition-colors">
                        {row.username}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {row.clan ? (
                        <Link href={`/klanlar/${row.clan.toLowerCase()}`} className="text-sm px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                          [{row.clan}]
                        </Link>
                      ) : <span className="text-[var(--text-tertiary)]">-</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium text-[var(--text-primary)]">
                      {activeCategory === 'Para' ? `$${row.value.toLocaleString()}` : row.value.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">Henüz sıralama verisi bulunmamaktadır.</p>
            </div>
          )}

          <div className="p-4 border-t border-[var(--border)] flex justify-center bg-[var(--bg-secondary)]">
            <Pagination currentPage={1} totalPages={5} />
          </div>
        </div>

      </div>
    </div>
  );
}
