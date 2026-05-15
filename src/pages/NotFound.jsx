// src/pages/NotFound.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiCoffee } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();
  const [coffeeMug, setCoffeeMug] = useState("☕");

  useEffect(() => {
    const emojis = ["☕", "🫘", "🥤"];
    const interval = setInterval(() => {
      setCoffeeMug(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="not-found-page"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0D0703 0%, #1a1110 100%)",
      }}
    >
      {/* animated background */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          fontSize: "120px",
          opacity: 0.08,
          animation: "float 6s ease-in-out infinite",
        }}
      >
        ☕
      </div>
      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          fontSize: "100px",
          opacity: 0.08,
          animation: "float 8s ease-in-out infinite 2s",
        }}
      >
        🫘
      </div>

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 600,
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        {/* 404 number */}
        <div
          className="animate-fade-up"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(5rem, 15vw, 9rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #D4963A 0%, #F7ECD8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </div>

        {/* coffee mug animation */}
        <div
          className="animate-bounce"
          style={{
            fontSize: "80px",
            margin: "20px 0",
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          {coffeeMug}
        </div>

        {/* title */}
        <h1
          className="animate-fade-up"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#F7ECD8",
            marginBottom: 12,
            animationDelay: "0.1s",
          }}
        >
          Oops! Resep Tidak Ditemukan
        </h1>

        {/* subtitle */}
        <p
          className="animate-fade-up"
          style={{
            color: "#CEAD86",
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            lineHeight: 1.6,
            marginBottom: 12,
            animationDelay: "0.2s",
          }}
        >
          Halaman yang Anda cari seperti kopi tanpa biji—tidak ada di sini!
        </p>

        <p
          className="animate-fade-up"
          style={{
            color: "#9D8B74",
            fontSize: "0.95rem",
            marginBottom: 40,
            animationDelay: "0.3s",
          }}
        >
          Mungkin halaman sudah dipindahkan, dihapus, atau Anda memasukkan URL yang salah.
        </p>

        {/* glass card info */}
        <div
          className="animate-fade-up glass-card"
          style={{
            background: "rgba(212, 150, 58, 0.08)",
            border: "1px solid rgba(212, 150, 58, 0.15)",
            borderRadius: 16,
            padding: "24px",
            marginBottom: 32,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            animationDelay: "0.4s",
          }}
        >
          <p style={{ color: "#D4963A", fontSize: "0.9rem", margin: 0 }}>
            💡 Tip: Kembali ke halaman utama untuk menikmati pengalaman penuh dari{" "}
            <span style={{ fontWeight: 600 }}>Brewista Coffee</span>
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            animationDelay: "0.5s",
          }}
        >
          <button
            onClick={() => navigate("/")}
            id="not-found-home-btn"
            className="shimmer-btn"
            style={{
              color: "#0D0703",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "12px 28px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            <FiHome size={18} /> Kembali ke Home
          </button>

          <button
            onClick={() => navigate(-1)}
            id="not-found-back-btn"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(212, 150, 58, 0.4)",
              color: "#F7ECD8",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "12px 28px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212, 150, 58, 0.8)";
              e.currentTarget.style.background = "rgba(212, 150, 58, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212, 150, 58, 0.4)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FiArrowLeft size={18} style={{ display: "inline", marginRight: 8 }} />
            Kembali
          </button>
        </div>

        {/* decoration */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(212, 150, 58, 0.1)",
          }}
        >
          <p
            style={{
              color: "#6B5F52",
              fontSize: "0.85rem",
              fontStyle: "italic",
            }}
          >
            "Mungkin Anda tersesat, tapi jangan khawatir—kami di sini untuk membimbing Anda kembali ke jalur yang benar." ✨
          </p>
        </div>
      </div>

      {/* animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .glass-card {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .shimmer-btn {
          background: linear-gradient(135deg, #D4963A 0%, #E5A84B 100%);
          box-shadow: 0 4px 15px rgba(212, 150, 58, 0.3);
        }

        .shimmer-btn:hover {
          box-shadow: 0 6px 25px rgba(212, 150, 58, 0.5);
        }
      `}</style>
    </div>
  );
}
