'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LifeBuoy, Plus, MessageSquare, Clock } from 'lucide-react';

interface TicketItem {
  id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

const STATUS_MAP: Record<string, { label: string; variant: "blue" | "amber" | "purple" | "emerald" | "gray" }> = {
  OPEN: { label: 'Açık', variant: 'blue' },
  IN_REVIEW: { label: 'İnceleniyor', variant: 'amber' },
  WAITING_USER: { label: 'Yanıtınız Bekleniyor', variant: 'purple' },
  RESOLVED: { label: 'Çözüldü', variant: 'emerald' },
  CLOSED: { label: 'Kapatıldı', variant: 'gray' },
};

const CATEGORY_MAP: Record<string, string> = {
  TECHNICAL: 'Teknik Sorun',
  PURCHASE: 'Satın Alım',
  PLAYER_REPORT: 'Oyuncu Şikayeti',
  BAN_APPEAL: 'Ban İtirazı',
  BUG_REPORT: 'Bug Bildirimi',
  OTHER: 'Diğer',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setTickets(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl mt-12 min-h-[70vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Destek Talepleri</h1>
          <p className="text-[var(--text-secondary)] mt-1">Sorunlarınızı ve taleplerinizi buradan takip edin.</p>
        </div>
        <Button href="/destek/yeni" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Talep Oluştur
        </Button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {tickets.map((t) => {
              const statusInfo = STATUS_MAP[t.status] || { label: t.status, variant: 'gray' as const };
              return (
                <Link
                  key={t.id}
                  href={`/destek/${t.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-[var(--bg-tertiary)]/60 transition-colors gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[var(--accent-primary)] font-medium">
                        {CATEGORY_MAP[t.category] || t.category}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-mono">
                        #{t.id.slice(0, 8)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors text-base">
                      {t.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] shrink-0">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(t.updatedAt || t.createdAt)}</span>
                    </div>
                    {t._count && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{t._count.messages} mesaj</span>
                      </div>
                    )}
                    <Badge variant={statusInfo.variant} dot>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 px-4">
            <EmptyState
              icon={<LifeBuoy className="h-10 w-10 text-[var(--accent-primary)]" />}
              title="Açık destek talebin bulunmuyor"
              description="Herhangi bir sorununuz veya isteğiniz varsa yeni bir talep oluşturabilirsiniz."
              action={{ label: 'Yeni Talep Oluştur', href: '/destek/yeni' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
