import { Scale, Store, Scroll, Shield, Trophy, RefreshCcw } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Scale,
      title: 'Dengeli Ekonomi',
      description: 'Oyuncuların emek verdiği, pay-to-win olmayan dengeli bir ekonomi sistemi.'
    },
    {
      icon: Store,
      title: 'Oyuncu Pazarı',
      description: 'Oyuncuların birbirleriyle güvenli şekilde ticaret yapabileceği market sistemi.'
    },
    {
      icon: Scroll,
      title: 'Özel Görevler',
      description: 'Günlük, haftalık ve sezonluk görevler.'
    },
    {
      icon: Shield,
      title: 'Klan Sistemi',
      description: 'Arkadaşlarınla klan kur, bölgeni geliştir ve diğer klanlarla rekabet et.'
    },
    {
      icon: Trophy,
      title: 'Etkinlikler',
      description: 'Sunucu genelinde düzenlenen özel etkinlikler ve ödüller.'
    },
    {
      icon: RefreshCcw,
      title: 'Sürekli Güncellemeler',
      description: 'Oyuncu geri bildirimleri doğrultusunda aktif geliştirme.'
    }
  ];

  return (
    <section className="w-full bg-[var(--bg-primary)] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-lg font-exo mb-4 text-[var(--text-primary)]">Neden JustNyktSMP?</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Sıradan bir hayatta kalma sunucusundan daha fazlası. Sistemlerimiz sizin için özel olarak tasarlandı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Row 1 */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {[features[0], features[1]].map((feature, idx) => (
                <FeatureCard key={idx} feature={feature} />
              ))}
            </div>
          </div>
          <div className="md:col-span-4 flex">
            <FeatureCard feature={features[2]} className="h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]" />
          </div>

          {/* Row 2 */}
          <div className="md:col-span-4 flex">
            <FeatureCard feature={features[3]} className="h-full bg-gradient-to-tr from-[var(--bg-secondary)] to-[var(--bg-tertiary)]" />
          </div>
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {[features[4], features[5]].map((feature, idx) => (
                <FeatureCard key={idx} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, className = '' }: { feature: any; className?: string }) {
  const Icon = feature.icon;
  return (
    <div className={`p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1 shadow-sm hover:shadow-md ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">{feature.title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
    </div>
  );
}
