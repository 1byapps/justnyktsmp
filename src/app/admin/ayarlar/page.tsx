"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteTitle: "JustNyktSMP | Minecraft SMP Sunucusu",
    siteDescription: "Topluluğun şekillendirdiği, rekabetin ve hayatta kalmanın bir araya geldiği modern SMP deneyimi.",
    serverIp: "play.justnyktsmp.net",
    discordUrl: "https://discord.gg/justnyktsmp",
    storeEnabled: true,
    voteEnabled: true,
    registrationsOpen: true,
    maxPlayers: 500,
    minecraftVersion: "1.21.x",
    contactEmail: "destek@justnyktsmp.net",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sistem & Site Ayarları</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Genel web sitesi ve sunucu yapılandırma parametreleri
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Genel Ayarlar */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Genel Ayarlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Site Başlığı</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Site Açıklaması (Meta)</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">İletişim E-posta</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Discord Davet Bağlantısı</label>
              <input
                type="url"
                value={settings.discordUrl}
                onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Sunucu & Modül Anahtarları */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Modül ve Özellik Anahtarları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.storeEnabled}
                onChange={(e) => setSettings({ ...settings, storeEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Mağaza Aktif</p>
                <p className="text-xs text-[var(--text-tertiary)]">Oyuncular ürün satın alabilir</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.voteEnabled}
                onChange={(e) => setSettings({ ...settings, voteEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Oy Verme Aktif</p>
                <p className="text-xs text-[var(--text-tertiary)]">Oy ödülleri ve seriler işlenir</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.registrationsOpen}
                onChange={(e) => setSettings({ ...settings, registrationsOpen: e.target.checked })}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Kayıtlar Açık</p>
                <p className="text-xs text-[var(--text-tertiary)]">Yeni kullanıcılar hesap oluşturabilir</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
              <Check className="h-4 w-4" /> Ayarlar kaydedildi
            </span>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={saving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
