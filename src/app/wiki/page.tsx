"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Book, Coins, ShoppingCart, Shield, Scroll, Crown, Terminal, Calendar, HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

const wikiCategories = [
  { id: 'baslangic', title: 'Başlangıç Rehberi', icon: Book, desc: 'Sunucuya ilk adım, kurallar ve temel bilgiler.' },
  { id: 'ekonomi', title: 'Ekonomi Sistemi', icon: Coins, desc: 'Para kazanma, meslekler ve ticaret.' },
  { id: 'market', title: 'Oyuncu Marketi', icon: ShoppingCart, desc: 'Market sistemi kullanımı ve güvenli ticaret.' },
  { id: 'klanlar', title: 'Klan Sistemi', icon: Shield, desc: 'Klan kurma, geliştirme ve klan savaşları.' },
  { id: 'gorevler', title: 'Görevler', icon: Scroll, desc: 'Günlük ve haftalık görevleri tamamlama.' },
  { id: 'rutbeler', title: 'Rütbeler', icon: Crown, desc: 'Oyun içi rütbeler ve sağladıkları ayrıcalıklar.' },
  { id: 'komutlar', title: 'Temel Komutlar', icon: Terminal, desc: 'Bilinmesi gereken önemli oyuncu komutları.' },
  { id: 'etkinlikler', title: 'Etkinlikler', icon: Calendar, desc: 'Düzenli sunucu etkinlikleri hakkında bilgi.' },
  { id: 'sss', title: 'Sıkça Sorulan Sorular', icon: HelpCircle, desc: 'En çok merak edilen soruların cevapları.' }
];

export default function WikiPage() {
  const [search, setSearch] = useState('');

  const filteredCategories = wikiCategories.filter(cat => 
    cat.title.toLowerCase().includes(search.toLowerCase()) || 
    cat.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="font-exo font-semibold text-[var(--text-primary)] mb-4 px-2">Wiki Kategorileri</h2>
              <nav className="flex flex-col gap-1">
                {wikiCategories.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/wiki/${cat.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <cat.icon size={16} />
                    <span className="text-sm font-medium">{cat.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="mb-12 text-center lg:text-left">
              <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">JustNyktSMP Wiki</h1>
              <p className="text-[var(--text-secondary)] max-w-2xl mb-8">
                Sunucumuz hakkında bilmeniz gereken her şeyi burada bulabilirsiniz. Aramak istediğiniz konuyu yazın veya kategorilere göz atın.
              </p>
              
              <div className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[var(--text-tertiary)]" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Wiki'de ara..." 
                  className="pl-10 bg-[var(--bg-secondary)] border-[var(--border)] h-12 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCategories.map(cat => (
                <Link key={cat.id} href={`/wiki/${cat.id}`} className="group">
                  <div className="h-full bg-[var(--bg-elevated)] border border-[var(--border)] p-6 rounded-2xl hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                      <cat.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-emerald-400 transition-colors">{cat.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredCategories.length === 0 && (
              <div className="text-center py-16 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)]">
                <p className="text-[var(--text-secondary)]">Aradığınız kriterlere uygun sonuç bulunamadı.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
