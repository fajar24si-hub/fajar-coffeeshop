// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/"); }, 1500);
  };

  const inputStyle = {
    width: "100%", background: "rgba(13,7,3,0.8)", border: "1px solid #2E1608",
    borderRadius: 10, padding: "12px 44px 12px 44px", color: "#F7ECD8",
    fontFamily: "'Inter', sans-serif", fontSize: 14, boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = { display: "block", color: "#7A6247", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 800, color: "#F7ECD8", marginBottom: 8 }}>
          Selamat Datang
        </h1>
        <p style={{ color: "#7A6247", fontSize: 14 }}>Masuk ke akun Brewista kamu</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <div style={{ position: "relative" }}>
            <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }} size={16} />
            <input id="login-email" type="email" required placeholder="email@kamu.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "rgba(212,150,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#2E1608"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }} size={16} />
            <input id="login-password" type={showPass ? "text" : "password"} required placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "rgba(212,150,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#2E1608"; e.target.style.boxShadow = "none"; }} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7A6247", cursor: "pointer", padding: 4 }}>
              {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <Link to="/forgot-password" style={{ color: "#D4963A", fontSize: 12, textDecoration: "none" }}>
              Lupa password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button id="login-submit" type="submit" disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#5a4020" : "linear-gradient(90deg, #b87a28, #F0C56A, #D4963A, #F0C56A, #b87a28)", backgroundSize: "300% auto", animation: loading ? "none" : "shimmer 4s linear infinite", color: loading ? "#7A6247" : "#0D0703", transition: "opacity 0.2s" }}>
          {loading ? "Masuk..." : <><span>Masuk</span> <FiArrowRight /></>}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, color: "#7A6247", fontSize: 13 }}>
        Belum punya akun?{" "}
        <Link to="/register" style={{ color: "#D4963A", fontWeight: 600, textDecoration: "none" }}>Daftar sekarang</Link>
      </p>
    </>
  );
}
