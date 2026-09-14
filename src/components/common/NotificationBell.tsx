'use client';
import * as React from 'react';
import { Bell } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = React.useState(2);

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      }
    >
      <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--border)]">
        <span className="font-medium text-[var(--text-primary)]">Bildirimler</span>
        {unreadCount > 0 && (
          <button onClick={() => setUnreadCount(0)} className="text-xs text-[var(--accent-primary)] hover:underline">
            Tümünü okundu işaretle
          </button>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto">
        <DropdownItem className="items-start gap-3 py-3">
          <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--text-primary)]">Market Siparişi</span>
            <span className="text-xs text-[var(--text-secondary)] line-clamp-2">VIP üyeliğiniz başarıyla aktif edildi!</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">2 saat önce</span>
          </div>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem className="items-start gap-3 py-3 opacity-60">
          <div className="h-2 w-2 mt-1.5 rounded-full bg-transparent flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--text-primary)]">Sunucu Bakımı</span>
            <span className="text-xs text-[var(--text-secondary)] line-clamp-2">Yarın 03:00'da planlı bakım çalışması yapılacaktır.</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">1 gün önce</span>
          </div>
        </DropdownItem>
      </div>
      <div className="p-2 border-t border-[var(--border)] text-center">
        <Link href="/bildirimler" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          Tüm bildirimleri gör
        </Link>
      </div>
    </Dropdown>
  );
}
