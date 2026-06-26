"use client";
import { useState, useEffect } from "react";
import "./page.css";

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
    month: "short",
    year: "numeric",
  });
}

// ===== LOGIN COMPONENT =====
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("admin@panti.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h2>Admin Login</h2>
          <p>Masuk ke dashboard admin panti asuhan</p>
        </div>
        <form onSubmit={handleSubmit} id="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input type="email" id="email" className="form-input" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>
        <div className="login-hint">
          <p>📧 <strong>Email:</strong> admin@panti.com</p>
          <p>🔑 <strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
}

// ===== DASHBOARD COMPONENT =====
function Dashboard({ admin, onLogout }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Expense form
  const [expenseForm, setExpenseForm] = useState({
    title: "", amount: "", date: "", description: "",
  });
  const [expenseLoading, setExpenseLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const result = await res.json();
      setData(result);
    } catch {
      console.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status, type) => {
    try {
      await fetch("/api/admin/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, type }),
      });
      fetchData();
    } catch {
      alert("Gagal update status");
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setExpenseLoading(true);
    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseForm),
      });
      if (res.ok) {
        setExpenseForm({ title: "", amount: "", date: "", description: "" });
        fetchData();
        alert("Pengeluaran berhasil dicatat!");
      }
    } catch {
      alert("Gagal menyimpan pengeluaran");
    } finally {
      setExpenseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container"><div className="loading-state">⏳ Memuat dashboard...</div></div>
      </div>
    );
  }

  if (!data) return null;

  const tabs = [
    { id: "overview", label: "📊 Ringkasan", icon: "📊" },
    { id: "money", label: "💰 Donasi Uang", icon: "💰" },
    { id: "items", label: "📦 Donasi Barang", icon: "📦" },
    { id: "expenses", label: "📤 Pengeluaran", icon: "📤" },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Dashboard Admin</h1>
            <p>Selamat datang, <strong>{admin.name}</strong> 👋</p>
          </div>
          <button className="btn btn-secondary" onClick={onLogout} id="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >{tab.label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--success-light)" }}>💰</div>
                <div className="stat-content">
                  <h4>Total Pemasukan</h4>
                  <span className="stat-value">{formatRupiah(data.stats.totalIncome)}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--error-light)" }}>📤</div>
                <div className="stat-content">
                  <h4>Total Pengeluaran</h4>
                  <span className="stat-value">{formatRupiah(data.stats.totalExpenseAmount)}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--warning-light)" }}>⏳</div>
                <div className="stat-content">
                  <h4>Donasi Pending</h4>
                  <span className="stat-value">{data.stats.pendingMoneyDonations + data.stats.pendingItemDonations}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--info-light)" }}>🎯</div>
                <div className="stat-content">
                  <h4>Kampanye Aktif</h4>
                  <span className="stat-value">{data.stats.activeCampaigns}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-section">
              <h3>📋 Donasi Uang Terbaru</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th><th>Donatur</th><th>Jumlah</th><th>Status</th><th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentMoneyDonations.map((d) => (
                      <tr key={d.id}>
                        <td>{formatDate(d.createdAt)}</td>
                        <td><strong>{d.donorName}</strong></td>
                        <td className="amount-cell">{formatRupiah(d.amount)}</td>
                        <td>
                          <span className={`badge ${d.status === "SUCCESS" ? "badge-success" : d.status === "PENDING" ? "badge-warning" : "badge-error"}`}>
                            {d.status}
                          </span>
                        </td>
                        <td>
                          {d.status === "PENDING" && (
                            <div className="action-btns">
                              <button className="btn btn-success btn-sm" onClick={() => updateStatus(d.id, "SUCCESS", "money")}>✓</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(d.id, "FAILED", "money")}>✗</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Money Donations Tab */}
        {activeTab === "money" && (
          <div className="tab-content animate-fade-in">
            <h3>💰 Semua Donasi Uang</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th><th>Donatur</th><th>Jumlah</th><th>Metode</th><th>Program</th><th>Status</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentMoneyDonations.map((d) => (
                    <tr key={d.id}>
                      <td>{formatDate(d.createdAt)}</td>
                      <td><strong>{d.donorName}</strong></td>
                      <td className="amount-cell">{formatRupiah(d.amount)}</td>
                      <td>{d.paymentMethod}</td>
                      <td>{d.campaign?.title || "Umum"}</td>
                      <td>
                        <span className={`badge ${d.status === "SUCCESS" ? "badge-success" : d.status === "PENDING" ? "badge-warning" : "badge-error"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td>
                        {d.status === "PENDING" && (
                          <div className="action-btns">
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(d.id, "SUCCESS", "money")}>✓ Terima</button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(d.id, "FAILED", "money")}>✗ Tolak</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Item Donations Tab */}
        {activeTab === "items" && (
          <div className="tab-content animate-fade-in">
            <h3>📦 Semua Donasi Barang</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th><th>Donatur</th><th>Barang</th><th>Jumlah</th><th>Pengiriman</th><th>Status</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentItemDonations.map((d) => (
                    <tr key={d.id}>
                      <td>{formatDate(d.createdAt)}</td>
                      <td><strong>{d.donorName}</strong></td>
                      <td>{d.itemName}</td>
                      <td>{d.quantity}</td>
                      <td>{d.deliveryMethod}</td>
                      <td>
                        <span className={`badge ${d.status === "RECEIVED" ? "badge-success" : "badge-warning"}`}>
                          {d.status === "RECEIVED" ? "Diterima" : "Menunggu"}
                        </span>
                      </td>
                      <td>
                        {d.status === "PENDING" && (
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(d.id, "RECEIVED", "item")}>
                            ✓ Terima
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <div className="tab-content animate-fade-in">
            <h3>📤 Catat Pengeluaran Baru</h3>
            <div className="form-card expense-form-card">
              <form onSubmit={handleExpenseSubmit} id="expense-form">
                <div className="expense-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-title">Keterangan</label>
                    <input type="text" id="expense-title" className="form-input"
                      placeholder="Contoh: Pembayaran Listrik"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-amount">Jumlah (Rp)</label>
                    <input type="number" id="expense-amount" className="form-input"
                      placeholder="Contoh: 500000" min="1"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-date">Tanggal</label>
                    <input type="date" id="expense-date" className="form-input"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-desc">Deskripsi</label>
                  <textarea id="expense-desc" className="form-textarea" rows={2}
                    placeholder="Detail pengeluaran..."
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={expenseLoading}>
                  {expenseLoading ? "Menyimpan..." : "💾 Simpan Pengeluaran"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAIN ADMIN PAGE =====
export default function AdminPage() {
  const [admin, setAdmin] = useState(null);

  const handleLogin = (userData) => {
    setAdmin(userData);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin");
      if (stored) setAdmin(JSON.parse(stored));
    }
  }, []);

  if (!admin) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard admin={admin} onLogout={handleLogout} />;
}
