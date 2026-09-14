import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.news.findFirst({
    where: { slug },
  });

  return {
    title: article ? `${article.title} | JustNyktSMP` : 'Haber | JustNyktSMP',
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbArticle = await prisma.news.findFirst({
    where: { slug },
    include: { category: true },
  });

  if (!dbArticle) {
    notFound();
  }

  const article = {
    title: dbArticle.title,
    content: dbArticle.content,
    category: dbArticle.category.name,
    date: dbArticle.publishedAt
      ? new Date(dbArticle.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Yeni',
    author: dbArticle.authorName,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Cover Image Area */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-br from-emerald-900/60 to-[var(--bg-tertiary)] relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-20 relative z-10">
        <Link href="/haberler" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white mb-6 bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border border-[var(--border)] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Haberlere Dön
        </Link>

        <article className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 md:p-12 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge className="bg-emerald-500 text-white border-none">{article.category}</Badge>
            <div className="flex items-center text-sm text-[var(--text-tertiary)] gap-2">
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center text-sm text-[var(--text-tertiary)] gap-2">
              <User size={14} />
              <span>{article.author}</span>
            </div>
          </div>

          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-8">{article.title}</h1>

          {article.content.includes('<p>') || article.content.includes('<div') ? (
            <div 
              className="prose prose-invert prose-emerald max-w-none text-[var(--text-secondary)]
                prose-headings:text-[var(--text-primary)] prose-headings:font-exo prose-headings:font-semibold
                prose-a:text-emerald-400 hover:prose-a:text-emerald-300
                prose-strong:text-[var(--text-primary)]
                prose-ul:list-disc prose-ul:pl-6
                prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {article.content}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
