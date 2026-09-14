import { Metadata } from 'next';
import { CopyButton } from '@/components/common/CopyButton';
import { Server, Compass, Shield, Pickaxe, Users, Sword } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sunucu | JustNyktSMP',
  description: 'JustNyktSMP sunucu bilgileri, özellikleri ve katılma rehberi.',
};

export default function ServerPage() {
  const systems = [
    { icon: Compass, title: 'Ekonomi', desc: 'Dengeli ve tamamen oyuncu odaklı bir piyasa. Sadece ticaret yaparak değil, meslekler ve görevlerle de gelişin.' },
    { icon: Shield, title: 'Klanlar', desc: 'Arkadaşlarınızla bir araya gelip kendi imparatorluğunuzu kurun, topraklarınızı koruyun ve diğer klanlarla diplomatik ilişkiler geliştirin.' },
    { icon: Pickaxe, title: 'Görevler', desc: 'Sıradan hayatta kalma rutininizi kıracak çeşitli günlük ve haftalık görevler. Tamamlayarak özel ödüller kazanın.' },
    { icon: Users, title: 'Etkinlikler', desc: 'Hafta sonları düzenlenen sunucu çapında etkinlikler. Özel boss savaşları, parkur yarışları ve daha fazlası.' },
    { icon: Sword, title: 'PvP Sistemi', desc: 'Adil ve kontrollü PvP mekanikleri. Sadece belirli alanlarda ve savaş etkinliklerinde yeteneklerinizi sergileyin.' },
    { icon: Server, title: 'Dünya Yapısı', desc: 'Düzenli olarak güncellenen geniş ve zengin bir dünya. Yapılarınızı inşa edebileceğiniz güvenli bölgeler.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-6">JustNyktSMP Nedir?</h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            JustNyktSMP, klasik Minecraft hayatta kalma deneyimini modern RPG ögeleri ve güçlü bir topluluk yapısıyla harmanlayan yenilikçi bir sunucudur. Hedefimiz, oyuncuların kendi hikayelerini yazabilecekleri, adil ve rekabetçi bir ortam sunmaktır.
          </p>
        </div>

        {/* Join Guide */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-16 shadow-sm">
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-8 text-center">Nasıl Katılırım?</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Minecraft Java Edition'ı Aç</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sunucumuz 1.21.x sürümlerini desteklemektedir.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Çok Oyunculu (Multiplayer) Menüsüne Gir</h3>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Sunucu Ekle (Add Server) Butonuna Tıkla</h3>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">4</div>
              <div className="w-full">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">IP Adresini Gir</h3>
                <div className="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 w-full sm:w-2/3">
                  <span className="font-mono text-emerald-400">play.justnyktsmp.net</span>
                  <CopyButton value="play.justnyktsmp.net" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">JustNyktSMP'ye Katıl!</h3>
                <p className="text-sm text-[var(--text-secondary)]">Kaydınızı oyun içinden tamamlayıp maceraya başlayabilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Systems */}
        <div className="mb-8">
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-10 text-center">Temel Sistemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((sys, idx) => {
              const Icon = sys.icon;
              return (
                <div key={idx} className="bg-[var(--bg-elevated)] border border-[var(--border)] p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-emerald-500 mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{sys.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{sys.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
