"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ShoppingCart } from "lucide-react";

interface OrderData { id: string; username: string; mcUsername: string; itemCount: number; total: number; status: string; paymentStatus: string; createdAt: string; }

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Ödeme Bekleniyor", class: "bg-amber-500/20 text-amber-400" },
  PAID: { label: "Ödendi", class: "bg-emerald-500/20 text-emerald-400" },
  DELIVERED: { label: "Teslim Edildi", class: "bg-blue-500/20 text-blue-400" },
  CANCELLED: { label: "İptal", class: "bg-red-500/20 text-red-400" },
  REFUNDED: { label: "İade", class: "bg-purple-500/20 text-purple-400" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch(`/api/admin/orders?status=${statusFilter}`); const data = await res.json(); if (data.success) setOrders(data.data?.items || []); } catch { /* empty */ } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Sipariş Yönetimi</h1></div>
      <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-1 overflow-x-auto max-w-max">
        {["all", "PENDING", "PAID", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${statusFilter === s ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
            {s === "all" ? "Tümü" : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Sipariş</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kullanıcı</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">MC Adı</th>
              <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">Tutar</th>
              <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Tarih</th>
              <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlem</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)]">{Array.from({ length: 7 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>))}</tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12"><div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]"><ShoppingCart className="h-8 w-8" /><p>Sipariş bulunamadı.</p></div></td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-xs text-[var(--text-primary)]">#{order.id.slice(0, 8)}</span><span className="text-xs text-[var(--text-tertiary)] ml-2">{order.itemCount} ürün</span></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{order.username}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{order.mcUsername}</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)]">{order.total.toFixed(2)}₺</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex px-2 py-0.5 rounded text-xs ${STATUS_MAP[order.status]?.class || ""}`}>{STATUS_MAP[order.status]?.label || order.status}</span></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-right"><button className="px-2.5 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">Detay</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
