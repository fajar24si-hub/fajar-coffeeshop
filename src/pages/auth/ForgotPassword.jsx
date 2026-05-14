// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 52, height: 52, background: "rgba(212,150,58,0.1)", border: "1px solid rgba(212,150,58,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiMail color="#D4963A" size={22} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: "#F7ECD8", marginBottom: 8 }}>
          Lupa Password?
        </h1>
        <p style={{ color: "#7A6247", fontSize: 14, lineHeight: 1.6 }}>
          Masukkan email kamu, kami akan kirimkan link reset password.
        </p>
      </div>

      {sent ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 52, height: 52, background: "rgba(34,197,94,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <FiCheck color="#22c55e" size={24} />
          </div>
          <p style={{ color: "#CEAD86", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Email reset password sudah dikirim ke <strong style={{ color: "#D4963A" }}>{email}</strong>. Cek inbox kamu!
          </p>
          <Link to="/login" style={{ color: "#D4963A", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiArrowLeft size={14} /> Kembali ke Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", color: "#7A6247", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Email</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }} size={16} />
              <input id="forgot-email" type="email" required placeholder="email@kamu.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", background: "rgba(13,7,3,0.8)", border: "1px solid #2E1608", borderRadius: 10, padding: "12px 44px", color: "#F7ECD8", fontFamily: "'Inter', sans-serif", fontSize: 14, boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = "rgba(212,150,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#2E1608"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>

          <button id="forgot-submit" type="submit" disabled={loading}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(90deg, #b87a28, #F0C56A, #D4963A, #F0C56A, #b87a28)", backgroundSize: "300% auto", color: "#0D0703" }}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>

          <Link to="/login" style={{ textAlign: "center", color: "#7A6247", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <FiArrowLeft size={13} /> Kembali ke Login
          </Link>
        </form>
      )}
    </>
  );
}
