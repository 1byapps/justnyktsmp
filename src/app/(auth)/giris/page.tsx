'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';

const loginSchema = z.object({
  identifier: z.string().min(3, 'E-posta veya kullanıcı adı girin.'),
  password: z.string().min(1, 'Şifre girin.'),
});

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues?.[0]?.message || 'Giriş bilgileri hatalı');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      setLoading(false);

      if (res?.error) {
        setError('E-posta / kullanıcı adı veya şifre hatalı.');
      } else {
        window.location.href = '/panel';
      }
    } catch {
      setLoading(false);
      setError('Giriş yapılırken bir hata oluştu. Bilgilerinizi kontrol edip tekrar deneyin.');
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-8 border border-[var(--border)] shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">JustNyktSMP</h1>
        <p className="text-[var(--text-secondary)] mt-2">Hesabınıza giriş yapın</p>
      </div>
      
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-posta veya Kullanıcı Adı"
          value={formData.identifier}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
        />
        <Input
          label="Şifre"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
            <input type="checkbox" className="rounded border-[var(--border)] bg-[var(--bg-tertiary)]" />
            <span>Beni Hatırla</span>
          </label>
          <Link href="/sifremi-unuttum" className="text-sm text-emerald-500 hover:underline">
            Şifremi Unuttum
          </Link>
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          Giriş Yap
        </Button>
      </form>
      
      <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
        Hesabın yok mu? <Link href="/kayit" className="text-emerald-500 hover:underline">Kayıt Ol</Link>
      </p>
    </div>
  );
}
