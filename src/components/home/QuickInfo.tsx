import { Server, Box, Globe, MessageSquare, Users } from 'lucide-react';

export function QuickInfo() {
  const infos = [
    { icon: Globe, label: 'Sunucu IP', value: 'play.justnyktsmp.net' },
    { icon: Box, label: 'Sürüm', value: '1.21.x' },
    { icon: Server, label: 'Oyun Modu', value: 'Survival SMP' },
    { icon: MessageSquare, label: 'Discord', value: 'Aktif Topluluk' },
    { icon: Users, label: 'Kayıtlı Oyuncu', value: '10,000+' }
  ];

  return (
    <section className="w-full bg-[var(--bg-secondary)] border-y border-[var(--border)] py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {infos.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-emerald-500">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-0.5">{info.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{info.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
