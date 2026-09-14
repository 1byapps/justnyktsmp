import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function LatestNews() {
  // Mock data - replace with API fetch in real implementation
  const news = [
    {
      id: 1,
      title: 'Sezon 2 Başlıyor! Yeni Özellikler ve Dahası',
      summary: 'Uzun süredir beklenen 2. Sezon nihayet burada. Yeni görevler, güncellenmiş pazar dinamikleri ve tamamen yenilenmiş klan sistemi ile karşınızdayız.',
      category: 'Sezon',
      date: '14 Eylül 2026',
      author: 'Yönetim',
      slug: 'sezon-2-basliyor',
      featured: true
    },
    {
      id: 2,
      title: 'Hafta Sonu XP Etkinliği',
      summary: 'Bu hafta sonu tüm sunucuda x2 XP etkinliği aktif olacak. Balık tutma, madencilik ve mob kesimlerinden çifte tecrübe kazanın.',
      category: 'Etkinlik',
      date: '12 Eylül 2026',
      author: 'Rehber',
      slug: 'hafta-sonu-xp-etkinligi',
      featured: false
    },
    {
      id: 3,
      title: 'Ekonomi Dengeleme Güncellemesi v1.4',
      summary: 'Market fiyatlarında ve bazı eşyaların satış değerlerinde düzenlemeler yapıldı. Amacımız daha dengeli ve uzun ömürlü bir ekonomi sağlamak.',
      category: 'Güncelleme',
      date: '10 Eylül 2026',
      author: 'Geliştirici',
      slug: 'ekonomi-dengeleme-guncellemesi',
      featured: false
    }
  ];

  if (news.length === 0) {
    return (
      <section className="w-full bg-[var(--bg-primary)] py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="heading-lg font-exo text-[var(--text-primary)]">Son Haberler</h2>
            <Link href="/haberler" className="text-emerald-500 hover:text-emerald-400 font-medium text-sm transition-colors">Tümünü Gör &rarr;</Link>
          </div>
          <EmptyState title="Henüz haber paylaşılmamış." description="Yakında yeni güncellemeler ve duyurular ile karşınızda olacağız." />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--bg-primary)] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="heading-lg font-exo text-[var(--text-primary)]">Son Haberler</h2>
          <Link href="/haberler" className="text-emerald-500 hover:text-emerald-400 font-medium text-sm transition-colors">Tümünü Gör &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Post */}
          <div className="lg:col-span-7 flex">
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col w-full group">
              <div className="h-64 bg-gradient-to-br from-emerald-900/40 to-[var(--bg-tertiary)] relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <Badge variant="default" className="bg-emerald-500 text-white">{news[0].category}</Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3">
                  <span>{news[0].date}</span>
                  <span>&bull;</span>
                  <span>{news[0].author}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-emerald-400 transition-colors">
                  <Link href={`/haberler/${news[0].slug}`}>{news[0].title}</Link>
                </h3>
                <p className="text-[var(--text-secondary)] mb-6 flex-grow">{news[0].summary}</p>
                <Link href={`/haberler/${news[0].slug}`} className="text-sm font-medium text-emerald-500 hover:text-emerald-400">Devamını Oku &rarr;</Link>
              </div>
            </div>
          </div>

          {/* Secondary Posts */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {news.slice(1).map((item) => (
              <div key={item.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col sm:flex-row h-full group">
                <div className="sm:w-1/3 h-48 sm:h-auto bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] relative shrink-0">
                  <div className="absolute top-3 left-3 sm:hidden">
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-center">
                  <div className="hidden sm:flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-2">
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    <Link href={`/haberler/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <Link href={`/haberler/${item.slug}`} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 mt-auto pt-2">Devamını Oku &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
