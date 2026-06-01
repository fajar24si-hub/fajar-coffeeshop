// src/components/ui/FeatureCard.jsx

export default function FeatureCard({ Icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="icon-box" style={{ width: 36, height: 36, minWidth: 36, borderRadius: 8 }}>
        <Icon size={14} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#F7ECD8", fontWeight: 600, fontSize: 13 }}>{title}</div>
        <div style={{ color: "#7A6247", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}
