"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";

interface ProductData { id: string; name: string; slug: string; imageUrl: string | null; price: number; discountPrice: number | null; categoryName: string; isVisible: boolean; inStock: boolean; }

export default function AdminMarketPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/products"); const data = await res.json(); if (data.success) setProducts(data.data?.items || []); } catch { /* empty */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Mağaza Yönetimi</h1><p className="text-sm text-[var(--text-secondary)] mt-1">{products.length} ürün</p></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)]"><Plus className="h-4 w-4" /> Yeni Ürün</button>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Ürün</th>
              <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kategori</th>
              <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">Fiyat</th>
              <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Görünürlük</th>
              <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Stok</th>
              <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)]">{Array.from({ length: 6 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>))}</tr>
              )) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]"><Package className="h-8 w-8" /><p>Henüz ürün eklenmemiş.</p></div></td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded bg-[var(--bg-tertiary)] flex items-center justify-center">{p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover" /> : <Package className="h-5 w-5 text-[var(--text-tertiary)]" />}</div><div><p className="font-medium text-[var(--text-primary)]">{p.name}</p><p className="text-xs text-[var(--text-tertiary)]">/{p.slug}</p></div></div></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{p.categoryName}</td>
                  <td className="px-4 py-3 text-right">{p.discountPrice ? (<><span className="line-through text-[var(--text-tertiary)] text-xs mr-1">{p.price.toFixed(2)}₺</span><span className="text-emerald-400 font-medium">{p.discountPrice.toFixed(2)}₺</span></>) : (<span className="font-medium text-[var(--text-primary)]">{p.price.toFixed(2)}₺</span>)}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex px-2 py-0.5 rounded text-xs ${p.isVisible ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>{p.isVisible ? "Görünür" : "Gizli"}</span></td>
                  <td className="px-4 py-3 text-center hidden md:table-cell"><span className={`inline-flex px-2 py-0.5 rounded text-xs ${p.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{p.inStock ? "Stokta" : "Tükendi"}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"><Edit className="h-4 w-4" /></button><button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">{p.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
