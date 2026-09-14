import { Hero } from '@/components/home/Hero';
import { QuickInfo } from '@/components/home/QuickInfo';
import { Features } from '@/components/home/Features';
import { Statistics } from '@/components/home/Statistics';
import { LatestNews } from '@/components/home/LatestNews';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JustNyktSMP | Modern Hayatta Kalma Deneyimi',
  description: 'Topluluğun şekillendirdiği, rekabetin ve hayatta kalmanın bir araya geldiği modern Minecraft SMP deneyimi.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <QuickInfo />
      <Features />
      <Statistics />
      <LatestNews />
    </div>
  );
}
