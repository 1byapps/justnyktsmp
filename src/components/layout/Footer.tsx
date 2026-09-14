'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Do not render public footer inside the admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-[var(--bg-primary)] border-t border-[var(--border)] pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="font-['Exo_2'] font-bold text-2xl tracking-tight flex items-center mb-4">
              <span className="text-white">Just</span>
              <span className="text-[var(--accent-primary)]">Nykt</span>
              <span className="text-[var(--text-secondary)]">SMP</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-6 leading-relaxed">
              Türkiye'nin en yenilikçi ve kaliteli Minecraft SMP sunucusu. Kesintisiz oyun deneyimi ve aktif topluluk.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">JustNyktSMP</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href="/hakkimizda" className="hover:text-[var(--accent-primary)] transition-colors">Hakkımızda</Link></li>
              <li><Link href="/sunucu" className="hover:text-[var(--accent-primary)] transition-colors">Sunucu</Link></li>
              <li><Link href="/kurallar" className="hover:text-[var(--accent-primary)] transition-colors">Kurallar</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Topluluk</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="https://discord.gg/justnyktsmp" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-primary)] transition-colors">Discord</a></li>
              <li><Link href="/haberler" className="hover:text-[var(--accent-primary)] transition-colors">Haberler</Link></li>
              <li><Link href="/siralama" className="hover:text-[var(--accent-primary)] transition-colors">Sıralama</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Destek</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href="/sss" className="hover:text-[var(--accent-primary)] transition-colors">SSS</Link></li>
              <li><Link href="/destek" className="hover:text-[var(--accent-primary)] transition-colors">Destek</Link></li>
              <li><Link href="/ban-itirazi" className="hover:text-[var(--accent-primary)] transition-colors">Ban İtirazı</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} JustNyktSMP. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-xs text-[var(--text-tertiary)]">
            <Link href="/gizlilik" className="hover:text-[var(--text-secondary)]">Gizlilik Politikası</Link>
            <Link href="/sartlar" className="hover:text-[var(--text-secondary)]">Kullanım Şartları</Link>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] italic">
            JustNyktSMP, Mojang Studios veya Microsoft ile bağlantılı değildir.
          </p>
        </div>
      </div>
    </footer>
  );
}
