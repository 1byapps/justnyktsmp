"use client";

import { Fragment, useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSession } from 'next-auth/react';

export function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const { state, removeItem, updateQuantity, subtotal, total, applyCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [mcUsername, setMcUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<{ orderId: string; mcUsername: string; total: number } | null>(null);

  useEffect(() => {
    if (session?.user) {
      const u = (session.user as unknown as { username?: string })?.username || session.user.name || '';
      if (u) setMcUsername(u);
    }
  }, [session]);

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

  const handleCheckout = async () => {
    if (!mcUsername.trim()) {
      setErrorMsg('Lütfen teslimat için Minecraft kullanıcı adınızı yazın.');
      return;
    }
    if (state.items.length === 0) {
      setErrorMsg('Sepetinizde ürün bulunmuyor.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          mcUsername: mcUsername.trim(),
          couponCode: state.couponCode || couponInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSuccessOrder({
          orderId: data.data.orderId,
          mcUsername: data.data.mcUsername,
          total: data.data.total,
        });
        clearCart();
      } else {
        setErrorMsg(data.error || 'Sipariş oluşturulamadı, lütfen tekrar deneyin.');
      }
    } catch {
      setErrorMsg('Bağlantı hatası oluştu, lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]/60">
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

        {/* Success Screen */}
        {successOrder ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Sipariş Başarılı!</h3>
              <p className="text-xs font-mono text-[var(--text-tertiary)]">Sipariş No: #{successOrder.orderId.slice(-8).toUpperCase()}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] w-full text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Alıcı Oyuncu:</span>
                <span className="font-bold text-emerald-400">{successOrder.mcUsername}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Ödenen Tutar:</span>
                <span className="font-bold text-white">₺{successOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Teslimat:</span>
                <span className="text-emerald-400 font-semibold">Oyun Sunucusuna İletildi</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Minecraft sunucusuna girdiğinizde satın aldığınız haklar ve eşyalar otomatik olarak hesabınıza tanımlanacaktır!
            </p>
            <Button
              onClick={() => {
                setSuccessOrder(null);
                onClose();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Tamam
            </Button>
          </div>
        ) : (
          <>
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

            {/* Footer / Checkout */}
            {state.items.length > 0 && (
              <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4">
                
                {/* Minecraft Username input */}
                <div>
                  <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1.5 block">
                    Minecraft Kullanıcı Adı (Teslimat için Zorunlu)
                  </label>
                  <Input
                    placeholder="Örn: TrepidRogue908"
                    value={mcUsername}
                    onChange={(e) => {
                      setMcUsername(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="bg-[var(--bg-primary)] border-[var(--border)] text-sm"
                  />
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="text-xs text-[var(--text-secondary)] font-medium mb-1.5 block">İndirim Kuponu</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Kupon Kodu" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-[var(--bg-primary)] border-[var(--border)] text-sm"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon} className="border-[var(--border)] shrink-0">Uygula</Button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs mt-1.5 ${couponMsg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 pt-2 text-sm border-t border-[var(--border)]/60">
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
                  <div className="flex justify-between text-lg font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border)]">
                    <span>Genel Toplam</span>
                    <span className="text-emerald-500">₺{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base h-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sipariş İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <span>Siparişi Tamamla & Satın Al</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
}
