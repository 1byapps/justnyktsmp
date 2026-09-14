"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Clock, User, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Message {
  id: string;
  content: string;
  isStaffReply: boolean;
  createdAt: string;
  user: {
    username: string;
    image: string | null;
  };
}

interface TicketDetail {
  id: string;
  subject: string;
  category: string;
  status: string;
  mcUsername: string | null;
  createdAt: string;
  messages: Message[];
}

const STATUS_LABELS: Record<string, { label: string; variant: "blue" | "amber" | "purple" | "emerald" | "gray" }> = {
  OPEN: { label: "Açık", variant: "blue" },
  IN_REVIEW: { label: "İnceleniyor", variant: "amber" },
  WAITING_USER: { label: "Yanıtınız Bekleniyor", variant: "purple" },
  RESOLVED: { label: "Çözüldü", variant: "emerald" },
  CLOSED: { label: "Kapatıldı", variant: "gray" },
};

const CATEGORY_NAMES: Record<string, string> = {
  TECHNICAL: "Teknik Sorun",
  PURCHASE: "Satın Alım",
  PLAYER_REPORT: "Oyuncu Şikayeti",
  BAN_APPEAL: "Ban İtirazı",
  BUG_REPORT: "Bug Bildirimi",
  OTHER: "Diğer",
};

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();
      if (data.success) {
        setTicket(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyContent("");
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <div className="h-8 w-48 rounded skeleton-shimmer" />
          <div className="h-64 rounded-2xl border border-[var(--border)] skeleton-shimmer" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 text-center">
        <div className="container mx-auto px-4 max-w-md space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Talep Bulunamadı</h2>
          <p className="text-sm text-[var(--text-secondary)]">Böyle bir destek talebi mevcut değil veya erişim yetkiniz yok.</p>
          <Button href="/destek" variant="secondary">Taleplerime Dön</Button>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[ticket.status] || { label: ticket.status, variant: "gray" as const };
  const isClosed = ticket.status === "CLOSED" || ticket.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/destek"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Taleplerime Dön
          </Link>
          <Badge variant={statusInfo.variant} dot>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Ticket Header Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider">
                {CATEGORY_NAMES[ticket.category] || ticket.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                {ticket.subject}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] shrink-0">
              <Clock className="h-4 w-4" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          {ticket.mcUsername && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span>Minecraft Kullanıcı Adı:</span>
              <span className="font-semibold text-[var(--text-primary)] font-mono">{ticket.mcUsername}</span>
            </div>
          )}
        </div>

        {/* Messages Thread */}
        <div className="space-y-4">
          {ticket.messages.map((msg) => {
            const isStaff = msg.isStaffReply;
            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-colors ${
                  isStaff
                    ? "bg-emerald-950/20 border-emerald-500/30 ml-4 sm:ml-8"
                    : "bg-[var(--bg-secondary)] border-[var(--border)] mr-4 sm:mr-8"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isStaff
                          ? "bg-emerald-500 text-white"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {isStaff ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {msg.user?.username || (isStaff ? "Yetkili Ekibi" : "Siz")}
                      </span>
                      {isStaff && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                          Yetkili
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{formatDate(msg.createdAt)}</span>
                </div>
                <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed pl-9">
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Form */}
        {!isClosed ? (
          <form onSubmit={handleSendReply} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Yanıt Yaz</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Mesajınızı buraya yazın..."
              rows={4}
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={sending}
                disabled={!replyContent.trim()}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Yanıtı Gönder
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center text-sm text-[var(--text-tertiary)]">
            Bu destek talebi kapatılmıştır. Yeni bir sorunuz varsa lütfen yeni bir talep oluşturun.
          </div>
        )}
      </div>
    </div>
  );
}
