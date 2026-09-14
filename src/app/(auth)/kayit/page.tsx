'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';

const registerSchema = z.object({
  username: z.string().min(3, 'En az 3 karakter').max(16, 'En fazla 16 karakter'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  confirm: z.string(),
}).refine(data => data.password === data.confirm, {
  message: "Şifreler eşleşmiyor",
  path: ["confirm"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues?.[0]?.message || 'Kayıt bilgileri geçersiz');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error);
    } else {
      router.push('/giris?registered=true');
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-8 border border-[var(--border)] shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">JustNyktSMP</h1>
        <p className="text-[var(--text-secondary)] mt-2">Yeni bir hesap oluşturun</p>
      </div>
      
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Minecraft Kullanıcı Adı"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <Input
          label="E-posta"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Şifre"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Input
          label="Şifre Tekrar"
          type="password"
          value={formData.confirm}
          onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
        />
        
        <Button type="submit" className="w-full mt-6" isLoading={loading}>
          Kayıt Ol
        </Button>
      </form>
      
      <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
        Zaten hesabın var mı? <Link href="/giris" className="text-emerald-500 hover:underline">Giriş Yap</Link>
      </p>
    </div>
  );
}
