"use client";

import { Fragment, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, removeItem, updateQuantity, subtotal, total, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponMsg({ type: 'success', text: 'Kupon başarıyla uygulandı.' });
    } else {
      setCouponMsg({ type: 'error', text: 'Geçersiz kupon kodu.' });
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-emerald-500" />
            <h2 className="text-xl font-bold font-exo text-[var(--text-primary)]">Sepetim</h2>
            <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold px-2 py-1 rounded-full">
              {state.items.reduce((acc, item) => acc + item.quantity, 0)} Ürün
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)]">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p>Sepetiniz şu anda boş.</p>
              <Button onClick={onClose} variant="outline" className="mt-6">Alışverişe Devam Et</Button>
            </div>
          ) : (
            state.items.map(item => (
              <div key={item.id} className="flex gap-4 bg-[var(--bg-secondary)] border border-[var(--border)] p-4 rounded-xl">
                <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={24} className="text-[var(--text-tertiary)]" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[var(--text-primary)] line-clamp-1">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-[var(--text-tertiary)] hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] w-8 h-8 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] w-8 h-8 flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-emerald-500">₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {state.items.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="mb-6">
              <label className="text-xs text-[var(--text-secondary)] font-medium mb-2 block">İndirim Kuponu</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Kupon Kodu" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-[var(--bg-primary)] border-[var(--border)]"
                />
                <Button variant="outline" onClick={handleApplyCoupon} className="border-[var(--border)]">Uygula</Button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 ${couponMsg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Ara Toplam</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              {state.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>İndirim ({(state.discount * 100).toFixed(0)}%)</span>
                  <span>-₺{(subtotal * state.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[var(--text-primary)] pt-3 border-t border-[var(--border)]">
                <span>Genel Toplam</span>
                <span className="text-emerald-500">₺{total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base h-12">
              Siparişi Tamamla <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
