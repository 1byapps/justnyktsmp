"use client";

import { useState } from "react";
import { Server, Wifi, WifiOff, AlertTriangle, Save } from "lucide-react";

export default function AdminServerPage() {
  const [settings, setSettings] = useState({
    serverIp: "schmidt-scanners.tun.ply.gg",
    displayAddress: "schmidt-scanners.tun.ply.gg",
    serverVersion: "1.21.4 (Tüm Sürümler)",
    maxPlayers: 100,
    motd: "JustNyktSMP - Normal SMP",
    discordUrl: "https://discord.gg/justnyktsmp",
    maintenanceMode: false,
  });
  const [saving, setSaving] = useState(false);
  const [serverOnline] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch { /* empty */ } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Sunucu Yönetimi</h1></div>

      {/* Server Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex items-center gap-3">
          {serverOnline ? <Wifi className="h-5 w-5 text-emerald-400" /> : <WifiOff className="h-5 w-5 text-red-400" />}
          <div><p className="text-xs text-[var(--text-tertiary)]">Durum</p><p className={`font-medium ${serverOnline ? "text-emerald-400" : "text-red-400"}`}>{serverOnline ? "Çevrimiçi" : "Çevrimdışı"}</p></div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4"><p className="text-xs text-[var(--text-tertiary)]">TPS</p><p className="font-medium text-[var(--text-primary)]">—</p></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4"><p className="text-xs text-[var(--text-tertiary)]">RAM</p><p className="font-medium text-[var(--text-primary)]">—</p></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4"><p className="text-xs text-[var(--text-tertiary)]">CPU</p><p className="font-medium text-[var(--text-primary)]">—</p></div>
      </div>

      {/* Maintenance Mode */}
      <div className={`border rounded-lg p-5 ${settings.maintenanceMode ? "bg-amber-500/5 border-amber-500/30" : "bg-[var(--bg-secondary)] border-[var(--border)]"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${settings.maintenanceMode ? "text-amber-400" : "text-[var(--text-tertiary)]"}`} />
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Bakım Modu</h3>
              <p className="text-sm text-[var(--text-secondary)]">Aktif olduğunda normal kullanıcılar bakım sayfasını görür.</p>
            </div>
          </div>
          <button onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? "bg-amber-500" : "bg-[var(--bg-tertiary)]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Sunucu Ayarları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Sunucu IP</label>
            <input type="text" value={settings.serverIp} onChange={(e) => setSettings((s) => ({ ...s, serverIp: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Görüntü Adresi</label>
            <input type="text" value={settings.displayAddress} onChange={(e) => setSettings((s) => ({ ...s, displayAddress: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Sürüm</label>
            <input type="text" value={settings.serverVersion} onChange={(e) => setSettings((s) => ({ ...s, serverVersion: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Maksimum Oyuncu</label>
            <input type="number" value={settings.maxPlayers} onChange={(e) => setSettings((s) => ({ ...s, maxPlayers: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">MOTD</label>
            <input type="text" value={settings.motd} onChange={(e) => setSettings((s) => ({ ...s, motd: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Discord URL</label>
            <input type="url" value={settings.discordUrl} onChange={(e) => setSettings((s) => ({ ...s, discordUrl: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]" />
          </div>
        </div>
        <div className="pt-2">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
