"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Search, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface ClanItem {
  id: string;
  name: string;
  tag: string;
  slug: string;
  level: number;
  score: number;
  balance: number;
  memberCount: number;
  ownerName: string;
}

export default function AdminClansPage() {
  const [clans, setClans] = useState<ClanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchClans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clans?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setClans(data.data?.items || []);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchClans();
  }, [fetchClans]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Klan Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Sunucuda kurulu klanlar, üyeler ve liderlik verileri
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Klan veya TAG ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Klan Adı</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">TAG</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Lider</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Seviye</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Üyeler</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">Skor</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : clans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
                      <Shield className="h-8 w-8" />
                      <p>Klan kaydı bulunamadı.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clans.map((clan) => (
                  <tr key={clan.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {clan.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent-primary)] font-bold">
                        [{clan.tag}]
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">
                      {clan.ownerName}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-primary)] font-semibold">
                      {clan.level}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)] hidden md:table-cell">
                      {clan.memberCount}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400">
                      {clan.score.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/klanlar/${clan.slug}`} className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
