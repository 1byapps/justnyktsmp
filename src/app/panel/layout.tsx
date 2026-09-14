'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { useSession } from 'next-auth/react';

const navItems = [
  { label: 'Genel Bakış', href: '/panel' },
  { label: 'Satın Alımlar', href: '/panel/satin-alimlar' },
  { label: 'Destek', href: '/destek' },
  { label: 'Ayarlar', href: '/panel/ayarlar' },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 mb-6 text-center">
            <Avatar src={`https://mc-heads.net/avatar/${session?.user?.name || 'steve'}`} alt="Avatar" size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-bold">{session?.user?.name || 'Oyuncu'}</h2>
            <p className="text-sm text-emerald-500 font-medium mt-1">Oyuncu</p>
          </div>
          
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/panel' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
