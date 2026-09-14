import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Haberler | JustNyktSMP',
  description: 'JustNyktSMP sunucusundan en son haberler, güncellemeler ve duyurular.',
};

import { prisma } from '@/lib/prisma';

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const currentCategory = categoryParam || 'Tümü';

  const [dbCategories, dbNews] = await Promise.all([
    prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        ...(currentCategory !== 'Tümü'
          ? { category: { name: { equals: currentCategory, mode: 'insensitive' } } }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    }),
  ]);

  const categories = ['Tümü', ...dbCategories.map((c) => c.name)];

  const filteredNews = dbNews.map((n) => ({
    id: n.id,
    title: n.title,
    summary: n.summary,
    category: n.category.name,
    date: n.publishedAt
      ? new Date(n.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Yeni',
    author: n.authorName,
    slug: n.slug,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-3">Haberler & Duyurular</h1>
            <p className="text-[var(--text-secondary)]">Sunucumuzla ilgili en son gelişmelerden haberdar olun.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link 
                key={cat} 
                href={`/haberler${cat !== 'Tümü' ? `?category=${cat}` : ''}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentCategory === cat 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-emerald-500/50'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredNews.map((item) => (
                <div key={item.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-colors">
                  <div className="h-48 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-emerald-500/90 backdrop-blur text-white">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3">
                      <span>{item.date}</span>
                      <span>&bull;</span>
                      <span>{item.author}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      <Link href={`/haberler/${item.slug}`}>{item.title}</Link>
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 flex-grow text-sm line-clamp-3">{item.summary}</p>
                    <Link href={`/haberler/${item.slug}`} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 mt-auto">Devamını Oku &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Pagination currentPage={1} totalPages={1} />
            </div>
          </>
        ) : (
          <EmptyState 
            title="Haber Bulunamadı" 
            description={`${currentCategory} kategorisinde henüz bir haber veya duyuru paylaşılmamış.`} 
          />
        )}
      </div>
    </div>
  );
}
