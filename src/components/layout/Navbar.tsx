'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, User, Settings, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/Button';
import { ServerStatus } from '../server/ServerStatus';
import { NotificationBell } from '../common/NotificationBell';
import { MobileNav } from './MobileNav';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';

const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/sunucu', label: 'Sunucu' },
  { href: '/market', label: 'Market' },
  { href: '/siralama', label: 'Sıralama' },
  { href: '/kurallar', label: 'Kurallar' },
  { href: '/haberler', label: 'Haberler' },
  { href: '/wiki', label: 'Wiki' },
  { href: '/destek', label: 'Destek' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data: session, status: sessionStatus } = useSession();
  const isLoggedIn = sessionStatus === 'authenticated' && !!session?.user;
  const userRoles = ((session?.user as unknown as { roles?: string[] })?.roles || []).map((r) => r.toLowerCase());
  const isAdmin = userRoles.includes('admin') || userRoles.includes('owner') || userRoles.includes('moderator') || userRoles.includes('developer');
  const username = (session?.user as unknown as { username?: string })?.username || session?.user?.name || 'Kullanıcı';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b",
        isScrolled 
          ? "bg-[var(--bg-primary)]/85 backdrop-blur-md border-[var(--border)] shadow-lg shadow-black/20" 
          : "bg-[var(--bg-primary)] border-transparent"
      )}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-['Exo_2'] font-bold text-xl tracking-tight flex items-center gap-1.5 group">
              <span className="text-white">Just</span>
              <span className="text-[var(--accent-primary)] group-hover:text-emerald-400 transition-colors">Nykt</span>
              <span className="text-[var(--text-secondary)]">SMP</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
                    pathname === link.href ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]/60" : "text-[var(--text-secondary)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ServerStatus variant="compact" />
            </div>

            <Button variant="outline" size="sm" className="hidden sm:flex border-[var(--border)] hover:border-emerald-500/40" href="https://discord.gg/justnyktsmp" target="_blank">
              Discord
            </Button>

            {/* Admin Panel Direct Button (When Admin is logged in) */}
            {isLoggedIn && isAdmin && (
              <Link href="/admin">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-950/40 border border-red-500/30 transition-all hover:scale-105 active:scale-95">
                  <ShieldAlert size={14} className="animate-pulse" />
                  <span className="hidden sm:inline">Admin Paneli</span>
                  <span className="sm:hidden">Admin</span>
                </button>
              </Link>
            )}

            {/* Authenticated User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Dropdown
                  align="right"
                  trigger={
                    <button className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1 pr-2.5 hover:bg-[var(--bg-tertiary)] hover:border-emerald-500/40 transition-all">
                      <img
                        src={`https://mc-heads.net/avatar/${username}/28`}
                        alt={username}
                        className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] border border-emerald-500/40 object-cover"
                        onError={(e) => {
                          // Fallback to avatar letter if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-sm font-semibold text-[var(--text-primary)] hidden sm:block max-w-[110px] truncate">
                        {username}
                      </span>
                    </button>
                  }
                >
                  <div className="px-3 py-2 border-b border-[var(--border)]">
                    <p className="text-xs text-[var(--text-tertiary)]">Giriş yapıldı</p>
                    <p className="text-sm font-bold text-emerald-400 truncate">{username}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        Yönetici / Kurucu
                      </span>
                    )}
                  </div>
                  <DropdownItem icon={<User size={16} />} onClick={() => window.location.href = '/panel'}>
                    Hesabım (Panel)
                  </DropdownItem>
                  {isAdmin && (
                    <DropdownItem icon={<ShieldAlert size={16} className="text-red-400" />} onClick={() => window.location.href = '/admin'} className="text-red-400 font-semibold">
                      Admin Paneli
                    </DropdownItem>
                  )}
                  <DropdownItem icon={<Settings size={16} />} onClick={() => window.location.href = '/destek'}>
                    Destek Taleplerim
                  </DropdownItem>
                  <DropdownItem icon={<Sparkles size={16} />} onClick={() => window.location.href = '/panel/ayarlar'}>
                    Ayarlar
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={<LogOut size={16} />} onClick={() => signOut({ callbackUrl: '/' })} className="text-red-500 hover:text-red-400">
                    Çıkış Yap
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/giris">
                  <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-950/30">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit" className="hidden sm:inline-block">
                  <Button variant="outline" size="sm" className="border-[var(--border)] hover:border-emerald-500/40 text-[var(--text-secondary)] hover:text-white">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menü"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        links={NAV_LINKS}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        username={username}
      />
    </>
  );
}
