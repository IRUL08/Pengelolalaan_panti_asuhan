import Link from "next/link";
import prisma from "@/lib/prisma";
import "./page.css";

export const dynamic = 'force-dynamic';

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  // Fetch data
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const totalDonors = await prisma.moneyDonation.count({
    where: { status: "SUCCESS" },
  });

  const totalDonations = await prisma.moneyDonation.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true },
  });

  const totalItemDonations = await prisma.itemDonation.count();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up">
            <span className="hero-badge">
              ✨ Platform Donasi Transparan & Terpercaya
            </span>
            <h1>
              Bersama Kita Wujudkan{" "}
              <span className="text-gradient">Masa Depan Cerah</span> untuk
              Anak-anak Panti
            </h1>
            <p className="hero-description">
              Setiap donasi Anda, sekecil apapun, membawa harapan besar bagi
              anak-anak yatim piatu di Panti Asuhan Kasih Sayang. Mari
              berbagi kebaikan hari ini.
            </p>
            <div className="hero-actions">
              <Link href="/donasi-uang" className="btn btn-primary btn-lg">
                💰 Donasi Sekarang
              </Link>
              <Link href="/donasi-barang" className="btn btn-secondary btn-lg">
                📦 Donasi Barang
              </Link>
            </div>
          </div>

          <div className="hero-stats animate-fade-in-up delay-2">
            <div className="hero-stat-item">
              <span className="hero-stat-value">
                {formatRupiah(totalDonations._sum.amount || 0)}
              </span>
              <span className="hero-stat-label">Total Donasi Terkumpul</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{totalDonors}</span>
              <span className="hero-stat-label">Donatur</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{totalItemDonations}</span>
              <span className="hero-stat-label">Donasi Barang</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAMPAIGNS SECTION ===== */}
      <section className="section campaigns-section" id="campaigns">
        <div className="container">
          <div className="section-header text-center animate-fade-in-up">
            <span className="section-badge">🎯 Kampanye Aktif</span>
            <h2>Program yang Membutuhkan Bantuan Anda</h2>
            <p className="subtitle">
              Pilih program yang ingin Anda dukung dan berikan kontribusi
              terbaik Anda untuk masa depan mereka.
            </p>
          </div>

          <div className="campaigns-grid">
            {campaigns.map((campaign, index) => {
              const progress = Math.min(
                (campaign.currentAmount / campaign.targetAmount) * 100,
                100
              );
              return (
                <div
                  key={campaign.id}
                  className={`campaign-card card animate-fade-in-up delay-${
                    index + 1
                  }`}
                >
                  <div className="campaign-header">
                    <span className="campaign-icon">
                      {index === 0
                        ? "🏗️"
                        : index === 1
                        ? "🎓"
                        : "🍚"}
                    </span>
                    <span className="badge badge-primary">Aktif</span>
                  </div>
                  <h3 className="campaign-title">{campaign.title}</h3>
                  <p className="campaign-desc">{campaign.description}</p>

                  <div className="campaign-progress">
                    <div className="progress-info">
                      <span className="progress-current">
                        {formatRupiah(campaign.currentAmount)}
                      </span>
                      <span className="progress-target">
                        dari {formatRupiah(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-percent">
                      {Math.round(progress)}% tercapai
                    </span>
                  </div>

                  <Link
                    href={`/donasi-uang?campaign=${campaign.id}`}
                    className="btn btn-primary campaign-btn"
                  >
                    Donasi untuk Program Ini →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">📋 Cara Berdonasi</span>
            <h2>Mudah, Cepat, dan Aman</h2>
            <p className="subtitle">
              Hanya 3 langkah sederhana untuk menyalurkan kebaikan Anda
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Isi Formulir</h3>
              <p>
                Lengkapi data diri dan jumlah donasi yang ingin Anda berikan.
                Bisa anonim sebagai &ldquo;Hamba Allah&rdquo;.
              </p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">💳</div>
              <h3>Pilih Pembayaran</h3>
              <p>
                Pilih metode pembayaran yang paling nyaman: Transfer Bank,
                E-Wallet, atau datang langsung.
              </p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">✅</div>
              <h3>Donasi Terkirim</h3>
              <p>
                Donasi Anda langsung tercatat dan dapat dipantau melalui
                halaman Transparansi secara real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Mulai Berbagi Kebaikan Hari Ini</h2>
              <p>
                Tidak ada donasi yang terlalu kecil. Setiap rupiah Anda adalah
                harapan baru bagi anak-anak panti.
              </p>
              <div className="cta-actions">
                <Link href="/donasi-uang" className="btn btn-accent btn-lg">
                  💰 Donasi Uang
                </Link>
                <Link href="/donasi-barang" className="btn btn-secondary btn-lg">
                  📦 Donasi Barang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
