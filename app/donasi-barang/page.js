"use client";
import { useState } from "react";
import "./page.css";

export default function DonasiBarangPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    donorPhone: "",
    itemName: "",
    quantity: "",
    description: "",
    deliveryMethod: "Diantar Langsung",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/donasi-barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({
          donorName: "",
          donorPhone: "",
          itemName: "",
          quantity: "",
          description: "",
          deliveryMethod: "Diantar Langsung",
        });
      }
    } catch {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="donation-page">
        <div className="container">
          <div className="success-card animate-fade-in-up">
            <div className="success-icon">📦</div>
            <h2>Donasi Barang Tercatat!</h2>
            <p>
              Terima kasih! Data donasi barang Anda telah dicatat. Admin panti
              akan segera menghubungi Anda untuk koordinasi pengiriman.
            </p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Donasi Lagi
              </button>
              <a href="/" className="btn btn-secondary">
                Kembali ke Beranda
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
          <span className="section-badge">📦 Donasi Barang</span>
          <h1>Donasikan Barang Anda</h1>
          <p className="subtitle">
            Isi formulir di bawah untuk mendonasikan barang. Kami menerima
            makanan, pakaian, peralatan sekolah, dan barang lainnya.
          </p>
        </div>

        <div className="donation-form-container animate-fade-in-up delay-1">
          <form onSubmit={handleSubmit} className="donation-form" id="item-donation-form">
            <div className="form-card">
              <h3 className="form-section-title">📋 Data Donatur</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="donorName">Nama Donatur</label>
                <input
                  type="text" id="donorName" className="form-input"
                  placeholder="Masukkan nama Anda"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="donorPhone">No. Telepon / WhatsApp</label>
                <input
                  type="tel" id="donorPhone" className="form-input"
                  placeholder="Contoh: 081234567890"
                  value={formData.donorPhone}
                  onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-card">
              <h3 className="form-section-title">📦 Detail Barang</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="itemName">Nama Barang</label>
                <input
                  type="text" id="itemName" className="form-input"
                  placeholder="Contoh: Beras, Buku Pelajaran, Pakaian"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quantity">Jumlah / Kuantitas</label>
                <input
                  type="text" id="quantity" className="form-input"
                  placeholder="Contoh: 10 Kg, 5 Buah, 2 Dus"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Deskripsi Barang</label>
                <textarea
                  id="description" className="form-textarea"
                  placeholder="Jelaskan kondisi dan detail barang..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="form-card">
              <h3 className="form-section-title">🚚 Metode Pengiriman</h3>
              <div className="payment-methods">
                {["Diantar Langsung", "Kurir"].map((method) => (
                  <label
                    key={method}
                    className={`payment-option ${formData.deliveryMethod === method ? "selected" : ""}`}
                  >
                    <input
                      type="radio" name="deliveryMethod" value={method}
                      checked={formData.deliveryMethod === method}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    />
                    <span className="payment-label">
                      {method === "Diantar Langsung" ? "🚗 Diantar Langsung ke Panti" : "📮 Dikirim via Kurir"}
                    </span>
                  </label>
                ))}
              </div>
              {formData.deliveryMethod === "Diantar Langsung" && (
                <div className="delivery-info">
                  <p>📍 <strong>Alamat Panti:</strong> Jl. Kasih Sayang No. 123, Medan</p>
                  <p>🕐 <strong>Jam Terima:</strong> Senin - Sabtu, 08:00 - 17:00</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading} id="submit-item-donation">
              {loading ? "Memproses..." : "📦 Kirim Donasi Barang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
