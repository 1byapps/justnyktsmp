"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';
import { Cart } from '@/components/shop/Cart';
import { useCart } from '@/lib/cart-context';

const categories = ['Tümü', 'Rütbeler', 'Anahtarlar', 'Kozmetik', 'Paketler', 'Destek Paketleri'];

// Mock products
const products = [
  { id: 'vip', name: 'VIP Rütbesi', desc: '1 aylık VIP rütbesi ve ayrıcalıkları. Özel prefix, kit ve daha fazlası.', price: 50, category: 'Rütbeler', slug: 'vip-rutbesi' },
  { id: 'vip-plus', name: 'VIP+ Rütbesi', desc: '1 aylık VIP+ rütbesi. Tüm VIP özellikleri ve ek avantajlar.', price: 100, category: 'Rütbeler', slug: 'vip-plus-rutbesi' },
  { id: 'mvp', name: 'MVP Rütbesi', desc: 'Sınırsız MVP rütbesi. Sunucunun en yüksek rütbesi.', price: 300, discountPrice: 250, category: 'Rütbeler', slug: 'mvp-rutbesi' },
  { id: 'key-vote', name: 'Oy Kasası Anahtarı x5', desc: 'Oy kasasını 5 kez açmanızı sağlar.', price: 20, category: 'Anahtarlar', slug: 'oy-kasasi-anahtari-5x' },
  { id: 'key-epic', name: 'Epik Kasa Anahtarı', desc: 'Epik kasayı 1 kez açmanızı sağlar. Nadir eşyalar içerir.', price: 50, category: 'Anahtarlar', slug: 'epik-kasa-anahtari' },
  { id: 'bundle-starter', name: 'Başlangıç Paketi', desc: 'Maceraya hızlı başlamak için ihtiyacınız olan her şey.', price: 150, discountPrice: 120, category: 'Paketler', slug: 'baslangic-paketi' },
];

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state, addItem } = useCart();

  const filteredProducts = activeCategory === 'Tümü' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-2">Market</h1>
            <p className="text-[var(--text-secondary)]">Sunucumuzu destekleyin ve oyun içi kozmetikler kazanın.</p>
          </div>
          
          <Button 
            onClick={() => setIsCartOpen(true)}
            className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] relative"
          >
            <ShoppingCart size={20} className="mr-2" /> Sepetim
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar border-b border-[var(--border)]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-[var(--bg-elevated)] text-emerald-500 border-x border-t border-[var(--border)] -mb-px' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-colors shadow-sm">
              <div className="h-48 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] relative flex items-center justify-center">
                {product.discountPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    İNDİRİM
                  </div>
                )}
                {/* Image placeholder */}
                <span className="text-[var(--text-tertiary)] font-bold text-2xl uppercase opacity-20">{product.name}</span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-emerald-500 font-medium mb-1">{product.category}</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-emerald-400 transition-colors">
                  <Link href={`/market/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-grow line-clamp-2">{product.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] line-through">₺{product.price.toFixed(2)}</span>
                        <span className="text-lg font-bold text-emerald-500">₺{product.discountPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-[var(--text-primary)]">₺{product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="px-3 border-[var(--border)] hover:bg-[var(--bg-tertiary)]">
                        <Link href={`/market/${product.slug}`}>Detay</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: product.discountPrice || product.price,
                        quantity: 1,
                        image: ''
                      })}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
                    >
                      Ekle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] mt-8">
            <p className="text-[var(--text-secondary)]">Bu kategoride henüz ürün bulunmamaktadır.</p>
          </div>
        )}

      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
