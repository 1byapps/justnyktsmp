"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TicketData {
  id: string;
  subject: string;
  username: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  OPEN: { label: "Açık", class: "bg-blue-500/20 text-blue-400" },
  IN_REVIEW: { label: "İnceleniyor", class: "bg-amber-500/20 text-amber-400" },
  WAITING_USER: { label: "Yanıt Bekleniyor", class: "bg-purple-500/20 text-purple-400" },
  RESOLVED: { label: "Çözüldü", class: "bg-emerald-500/20 text-emerald-400" },
  CLOSED: { label: "Kapatıldı", class: "bg-gray-500/20 text-gray-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  TECHNICAL: "Teknik Sorun", PURCHASE: "Satın Alım", PLAYER_REPORT: "Oyuncu Şikayeti",
  BAN_APPEAL: "Ban İtirazı", BUG_REPORT: "Bug Bildirimi", OTHER: "Diğer",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets?status=${statusFilter}&search=${search}`);
      const data = await res.json();
      if (data.success) setTickets(data.data?.items || []);
    } catch { /* empty */ } finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Destek Talepleri</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Tüm destek taleplerini yönetin</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input type="text" placeholder="Ticket ara..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]" />
        </div>
        <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-1 overflow-x-auto">
          {["all", "OPEN", "IN_REVIEW", "WAITING_USER", "RESOLVED", "CLOSED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${statusFilter === s ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
              {s === "all" ? "Tümü" : STATUS_LABELS[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium w-12">#</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Konu</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Tarih</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>
                    ))}
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--text-tertiary)]">Destek talebi bulunamadı.</td></tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3 text-[var(--text-tertiary)] font-mono text-xs">{ticket.id.slice(0, 6)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/ticketlar/${ticket.id}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{ticket.username}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{CATEGORY_LABELS[ticket.category] || ticket.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${STATUS_LABELS[ticket.status]?.class || ""}`}>
                        {STATUS_LABELS[ticket.status]?.label || ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/ticketlar/${ticket.id}`}
                          className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                        <Link href={`/destek/${ticket.id}`}
                          className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
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
