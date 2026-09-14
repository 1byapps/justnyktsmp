'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ServerStatus } from '../server/ServerStatus';
import { NotificationBell } from '../common/NotificationBell';
import { MobileNav } from './MobileNav';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { User, Settings, LogOut, ShieldAlert } from 'lucide-react';

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

  // Mocks for user auth state
  const isLoggedIn = false;
  const isAdmin = false;

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
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-md border-[var(--border)]" 
          : "bg-[var(--bg-primary)] border-transparent"
      )}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-['Exo_2'] font-bold text-xl tracking-tight flex items-center">
              <span className="text-white">Just</span>
              <span className="text-[var(--accent-primary)]">Nykt</span>
              <span className="text-[var(--text-secondary)]">SMP</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
                    pathname === link.href ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]/50" : "text-[var(--text-secondary)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <ServerStatus variant="compact" />
            </div>

            <Button variant="outline" size="sm" className="hidden sm:flex" href="https://discord.gg/justnyktsmp" target="_blank">
              Discord
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Dropdown
                  align="right"
                  trigger={
                    <button className="flex items-center gap-2 rounded-full border border-[var(--border)] p-0.5 pr-2 hover:bg-[var(--bg-tertiary)] transition-colors">
                      <Avatar size="sm" initials="US" />
                      <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">User</span>
                    </button>
                  }
                >
                  <DropdownItem icon={<User />}>Hesabım</DropdownItem>
                  {isAdmin && (
                    <DropdownItem icon={<ShieldAlert />} onClick={() => window.location.href = '/admin'}>
                      Admin Panel
                    </DropdownItem>
                  )}
                  <DropdownItem icon={<Settings />}>Destek</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={<LogOut />} className="text-red-500">Çıkış Yap</DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <Button variant="primary" size="sm">
                Giriş Yap
              </Button>
            )}

            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(true)}
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
      />
    </>
  );
}
