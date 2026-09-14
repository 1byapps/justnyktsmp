import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ').toUpperCase()} | JustNyktSMP`,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // In a real app, fetch data based on params.slug
  const article = {
    title: 'Sezon 2 Başlıyor! Yeni Özellikler ve Dahası',
    content: `
      <p>Uzun süredir beklenen 2. Sezon nihayet burada. Yeni görevler, güncellenmiş pazar dinamikleri ve tamamen yenilenmiş klan sistemi ile karşınızdayız.</p>
      <h2>Yenilikler Neler?</h2>
      <p>Sezon 2 ile birlikte sunucumuza birçok yeni özellik ekleniyor. İşte öne çıkan bazı değişiklikler:</p>
      <ul>
        <li><strong>Gelişmiş Klan Sistemi:</strong> Klanlar arası savaşlar artık daha adil ve stratejik. Klan seviyeleri eklendi.</li>
        <li><strong>Ekonomi Dengelemesi:</strong> Tarım ürünlerinin fiyatları güncellendi, yeni meslekler eklendi.</li>
        <li><strong>Özel Görevler:</strong> Günlük ve haftalık görevlerin ödülleri artırıldı.</li>
      </ul>
      <h2>Ne Zaman Başlıyor?</h2>
      <p>Sezon 2, 14 Eylül Cumartesi günü saat 20:00'da (TSİ) aktif olacaktır. Eski sezon verileri arşivlenmiş olup, tüm oyuncularımız yeni bir başlangıç yapacaktır.</p>
      <p>Yeni sezonda görüşmek üzere, iyi oyunlar dileriz!</p>
    `,
    category: 'Sezon',
    date: '14 Eylül 2026',
    author: 'Yönetim',
  };

  if (!article) {
    notFound();
  }

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

          <div 
            className="prose prose-invert prose-emerald max-w-none text-[var(--text-secondary)]
              prose-headings:text-[var(--text-primary)] prose-headings:font-exo prose-headings:font-semibold
              prose-a:text-emerald-400 hover:prose-a:text-emerald-300
              prose-strong:text-[var(--text-primary)]
              prose-ul:list-disc prose-ul:pl-6
              prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
}
