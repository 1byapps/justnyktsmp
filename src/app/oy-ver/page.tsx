"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Gift, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

const voteSites = [
  { id: 1, name: 'Minecraft-MP', url: '#', reward: '1x Oy Kasası Anahtarı, 500 Oyun Parası', cooldown: '24 Saat' },
  { id: 2, name: 'TopG', url: '#', reward: '1x Oy Kasası Anahtarı, 500 Oyun Parası', cooldown: '24 Saat' },
  { id: 3, name: 'MinecraftServers.org', url: '#', reward: '1x Oy Kasası Anahtarı, 500 Oyun Parası', cooldown: '24 Saat' },
  { id: 4, name: 'PlanetMinecraft', url: '#', reward: '1x Oy Kasası Anahtarı, 500 Oyun Parası', cooldown: '24 Saat' }
];

export default function VotePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center mb-16">
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">Sunucuya Oy Ver</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Sunucumuzu destekleyerek büyümemize yardımcı olun ve karşılığında harika oyun içi ödüller kazanın!
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-[var(--bg-secondary)] border border-emerald-500/30 rounded-xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Ödülleri Almak İçin Giriş Yapın</h3>
              <p className="text-sm text-[var(--text-secondary)]">Oy ödüllerinizin doğrudan oyun içi hesabınıza gelmesi için siteye giriş yapmalısınız.</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
              Giriş Yap
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {voteSites.map((site) => (
            <div key={site.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 flex flex-col hover:border-emerald-500/50 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold font-exo text-[var(--text-primary)] mb-1">{site.name}</h3>
                  <div className="flex items-center text-sm text-[var(--text-tertiary)] gap-1">
                    <Clock size={14} />
                    <span>Bekleme Süresi: {site.cooldown}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Gift size={20} className="text-emerald-500" />
                </div>
              </div>
              
              <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-6">
                <p className="text-sm text-[var(--text-secondary)]"><span className="text-[var(--text-primary)] font-medium">Ödül:</span> {site.reward}</p>
              </div>
              
              <Button className="w-full mt-auto" variant="outline" asChild>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  Oy Ver <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Vote Streak Section */}
        <div className="bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500 pointer-events-none">
            <Gift size={120} />
          </div>
          
          <h2 className="heading-lg font-exo text-[var(--text-primary)] mb-2 relative z-10">Günlük Seri Ödülleri</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl relative z-10">Art arda her gün oy vererek daha büyük ödüller kazanın. Seriyi bozarsanız baştan başlarsınız!</p>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isCompleted = day <= 3; // Mock 3 day streak
              const isToday = day === 4;
              
              return (
                <div key={day} className="flex flex-col items-center gap-2 relative">
                  {day < 7 && (
                    <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--bg-tertiary)]'}`}></div>
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${
                    isCompleted ? 'bg-emerald-500 text-white' : 
                    isToday ? 'bg-[var(--bg-tertiary)] border-2 border-emerald-500 text-[var(--text-primary)]' : 
                    'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                  }`}>
                    {isCompleted ? <CheckCircle size={20} /> : day}
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{day}. Gün</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)] relative z-10">
            <h3 className="text-[var(--text-primary)] font-medium mb-2">Mevcut Seri: <span className="text-emerald-500 text-xl font-bold ml-2">3 Gün</span></h3>
            <p className="text-sm text-[var(--text-secondary)]">7 günlük seriyi tamamladığınızda ekstra "Epik Kasa Anahtarı" kazanırsınız!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
