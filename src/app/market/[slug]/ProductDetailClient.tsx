"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Cart } from '@/components/shop/Cart';

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    price: number;
    discountPrice: number | null;
    imageUrl: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, state } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.imageUrl || '',
    });
    setIsCartOpen(true);
  };

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // Split description into bullet points if it has lines
  const lines = product.description.split('\n').filter(Boolean);

  return (
    <>
      {/* Navigation / Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/market"
          className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Markete Dön
        </Link>

        <Button
          onClick={() => setIsCartOpen(true)}
          variant="outline"
          className="bg-[var(--bg-secondary)] border-[var(--border)] relative"
        >
          <ShoppingCart size={18} className="mr-2" /> Sepetim
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-[var(--text-tertiary)] mb-6">
        <Link href="/market" className="hover:text-[var(--text-primary)]">
          Market
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-secondary)]">{product.category.name}</span>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-primary)]">{product.name}</span>
      </div>

      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row">
        {/* Product Image Area */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] p-12 flex flex-col items-center justify-center min-h-[380px] border-b lg:border-b-0 lg:border-r border-[var(--border)] relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          {product.discountPrice && (
            <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              İNDİRİM
            </div>
          )}
          <span className="text-[var(--text-tertiary)] font-bold text-3xl sm:text-4xl uppercase opacity-20 relative z-10 text-center font-exo">
            {product.name}
          </span>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-2 text-emerald-400 font-semibold text-sm uppercase tracking-wider">
            {product.category.name}
          </div>
          <h1 className="heading-xl font-exo text-[var(--text-primary)] mb-4">{product.name}</h1>
          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed text-sm">
            {product.shortDescription || product.description}
          </p>

          <div className="mb-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-sm">
              <ShieldCheck size={18} className="text-emerald-400" /> Ürün Detayları & Özellikler
            </h3>
            <ul className="space-y-2.5">
              {lines.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[var(--text-secondary)] text-sm">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs text-[var(--text-tertiary)] mb-1">Fiyat</div>
              {product.discountPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-emerald-400 font-exo">
                    ₺{product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-[var(--text-tertiary)] line-through">
                    ₺{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-[var(--text-primary)] font-exo">
                  ₺{product.price.toFixed(2)}
                </div>
              )}
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 text-base h-12 shadow-lg shadow-emerald-900/20"
            >
              <ShoppingCart size={18} className="mr-2" /> Sepete Ekle
            </Button>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
