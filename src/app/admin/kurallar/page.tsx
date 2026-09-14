"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RuleItem {
  id: string;
  ruleNumber: number;
  title: string;
  content: string;
  categoryName: string;
  isActive: boolean;
}

export default function AdminRulesPage() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rules");
      const data = await res.json();
      if (data.success) {
        setRules(data.data?.items || []);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sunucu Kuralları Yönetimi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Kural kategorileri ve kuralları düzenleyin, ekleyin veya kaldırın
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Yeni Kural Ekle
          </Button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium w-16">#</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium">Kural Başlığı</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-[var(--text-tertiary)] font-medium hidden lg:table-cell">Açıklama</th>
                <th className="text-center px-4 py-3 text-[var(--text-tertiary)] font-medium">Durum</th>
                <th className="text-right px-4 py-3 text-[var(--text-tertiary)] font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded skeleton-shimmer" style={{ width: "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
                      <Shield className="h-8 w-8" />
                      <p>Kural bulunamadı.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[var(--accent-primary)]">
                      §{rule.ruleNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {rule.title}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">
                      {rule.categoryName}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)] max-w-xs truncate hidden lg:table-cell">
                      {rule.content}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${rule.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {rule.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                          {rule.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
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
