// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
    borderRadius: 10, padding: "12px 44px", color: "#F7ECD8",
    fontFamily: "'Inter', sans-serif", fontSize: 14, boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = { display: "block", color: "#7A6247", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 800, color: "#F7ECD8", marginBottom: 8 }}>
          Buat Akun
        </h1>
        <p style={{ color: "#7A6247", fontSize: 14 }}>Bergabung dengan komunitas Brewista</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { id: "reg-name",  key: "name",     type: "text",  Icon: FiUser, label: "Nama Lengkap", ph: "Nama kamu" },
          { id: "reg-email", key: "email",    type: "email", Icon: FiMail, label: "Email",        ph: "email@kamu.com" },
        ].map(({ id, key, type, Icon, label, ph }) => (
          <div key={id}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: "relative" }}>
              <Icon style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }} size={16} />
              <input id={id} type={type} required placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,150,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#2E1608"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>
        ))}

        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }} size={16} />
            <input id="reg-password" type={showPass ? "text" : "password"} required placeholder="Min. 8 karakter"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "rgba(212,150,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#2E1608"; e.target.style.boxShadow = "none"; }} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7A6247", cursor: "pointer" }}>
              {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        <button id="reg-submit" type="submit" disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#5a4020" : "linear-gradient(90deg, #b87a28, #F0C56A, #D4963A, #F0C56A, #b87a28)", backgroundSize: "300% auto", color: loading ? "#7A6247" : "#0D0703" }}>
          {loading ? "Mendaftar..." : <><span>Daftar Sekarang</span> <FiArrowRight /></>}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, color: "#7A6247", fontSize: 13 }}>
        Sudah punya akun?{" "}
        <Link to="/login" style={{ color: "#D4963A", fontWeight: 600, textDecoration: "none" }}>Masuk di sini</Link>
      </p>
    </>
  );
}
