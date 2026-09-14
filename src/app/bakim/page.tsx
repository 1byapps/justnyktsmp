import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Wrench, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bakım | JustNyktSMP',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-3xl p-10 max-w-lg w-full text-center shadow-xl relative z-10">
        <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
            <Wrench size={48} />
        </div>
        
        <h1 className="heading-lg font-exo text-[var(--text-primary)] mb-2">Bakım Modu</h1>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          Sunucumuz şu anda bakım modunda. Altyapı iyileştirmeleri ve güncellemeler yapıyoruz. Kısa süre içinde tekrar hizmetinizde olacağız.
        </p>
        
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 flex items-center justify-center gap-3 mb-8 border border-[var(--border)]">
            <Clock className="text-emerald-500" size={20} />
            <span className="text-[var(--text-primary)] font-medium">Tahmini Bitiş: <span className="text-emerald-500 ml-1">Bugün 22:00</span></span>
        </div>

        <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white" asChild>
            <a href="https://discord.gg/justnyktsmp" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={18} className="mr-2" /> Discord'dan Bilgi Al
            </a>
        </Button>
      </div>
    </div>
  );
}
