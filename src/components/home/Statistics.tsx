"use client";

import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, UserPlus, Shield, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Statistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchStats = async () => {
      try {
        setTimeout(() => {
          setStats({
            activePlayers: 128,
            totalPlayers: 14502,
            clans: 342,
            questsCompleted: 85901,
            uptime: '99.9%'
          });
          setLoading(false);
        }, 1200);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { title: 'Aktif Oyuncular', value: stats?.activePlayers, icon: <Users size={20} className="text-emerald-500" /> },
    { title: 'Toplam Kayıtlı', value: stats?.totalPlayers, icon: <UserPlus size={20} className="text-emerald-500" /> },
    { title: 'Oluşturulan Klanlar', value: stats?.clans, icon: <Shield size={20} className="text-emerald-500" /> },
    { title: 'Tamamlanan Görevler', value: stats?.questsCompleted, icon: <CheckCircle size={20} className="text-emerald-500" /> },
    { title: 'Sunucu Çalışma Süresi', value: stats?.uptime, icon: <Clock size={20} className="text-emerald-500" /> }
  ];

  return (
    <section className="w-full bg-[var(--bg-secondary)] py-20 border-y border-[var(--border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="heading-lg font-exo text-[var(--text-primary)]">Sunucu İstatistikleri</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statItems.map((stat, idx) => (
            <div key={idx} className="bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--bg-tertiary)]">
                  {stat.icon}
                </div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">{stat.title}</h3>
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
