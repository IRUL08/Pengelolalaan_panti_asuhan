"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./page.css";

export default function DonasiUangPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    amount: "",
    paymentMethod: "Bank Transfer",
    campaignId: campaignId || "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (campaignId) {
      setFormData((prev) => ({ ...prev, campaignId }));
    }
  }, [campaignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/donasi-uang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          donorName: "",
          amount: "",
          paymentMethod: "Bank Transfer",
          campaignId: "",
          message: "",
        });
      }
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "Bank Transfer", label: "🏦 Bank Transfer (BCA / Mandiri / BRI)", icon: "🏦" },
    { value: "GoPay", label: "💚 GoPay", icon: "💚" },
    { value: "OVO", label: "💜 OVO", icon: "💜" },
    { value: "Dana", label: "💙 Dana", icon: "💙" },
    { value: "ShopeePay", label: "🧡 ShopeePay", icon: "🧡" },
  ];

  if (success) {
    return (
      <div className="donation-page">
        <div className="container">
          <div className="success-card animate-fade-in-up">
            <div className="success-icon">✅</div>
            <h2>Donasi Berhasil Dicatat!</h2>
            <p>
              Terima kasih atas kebaikan hati Anda. Donasi Anda telah berhasil
              dicatat dan akan segera diverifikasi oleh admin panti.
            </p>
            <div className="success-actions">
              <button
                className="btn btn-primary"
                onClick={() => setSuccess(false)}
              >
                Donasi Lagi
              </button>
              <a href="/transparansi" className="btn btn-secondary">
                Lihat Transparansi
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-page">
      <div className="container">
        <div className="page-header animate-fade-in-up">
          <span className="section-badge">💰 Donasi Uang</span>
          <h1>Salurkan Donasi Anda</h1>
          <p className="subtitle">
            Isi formulir di bawah untuk menyalurkan donasi uang. Anda bisa
            memilih program tertentu atau donasi umum.
          </p>
        </div>

        <div className="donation-form-container animate-fade-in-up delay-1">
          <form onSubmit={handleSubmit} className="donation-form" id="donation-form">
            <div className="form-card">
              <h3 className="form-section-title">📋 Data Donatur</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="donorName">
                  Nama Donatur
                </label>
                <input
                  type="text"
                  id="donorName"
                  className="form-input"
                  placeholder='Masukkan nama Anda (atau "Hamba Allah")'
                  value={formData.donorName}
                  onChange={(e) =>
                    setFormData({ ...formData, donorName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="amount">
                  Jumlah Donasi (Rp)
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-input"
                  placeholder="Contoh: 100000"
                  min="1000"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
                <div className="quick-amounts">
                  {[25000, 50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`quick-amount-btn ${
                        formData.amount === String(amt) ? "active" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, amount: String(amt) })
                      }
                    >
                      {new Intl.NumberFormat("id-ID").format(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="campaignId">
                  Pilih Program (Opsional)
                </label>
                <select
                  id="campaignId"
                  className="form-select"
                  value={formData.campaignId}
                  onChange={(e) =>
                    setFormData({ ...formData, campaignId: e.target.value })
                  }
                >
                  <option value="">-- Donasi Umum --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Pesan / Doa (Opsional)
                </label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Tuliskan pesan atau doa untuk anak-anak panti..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="form-card">
              <h3 className="form-section-title">💳 Metode Pembayaran</h3>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`payment-option ${
                      formData.paymentMethod === method.value ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <span className="payment-label">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg submit-btn"
              disabled={loading}
              id="submit-donation"
            >
              {loading ? "Memproses..." : "💰 Kirim Donasi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
