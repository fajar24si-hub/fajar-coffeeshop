// src/components/sections/HeroSection.jsx
import { FiArrowRight } from "react-icons/fi";
import HeroBadge from "../ui/HeroBadge";
import StatCard from "../ui/StatCard";
import ScrollIndicator from "../ui/ScrollIndicator";

export default function HeroSection() {
  const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="hero-bg"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src="/images/hero.jpg"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => (e.target.style.display = "none")}
      />
      <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />

      {/* floating deco */}
      <div className="animate-float" style={{ position: "absolute", top: 120, right: 80, fontSize: 80, opacity: 0.06 }}>☕</div>
      <div className="animate-float" style={{ position: "absolute", bottom: 140, left: 60, fontSize: 56, opacity: 0.06, animationDelay: "2s" }}>🫘</div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 860,
          margin: "0 auto",
          padding: "140px 24px 100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <HeroBadge />

        <h1
          className="animate-fade-up"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(2.4rem,6vw,4.5rem)",
            fontWeight: 800,
            color: "#F7ECD8",
            lineHeight: 1.1,
            marginBottom: 20,
            animationDelay: "0.1s",
          }}
        >
          Taste the Art of{" "}
          <span className="gradient-text" style={{ fontStyle: "italic" }}>
            Perfect Coffee
          </span>
        </h1>

        <p
          className="animate-fade-up"
          style={{
            color: "#CEAD86",
            fontSize: "clamp(1rem,2vw,1.15rem)",
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 36,
            animationDelay: "0.2s",
          }}
        >
          Setiap cangkir yang kami sajikan adalah hasil dari biji kopi pilihan terbaik, diracik
          oleh barista berpengalaman, khusus untuk momen spesialmu.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            marginBottom: 60,
            animationDelay: "0.3s",
          }}
        >
          <button
            id="hero-menu-btn"
            onClick={() => go("#menu")}
            className="shimmer-btn"
            style={{
              color: "#0D0703",
              fontWeight: 700,
              fontSize: 14,
              padding: "13px 28px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Explore Menu <FiArrowRight />
          </button>
          <button
            id="hero-story-btn"
            onClick={() => go("#about")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#F7ECD8",
              fontWeight: 500,
              fontSize: 14,
              padding: "13px 28px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = "rgba(212,150,58,0.5)")}
            onMouseLeave={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.2)")}
          >
            Our Story
          </button>
        </div>

        <StatCard />
      </div>

      <ScrollIndicator />
    </section>
  );
}
