"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, Edit, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WikiArticle {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  isPublished: boolean;
  updatedAt: string;
}

export default function AdminWikiPage() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/wiki?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data?.items || []);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Wiki Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Rehberler, komutlar ve sistem dökümantasyonunu yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Yeni Makale
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Makale ara..."
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
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Başlık</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kategori</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Yayın Durumu</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Son Güncelleme</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
                      <BookOpen className="h-8 w-8" />
                      <p>Henüz wiki makalesi oluşturulmamış.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">/{item.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{item.categoryName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${item.isPublished ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {item.isPublished ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.isPublished ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{formatDate(item.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
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
