// src/components/ui/SectionHeader.jsx

export default function SectionHeader({ label, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <div className="section-label" style={{ justifyContent: "center" }}>
        {label}
      </div>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 800,
          color: "#F7ECD8",
          margin: "16px 0 16px",
        }}
      >
        {title}
      </h2>
      <div className="divider" style={subtitle ? { marginBottom: 16 } : {}} />
      {subtitle && (
        <p
          style={{
            color: "#7A6247",
            maxWidth: 480,
            margin: "0 auto",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
