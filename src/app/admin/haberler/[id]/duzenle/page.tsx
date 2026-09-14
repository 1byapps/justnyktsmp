"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminNewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "",
    categoryId: "",
    authorName: "",
    status: "DRAFT",
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  const fetchArticle = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/news/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        setForm({
          title: item.title || "",
          slug: item.slug || "",
          summary: item.summary || "",
          content: item.content || "",
          coverImage: item.coverImage || "",
          categoryId: item.categoryId || "",
          authorName: item.authorName || "",
          status: item.status || "DRAFT",
          tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
          seoTitle: item.seoTitle || "",
          seoDescription: item.seoDescription || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleSubmit = async (newStatus?: string) => {
    setSaving(true);
    try {
      const statusToSave = newStatus || form.status;
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: statusToSave,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/haberler");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      router.push("/admin/haberler");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-48 rounded skeleton-shimmer" />
        <div className="h-96 rounded-xl border border-[var(--border)] skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/haberler"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Haberlere Dön
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Sil
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={saving}
            onClick={() => handleSubmit()}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Kaydet
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={saving}
            onClick={() => handleSubmit("PUBLISHED")}
            leftIcon={<Send className="h-4 w-4" />}
          >
            Yayınla
          </Button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
          Haberi Düzenle
        </h2>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Başlık</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Özet</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5">İçerik (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={12}
            className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-y"
          />
        </div>
      </div>
    </div>
  );
}
