'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, ShoppingCart, Newspaper, Book, Gavel, Ticket, ShieldBan, Swords, TicketPercent, Server, Settings, Activity } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

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

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] hidden md:flex">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[var(--border)]">
        <Link href="/admin" className="font-['Exo_2'] font-bold text-xl tracking-tight">
          <span className="text-white">Admin</span>
          <span className="text-[var(--accent-primary)]">Panel</span>
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto p-4 custom-scrollbar">
        {ADMIN_LINKS.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]")} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm" initials="AD" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[var(--text-primary)]">Admin User</span>
            <Link href="/" className="text-xs text-[var(--accent-primary)] hover:underline">Siteye Dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
