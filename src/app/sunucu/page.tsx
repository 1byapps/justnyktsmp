import { Metadata } from 'next';
import { CopyButton } from '@/components/common/CopyButton';
import { Server, Compass, Shield, Pickaxe, Users, Sword, HeartHandshake, Mic, Briefcase, Key, Map } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sunucu | JustNyktSMP',
  description: 'JustNyktSMP 1.8 - 1.21.x Normal SMP sunucu bilgileri, katılım rehberi ve komut listesi.',
};

export default function ServerPage() {
  const systems = [
    { icon: Briefcase, title: 'Meslekler & Ekonomi (/jobs)', desc: 'Madenci, Oduncu, Avcı, Balıkçı vb. mesleklerle çalışarak adil oyun içi para kazanın.' },
    { icon: Compass, title: '4 Dinamik Mevsim Döngüsü', desc: 'İlkbahar, Yaz, Sonbahar ve Kış şartları; sıcaklık, donma ve mevsime özel tarım dinamikleri.' },
    { icon: Shield, title: 'Altın Kürek Claim & [Özel] Kilit', desc: 'Arazinizi koruma altına alın, sandık ve fırınlarınıza [Ozel] tabela koyarak güvenle kilitleyin.' },
    { icon: HeartHandshake, title: 'Mezar Sistemi (GravesX)', desc: 'Öldüğünüzde eşyalarınız lavda yanmaz, 5 dakikada silinmez. Korumalı mezarınızdan geri alın.' },
    { icon: Mic, title: '3D Sesli Sohbet & Hareketler', desc: 'Simple Voice Chat ile konumsal 3D sesli sohbet. /sit oturma, /lay uzanma, /crawl sürünme mekanikleri.' },
    { icon: Server, title: '1.8 - 1.21.x & Bedrock Desteği', desc: 'Tüm Java sürümleri (1.8 - 1.21.4) ve Geyser sayesinde Bedrock (Mobil, Tablet, Konsol) desteği.' },
  ];

  const commands = [
    { cmd: '/register <şifre> <şifre>', desc: 'İlk girişte hesabınızı korumak için şifre belirler.' },
    { cmd: '/login <şifre>', desc: 'Sonraki girişlerde oyuna giriş yapar.' },
    { cmd: '/rtp', desc: 'Güvenli, boş bir vahşi doğa arazisine rastgele ışınlar.' },
    { cmd: '/sethome [isim]', desc: 'Bulunduğunuz konumu eviniz olarak kaydeder.' },
    { cmd: '/home [isim]', desc: 'Kaydettiğiniz evinize ışınlar.' },
    { cmd: '/tpa [oyuncu]', desc: 'Arkadaşınıza ışınlanma isteği gönderir.' },
    { cmd: '/tpaccept', desc: 'Gelen ışınlanma isteğini kabul eder.' },
    { cmd: '/spawn veya /hub', desc: 'Başlangıç noktasına / lobiye döner.' },
    { cmd: '/jobs browse', desc: 'Meslekler menüsünü açar (Madenci, Oduncu vb.).' },
    { cmd: '/ah', desc: 'Açık artırma oyuncu pazarını açar.' },
    { cmd: '/trade <oyuncu>', desc: 'Yakındaki oyuncuyla güvenli takas menüsünü açar.' },
    { cmd: '/sit & /lay & /crawl', desc: 'Yere oturma, uzanma veya 1 blokluk alanda sürünme.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            Normal SMP &bull; 1.8 - 1.21.x (Java & Bedrock)
          </div>
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-6">JustNyktSMP Nedir?</h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            JustNyktSMP, pay-to-win unsurlarından arındırılmış, oyuncuların kendi emeğiyle yükseldiği saf ve dengeli bir <strong>Normal SMP (Survival Multiplayer)</strong> sunucusudur. 4 mevsim döngüsü, meslekler, klanlar, açık artırma pazarı, 3D yakınlık sesli sohbeti ve eşya kaybını önleyen mezar sistemiyle gerçek hayatta kalma keyfini yaşayın.
          </p>
        </div>

        {/* Join Guide */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-16 shadow-sm">
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-8 text-center">Nasıl Katılırım?</h2>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Minecraft'ı Başlatın</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>Java Edition:</strong> 1.8 ile 1.21.4 arasındaki tüm sürümlerle girebilirsiniz (Önerilen: 1.21.4).<br />
                  <strong>Bedrock Edition:</strong> Mobil, Tablet, Windows 10 veya Konsoldan bağlanabilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Çok Oyunculu / Sunucu Ekle</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sunucu Adı kısmına <strong>JustNykt SMP</strong> yazabilirsiniz.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">3</div>
              <div className="w-full">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Java Sunucu Adresi (IP & Port)</h3>
                <div className="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 w-full sm:w-4/5 mb-3">
                  <span className="font-mono text-emerald-400 font-semibold text-sm sm:text-base truncate mr-2">schmidt-scanners.tun.ply.gg:64110</span>
                  <CopyButton value="schmidt-scanners.tun.ply.gg:64110" />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Eğer port ayrı soruluyorsa: IP: <code className="text-emerald-400">schmidt-scanners.tun.ply.gg</code> | Port: <code className="text-emerald-400">64110</code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">4</div>
              <div className="w-full">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Bedrock (Mobil / Konsol) Bağlantısı</h3>
                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)]">
                  Sunucu IP: <span className="font-mono text-emerald-400 font-semibold">schmidt-scanners.tun.ply.gg</span><br />
                  Port: <span className="font-mono text-emerald-400 font-semibold">19132</span> (veya <span className="font-mono text-emerald-400">64110</span>)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Giriş Yapın & Kayıt Olun</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Hem Orijinal hem Crack giriş desteklenir. İlk girişinizde sohbeti açıp <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">/register &lt;şifreniz&gt; &lt;şifreniz&gt;</code> yazarak güvenle başlayın!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Systems */}
        <div className="mb-16">
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

        {/* Commands Cheat-sheet */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-6 text-center">En Çok Kullanılan Sunucu Komutları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commands.map((c, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex flex-col justify-between">
                <span className="font-mono text-emerald-400 font-semibold text-sm mb-1">{c.cmd}</span>
                <span className="text-xs text-[var(--text-secondary)]">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
