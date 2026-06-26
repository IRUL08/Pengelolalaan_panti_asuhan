"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/galeri", label: "Galeri" },
    { href: "/donasi-uang", label: "Donasi Uang" },
    { href: "/donasi-barang", label: "Donasi Barang" },
    { href: "/transparansi", label: "Transparansi" },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-icon">🏠</span>
          <div className="brand-text">
            <span className="brand-name">Panti Asuhan</span>
            <span className="brand-subtitle">Kasih Sayang</span>
          </div>
        </Link>

        <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="btn btn-primary btn-sm nav-admin-btn"
            onClick={() => setIsOpen(false)}
          >
            🔐 Admin
          </Link>
        </div>

        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
