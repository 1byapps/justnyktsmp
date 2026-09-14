"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MinecraftAvatar } from '@/components/server/MinecraftAvatar';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardItem {
  rank: number;
  username: string;
  uuid: string;
  value: number | string;
  clan: string | null;
}

const CATEGORIES = [
  { id: 'balance', label: 'Para' },
  { id: 'playtime', label: 'Oynama Süresi' },
  { id: 'kills', label: 'Öldürme' },
  { id: 'deaths', label: 'Ölüm' },
  { id: 'kd', label: 'K/D' },
  { id: 'level', label: 'Seviye' },
  { id: 'quests', label: 'Görevler' },
  { id: 'blocks', label: 'Blok Kırma' },
  { id: 'fish', label: 'Balık Tutma' },
];

function formatDisplayValue(catId: string, value: number | string): string {
  if (catId === 'balance') {
    return `₺${Number(value).toLocaleString()}`;
  }
  if (catId === 'playtime') {
    const mins = Number(value);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}s ${remMins}d`;
  }
  if (catId === 'kd') {
    return String(value);
  }
  return Number(value).toLocaleString();
}

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('balance');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          category: activeCategory,
          search: search.trim(),
        });
        const res = await fetch(`/api/leaderboard?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success && !isCancelled) {
          setItems(data.data.items || []);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchLeaderboard();
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              Oyuncu Sıralaması
            </div>
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-2">Lider Tablosu</h1>
            <p className="text-[var(--text-secondary)]">Sunucunun en aktif ve yetenekli oyuncuları.</p>
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

        {/* Categories Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--text-secondary)]">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
              <p className="text-sm">Sıralama verileri yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--bg-secondary)]">
                  <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                    <TableHead className="w-16 text-center text-[var(--text-secondary)]">#</TableHead>
                    <TableHead className="w-16 text-center text-[var(--text-secondary)]">Avatar</TableHead>
                    <TableHead className="text-[var(--text-secondary)]">Oyuncu</TableHead>
                    <TableHead className="text-[var(--text-secondary)]">Klan</TableHead>
                    <TableHead className="text-right text-[var(--text-secondary)]">
                      {CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Değer'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row) => (
                    <TableRow
                      key={row.username}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    >
                      <TableCell className="text-center font-bold">
                        {row.rank === 1 ? (
                          <span className="text-yellow-500 text-lg font-bold">1</span>
                        ) : row.rank === 2 ? (
                          <span className="text-gray-400 text-lg font-bold">2</span>
                        ) : row.rank === 3 ? (
                          <span className="text-amber-600 text-lg font-bold">3</span>
                        ) : (
                          <span className="text-[var(--text-secondary)]">{row.rank}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <MinecraftAvatar username={row.username} size={32} />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/oyuncu/${row.username}`}
                          className="font-semibold text-[var(--text-primary)] hover:text-emerald-400 transition-colors"
                        >
                          {row.username}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {row.clan ? (
                          <Link
                            href={`/klanlar/${row.clan.toLowerCase()}`}
                            className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded font-mono hover:bg-emerald-500/20 transition-colors"
                          >
                            [{row.clan}]
                          </Link>
                        ) : (
                          <span className="text-[var(--text-tertiary)] text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-400">
                        {formatDisplayValue(activeCategory, row.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)]">Bu kriterde sıralama verisi bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
