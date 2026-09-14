'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, ShieldAlert, User, LogOut, LogIn, UserPlus, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ServerStatus } from '../server/ServerStatus';
import { Button } from '../ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
  isAdmin?: boolean;
  username?: string;
}

export function MobileNav({ isOpen, onClose, links, isLoggedIn, isAdmin, username = 'Kullanıcı' }: MobileNavProps) {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />
      <div className="relative z-50 w-4/5 max-w-sm h-full bg-[var(--bg-elevated)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="font-['Exo_2'] font-bold text-lg text-[var(--text-primary)]">Menü</span>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Status */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
          <ServerStatus variant="compact" />
        </div>

        {/* User Card (When logged in) */}
        {isLoggedIn ? (
          <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-tertiary)]/40 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={`https://mc-heads.net/avatar/${username}/36`}
                alt={username}
                className="w-9 h-9 rounded-full border border-emerald-500/40 bg-[var(--bg-tertiary)]"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-tertiary)]">Giriş Yapıldı</p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{username}</p>
                {isAdmin && (
                  <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Yönetici / Admin
                  </span>
                )}
              </div>
            </div>

            {isAdmin && (
              <Link href="/admin" onClick={onClose} className="w-full">
                <button className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-red-950/40 border border-red-500/30">
                  <ShieldAlert size={16} />
                  <span>Admin Paneli</span>
                </button>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2 mt-1">
              <Link href="/panel" onClick={onClose} className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] hover:border-emerald-500/40">
                <User size={13} />
                <span>Panel</span>
              </Link>
              <Link href="/panel/ayarlar" onClick={onClose} className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] hover:border-emerald-500/40">
                <Settings size={13} />
                <span>Ayarlar</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-[var(--border)] flex flex-col gap-2 bg-[var(--bg-secondary)]/30">
            <Link href="/giris" onClick={onClose} className="w-full">
              <Button variant="primary" className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <LogIn size={16} className="mr-2" />
                Giriş Yap
              </Button>
            </Link>
            <Link href="/kayit" onClick={onClose} className="w-full">
              <Button variant="outline" className="w-full justify-center border-[var(--border)]">
                <UserPlus size={16} className="mr-2" />
                Kayıt Ol
              </Button>
            </Link>
          </div>
        )}

        {/* Nav Links */}
        <div className="p-3 flex flex-col gap-1 overflow-y-auto flex-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer actions */}
        {isLoggedIn && (
          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={() => { onClose(); signOut({ callbackUrl: '/' }); }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
