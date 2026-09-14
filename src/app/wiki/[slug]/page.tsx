import { Metadata } from 'next';
import Link from 'next/link';
import { Book, Coins, ShoppingCart, Shield, Scroll, Crown, Terminal, Calendar, HelpCircle, ChevronRight, Menu } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, ' ');
  return {
    title: `${title} | Wiki | JustNyktSMP`,
  };
}

const wikiCategories = [
  { id: 'baslangic', title: 'Başlangıç Rehberi', icon: Book },
  { id: 'ekonomi', title: 'Ekonomi Sistemi', icon: Coins },
  { id: 'market', title: 'Oyuncu Marketi', icon: ShoppingCart },
  { id: 'klanlar', title: 'Klan Sistemi', icon: Shield },
  { id: 'gorevler', title: 'Görevler', icon: Scroll },
  { id: 'rutbeler', title: 'Rütbeler', icon: Crown },
  { id: 'komutlar', title: 'Temel Komutlar', icon: Terminal },
  { id: 'etkinlikler', title: 'Etkinlikler', icon: Calendar },
  { id: 'sss', title: 'Sıkça Sorulan Sorular', icon: HelpCircle }
];

export default function WikiArticlePage({ params }: { params: { slug: string } }) {
  const activeCategory = wikiCategories.find(c => c.id === params.slug);
  
  if (!activeCategory) {
    // We would normally fetch data, but for now if it doesn't match a cat, 404
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-8">
          <Link href="/wiki" className="hover:text-emerald-400">Wiki</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--text-primary)]">{activeCategory.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="font-exo font-semibold text-[var(--text-primary)] mb-4 px-2">Wiki Kategorileri</h2>
              <nav className="flex flex-col gap-1">
                {wikiCategories.map(cat => {
                  const isActive = cat.id === params.slug;
                  return (
                    <Link 
                      key={cat.id} 
                      href={`/wiki/${cat.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        isActive 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <cat.icon size={16} />
                      <span>{cat.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Article Content */}
          <div className="flex-grow max-w-3xl">
            <article className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--border)]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <activeCategory.icon size={24} />
                </div>
                <h1 className="heading-xl font-exo text-[var(--text-primary)]">{activeCategory.title}</h1>
              </div>

              <div className="prose prose-invert prose-emerald max-w-none text-[var(--text-secondary)]
                prose-headings:text-[var(--text-primary)] prose-headings:font-exo prose-headings:font-semibold
                prose-a:text-emerald-400 hover:prose-a:text-emerald-300
                prose-strong:text-[var(--text-primary)]
                prose-ul:list-disc prose-ul:pl-6
                prose-li:my-2
                prose-code:bg-[var(--bg-tertiary)] prose-code:text-emerald-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                
                <p>Bu bölüm yapım aşamasındadır. Sunucumuzdaki <strong>{activeCategory.title.toLowerCase()}</strong> hakkında detaylı bilgiler çok yakında eklenecektir.</p>
                
                <h2>Örnek İçerik Başlığı</h2>
                <p>JustNyktSMP sunucusunda oyuncularımıza en iyi deneyimi sunmak için sürekli çalışıyoruz. Sistemlerimizi dengede tutmak için şu kurallara dikkat etmelisiniz:</p>
                <ul>
                  <li>Özellik 1 açıklaması</li>
                  <li>Özellik 2 açıklaması ve detayları</li>
                  <li>Komutları kullanırken <code>/yardim</code> komutundan destek alabilirsiniz.</li>
                </ul>

                <h3>Alt Başlık</h3>
                <p>Ek bilgiler ve detaylar buraya gelecektir.</p>
              </div>
            </article>
          </div>

          {/* Table of Contents - Right Sidebar */}
          <div className="hidden xl:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4">Bu Sayfada</h3>
              <nav className="flex flex-col gap-2 border-l border-[var(--border)]">
                <a href="#" className="pl-4 text-sm text-emerald-400 border-l-2 border-emerald-500 -ml-[1px]">Giriş</a>
                <a href="#" className="pl-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-l-2 border-transparent -ml-[1px] transition-colors">Örnek İçerik Başlığı</a>
                <a href="#" className="pl-8 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border-l-2 border-transparent -ml-[1px] transition-colors">Alt Başlık</a>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
