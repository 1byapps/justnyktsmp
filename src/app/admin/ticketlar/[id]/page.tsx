"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, XCircle, Clock, ShieldCheck, User } from "lucide-react";
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
  user: {
    id: string;
    username: string;
    email: string;
  };
  messages: Message[];
}

const STATUS_MAP: Record<string, { label: string; variant: "blue" | "amber" | "purple" | "emerald" | "gray" }> = {
  OPEN: { label: "Açık", variant: "blue" },
  IN_REVIEW: { label: "İnceleniyor", variant: "amber" },
  WAITING_USER: { label: "Kullanıcı Yanıtı Bekleniyor", variant: "purple" },
  RESOLVED: { label: "Çözüldü", variant: "emerald" },
  CLOSED: { label: "Kapatıldı", variant: "gray" },
};

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>("OPEN");

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/tickets/${id}`);
      const data = await res.json();
      if (data.success) {
        setTicket(data.data);
        setStatus(data.data.status);
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}/messages`, {
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
      <div className="space-y-6">
        <div className="h-8 w-48 rounded skeleton-shimmer" />
        <div className="h-64 rounded-xl border border-[var(--border)] skeleton-shimmer" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8 text-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Talep Bulunamadı</h2>
        <Link href="/admin/ticketlar" className="text-sm text-emerald-400 mt-2 inline-block">
          Geri Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/ticketlar"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Tüm Taleplere Dön
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="OPEN">Açık</option>
            <option value="IN_REVIEW">İnceleniyor</option>
            <option value="WAITING_USER">Kullanıcı Yanıtı Bekleniyor</option>
            <option value="RESOLVED">Çözüldü</option>
            <option value="CLOSED">Kapatıldı</option>
          </select>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusChange("RESOLVED")}
            leftIcon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          >
            Çözüldü
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleStatusChange("CLOSED")}
            leftIcon={<XCircle className="h-4 w-4" />}
          >
            Kapat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={STATUS_MAP[ticket.status]?.variant || "gray"} dot>
                {STATUS_MAP[ticket.status]?.label || ticket.status}
              </Badge>
              <span className="text-xs text-[var(--text-tertiary)] font-mono">#{ticket.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{ticket.subject}</h1>
          </div>

          <div className="space-y-3">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border ${
                  msg.isStaffReply
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-[var(--bg-secondary)] border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {msg.isStaffReply ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <User className="h-4 w-4 text-[var(--text-secondary)]" />
                    )}
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {msg.user?.username || (msg.isStaffReply ? "Yetkili" : "Kullanıcı")}
                    </span>
                    {msg.isStaffReply && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                        Yetkili Yanıtı
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>

          {/* Staff reply box */}
          <form onSubmit={handleSendReply} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Yetkili Olarak Yanıtla</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Kullanıcıya iletilecek yanıt..."
              rows={4}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={sending}
                disabled={!replyContent.trim()}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Yanıt Gönder
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 space-y-4 text-sm">
            <h3 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-xs border-b border-[var(--border)] pb-2">
              Kullanıcı Bilgileri
            </h3>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Kullanıcı Adı</p>
              <p className="font-medium text-[var(--text-primary)] mt-0.5">{ticket.user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">E-posta</p>
              <p className="font-medium text-[var(--text-primary)] mt-0.5">{ticket.user?.email}</p>
            </div>
            {ticket.mcUsername && (
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Minecraft Adı</p>
                <p className="font-mono text-[var(--accent-primary)] font-medium mt-0.5">{ticket.mcUsername}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Oluşturulma Tarihi</p>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] mt-0.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
