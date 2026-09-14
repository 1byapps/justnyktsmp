"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, FileText, Filter } from "lucide-react";

interface LogEntry { id: string; adminName: string; action: string; targetType: string | null; targetId: string | null; details: Record<string, unknown> | null; ipAddress: string | null; createdAt: string; }

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&pageSize=${pageSize}&search=${search}&action=${actionFilter}`);
      const data = await res.json();
      if (data.success) { setLogs(data.data?.items || []); setTotal(data.data?.total || 0); }
    } catch { /* empty */ } finally { setLoading(false); }
  }, [page, search, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (d: string) => new Date(d).toLocaleString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const totalPages = Math.ceil(total / pageSize);

  const actionColors: Record<string, string> = {
    LOGIN: "text-blue-400", LOGOUT: "text-gray-400", BAN: "text-red-400", UNBAN: "text-emerald-400",
    RANK_CHANGE: "text-purple-400", BALANCE_CHANGE: "text-amber-400", NEWS_CREATE: "text-emerald-400",
    NEWS_UPDATE: "text-blue-400", NEWS_DELETE: "text-red-400", SETTINGS_UPDATE: "text-amber-400",
    TICKET_REPLY: "text-blue-400", TICKET_CLOSE: "text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Denetim Logları</h1><p className="text-sm text-[var(--text-secondary)] mt-1">Tüm yönetici işlemleri</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input type="text" placeholder="Admin veya hedef ara..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]" />
        </div>
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]">
          <option value="">Tüm İşlemler</option>
          <option value="LOGIN">Giriş</option><option value="BAN">Ban</option><option value="UNBAN">Unban</option>
          <option value="RANK_CHANGE">Rütbe Değişikliği</option><option value="BALANCE_CHANGE">Bakiye Değişikliği</option>
          <option value="NEWS_CREATE">Haber Oluşturma</option><option value="SETTINGS_UPDATE">Ayar Güncelleme</option>
          <option value="TICKET_REPLY">Ticket Yanıtı</option>
        </select>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Admin</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlem</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Hedef</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Detay</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Zaman</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">IP</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)]">{Array.from({ length: 6 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: j === 0 ? "100px" : "80px" }} /></td>))}</tr>
              )) : logs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]"><FileText className="h-8 w-8" /><p>Log kaydı bulunamadı.</p></div></td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{log.adminName}</td>
                  <td className="px-4 py-3"><span className={`font-mono text-xs ${actionColors[log.action] || "text-[var(--text-secondary)]"}`}>{log.action}</span></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{log.targetType ? `${log.targetType}${log.targetId ? `:${log.targetId.slice(0, 6)}` : ""}` : "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)] text-xs max-w-xs truncate hidden lg:table-cell">{log.details ? JSON.stringify(log.details) : "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)] font-mono text-xs hidden lg:table-cell">{log.ipAddress || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-tertiary)]">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-50">Önceki</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-50">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
