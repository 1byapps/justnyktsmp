"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";

export default function AdminNewsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "",
    categoryId: "",
    authorName: "",
    status: "DRAFT" as string,
    tags: "",
    seoTitle: "",
    seoDescription: "",
    scheduledAt: "",
  });

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setForm((f) => ({ ...f, title, slug }));
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/haberler");
      }
    } catch { /* empty */ } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Yeni Haber</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSubmit("DRAFT")} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50">
            <Save className="h-4 w-4" /> Taslak Kaydet
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] disabled:opacity-50">
            <Send className="h-4 w-4" /> Yayınla
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">İçerik</h2>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Başlık</label>
            <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              placeholder="Haber başlığı" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
              placeholder="haber-slug" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Kategori</label>
            <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]">
              <option value="">Kategori seçin</option>
              <option value="guncelleme">Güncelleme</option>
              <option value="etkinlik">Etkinlik</option>
              <option value="duyuru">Duyuru</option>
              <option value="bakim">Bakım</option>
              <option value="sezon">Sezon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Özet</label>
            <textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} rows={3}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent-primary)]"
              placeholder="Kısa özet..." />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">İçerik (Markdown)</label>
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={15}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] font-mono resize-y focus:outline-none focus:border-[var(--accent-primary)]"
              placeholder="Haber içeriği..." />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Detaylar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Yazar Adı</label>
              <input type="text" value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Kapak Görseli URL</label>
              <input type="url" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Etiketler (virgülle ayırın)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                placeholder="güncelleme, pvp, etkinlik" />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Zamanlama</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">SEO</h2>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">SEO Başlık</label>
            <input type="text" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">SEO Açıklama</label>
            <textarea value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} rows={2}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
