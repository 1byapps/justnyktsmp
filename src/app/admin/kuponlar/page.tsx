"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

interface CouponData { id: string; code: string; discountType: string; discountValue: number; usageCount: number; usageLimit: number | null; isActive: boolean; startsAt: string | null; expiresAt: string | null; }

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/coupons"); const data = await res.json(); if (data.success) setCoupons(data.data?.items || []); } catch { /* empty */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Kupon Yönetimi</h1></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)]"><Plus className="h-4 w-4" /> Yeni Kupon</button>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Kod</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">İndirim</th>
              <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Kullanım</th>
              <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Başlangıç</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Bitiş</th>
              <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)]">{Array.from({ length: 7 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>))}</tr>
              )) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12"><div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]"><Tag className="h-8 w-8" /><p>Henüz kupon oluşturulmamış.</p></div></td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3"><span className="font-mono font-medium text-[var(--accent-primary)]">{c.code}</span></td>
                  <td className="px-4 py-3 text-[var(--text-primary)]">{c.discountType === "PERCENTAGE" ? `%${c.discountValue}` : `${c.discountValue.toFixed(2)}₺`}</td>
                  <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex px-2 py-0.5 rounded text-xs ${c.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>{c.isActive ? "Aktif" : "Pasif"}</span></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(c.startsAt)}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(c.expiresAt)}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"><Edit className="h-4 w-4" /></button><button className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
