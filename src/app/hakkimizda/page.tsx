import { Shield, Sparkles, Users, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/common/CopyButton";

export const metadata = {
  title: "Hakkımızda | JustNyktSMP",
  description: "JustNyktSMP Minecraft sunucusu hakkında detaylı bilgi, vizyonumuz ve topluluk değerlerimiz.",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Modern Minecraft Topluluğu</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight font-['Exo_2'] mb-4">
            JustNyktSMP Hakkında
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Türkiye'nin en dengeli, emek odaklı ve oyuncu merkezli Minecraft Survival (SMP) deneyimini sunmak için yola çıktık.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Pay-to-Win Karşıtı</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Oyun içi dengeleri bozan, haksız avantaj sağlayan eşya satışları kesinlikle bulunmaz. Emek veren her oyuncu en güçlü olabilir.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Yüksek Performans (20 TPS)</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Optimize edilmiş Aikar GC bayrakları, Purpur çekirdeği ve donanımlı altyapımızla takılma ve gecikme olmaksızın akıcı oyun sunuyoruz.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Aktif Topluluk & Sesli Sohbet</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Simple Voice Chat entegrasyonu sayesinde arkadaşlarınızla 3D konumsal sesle konuşabilir, klanlar kurup büyük savaşlara katılabilirsiniz.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 md:p-10 mb-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Hikayemiz & Felsefemiz</h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
            <p>
              JustNyktSMP, klasik hayatta kalma modunun özünü korurken modern eklentilerle zenginleştirilmiş bir oyun deneyimi sunma amacıyla kuruldu. Oyuncuların inşa ettiği devasa yapılar, kurulan klanlar ve canlı pazar ekonomisi, sunucumuzu basit bir oyundan çok bir dijital topluluğa dönüştürmektedir.
            </p>
            <p>
              Sunucumuzda adaleti sağlamak için CoreProtect blok teftiş sistemi, gelişmiş hile koruması ve aktif yetkili kadromuz 7/24 görev yapmaktadır. Yapılarınız ve sandıklarınız altın kürek claim sistemiyle tamamen güvence altındadır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-[var(--text-primary)] font-medium">1.8 - 1.21.x Tüm Sürümlerle Giriş</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-[var(--text-primary)] font-medium">Java & Bedrock (Mobil) Çapraz Oyun</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-[var(--text-primary)] font-medium">Canlı Web Haritası (Squaremap)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-[var(--text-primary)] font-medium">Meslekler, Pazar ve Güvenli Takas</span>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[var(--bg-secondary)] to-transparent border border-emerald-500/20">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Maceraya Katılmaya Hazır Mısın?</h3>
            <p className="text-xs text-[var(--text-secondary)]">Hemen sunucu adresimizi kopyala ve çok oyunculu menüsüne ekle!</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono text-emerald-400">
              <span>schmidt-scanners.tun.ply.gg</span>
            </div>
            <CopyButton value="schmidt-scanners.tun.ply.gg" />
          </div>
        </div>

      </div>
    </div>
  );
}
