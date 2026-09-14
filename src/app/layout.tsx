import type { Metadata } from 'next';
import { Inter, Exo_2 } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-exo2' });

export const metadata: Metadata = {
  title: 'JustNyktSMP | Minecraft SMP Sunucusu',
  description: 'Topluluğun şekillendirdiği, rekabetin ve hayatta kalmanın bir araya geldiği modern SMP deneyimi.',
  openGraph: {
    title: 'JustNyktSMP | Minecraft SMP Sunucusu',
    description: 'Topluluğun şekillendirdiği, rekabetin ve hayatta kalmanın bir araya geldiği modern SMP deneyimi.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${exo2.variable}`}>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
