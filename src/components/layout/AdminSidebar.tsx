'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Newspaper,
  Book,
  Gavel,
  Ticket,
  ShieldBan,
  Swords,
  TicketPercent,
  Server,
  Settings,
  Activity,
  Menu,
  X
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/oyuncular', label: 'Oyuncular', icon: Users },
  { href: '/admin/market', label: 'Market', icon: ShoppingCart },
  { href: '/admin/haberler', label: 'Haberler', icon: Newspaper },
  { href: '/admin/wiki', label: 'Wiki', icon: Book },
  { href: '/admin/kurallar', label: 'Kurallar', icon: Gavel },
  { href: '/admin/ticketlar', label: 'Ticketlar', icon: Ticket },
  { href: '/admin/banlar', label: 'Banlar', icon: ShieldBan },
  { href: '/admin/klanlar', label: 'Klanlar', icon: Swords },
  { href: '/admin/kuponlar', label: 'Kuponlar', icon: TicketPercent },
  { href: '/admin/sunucu', label: 'Sunucu', icon: Server },
  { href: '/admin/loglar', label: 'Loglar', icon: Activity },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const username =
    (session?.user as unknown as { username?: string })?.username ||
    session?.user?.name ||
    'Yönetici';

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex h-14 items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] sticky top-0 z-40">
        <Link href="/admin" className="font-['Exo_2'] font-bold text-lg tracking-tight">
          <span className="text-white">Admin</span>
          <span className="text-[var(--accent-primary)]">Panel</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Menüyü Aç/Kapat"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[var(--border)]">
          <Link href="/admin" className="font-['Exo_2'] font-bold text-xl tracking-tight">
            <span className="text-white">Admin</span>
            <span className="text-[var(--accent-primary)]">Panel</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto p-4 custom-scrollbar">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'
                  )}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4 bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-3">
            <img
              src={`https://mc-heads.net/avatar/${username}/32`}
              alt={username}
              className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {username}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                  Yönetici
                </span>
                <Link
                  href="/"
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:underline"
                >
                  Siteye Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
