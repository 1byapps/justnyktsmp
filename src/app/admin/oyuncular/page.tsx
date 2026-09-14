"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MoreVertical, Ban, Shield, Coins, Eye } from "lucide-react";
import Link from "next/link";

interface Player {
  id: string;
  uuid: string;
  username: string;
  rankName: string | null;
  balance: number;
  playtimeMinutes: number;
  lastSeenAt: string;
  isOnline: boolean;
  hasPunishment: boolean;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionPlayer, setActionPlayer] = useState<Player | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const pageSize = 20;

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/players?page=${page}&pageSize=${pageSize}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setPlayers(data.data.items || []);
        setTotal(data.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch players:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const formatPlaytime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}g ${hours % 24}s`;
    return `${hours}s ${mins % 60}d`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Oyuncu Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{total} oyuncu kayıtlı</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Oyuncu ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Oyuncu</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">UUID</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Rütbe</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">Bakiye</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Süre</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Son Görülme</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded skeleton-shimmer" style={{ width: j === 0 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--text-tertiary)]">
                    {search ? "Arama sonucu bulunamadı." : "Henüz oyuncu kaydı yok."}
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://mc-heads.net/avatar/${player.username}/32`}
                          alt={player.username}
                          className="w-8 h-8 rounded"
                          loading="lazy"
                        />
                        <Link href={`/oyuncu/${player.username}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                          {player.username}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] text-xs font-mono hidden lg:table-cell">
                      {player.uuid.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {player.rankName || "Oyuncu"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--accent-primary)]">
                      {player.balance.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden md:table-cell">
                      {formatPlaytime(player.playtimeMinutes)}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">
                      {formatDate(player.lastSeenAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${player.isOnline ? "text-emerald-400" : "text-[var(--text-tertiary)]"}`}>
                        <span className={`w-2 h-2 rounded-full ${player.isOnline ? "bg-emerald-400 animate-pulse-dot" : "bg-[var(--text-tertiary)]"}`} />
                        {player.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === player.id ? null : player.id)}
                          className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                          aria-label="İşlemler"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActions === player.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg z-20 py-1 animate-scale-in">
                            <Link
                              href={`/oyuncu/${player.username}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                            >
                              <Eye className="h-4 w-4" /> Profili Gör
                            </Link>
                            <button
                              onClick={() => { setActionPlayer(player); setShowActions(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                            >
                              <Coins className="h-4 w-4" /> Bakiye Düzenle
                            </button>
                            <button
                              onClick={() => { setActionPlayer(player); setShowActions(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                            >
                              <Shield className="h-4 w-4" /> Rütbe Değiştir
                            </button>
                            <div className="my-1 border-t border-[var(--border)]" />
                            <button
                              onClick={() => { setActionPlayer(player); setShowActions(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Ban className="h-4 w-4" /> Banla
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-tertiary)]">
              {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50"
              >
                Önceki
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {actionPlayer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setActionPlayer(null)}>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Oyuncu: {actionPlayer.username}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Bu işlem yönetici denetim kaydına işlenecektir.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActionPlayer(null)}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              >
                İptal
              </button>
              <button
                onClick={() => setActionPlayer(null)}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
