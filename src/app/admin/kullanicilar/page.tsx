"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, UserCog, ShieldCheck } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&pageSize=${pageSize}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data?.items || []);
        setTotal(data.data?.total || 0);
      }
    } catch { /* empty */ } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / pageSize);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{total} kayıtlı kullanıcı</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <input type="text" placeholder="Kullanıcı ara..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]" />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">E-posta</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Roller</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kayıt</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Son Giriş</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--text-tertiary)]">Kullanıcı bulunamadı.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{user.username}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.map((role) => (
                          <span key={role} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[var(--accent-primary-muted)] text-[var(--accent-primary)]">
                            <ShieldCheck className="h-3 w-3" />{role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${user.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {user.isActive ? "Aktif" : "Devre Dışı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors" aria-label="Düzenle">
                        <UserCog className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-tertiary)]">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-50">Önceki</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-50">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
