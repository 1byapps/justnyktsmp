'use client';
import { StatCard } from '@/components/ui/StatCard';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
// Importing recharts dynamically if needed, or directly
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dummyData = [
  { name: 'Pzt', uv: 4000, pv: 2400 },
  { name: 'Sal', uv: 3000, pv: 1398 },
  { name: 'Çar', uv: 2000, pv: 9800 },
  { name: 'Per', uv: 2780, pv: 3908 },
  { name: 'Cum', uv: 1890, pv: 4800 },
  { name: 'Cmt', uv: 2390, pv: 3800 },
  { name: 'Paz', uv: 3490, pv: 4300 },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Yönetim Paneli</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <StatCard title="Çevrimci Oyuncular" value="142" />
            <StatCard title="Kayıtlı Kullanıcılar" value="1,204" />
            <StatCard title="Bugün Yeni" value="+24" />
            <StatCard title="Bekleyen Ticketlar" value="5" />
            <StatCard title="Bugün Sipariş" value="12" />
            <StatCard title="Gelir" value="₺4,250" />
            <StatCard title="Sunucu Durumu" value="Aktif" />
            <StatCard title="TPS" value="20.0" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <h2 className="text-lg font-bold mb-4">Oyuncu Aktivitesi</h2>
          <div className="h-64">
            {loading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Line type="monotone" dataKey="pv" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <h2 className="text-lg font-bold mb-4">Mağaza Geliri</h2>
          <div className="h-64">
            {loading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Bar dataKey="uv" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
