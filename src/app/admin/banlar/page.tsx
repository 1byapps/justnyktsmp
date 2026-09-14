"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Ban, Shield, AlertTriangle } from "lucide-react";

interface PunishmentData {
  id: string;
  playerName: string;
  playerUuid: string;
  type: string;
  reason: string;
  staffName: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const TYPE_MAP: Record<string, { label: string; class: string; icon: typeof Ban }> = {
  BAN: { label: "Ban", class: "bg-red-500/20 text-red-400", icon: Ban },
  TEMPBAN: { label: "Geçici Ban", class: "bg-orange-500/20 text-orange-400", icon: Ban },
  MUTE: { label: "Susturma", class: "bg-amber-500/20 text-amber-400", icon: AlertTriangle },
  TEMPMUTE: { label: "Geçici Susturma", class: "bg-yellow-500/20 text-yellow-400", icon: AlertTriangle },
  KICK: { label: "Atma", class: "bg-blue-500/20 text-blue-400", icon: Shield },
  WARNING: { label: "Uyarı", class: "bg-gray-500/20 text-gray-400", icon: AlertTriangle },
};

export default function AdminBansPage() {
  const [punishments, setPunishments] = useState<PunishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [search, setSearch] = useState("");

  const fetchPunishments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/punishments?filter=${filter}&search=${search}`);
      const data = await res.json();
      if (data.success) setPunishments(data.data?.items || []);
    } catch { /* empty */ } finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { fetchPunishments(); }, [fetchPunishments]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ceza Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Ban, susturma ve uyarı kayıtları</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
          <Ban className="h-4 w-4" /> Yeni Ceza
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input type="text" placeholder="Oyuncu ara..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]" />
        </div>
        <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-1">
          {(["all", "active", "expired"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${filter === f ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {f === "all" ? "Tümü" : f === "active" ? "Aktif" : "Süresi Dolmuş"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Oyuncu</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Tür</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Sebep</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Yetkili</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Tarih</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Bitiş</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>
                    ))}
                  </tr>
                ))
              ) : punishments.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[var(--text-tertiary)]">Ceza kaydı bulunamadı.</td></tr>
              ) : (
                punishments.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={`https://mc-heads.net/avatar/${p.playerName}/24`} alt="" className="w-6 h-6 rounded" />
                        <span className="font-medium text-[var(--text-primary)]">{p.playerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${TYPE_MAP[p.type]?.class || ""}`}>
                        {TYPE_MAP[p.type]?.label || p.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs truncate hidden md:table-cell">{p.reason}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{p.staffName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{p.expiresAt ? formatDate(p.expiresAt) : "Süresiz"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${p.isActive ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {p.isActive ? "Aktif" : "Sona Erdi"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.isActive && (
                        <button className="px-2.5 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
                          Kaldır
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
