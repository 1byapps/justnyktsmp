"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const rulesData = [
  {
    category: "Genel Kurallar",
    rules: [
      { id: 1, title: "Saygı ve Nezaket", desc: "Tüm oyunculara ve yetkililere saygılı davranmak zorunludur. Din, dil, ırk, cinsiyet veya herhangi bir kişisel özellik üzerinden ayrımcılık yapılamaz." },
      { id: 2, title: "Reklam Yasak", desc: "Başka sunucuların, Discord hesaplarının, Twitch/YouTube kanallarının vb. reklamını yapmak (yazılı veya sözlü) kesinlikle yasaktır." },
      { id: 3, title: "Kişisel Bilgi Gizliliği", desc: "Kendinizin veya bir başkasının kişisel bilgilerini (adres, telefon, gerçek isim, vb.) paylaşmak yasaktır." },
      { id: 4, title: "Açık Kullanımı", desc: "Oyun içi bir hata (bug/exploit) bulursanız bunu kullanmak yerine derhal yönetime bildirmelisiniz." },
      { id: 5, title: "Yetkili Kararları", desc: "Yetkililerin verdiği kararlar nihaidir. İtirazlarınızı saygılı bir şekilde destek talebi açarak yapabilirsiniz." }
    ]
  },
  {
    category: "Sohbet Kuralları",
    rules: [
      { id: 6, title: "Küfür ve Argo", desc: "Sohbette küfür etmek, aşırı argo kelimeler kullanmak, sansürleyerek küfretmek yasaktır." },
      { id: 7, title: "Spam ve Flood", desc: "Aynı mesajı veya benzer kelimeleri arka arkaya göndermek (spam/flood) yasaktır." },
      { id: 8, title: "Büyük Harf Kullanımı", desc: "Sohbette tamamen büyük harflerle (CAPS LOCK) konuşmak rahatsız edici olduğundan yasaktır." },
      { id: 9, title: "Dil Kullanımı", desc: "Genel sohbette yalnızca Türkçe veya İngilizce dilleri kullanılabilir." }
    ]
  },
  {
    category: "Oyun İçi Davranış",
    rules: [
      { id: 10, title: "Griefing Yasak", desc: "Başkalarının yapılarını kırmak, zarar vermek veya izinsiz blok eklemek yasaktır. Claim alınmamış olsa bile saygı esastır." },
      { id: 11, title: "Tuzak Kurmak", desc: "Oyuncuları kandırarak tuzaklara çekmek ve eşyalarını almak (TPA tuzağı vb.) yasaktır." },
      { id: 12, title: "Lag Yaratacak Sistemler", desc: "Sunucuyu yoracak, lag yaratacak aşırı büyük kızıltaş (redstone) sistemleri veya aşırı mob farm'ları kurmak yasaktır." },
      { id: 13, title: "Harita Bozumu", desc: "Doğayı gereksiz yere tahrip etmek (1x1 kuleler dikmek, dev çukurlar açmak) yasaktır." }
    ]
  },
  {
    category: "Hile ve Exploit",
    rules: [
      { id: 14, title: "Hile Kullanımı", desc: "Oyun içi avantaj sağlayan herhangi bir hile (X-Ray, KillAura, Fly, vb.) kullanımı kalıcı uzaklaştırma sebebidir." },
      { id: 15, title: "Makro ve Auto-Clicker", desc: "PvP veya blok kırmada avantaj sağlayan makro, auto-clicker kullanımı yasaktır." },
      { id: 16, title: "İzin Verilmeyen İstemciler", desc: "Yalnızca izin verilen istemcilerle giriş yapılabilir. Hile içeren modifiye istemciler yasaktır." }
    ]
  }
];

export default function RulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    rulesData.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {})
  );

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredData = rulesData.map(cat => {
    const filteredRules = cat.rules.filter(rule => 
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rule.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, rules: filteredRules };
  }).filter(cat => cat.rules.length > 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">Sunucu Kuralları</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Adil ve keyifli bir oyun ortamı sağlamak için tüm oyuncularımızın aşağıdaki kurallara uyması beklenmektedir. Kuralları ihlal etmek, geçici veya kalıcı uzaklaştırmaya neden olabilir.
          </p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <Input 
              type="text" 
              placeholder="Kurallarda ara..." 
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((category) => (
              <div key={category.category} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center justify-between p-5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                >
                  <h2 className="text-xl font-semibold font-exo text-[var(--text-primary)]">
                    {category.category} <span className="text-sm font-normal text-[var(--text-tertiary)] ml-2">({category.rules.length})</span>
                  </h2>
                  {openCategories[category.category] ? (
                    <ChevronUp className="text-[var(--text-secondary)]" />
                  ) : (
                    <ChevronDown className="text-[var(--text-secondary)]" />
                  )}
                </button>
                
                {openCategories[category.category] && (
                  <div className="p-5 divide-y divide-[var(--border)]">
                    {category.rules.map((rule) => (
                      <div key={rule.id} className="py-4 first:pt-0 last:pb-0">
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-start gap-3">
                          <span className="text-emerald-500 font-bold min-w-[24px]">{rule.id}.</span>
                          {rule.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] pl-9 text-sm leading-relaxed">
                          {rule.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
              <p className="text-[var(--text-secondary)]">Arama kriterlerinize uygun kural bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
