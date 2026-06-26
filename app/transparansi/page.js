import prisma from "@/lib/prisma";
import "./page.css";

export const dynamic = 'force-dynamic';

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TransparansiPage() {
  const [moneyDonations, itemDonations, expenses, campaigns] =
    await Promise.all([
      prisma.moneyDonation.findMany({
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { campaign: true },
      }),
      prisma.itemDonation.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.expense.findMany({
        orderBy: { date: "desc" },
        take: 20,
      }),
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const totalIncome =
    moneyDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="transparansi-page">
      <div className="container">
        <div className="page-header animate-fade-in-up">
          <span className="section-badge">📊 Transparansi Keuangan</span>
          <h1>Laporan Transparansi</h1>
          <p className="subtitle">
            Kami berkomitmen terhadap transparansi penuh. Berikut adalah laporan
            donasi masuk dan pengeluaran panti yang tercatat dalam sistem.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid animate-fade-in-up delay-1">
          <div className="summary-card income">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <span className="summary-label">Total Donasi Masuk</span>
              <span className="summary-value">{formatRupiah(totalIncome)}</span>
            </div>
          </div>
          <div className="summary-card expense">
            <div className="summary-icon">📤</div>
            <div className="summary-info">
              <span className="summary-label">Total Pengeluaran</span>
              <span className="summary-value">{formatRupiah(totalExpense)}</span>
            </div>
          </div>
          <div className="summary-card balance">
            <div className="summary-icon">💎</div>
            <div className="summary-info">
              <span className="summary-label">Saldo Saat Ini</span>
              <span className="summary-value">{formatRupiah(balance)}</span>
            </div>
          </div>
        </div>

        {/* Campaign Progress */}
        <div className="transparansi-section animate-fade-in-up delay-2">
          <h2>🎯 Progress Kampanye</h2>
          <div className="campaign-progress-list">
            {campaigns.map((campaign) => {
              const progress = Math.min(
                (campaign.currentAmount / campaign.targetAmount) * 100, 100
              );
              return (
                <div key={campaign.id} className="campaign-progress-item">
                  <div className="campaign-progress-header">
                    <h4>{campaign.title}</h4>
                    <span className={`badge ${campaign.status === "COMPLETED" ? "badge-success" : "badge-primary"}`}>
                      {campaign.status === "COMPLETED" ? "Tercapai" : "Aktif"}
                    </span>
                  </div>
                  <div className="progress-info">
                    <span className="progress-current">{formatRupiah(campaign.currentAmount)}</span>
                    <span className="progress-target">dari {formatRupiah(campaign.targetAmount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Money Donations Table */}
        <div className="transparansi-section animate-fade-in-up delay-3">
          <h2>💰 Riwayat Donasi Uang</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Donatur</th>
                  <th>Jumlah</th>
                  <th>Metode</th>
                  <th>Program</th>
                </tr>
              </thead>
              <tbody>
                {moneyDonations.map((d) => (
                  <tr key={d.id}>
                    <td>{formatDate(d.createdAt)}</td>
                    <td><strong>{d.donorName}</strong></td>
                    <td className="amount-cell">{formatRupiah(d.amount)}</td>
                    <td>{d.paymentMethod}</td>
                    <td>{d.campaign?.title || "Donasi Umum"}</td>
                  </tr>
                ))}
                {moneyDonations.length === 0 && (
                  <tr><td colSpan={5} className="empty-cell">Belum ada donasi tercatat</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Item Donations Table */}
        <div className="transparansi-section animate-fade-in-up delay-4">
          <h2>📦 Riwayat Donasi Barang</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Donatur</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {itemDonations.map((d) => (
                  <tr key={d.id}>
                    <td>{formatDate(d.createdAt)}</td>
                    <td><strong>{d.donorName}</strong></td>
                    <td>{d.itemName}</td>
                    <td>{d.quantity}</td>
                    <td>
                      <span className={`badge ${d.status === "RECEIVED" ? "badge-success" : "badge-warning"}`}>
                        {d.status === "RECEIVED" ? "Diterima" : "Menunggu"}
                      </span>
                    </td>
                  </tr>
                ))}
                {itemDonations.length === 0 && (
                  <tr><td colSpan={5} className="empty-cell">Belum ada donasi barang</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="transparansi-section animate-fade-in-up">
          <h2>📤 Riwayat Pengeluaran</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td>{formatDate(e.date)}</td>
                    <td><strong>{e.title}</strong></td>
                    <td className="amount-cell expense-amount">{formatRupiah(e.amount)}</td>
                    <td>{e.description}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan={4} className="empty-cell">Belum ada pengeluaran</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
