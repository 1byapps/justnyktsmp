"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MoreVertical, Ban, Shield, Coins, ExternalLink, X, Check, AlertCircle, UserCheck } from "lucide-react";
import Link from "next/link";

interface Player {
  id: string;
  uuid: string;
  username: string;
  rankName: string | null;
  balance: number;
  playtimeMinutes: number;
  lastSeenAt: string;
  isOnline: boolean;
  hasPunishment: boolean;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Manage Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<"balance" | "rank" | "punish">("balance");
  const [newBalance, setNewBalance] = useState<string>("");
  const [selectedRank, setSelectedRank] = useState<string>("");
  const [punishType, setPunishType] = useState<"BAN" | "MUTE" | "KICK">("BAN");
  const [punishReason, setPunishReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const pageSize = 20;

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/players?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setPlayers(data.data.items || []);
        setTotal(data.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch players:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const openManageModal = (player: Player) => {
    setSelectedPlayer(player);
    setNewBalance(player.balance.toString());
    setSelectedRank(player.rankName || "Oyuncu");
    setPunishType("BAN");
    setPunishReason("");
    setActionMessage(null);
    setActiveTab("balance");
  };

  const handleUpdateBalance = async () => {
    if (!selectedPlayer) return;
    const num = parseFloat(newBalance);
    if (isNaN(num)) {
      setActionMessage({ type: "error", text: "Lütfen geçerli bir sayı girin." });
      return;
    }

    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/players", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPlayer.id, balance: num }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Bakiye başarıyla güncellendi!" });
        setSelectedPlayer({ ...selectedPlayer, balance: num });
        setPlayers(players.map((p) => (p.id === selectedPlayer.id ? { ...p, balance: num } : p)));
      } else {
        setActionMessage({ type: "error", text: data.error || "Güncelleme başarısız." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRank = async () => {
    if (!selectedPlayer) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/players", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPlayer.id, rankName: selectedRank }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Rütbe başarıyla güncellendi!" });
        setSelectedPlayer({ ...selectedPlayer, rankName: selectedRank });
        setPlayers(players.map((p) => (p.id === selectedPlayer.id ? { ...p, rankName: selectedRank } : p)));
      } else {
        setActionMessage({ type: "error", text: data.error || "Güncelleme başarısız." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePunish = async () => {
    if (!selectedPlayer) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          type: punishType,
          reason: punishReason || "Yönetici tarafından cezalandırıldı",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: `${punishType} cezası başarıyla uygulandı!` });
        setSelectedPlayer({ ...selectedPlayer, hasPunishment: true });
        setPlayers(players.map((p) => (p.id === selectedPlayer.id ? { ...p, hasPunishment: true } : p)));
      } else {
        setActionMessage({ type: "error", text: data.error || "Ceza işlemi başarısız." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!selectedPlayer) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: selectedPlayer.id, action: "unban" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Cezalar başarıyla kaldırıldı!" });
        setSelectedPlayer({ ...selectedPlayer, hasPunishment: false });
        setPlayers(players.map((p) => (p.id === selectedPlayer.id ? { ...p, hasPunishment: false } : p)));
      } else {
        setActionMessage({ type: "error", text: data.error || "İşlem başarısız." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setActionLoading(false);
    }
  };

  const formatPlaytime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}g ${hours % 24}s`;
    return `${hours}s ${mins % 60}d`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Oyuncu Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{total} oyuncu kayıtlı</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Oyuncu ara (kullanıcı adı veya UUID)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-tertiary)]/40">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Oyuncu</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">UUID</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Rütbe</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">Bakiye</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Süre</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Son Görülme</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-[var(--bg-tertiary)] animate-pulse" style={{ width: j === 0 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--text-tertiary)]">
                    {search ? "Arama sonucu bulunamadı." : "Henüz oyuncu kaydı yok."}
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://mc-heads.net/avatar/${player.username}/32`}
                          alt={player.username}
                          className="w-8 h-8 rounded bg-[var(--bg-tertiary)]"
                          loading="lazy"
                        />
                        <div>
                          <Link href={`/oyuncu/${player.username}`} className="font-semibold text-[var(--text-primary)] hover:text-emerald-400 transition-colors">
                            {player.username}
                          </Link>
                          {player.hasPunishment && (
                            <span className="block text-[10px] text-red-400 font-bold">CEZALI</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] text-xs font-mono hidden lg:table-cell">
                      {player.uuid.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-[var(--bg-tertiary)] text-emerald-400 border border-emerald-500/20 font-medium">
                        {player.rankName || "Oyuncu"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                      {player.balance.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden md:table-cell">
                      {formatPlaytime(player.playtimeMinutes)}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell text-xs">
                      {formatDate(player.lastSeenAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${player.isOnline ? "text-emerald-400" : "text-[var(--text-tertiary)]"}`}>
                        <span className={`w-2 h-2 rounded-full ${player.isOnline ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                        {player.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openManageModal(player)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-emerald-600 hover:text-white text-[var(--text-primary)] text-xs font-semibold border border-[var(--border)] hover:border-emerald-500 transition-all shadow-sm active:scale-95"
                        title="Oyuncuyu Yönet"
                      >
                        <span>Yönet</span>
                        <MoreVertical className="h-3.5 w-3.5 opacity-70" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-tertiary)]/20">
            <p className="text-sm text-[var(--text-tertiary)]">
              {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50"
              >
                Önceki
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Player Management Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <img
                  src={`https://mc-heads.net/avatar/${selectedPlayer.username}/44`}
                  alt={selectedPlayer.username}
                  className="w-11 h-11 rounded-lg border border-emerald-500/40 bg-[var(--bg-tertiary)]"
                />
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    {selectedPlayer.username}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selectedPlayer.isOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                      {selectedPlayer.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                    </span>
                  </h2>
                  <p className="text-xs text-[var(--text-tertiary)] font-mono">{selectedPlayer.uuid}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notification alert if present */}
            {actionMessage && (
              <div className={`p-3 text-xs flex items-center gap-2 border-b ${actionMessage.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {actionMessage.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
              <button
                onClick={() => { setActiveTab("balance"); setActionMessage(null); }}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === "balance" ? "border-emerald-500 text-emerald-400 bg-[var(--bg-tertiary)]/50" : "border-transparent text-[var(--text-secondary)] hover:text-white"}`}
              >
                <Coins className="h-3.5 w-3.5" /> Bakiye
              </button>
              <button
                onClick={() => { setActiveTab("rank"); setActionMessage(null); }}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === "rank" ? "border-emerald-500 text-emerald-400 bg-[var(--bg-tertiary)]/50" : "border-transparent text-[var(--text-secondary)] hover:text-white"}`}
              >
                <Shield className="h-3.5 w-3.5" /> Rütbe
              </button>
              <button
                onClick={() => { setActiveTab("punish"); setActionMessage(null); }}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === "punish" ? "border-red-500 text-red-400 bg-[var(--bg-tertiary)]/50" : "border-transparent text-[var(--text-secondary)] hover:text-white"}`}
              >
                <Ban className="h-3.5 w-3.5" /> Ceza & Ban
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-4">
              {activeTab === "balance" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-secondary)]">Mevcut Bakiye:</span>
                    <span className="font-mono text-base font-bold text-emerald-400">{selectedPlayer.balance.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Yeni Bakiye Miktarı (₺)</label>
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[10000, 50000, 100000, 0].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setNewBalance(amount === 0 ? "0" : (selectedPlayer.balance + amount).toString())}
                        className="py-1.5 px-2 text-xs rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-white transition-colors"
                      >
                        {amount === 0 ? "Sıfırla" : `+${amount.toLocaleString("tr-TR")}`}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleUpdateBalance}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    <span>{actionLoading ? "Kaydediliyor..." : "Bakiyeyi Güncelle"}</span>
                  </button>
                </div>
              )}

              {activeTab === "rank" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-secondary)]">Mevcut Rütbe:</span>
                    <span className="text-xs px-2.5 py-1 rounded bg-[var(--bg-tertiary)] font-bold text-emerald-400 border border-emerald-500/30">
                      {selectedPlayer.rankName || "Oyuncu"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Yeni Rütbe Seçin</label>
                    <select
                      value={selectedRank}
                      onChange={(e) => setSelectedRank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Oyuncu">Oyuncu (Varsayılan)</option>
                      <option value="VIP">VIP</option>
                      <option value="VIP+">VIP+</option>
                      <option value="MVP">MVP</option>
                      <option value="MVP+">MVP+</option>
                      <option value="Rehber">Rehber</option>
                      <option value="Moderatör">Moderatör</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <button
                    onClick={handleUpdateRank}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{actionLoading ? "Güncelleniyor..." : "Rütbeyi Onayla ve Değiştir"}</span>
                  </button>
                </div>
              )}

              {activeTab === "punish" && (
                <div className="space-y-4">
                  {selectedPlayer.hasPunishment && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Bu oyuncunun aktif bir cezası bulunmaktadır.</span>
                      </div>
                      <button
                        onClick={handleUnban}
                        disabled={actionLoading}
                        className="px-2.5 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shrink-0"
                      >
                        Cezayı Kaldır
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Ceza Türü</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["BAN", "MUTE", "KICK"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPunishType(t)}
                          className={`py-2 text-xs rounded-lg font-bold border transition-colors ${punishType === t ? "bg-red-600 text-white border-red-500" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:text-white"}`}
                        >
                          {t === "BAN" ? "Yasakla (Ban)" : t === "MUTE" ? "Sustur (Mute)" : "Sunucudan At (Kick)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Ceza Nedeni</label>
                    <input
                      type="text"
                      placeholder="Örn: Hile kullanımı, Küfür, Kurallara uymama..."
                      value={punishReason}
                      onChange={(e) => setPunishReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    onClick={handlePunish}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-md shadow-red-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Ban className="h-4 w-4" />
                    <span>{actionLoading ? "Uygulanıyor..." : `${punishType} Cezasını Uygula`}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-between">
              <Link
                href={`/oyuncu/${selectedPlayer.username}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Web Profilini Aç</span>
              </Link>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
