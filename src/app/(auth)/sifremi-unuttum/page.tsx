'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-8 border border-[var(--border)] shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Şifremi Unuttum</h1>
        <p className="text-[var(--text-secondary)] mt-2">Hesabınızın e-posta adresini girin</p>
      </div>
      
      {success ? (
        <Alert type="success" className="mb-4">
          E-posta adresinize sıfırlama bağlantısı gönderildi.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-posta"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full" isLoading={loading}>
            Sıfırlama Bağlantısı Gönder
          </Button>
        </form>
      )}
      
      <p className="text-center mt-6 text-sm">
        <Link href="/giris" className="text-emerald-500 hover:underline">Giriş sayfasına dön</Link>
      </p>
    </div>
  );
}
