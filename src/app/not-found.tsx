import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 text-center">
      <div className="text-[var(--text-tertiary)] font-bold text-9xl tracking-tighter mb-4 opacity-50 font-exo">
        404
      </div>
      <h1 className="heading-lg font-exo text-[var(--text-primary)] mb-4">Sayfa Bulunamadı</h1>
      <p className="text-[var(--text-secondary)] max-w-md mb-8">
        Aradığınız sayfa mevcut değil, silinmiş veya taşınmış olabilir. Adresi doğru yazdığınızdan emin olun.
      </p>
      <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
        <Link href="/">
          <Home size={18} className="mr-2" /> Ana Sayfaya Dön
        </Link>
      </Button>
    </div>
  );
}
