'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

const categories = [
  { value: 'gameplay', label: 'Oyun İçi Sorun' },
  { value: 'store', label: 'Market / Ödeme' },
  { value: 'report', label: 'Oyuncu Şikayeti' },
  { value: 'bug', label: 'Hata Bildirimi' },
  { value: 'other', label: 'Diğer' },
];

export default function NewTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ subject: '', category: 'gameplay', content: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Create
    setTimeout(() => {
      setLoading(false);
      router.push('/destek');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mt-16">
      <h1 className="text-2xl font-bold mb-6">Yeni Destek Talebi</h1>
      
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        {error && <Alert type="error" className="mb-4">{error}</Alert>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Konu Başlığı" 
            required 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Sorununuzu kısaca özetleyin"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Kategori"
              options={categories}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input 
              label="Oyun İçi Kullanıcı Adı (Opsiyonel)" 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
              Detaylı Açıklama
            </label>
            <textarea 
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y min-h-[150px]"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Lütfen sorununuzu detaylı bir şekilde açıklayın..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              İptal
            </Button>
            <Button type="submit" isLoading={loading}>
              Talebi Oluştur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
