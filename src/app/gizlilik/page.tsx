export const metadata = {
  title: "Gizlilik Politikası | JustNyktSMP",
  description: "JustNyktSMP gizlilik politikası ve kişisel verilerin korunması bilgilendirmesi.",
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-white mb-6 font-['Exo_2']">Gizlilik Politikası</h1>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Toplanan Veriler</h2>
            <p>
              JustNyktSMP sunucularına bağlandığınızda veya sitemize kayıt olduğunuzda, oyun deneyimini sağlamak amacıyla Minecraft kullanıcı adınız, oyun içi UUID değeriniz, IP adresiniz ve web sitesi için kayıt olduğunuz e-posta adresiniz kaydedilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Verilerin Kullanım Amacı</h2>
            <p>
              Toplanan veriler yalnızca hesap güvenliğinizi sağlamak, hile/zararlı davranışları engellemek, oyun içi istatistiklerinizi (sıralama, bakiye) web sitesiyle senkronize etmek amacıyla kullanılır. Verileriniz hiçbir üçüncü taraf şirketle paylaşılmaz veya satılmaz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Çerezler (Cookies)</h2>
            <p>
              Web sitemiz yalnızca oturum açma (oturum süresi boyunca açık kalmanızı sağlayan JWT belirteçleri) ve sepetinizi hatırlamak için tarayıcı depolama alanını kullanır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. İletişim</h2>
            <p>
              Verileriniz veya hesabınızla ilgili her türlü talep için resmi Discord sunucumuzdan veya Destek Talepleri bölümünden yetkililerimizle irtibat kurabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
