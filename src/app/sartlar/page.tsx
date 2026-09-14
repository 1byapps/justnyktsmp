export const metadata = {
  title: "Kullanım Şartları | JustNyktSMP",
  description: "JustNyktSMP kullanım şartları, sunucu kuralları ve mağaza teslimat koşulları.",
};

export default function SartlarPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-white mb-6 font-['Exo_2']">Kullanım Şartları</h1>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Genel Koşullar</h2>
            <p>
              JustNyktSMP sunucusuna giriş yaparak veya web sitemizi kullanarak topluluk ve oyun kurallarına uymayı kabul etmiş sayılırsınız. Hile, hakaret, reklam ve sunucu düzenini bozan davranışlar uzaklaştırma sebebidir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Dijital Ürünler ve Teslimat</h2>
            <p>
              Mağazamızda sunulan tüm ürünler (VIP rütbeleri, kasa anahtarları, pelerinler) dijital oyun içi içeriklerdir. Satın alım tamamlandıktan hemen sonra otomatik olarak belirtilen Minecraft kullanıcı adına teslim edilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. İade Politikası</h2>
            <p>
              Dijital içeriklerin niteliği gereği, anında teslim edilen ve tüketilen ürünlerde keyfi iade yapılmamaktadır. Ancak teknik bir arıza veya teslimat aksaklığı durumunda Destek ekibimiz mağduriyeti telafi etmekle yükümlüdür.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Mojang & Microsoft Bağlantısı</h2>
            <p className="italic text-xs text-[var(--text-tertiary)]">
              JustNyktSMP, bağımsız bir topluluk sunucusudur. Mojang Studios veya Microsoft ile hiçbir resmi bağı, ortaklığı veya onayı bulunmamaktadır. Minecraft, Mojang AB'nin tescilli ticari markasıdır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
