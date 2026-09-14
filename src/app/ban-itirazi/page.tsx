import Link from "next/link";
import { ShieldAlert, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Ban İtirazı | JustNyktSMP",
  description: "JustNyktSMP sunucusundaki cezanız için itiraz oluşturun ve yetkililere iletin.",
};

export default function BanItiraziPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-['Exo_2'] mb-3">
            Ceza & Ban İtirazı
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Haksız yere cezalandırıldığınızı veya uzaklaştırıldığınızı düşünüyorsanız aşağıdaki kurallar çerçevesinde itiraz formu doldurabilirsiniz.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">İtiraz Etmeden Önce Lütfen Dikkat Edin:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-200/90 text-xs">
                <li>Kanıtlı ve bariz hile kullanımı cezalarında af uygulanmamaktadır.</li>
                <li>Küfürlü veya saygısızca yazılan itirazlar doğrudan reddedilir.</li>
                <li>İtirazınız yetkili ekibimiz tarafından en geç 24 saat içinde incelenir.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">İtiraz Süreci Nasıl İşler?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <span className="text-emerald-400 font-bold text-sm block mb-1">1. Adım</span>
                <p className="text-xs text-[var(--text-secondary)]">Destek Talebi Aç sayfasına gidin ve "Ban İtirazı" kategorisini seçin.</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <span className="text-emerald-400 font-bold text-sm block mb-1">2. Adım</span>
                <p className="text-xs text-[var(--text-secondary)]">Oyun içi kullanıcı adınızı ve ceza gerekçenizi açıklayın.</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <span className="text-emerald-400 font-bold text-sm block mb-1">3. Adım</span>
                <p className="text-xs text-[var(--text-secondary)]">Yetkililerin log kayıtlarını incelemesini ve yanıtını bekleyin.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--text-tertiary)]">
              Giriş yaptıktan sonra biletiniz otomatik profilinize bağlanacaktır.
            </div>
            <Link
              href="/destek/yeni?category=ban"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>İtiraz Bileti Oluştur</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
