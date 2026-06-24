// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser, FiMail, FiLock, FiPhone,
  FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);
  const navigate                      = useNavigate();
  const { register }                  = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      setSuccess(true);
      // Tunggu sebentar lalu redirect ke login
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
        setError("Tidak dapat terhubung ke server. Pastikan koneksi internet kamu aktif dan coba lagi.");
      } else if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("Email ini sudah terdaftar. Silakan login.");
      } else if (msg.includes("Password should be at least")) {
        setError("Password minimal 6 karakter.");
      } else {
        setError(msg || "Terjadi kesalahan saat mendaftar.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(13,7,3,0.75)",
    border: "1px solid #3A2010",
    borderRadius: 10,
    padding: "12px 44px",
    color: "#F7ECD8",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    color: "#9A7A5A",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    marginBottom: 8,
  };

  // Jika sukses, tampilkan pesan konfirmasi
  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <FiCheckCircle size={36} color="#22C55E" />
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0D0703",
            marginBottom: 12,
          }}
        >
          Pendaftaran Berhasil!
        </h2>
        <p style={{ color: "#7A6247", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
          Akun kamu telah dibuat. Silakan cek email untuk konfirmasi,
          lalu login dengan akun baru kamu.
        </p>
        <p style={{ color: "#A89474", fontSize: 13 }}>
          Mengalihkan ke halaman login...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#0D0703",
            marginBottom: 8,
          }}
        >
          Buat Akun Baru
        </h1>
        <p style={{ color: "#7A6247", fontSize: 14 }}>
          Bergabung dengan komunitas Brewista Coffee Shop
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: 8,
            marginBottom: 20,
            color: "#EF4444",
            fontSize: "0.875rem",
          }}
        >
          <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Nama Lengkap */}
        <div>
          <label style={labelStyle}>Nama Lengkap</label>
          <div style={{ position: "relative" }}>
            <FiUser
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }}
              size={16}
            />
            <input
              id="reg-name"
              type="text"
              required
              placeholder="Nama lengkap kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,150,58,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#3A2010"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <div style={{ position: "relative" }}>
            <FiMail
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }}
              size={16}
            />
            <input
              id="reg-email"
              type="email"
              required
              placeholder="email@kamu.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,150,58,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#3A2010"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* No. HP (opsional) */}
        <div>
          <label style={labelStyle}>
            No. HP <span style={{ color: "#5A4A3A", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opsional)</span>
          </label>
          <div style={{ position: "relative" }}>
            <FiPhone
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }}
              size={16}
            />
            <input
              id="reg-phone"
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,150,58,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#3A2010"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <FiLock
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }}
              size={16}
            />
            <input
              id="reg-password"
              type={showPass ? "text" : "password"}
              required
              placeholder="Min. 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,150,58,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#3A2010"; e.target.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#7A6247", cursor: "pointer",
              }}
            >
              {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label style={labelStyle}>Konfirmasi Password</label>
          <div style={{ position: "relative" }}>
            <FiLock
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7A6247" }}
              size={16}
            />
            <input
              id="reg-confirm-password"
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Ulangi password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              style={{
                ...inputStyle,
                borderColor: form.confirmPassword && form.confirmPassword !== form.password
                  ? "rgba(239,68,68,0.6)"
                  : "#3A2010",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,150,58,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)"; }}
              onBlur={(e) => {
                e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password
                  ? "rgba(239,68,68,0.6)"
                  : "#3A2010";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#7A6247", cursor: "pointer",
              }}
            >
              {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {form.confirmPassword && form.confirmPassword !== form.password && (
            <p style={{ margin: "6px 0 0 0", color: "#EF4444", fontSize: 12 }}>
              Password tidak cocok
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="reg-submit"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            marginTop: 4,
            borderRadius: 12,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: loading
              ? "#3A2010"
              : "linear-gradient(90deg, #b87a28, #F0C56A, #D4963A, #F0C56A, #b87a28)",
            backgroundSize: "300% auto",
            color: loading ? "#7A6247" : "#0D0703",
            transition: "all 0.3s ease",
          }}
        >
          {loading
            ? "Mendaftarkan..."
            : <><span>Daftar Sekarang</span><FiArrowRight /></>
          }
        </button>
      </form>

      {/* Login Link */}
      <p style={{ textAlign: "center", marginTop: 24, color: "#7A6247", fontSize: 13 }}>
        Sudah punya akun?{" "}
        <Link
          to="/login"
          style={{ color: "#D4963A", fontWeight: 600, textDecoration: "none" }}
        >
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
