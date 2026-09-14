import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Book, Coins, ShoppingCart, Shield, Scroll, Crown, Terminal, Calendar, HelpCircle, ChevronRight, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  const article = await prisma.wikiArticle.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, seoTitle: true, seoDescription: true },
  });

  if (article) {
    return {
      title: article.seoTitle || `${article.title} | Wiki | JustNyktSMP`,
      description: article.seoDescription || `${article.title} rehberi ve detayları.`,
    };
  }

  const category = await prisma.wikiCategory.findFirst({
    where: { slug },
    select: { name: true },
  });

  if (category) {
    return {
      title: `${category.name} | Wiki | JustNyktSMP`,
      description: `${category.name} kategorisindeki sunucu rehberleri.`,
    };
  }

  return {
    title: 'Wiki | JustNyktSMP',
  };
}

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

export default async function WikiArticleOrCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Check if it's an article
  const article = await prisma.wikiArticle.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: {
        include: {
          articles: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  // 2. Or check if it's a category
  const category = !article
    ? await prisma.wikiCategory.findFirst({
        where: { slug },
        include: {
          articles: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
    : null;

  if (!article && !category) {
    notFound();
  }

  // All categories for sidebar
  const allCategories = await prisma.wikiCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      articles: {
        where: { isPublished: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const currentCategorySlug = article ? article.category.slug : category!.slug;
  const currentCategoryName = article ? article.category.name : category!.name;
  const Icon = iconMap[currentCategorySlug] || Book;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-8 flex-wrap">
          <Link href="/wiki" className="hover:text-emerald-400 transition-colors">
            Wiki
          </Link>
          <ChevronRight size={14} />
          <Link href={`/wiki/${currentCategorySlug}`} className="hover:text-emerald-400 transition-colors">
            {currentCategoryName}
          </Link>
          {article && (
            <>
              <ChevronRight size={14} />
              <span className="text-[var(--text-primary)] font-medium truncate max-w-xs sm:max-w-md">
                {article.title}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <h2 className="font-exo font-semibold text-xs uppercase tracking-wider text-emerald-400 mb-3 px-1">
                  Kategoriler
                </h2>
                <nav className="flex flex-col gap-1">
                  {allCategories.map((cat) => {
                    const CatIcon = iconMap[cat.slug] || Book;
                    const isActive = cat.slug === currentCategorySlug;
                    return (
                      <Link
                        key={cat.id}
                        href={`/wiki/${cat.slug}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <CatIcon size={16} className={isActive ? 'text-emerald-400' : 'text-[var(--text-tertiary)]'} />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-xs text-[var(--text-tertiary)] ml-2">
                          {cat.articles.length}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Articles in current category */}
              {(article?.category.articles || category?.articles) && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <h3 className="font-exo font-semibold text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3 px-1">
                    Bu Kategorideki Rehberler
                  </h3>
                  <div className="flex flex-col gap-1">
                    {(article?.category.articles || category!.articles).map((a) => {
                      const isCurrentArticle = article?.slug === a.slug;
                      return (
                        <Link
                          key={a.id}
                          href={`/wiki/${a.slug}`}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-colors truncate ${
                            isCurrentArticle
                              ? 'bg-emerald-500 text-white font-medium shadow-sm'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          {a.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow max-w-4xl">
            {article ? (
              /* Article View */
              <article className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--border)]">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Icon size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      {article.category.name}
                    </div>
                    <h1 className="heading-xl font-exo text-[var(--text-primary)]">
                      {article.title}
                    </h1>
                  </div>
                </div>

                {/* Article Content */}
                <div className="text-[var(--text-secondary)] text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
                  {article.content}
                </div>

                {/* Footer Navigation */}
                <div className="mt-12 pt-6 border-t border-[var(--border)] flex justify-between items-center">
                  <Link
                    href={`/wiki/${article.category.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <ArrowLeft size={16} /> {article.category.name} Kategorisine Dön
                  </Link>
                </div>
              </article>
            ) : (
              /* Category Overview View */
              <div className="space-y-6">
                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h1 className="heading-xl font-exo text-[var(--text-primary)]">
                        {category!.name}
                      </h1>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Bu kategoride toplam {category!.articles.length} rehber makalesi bulunmaktadır.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category's Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category!.articles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/wiki/${art.slug}`}
                      className="bg-[var(--bg-elevated)] border border-[var(--border)] p-6 rounded-2xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold font-exo text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors mb-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
                          {art.content.slice(0, 140)}...
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 pt-3 border-t border-[var(--border)]">
                        Makaleyi Oku <ArrowRight size={14} />
                      </div>
                    </Link>
                  ))}
                </div>

                {category!.articles.length === 0 && (
                  <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[var(--text-secondary)]">Bu kategoride henüz makale eklenmemiş.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
