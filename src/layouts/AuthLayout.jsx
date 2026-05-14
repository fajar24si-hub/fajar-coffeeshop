// src/layouts/AuthLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { FaCoffee } from "react-icons/fa";

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0703",
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(212,150,58,0.1) 0%, transparent 60%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 36 }}>
        <div style={{ width: 38, height: 38, background: "#D4963A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(212,150,58,0.35)" }}>
          <FaCoffee color="#0D0703" size={17} />
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #F0C56A, #D4963A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Brewista
        </span>
      </Link>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "rgba(26,10,4,0.85)",
        border: "1px solid rgba(212,150,58,0.15)",
        borderRadius: 20,
        padding: "36px 32px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <Outlet />
      </div>

      {/* Footer note */}
      <p style={{ marginTop: 24, color: "#7A6247", fontSize: 12, textAlign: "center" }}>
        © {new Date().getFullYear()} Brewista. All rights reserved.
      </p>
    </div>
  );
}
