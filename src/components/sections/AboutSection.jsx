// src/components/sections/AboutSection.jsx
import { FiArrowRight, FiStar } from "react-icons/fi";
import { FaLeaf, FaAward, FaCoffee, FaUsers } from "react-icons/fa";
import SectionHeader from "../ui/SectionHeader";
import FeatureCard from "../ui/FeatureCard";

const features = [
  { Icon: FaLeaf,   title: "Single Origin Beans",    desc: "Biji kopi premium dari perkebunan terbaik Nusantara — Aceh, Toraja, dan Flores." },
  { Icon: FaAward,  title: "Award-Winning Baristas", desc: "Tim kami terdiri dari barista bersertifikat internasional dengan jam terbang tinggi." },
  { Icon: FaCoffee, title: "Freshly Roasted Daily",  desc: "Kami memanggang biji kopi setiap pagi untuk menjamin kesegaran dan cita rasa terbaik." },
  { Icon: FaUsers,  title: "Community Atmosphere",   desc: "Ruang yang dirancang untuk menginspirasi — sempurna untuk bekerja, belajar, atau bersantai." },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ background: "#0F0702", padding: "96px 0" }}>
      <div className="container-inner">
        <SectionHeader label="Our Story" title="More Than Just Coffee" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
          {/* image */}
          <div style={{ position: "relative", minWidth: 0 }}>
            <div
              style={{
                position: "relative",
                height: 360,
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #2E1608",
                background: "linear-gradient(135deg,#1E0E06,#3A1F10)",
              }}
            >
              <div className="img-placeholder" style={{ position: "absolute", inset: 0, fontSize: 80, opacity: 0.12 }}>🏠</div>
              <img
                src="/images/interior.jpg"
                alt="Interior"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>

            {/* rating badge */}
            <div
              className="glass-card"
              style={{ position: "absolute", bottom: -16, right: -12, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ width: 40, height: 40, background: "rgba(212,150,58,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiStar fill="#D4963A" color="#D4963A" size={18} />
              </div>
              <div>
                <div style={{ color: "#F7ECD8", fontWeight: 700, fontSize: 17 }}>4.9 / 5.0</div>
                <div style={{ color: "#7A6247", fontSize: 11, marginTop: 2 }}>15,000+ ulasan</div>
              </div>
            </div>

            {/* est. badge */}
            <div
              className="glass-card"
              style={{ position: "absolute", top: -14, left: -12, borderRadius: 12, padding: "10px 16px" }}
            >
              <div style={{ color: "#D4963A", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>Est.</div>
              <div style={{ color: "#F7ECD8", fontWeight: 700, fontSize: 18 }}>2018</div>
            </div>
          </div>

          {/* content */}
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "#CEAD86", lineHeight: 1.75, marginBottom: 14 }}>
              Brewista lahir dari kecintaan mendalam terhadap kopi Nusantara. Sejak 2018, kami berkomitmen menghadirkan pengalaman kopi yang autentik — dari biji ke cangkir — dengan penuh cinta dan keahlian.
            </p>
            <p style={{ color: "#7A6247", fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
              Setiap menu kami dirancang untuk merayakan kekayaan cita rasa kopi Indonesia, sambil menggabungkan teknik barista modern yang telah teruji secara internasional.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              {features.map(({ Icon, title, desc }) => (
                <FeatureCard key={title} Icon={Icon} title={title} desc={desc} />
              ))}
            </div>

            <button
              id="about-visit-btn"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="shimmer-btn"
              style={{
                color: "#0D0703",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Visit Us <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
