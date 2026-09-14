'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function SettingsPage() {
  const [success, setSuccess] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Ayarlarınız başarıyla güncellendi.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hesap Ayarları</h1>
        <p className="text-[var(--text-secondary)] mt-1">E-posta ve şifrenizi güncelleyin.</p>
      </div>

      {success && <Alert type="success">{success}</Alert>}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Şifre Değiştir</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <Input label="Mevcut Şifre" type="password" required />
          <Input label="Yeni Şifre" type="password" required />
          <Input label="Yeni Şifre (Tekrar)" type="password" required />
          <Button type="submit">Şifreyi Güncelle</Button>
        </form>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-red-500/20 rounded-xl p-6">
        <h2 className="text-lg font-bold text-red-500 mb-2">Tehlikeli Bölge</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak kaldırılır ve geri alınamaz.
        </p>
        <Button variant="danger">Hesabımı Sil</Button>
      </div>
    </div>
  );
}
