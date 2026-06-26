import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <span className="brand-icon">🏠</span>
              <div>
                <h3>Panti Asuhan Kasih Sayang</h3>
                <p className="footer-tagline">Membangun harapan, memberi kasih sayang</p>
              </div>
            </div>
            <p className="footer-description">
              Panti Asuhan Kasih Sayang berdedikasi merawat dan mendidik anak-anak yatim piatu
              agar tumbuh menjadi generasi yang mandiri, berprestasi, dan berbudi pekerti luhur.
            </p>
          </div>

          <div className="footer-links">
            <h4>Navigasi</h4>
            <ul>
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/donasi-uang">Donasi Uang</Link></li>
              <li><Link href="/donasi-barang">Donasi Barang</Link></li>
              <li><Link href="/transparansi">Transparansi</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Kontak Kami</h4>
            <ul>
              <li>📍 Jl. Kasih Sayang No. 123, Medan</li>
              <li>📞 (061) 123-4567</li>
              <li>✉️ info@pantiasuhan.org</li>
              <li>🕐 Senin - Sabtu, 08:00 - 17:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Panti Asuhan Kasih Sayang. Semua hak dilindungi.</p>
          <p className="footer-credit">Dibuat dengan ❤️ untuk kebaikan</p>
        </div>
      </div>
    </footer>
  );
}
