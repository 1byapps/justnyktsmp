"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Plus, Check } from "lucide-react";

interface RoleData { id: string; name: string; displayName: string; description: string | null; color: string | null; priority: number; permissionCount: number; }
interface PermissionData { id: string; key: string; displayName: string; category: string; }

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/roles"); const data = await res.json(); if (data.success) { setRoles(data.data?.roles || []); setPermissions(data.data?.permissions || []); } } catch { /* empty */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const permissionsByCategory = permissions.reduce<Record<string, PermissionData[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Rol Yönetimi</h1><p className="text-sm text-[var(--text-secondary)] mt-1">Roller ve yetkileri yönetin</p></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)]"><Plus className="h-4 w-4" /> Yeni Rol</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider px-1">Roller</h3>
          {loading ? Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-16 rounded-lg skeleton-shimmer" />)) :
            roles.sort((a, b) => b.priority - a.priority).map((role) => (
              <button key={role.id} onClick={() => { setSelectedRole(role.id); setRolePermissions([]); }}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedRole === role.id ? "bg-[var(--bg-tertiary)] border-[var(--accent-primary)]" : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color || "#71717a" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] text-sm">{role.displayName}</p>
                    <p className="text-xs text-[var(--text-tertiary)] truncate">{role.description || role.name}</p>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded">{role.permissionCount}</span>
                </div>
              </button>
            ))
          }
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 space-y-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Yetkiler</h3>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {perms.map((perm) => {
                      const isGranted = rolePermissions.includes(perm.key);
                      return (
                        <button key={perm.id} onClick={() => setRolePermissions((rp) => isGranted ? rp.filter((k) => k !== perm.key) : [...rp, perm.key])}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-colors ${isGranted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"}`}>
                          <div className={`w-4 h-4 rounded flex items-center justify-center ${isGranted ? "bg-emerald-500" : "bg-[var(--bg-tertiary)]"}`}>
                            {isGranted && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span>{perm.displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-12 text-center">
              <Shield className="h-10 w-10 text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-[var(--text-secondary)]">Yetkileri görüntülemek için bir rol seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
