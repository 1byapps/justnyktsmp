"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Search, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface RuleItem {
  id: number | string;
  title: string;
  desc: string;
}

interface RuleCat {
  category: string;
  rules: RuleItem[];
}

const defaultRulesData: RuleCat[] = [
  {
    category: "Genel Kurallar",
    rules: [
      { id: 1, title: "Saygı ve Nezaket", desc: "Tüm oyunculara ve yetkililere saygılı davranmak zorunludur. Din, dil, ırk, cinsiyet veya herhangi bir kişisel özellik üzerinden ayrımcılık kesinlikle yasaktır." },
      { id: 2, title: "Reklam Yasak", desc: "Başka Minecraft sunucularının, harici Discord topluluklarının veya ticari platformların reklamını yapmak (yazılı veya sesli) kalıcı uzaklaştırma sebebidir." },
      { id: 3, title: "Kişisel Bilgi Gizliliği (Doxxing)", desc: "Kendinizin veya bir başka oyuncunun gerçek isim, telefon, adres gibi kişisel bilgilerini paylaşmak kesinlikle yasaktır." },
      { id: 4, title: "Hata Bildirimi ve Exploit", desc: "Oyun içi veya sunucu kaynaklı bir hata/açık (bug/exploit) bulursanız bunu avantaj sağlamak için kullanmak yasaktır; derhal yetkililere bildirilmelidir." },
      { id: 5, title: "Yetkili Kararlarına Saygı", desc: "Yetkililerin verdiği kararlar nihaidir. İtirazlarınızı saygılı bir üslupla web sitemizdeki Destek Talebi üzerinden iletebilirsiniz." }
    ]
  },
  {
    category: "Sohbet Kuralları",
    rules: [
      { id: 6, title: "Küfür, Hakaret ve Argo", desc: "Genel sohbette küfür etmek, şahıslara veya ailevi değerlere hakaret etmek, kısaltma/noktalama ile sansürleyerek küfretmek yasaktır." },
      { id: 7, title: "Spam ve Flood", desc: "Aynı mesajı, anlamsız harfleri veya komutları arka arkaya sohbete göndererek sohbet akışını bozmak yasaktır." },
      { id: 8, title: "Büyük Harf Kullanımı (Caps Lock)", desc: "Sohbette bağırma hissi uyandıran sürekli büyük harflerle (CAPS LOCK) yazı yazmak yasaktır." },
      { id: 9, title: "Siyaset ve Provokasyon", desc: "Sunucu sohbetinde siyasi, dini veya toplumsal kutuplaşma yaratacak tartışmalar başlatmak yasaktır." }
    ]
  },
  {
    category: "Oyun İçi Davranış & Normal SMP",
    rules: [
      { id: 10, title: "Griefing ve İzinsiz Yıkım", desc: "Başkalarının emek vererek inşa ettiği yapıları kırmak, ateşe vermek, lav dökmek veya zarar vermek yasaktır. Korumasız alanlarda bile saygı esastır." },
      { id: 11, title: "TPA Tuzağı ve Dolandırıcılık", desc: "Işınlanma isteği (TPA) kabul ettirip oyuncuyu tuzağa düşürerek eşyalarını almak veya öldürmek yasaktır." },
      { id: 12, title: "Sunucu Performansını Düşürecek Sistemler", desc: "Sunucu TPS değerlerini düşürecek aşırı büyük kızıltaş döngüleri, sınırsız mob üretim alanları veya lag makineleri kurmak yasaktır." },
      { id: 13, title: "Çevre ve Doğa Katliamı", desc: "Harita düzenini bozacak 1x1 lava/su kuleleri dikmek, havada asılı yapraklar bırakmak veya devasa anlamsız çukurlar açmak yasaktır." }
    ]
  },
  {
    category: "Hile ve Exploit Yasakları",
    rules: [
      { id: 14, title: "Haksız Avantaj Sağlayan Hileler", desc: "X-Ray, KillAura, Fly, Speed, Reach, Auto-Totem, Baritone gibi oyun dengesini bozan her türlü üçüncü parti hile yazılımı kalıcı ban sebebidir." },
      { id: 15, title: "Makro ve Otomatik Tıklayıcılar", desc: "PvP mücadelesinde, afk farm'larda veya blok kırmada insan reflekslerini aşan makro ve auto-clicker kullanımı yasaktır." },
      { id: 16, title: "İzin Verilmeyen İstemci Modları", desc: "Yalnızca OptiFine, Sodium, Iris, Lunar/Badlion Client gibi performans ve kozmetik modlarına izin verilir. Freecam vb. modlar hile sayılır." }
    ]
  },
  {
    category: "Ticaret ve Ekonomi Kuralları",
    rules: [
      { id: 17, title: "Gerçek Para ile Ticaret (RMT)", desc: "Oyun içi eşyaları, paraları veya hesapları gerçek para (TL, kripto vb.) karşılığında oyuncular arasında satmak kesinlikle yasaktır." },
      { id: 18, title: "Pazar Dolandırıcılığı", desc: "Pazara veya takas alanlarına yanıltıcı isimlerle eşya koymak veya oyuncuları kandırarak haksız kazanç sağlamak cezalandırılır." }
    ]
  },
  {
    category: "PvP ve Mücadele Kuralları",
    rules: [
      { id: 19, title: "Doğma Noktası Pususu (Spawn Kill)", desc: "Yeni başlayan veya doğma noktasından henüz çıkmış oyuncuları sürekli olarak öldürmek ve oyundan bezdirmek yasaktır." },
      { id: 20, title: "Savaş Sırasında Oyundan Çıkma (Combat Log)", desc: "PvP mücadelesi esnasında eşyalarını kaybetmemek için oyundan çıkmak yasaktır; sistem tarafından otomatik cezalandırılırsınız." }
    ]
  },
  {
    category: "Klan ve Birlik Kuralları",
    rules: [
      { id: 21, title: "Klan İsimleri ve Kısaltmaları", desc: "Klan adlarında ve etiketlerinde (TAG) küfür, argo, nefret söylemi veya siyasi ifadeler kullanmak klanın feshine sebep olur." },
      { id: 22, title: "Klan İçi İhanet ve Hırsızlık", desc: "Bir klana üye olup sandıkları boşaltarak veya yapıları patlatarak klandan ayrılmak yasaktır." }
    ]
  },
  {
    category: "Discord ve İletişim",
    rules: [
      { id: 23, title: "Ses Kanalları Kuralları", desc: "Ses kanallarında aşırı gürültü yapmak, ses değiştirici programlarla rahatsızlık vermek ve izinsiz ses kaydı almak yasaktır." },
      { id: 24, title: "Yetkilileri Gereksiz Etiketleme", desc: "Yetkili ekibini gereksiz yere birden fazla kez etiketlemek veya özel mesajlardan spam yapmak yasaktır; destek talebi açınız." }
    ]
  }
];

export default function RulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesData, setCategoriesData] = useState<RuleCat[]>(defaultRulesData);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadRules() {
      try {
        const res = await fetch("/api/rules");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped: RuleCat[] = json.data.map((cat: any) => ({
            category: cat.name,
            rules: (cat.rules || []).map((r: any) => ({
              id: r.ruleNumber || r.id,
              title: r.title,
              desc: r.content,
            })),
          })).filter((c: RuleCat) => c.rules.length > 0);

          if (mapped.length > 0) {
            setCategoriesData(mapped);
            setOpenCategories(mapped.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {}));
            return;
          }
        }
      } catch (err) {
        console.error("Rules API fetch error:", err);
      }
      setOpenCategories(defaultRulesData.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {}));
    }
    loadRules();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredData = categoriesData.map((cat) => {
    const filteredRules = cat.rules.filter((rule) =>
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, rules: filteredRules };
  }).filter((cat) => cat.rules.length > 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldAlert size={14} /> JustNyktSMP Topluluk Standartları
          </div>
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">Sunucu Kuralları</h1>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            Adil, saygılı ve dengeli bir Normal SMP ortamı sağlamak için tüm oyuncularımızın aşağıdaki kurallara uyması zorunludur. İhlaller durumunda cezai yaptırımlar uygulanır.
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
            <Input
              type="text"
              placeholder="Kurallarda ara (Örn: hile, küfür, pvp, grief, claim)..."
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border)] focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((category) => (
              <div
                key={category.category}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center justify-between p-5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                >
                  <h2 className="text-lg sm:text-xl font-semibold font-exo text-[var(--text-primary)]">
                    {category.category}{' '}
                    <span className="text-xs font-normal text-[var(--text-tertiary)] ml-2">
                      ({category.rules.length} kural)
                    </span>
                  </h2>
                  {openCategories[category.category] ? (
                    <ChevronUp className="text-[var(--text-secondary)] h-5 w-5" />
                  ) : (
                    <ChevronDown className="text-[var(--text-secondary)] h-5 w-5" />
                  )}
                </button>

                {openCategories[category.category] && (
                  <div className="p-5 divide-y divide-[var(--border)]">
                    {category.rules.map((rule) => (
                      <div key={rule.id} className="py-4 first:pt-0 last:pb-0">
                        <h3 className="text-base font-medium text-[var(--text-primary)] mb-2 flex items-start gap-3">
                          <span className="text-emerald-500 font-mono font-bold min-w-[32px]">
                            §{rule.id}
                          </span>
                          {rule.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] pl-11 text-sm leading-relaxed">
                          {rule.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)]">
              <p className="text-[var(--text-secondary)]">Arama kriterinize uygun bir kural bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
