import { Metadata } from 'next';
import { CopyButton } from '@/components/common/CopyButton';
import { Server, Compass, Shield, Pickaxe, Users, Sword } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sunucu | JustNyktSMP',
  description: 'JustNyktSMP sunucu bilgileri, özellikleri ve katılma rehberi.',
};

export default function ServerPage() {
  const systems = [
    { icon: Compass, title: 'Dengeli Oyuncu Ekonomisi', desc: 'Pay-to-win olmayan, tamamen oyuncu emeğine ve ticaretine dayalı adil pazar sistemi.' },
    { icon: Shield, title: 'Klan & Birlik Sistemi', desc: 'Arkadaşlarınızla klan kurun, bölgenizi geliştirin ve sunucunun en saygın birliği olmak için yükselin.' },
    { icon: Pickaxe, title: 'Arazi & Sandık Güvenliği', desc: 'İnşa ettiğiniz yapıları ve sandıklarınızı koruma altına alarak kayıp ve keder yaşamadan huzurla oynayın.' },
    { icon: Server, title: 'Geniş Sürüm Desteği', desc: 'Sunucumuz 1.21.4 tabanlıdır ancak geriye dönük eklentiler sayesinde 1.16 ve üzeri tüm sürümlerle bağlanabilirsiniz.' },
    { icon: Sword, title: 'Adil PvP & Mücadele', desc: 'Hilesiz, net vuruş kayıtlarına sahip, yetenek ve ekipmanın konuştuğu dengeli savaş deneyimi.' },
    { icon: Users, title: 'Aktif & Sıcak Topluluk', desc: 'Saygılı, samimi ve kurallara bağlı bir oyuncu kitlesi ile keyifli sohbetler ve ortak projeler.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            Normal SMP Deneyimi
          </div>
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-6">JustNyktSMP Nedir?</h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            JustNyktSMP, pay-to-win unsurlarından arındırılmış, oyuncuların kendi emeğiyle yükseldiği saf ve dengeli bir <strong>Normal SMP (Survival Multiplayer)</strong> sunucusudur. Karmaşık minigame veya abartılı sistemler yerine; arkadaşlarınızla güvenle üs kurabileceğiniz, ticaret yapabileceğiniz ve hayatta kalabileceğiniz samimi bir topluluk sunuyoruz.
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
                <p className="text-sm text-[var(--text-secondary)]">Önerilen sürüm <strong>1.21.4</strong> olmakla birlikte <strong>tüm sürümler (1.16+)</strong> ile giriş yapabilirsiniz.</p>
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
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Sunucu Adresini Gir</h3>
                <div className="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 w-full sm:w-3/4">
                  <span className="font-mono text-emerald-400 font-semibold text-sm sm:text-base truncate mr-2">schmidt-scanners.tun.ply.gg</span>
                  <CopyButton value="schmidt-scanners.tun.ply.gg" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">JustNyktSMP'ye Katıl!</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sunucuya bağlanıp maceranıza hemen başlayabilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Systems */}
        <div className="mb-8">
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-10 text-center">Temel Sunucu Özellikleri</h2>
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
