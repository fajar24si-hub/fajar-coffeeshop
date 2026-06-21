// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "", rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");
  const navigate               = useNavigate();
  const { login }              = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      // Tampilkan pesan error yang user-friendly
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Email belum dikonfirmasi. Cek inbox email kamu.");
      } else {
        setError(msg || "Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#0D0703",
            margin: "0 0 8px 0",
          }}
        >
          Welcome Back, Please login to your account
        </h1>
        <p style={{ margin: 0, color: "#6B5D4F", fontSize: "0.95rem" }}>
          Enter your credentials below
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
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            marginBottom: 20,
            color: "#DC2626",
            fontSize: "0.9rem",
          }}
        >
          <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Email Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              display: "block",
              color: "#3E2E23",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Email address
          </label>
          <div style={{ position: "relative" }}>
            <FiMail
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#A89474",
              }}
              size={18}
            />
            <input
              id="login-email"
              type="email"
              required
              placeholder="jubaer@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%",
                background: "#F7F5F2",
                border: "1px solid #E4D5C3",
                borderRadius: 8,
                padding: "14px 16px 14px 48px",
                color: "#2A1810",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#D4963A";
                e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E4D5C3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              display: "block",
              color: "#3E2E23",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <FiLock
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#A89474",
              }}
              size={18}
            />
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: "100%",
                background: "#F7F5F2",
                border: "1px solid #E4D5C3",
                borderRadius: 8,
                padding: "14px 48px 14px 48px",
                color: "#2A1810",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#D4963A";
                e.target.style.boxShadow = "0 0 0 3px rgba(212,150,58,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E4D5C3";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#A89474",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#3E2E23",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
                accentColor: "#D4963A",
              }}
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            style={{
              color: "#D4963A",
              fontSize: "0.9rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#E5A84B")}
            onMouseLeave={(e) => (e.target.style.color = "#D4963A")}
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: 8,
            borderRadius: 8,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            background: loading
              ? "#5a4020"
              : "linear-gradient(135deg, #D4963A 0%, #E5A84B 100%)",
            color: "#0D0703",
            transition: "all 0.2s ease",
            boxShadow: loading
              ? "none"
              : "0 4px 15px rgba(212, 150, 58, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.boxShadow = "0 6px 25px rgba(212, 150, 58, 0.5)";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.boxShadow = "0 4px 15px rgba(212, 150, 58, 0.3)";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0",
          color: "#6B5D4F",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "#D9CCC0" }} />
        <span>or</span>
        <div style={{ flex: 1, height: "1px", background: "#D9CCC0" }} />
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 8,
          border: "1px solid #D9CCC0",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          background: "white",
          color: "#0D0703",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F7F5F2";
          e.currentTarget.style.borderColor = "#D4963A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#D9CCC0";
        }}
      >
        <FcGoogle size={20} />
        Sign in with google
      </button>

      {/* Sign Up Link */}
      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          color: "#6B5D4F",
          fontSize: "0.9rem",
          margin: "24px 0 0 0",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#D4963A",
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#E5A84B")}
          onMouseLeave={(e) => (e.target.style.color = "#D4963A")}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
