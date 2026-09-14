"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "Giriş & Bağlantı",
    items: [
      {
        q: "Sunucuya hangi Minecraft sürümleriyle katılabilirim?",
        a: "Sunucumuz ViaVersion ve ViaBackwards desteği ile 1.8 ile 1.21.x arasındaki tüm Minecraft Java sürümlerini desteklemektedir. Tavsiye edilen en akıcı sürüm 1.21.4'tür."
      },
      {
        q: "Telefondan (Bedrock/Pocket Edition) giriş yapabilir miyim?",
        a: "Evet! GeyserMC entegrasyonu ile Bedrock ve mobil oyuncuları da katılabilir. Sunucu IP: schmidt-scanners.tun.ply.gg, Port: 19132 olarak ekleyebilirsiniz."
      },
      {
        q: "Sunucuya ilk defa giriyorum, ne yapmalıyım?",
        a: "Girdiğinizde güvenliğiniz için '/register <şifreniz> <şifreniz>' yazarak hesabınızı şifreleyin. Ardından pusulaya sağ tıklayarak SMP dünyasına geçiş yapabilirsiniz."
      }
    ]
  },
  {
    category: "Oyun İçi Sistemler & Claim",
    items: [
      {
        q: "Evimi ve arazimi (Claim) nasıl koruyabilirim?",
        a: "Elinize Altın Kürek alıp korumak istediğiniz alanın iki çapraz köşesine sağ tıklayarak alanınızı anında claimleyebilirsiniz. Arkadaşınızı eklemek için: /trust <oyuncu_adı>."
      },
      {
        q: "Sandıklarımı ve fırınlarımı nasıl kilitlerim?",
        a: "Sandığınızın veya fırınınızın üzerine bir tabela koyup ilk satırına [Özel] yazmanız yeterlidir. Sizden başka hiç kimse açamaz."
      },
      {
        q: "Öldüğümde eşyalarım kaybolur mu?",
        a: "Hayır! Sunucumuzda Graves (Mezar) sistemi bulunmaktadır. Öldüğünüzde eşyalarınız korumalı bir mezar taşı içinde saklanır; mezarınıza gidip tıkladığınızda tüm eşyalarınızı geri alırsınız."
      },
      {
        q: "Nasıl para kazanabilirim?",
        a: "'/jobs join' ile bir mesleğe katılabilir (Madenci, Oduncu, Avcı vb.), maden ve ürün satabilir veya '/ah' oyuncu pazarına eşya koyarak para kazanabilirsiniz."
      }
    ]
  },
  {
    category: "Mağaza & Destek",
    items: [
      {
        q: "Satın aldığım VIP veya ürünler ne zaman teslim edilir?",
        a: "Web mağazamızdan satın aldığınız ürünler JustNyktSync eklentisi sayesinde saniyeler içerisinde otomatik olarak oyun içi hesabınıza teslim edilir."
      },
      {
        q: "Bir sorun yaşadığımda yetkililere nasıl ulaşabilirim?",
        a: "Web sitemizin Destek bölümünden anında bir destek bileti açabilir veya resmi Discord sunucumuz üzerinden yetkili ekibimize ulaşabilirsiniz."
      }
    ]
  }
];

export default function SssPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Yardım & Yanıtlar</span>
          </span>
          <h1 className="text-4xl font-extrabold text-[var(--text-primary)] font-['Exo_2'] mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            JustNyktSMP hakkında merak edilen tüm soruların yanıtları burada. Aradığınızı bulamadınız mı? Destek ekibimize yazabilirsiniz.
          </p>
        </div>

        <div className="space-y-10">
          {FAQS.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[var(--border)] pb-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>{cat.category}</span>
              </h2>

              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[id];
                  return (
                    <div key={itemIdx} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors">
                      <button
                        onClick={() => toggle(id)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--text-primary)] hover:text-emerald-400"
                      >
                        <span>{item.q}</span>
                        <ChevronDown className={`h-5 w-5 text-[var(--text-tertiary)] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]/50 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <h3 className="text-xl font-bold text-white mb-2">Başka bir sorunuz mu var?</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Ekibimiz size yardımcı olmaktan mutluluk duyar. Bir destek bileti oluşturun veya Discord'umuza katılın.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/destek/yeni" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
              Destek Talebi Aç
            </Link>
            <a href="https://discord.gg/justnyktsmp" target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm font-semibold border border-[var(--border)] transition-colors">
              Discord Sunucumuz
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
