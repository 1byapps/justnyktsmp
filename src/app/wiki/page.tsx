import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Book, Coins, ShoppingCart, Shield, Scroll, Crown, Terminal, Calendar, HelpCircle, Search, ArrowRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wiki & Rehberler | JustNyktSMP',
  description: 'JustNyktSMP sunucu rehberleri, sistemler, komutlar ve başlangıç kılavuzu.',
};

const iconMap: Record<string, any> = {
  baslangic: BookOpen,
  ekonomi: Coins,
  market: ShoppingCart,
  klanlar: Shield,
  gorevler: Scroll,
  rutbeler: Crown,
  komutlar: Terminal,
  etkinlikler: Calendar,
  sss: HelpCircle,
};

export default async function WikiPage() {
  const categories = await prisma.wikiCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      articles: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <h2 className="font-exo font-semibold text-[var(--text-primary)] mb-4 px-2 text-sm uppercase tracking-wider text-emerald-400">
                Kategoriler
              </h2>
              <nav className="flex flex-col gap-1.5">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.slug] || Book;
                  return (
                    <Link
                      key={cat.id}
                      href={`/wiki/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all text-sm font-medium group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                        {cat.articles.length}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
                JustNyktSMP Bilgi Bankası
              </div>
              <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">Sunucu Rehberi & Wiki</h1>
              <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
                Sunucumuz hakkında bilmeniz gereken her şeyi burada bulabilirsiniz. Sistem mekanikleri, meslekler, claim koruması ve komutlar hakkında detaylı rehberler.
              </p>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {categories.map((cat) => {
                const Icon = iconMap[cat.slug] || Book;
                return (
                  <div
                    key={cat.id}
                    className="bg-[var(--bg-elevated)] border border-[var(--border)] p-6 rounded-2xl hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-exo group-hover:text-emerald-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-4">
                        {cat.articles.length} rehber makalesi mevcut.
                      </p>

                      {/* Articles list preview */}
                      <ul className="space-y-2 mb-6">
                        {cat.articles.slice(0, 3).map((article) => (
                          <li key={article.id}>
                            <Link
                              href={`/wiki/${article.slug}`}
                              className="text-xs text-[var(--text-tertiary)] hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                              <span className="truncate">{article.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/wiki/${cat.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-[var(--border)] transition-colors"
                    >
                      Kategoriye Git <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-16 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)]">
                <p className="text-[var(--text-secondary)]">Henüz wiki içeriği eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
