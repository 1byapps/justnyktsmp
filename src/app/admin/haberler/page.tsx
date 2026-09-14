"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  categoryName: string;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Taslak", class: "bg-gray-500/20 text-gray-400" },
  SCHEDULED: { label: "Planlandı", class: "bg-blue-500/20 text-blue-400" },
  PUBLISHED: { label: "Yayında", class: "bg-emerald-500/20 text-emerald-400" },
  ARCHIVED: { label: "Arşivlendi", class: "bg-amber-500/20 text-amber-400" },
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.success) setArticles(data.data?.items || []);
    } catch { /* empty */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

  const handleDelete = async (id: string) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      fetchNews();
    } catch { /* empty */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Haber Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{articles.length} haber</p>
        </div>
        <Link
          href="/admin/haberler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" /> Yeni Haber
        </Link>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Başlık</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Yazar</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Tarih</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: j === 0 ? "200px" : "80px" }} /></td>
                    ))}
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--text-tertiary)]">Henüz haber oluşturulmamış.</td></tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{article.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[var(--text-secondary)]">{article.categoryName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${STATUS_MAP[article.status]?.class || "bg-gray-500/20 text-gray-400"}`}>
                        {STATUS_MAP[article.status]?.label || article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{article.authorName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">
                      {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/haberler/${article.slug}`} className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors" aria-label="Önizle">
                          {article.status === "PUBLISHED" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Link>
                        <Link href={`/admin/haberler/${article.id}/duzenle`} className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors" aria-label="Düzenle">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(article.id)} className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors" aria-label="Sil">
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
